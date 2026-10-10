import z from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { LlmAdapter, LlmError } from "@deepseek-ai/dsh-llm";
//#region src/shared/config.ts
const ROUTER_PROVIDER_ID = "model-router";
const ROUTER_SETTINGS_NS = "model-router";
/**
* Strip the first path segment (`vendor/`) from a model id, case-sensitively.
* Inert for ids without a prefix: no slash, an empty first segment, or an
* empty remainder all return the input unchanged. `a/b/c` becomes `b/c`.
*/
function stripModelIdPrefix(id) {
	const slash = id.indexOf("/");
	if (slash <= 0 || slash === id.length - 1) return id;
	return id.slice(slash + 1);
}
/**
* Merge every provider's models into one entry per model id. With
* `ignorePrefix` the group key is the prefix-stripped id and the merged id is
* that stripped id, while each provider entry keeps its raw local id. When a
* single provider advertises both a prefixed and the unprefixed raw id for the
* same group (a same-provider collision), the unprefixed raw id wins (it is
* the canonical form); otherwise the first-seen raw id wins.
*/
function mergeModels(providers, options = {}) {
	const byId = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		const chosen = /* @__PURE__ */ new Map();
		for (const model of provider.models) {
			const key = options.ignorePrefix ? stripModelIdPrefix(model.id) : model.id;
			const prev = chosen.get(key);
			if (prev === void 0 || prev !== key && model.id === key) chosen.set(key, model.id);
		}
		for (const model of provider.models) {
			const key = options.ignorePrefix ? stripModelIdPrefix(model.id) : model.id;
			if (chosen.get(key) !== model.id) continue;
			let merged = byId.get(key);
			if (merged === void 0) {
				merged = {
					id: key,
					providers: []
				};
				byId.set(key, merged);
			}
			merged.providers.push({
				provider: provider.id,
				id: model.id,
				name: model.name,
				contextWindow: model.contextWindow,
				maxTokens: model.maxTokens
			});
		}
	}
	return [...byId.values()];
}
/** The provider view a merged model should display for (follows active). */
function displayProvider(merged, active) {
	if (merged.providers.length === 0) return null;
	return merged.providers.find((p) => p.provider === active) ?? merged.providers[0];
}
/** The display name a merged model advertises (active provider's name). */
function displayNameOf(model, config) {
	const ids = model.providers.map((provider) => provider.provider);
	return displayProvider(model, resolveActive(config, model.id, ids) ?? void 0)?.name ?? model.id;
}
/**
* Order the merged catalog the way the model picker should list it, per the
* configured `modelSort` mode. Always returns a permutation of `models`
* (never drops or duplicates entries).
*
* - `custom`: `config.modelOrder` first (in stored order), then any model not
*   present in it, in catalog order.
* - `name`: display-name ascending (numeric-aware, case-insensitive), ties
*   keep catalog order (stable sort).
* - `recent`: most-recently-used first; never-used models sink to the tail in
*   catalog order. Ties (equal timestamps, or both unused) keep catalog
*   order (stable sort).
*/
function sortModelsForList(models, config) {
	if (config.modelSort === "name") {
		const byName = new Map(models.map((model) => [model, displayNameOf(model, config)]));
		return [...models].sort((left, right) => byName.get(left).localeCompare(byName.get(right), void 0, {
			numeric: true,
			sensitivity: "base"
		}));
	}
	if (config.modelSort === "recent") {
		const recent = config.recentlyUsed ?? {};
		return [...models].sort((left, right) => (recent[right.id] ?? -Infinity) - (recent[left.id] ?? -Infinity));
	}
	const listed = [];
	const seen = /* @__PURE__ */ new Set();
	for (const id of config.modelOrder ?? []) {
		if (seen.has(id)) continue;
		const model = models.find((candidate) => candidate.id === id);
		if (model === void 0) continue;
		seen.add(id);
		listed.push(model);
	}
	const tail = models.filter((model) => !seen.has(model.id));
	return [...listed, ...tail];
}
/** Initial config for a model the user never configured: first in order wins. */
function initialConfigFor(providerIds) {
	if (providerIds.length === 0) return null;
	return {
		order: [...providerIds],
		active: providerIds[0],
		enabled: true
	};
}
/**
* Effective active provider for a model id.
*
* Rules: a stored active still present in the catalog wins; otherwise the
* first stored order entry still present wins; otherwise the first provider
* of the catalog wins; an empty catalog yields null.
*/
function resolveActive(config, modelId, catalogProviderIds) {
	if (catalogProviderIds.length === 0) return null;
	const stored = config.models[modelId];
	if (stored !== void 0) {
		if (catalogProviderIds.includes(stored.active)) return stored.active;
		const firstRemaining = stored.order.find((id) => catalogProviderIds.includes(id));
		if (firstRemaining !== void 0) return firstRemaining;
	}
	return catalogProviderIds[0];
}
/**
* Reconcile one model's config against the live catalog: prune vanished
* providers, append newly discovered ones, and repair a vanished active by
* falling back to the first remaining provider. Returns the new config, or
* undefined when the catalog leaves nothing to route to.
*/
function syncConfig(config, modelId, catalogProviderIds) {
	const next = { ...config.models };
	let changed = false;
	const existing = next[modelId];
	if (catalogProviderIds.length === 0) {
		if (existing !== void 0) {
			delete next[modelId];
			changed = true;
		}
		return {
			models: next,
			changed
		};
	}
	if (existing === void 0) {
		const initial = initialConfigFor(catalogProviderIds);
		if (initial !== null) {
			next[modelId] = initial;
			changed = true;
		}
		return {
			models: next,
			changed
		};
	}
	const catalog = new Set(catalogProviderIds);
	const order = existing.order.filter((id) => catalog.has(id));
	if (order.length !== existing.order.length) changed = true;
	for (const id of catalogProviderIds) if (!order.includes(id)) {
		order.push(id);
		changed = true;
	}
	let active = existing.active;
	if (!catalog.has(active)) {
		active = order[0];
		changed = true;
	}
	if (changed) next[modelId] = {
		order,
		active,
		enabled: existing.enabled !== false
	};
	else if (existing.enabled === void 0) {
		next[modelId] = { order, active, enabled: true };
		changed = true;
	}
	return {
		models: next,
		changed
	};
}
function sameModels(a, b) {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	for (const key of aKeys) {
		const x = a[key];
		const y = b[key];
		if (y === void 0 || x.active !== y.active || x.enabled !== y.enabled || x.order.length !== y.order.length) return false;
		if (!x.order.every((id, i) => id === y.order[i])) return false;
	}
	return true;
}
/**
* Reconcile the stored config document against the live merged catalog.
*
* Beyond the per-model sync of {@link syncConfig}, this remaps stored entries
* to their merged ids: with prefix-ignore on, an entry keyed by a raw id that
* now strips to a merged id (e.g. `deepseek/deepseek-v4-flash` →
* `deepseek-v4-flash`) migrates to that merged id. When several stored keys
* collapse onto one merged id, the entry keyed by the merged id itself wins
* for `active`, and `order` becomes the deduped union in exact-key-first
* order. Stored keys no longer mapping to any merged model are dropped (this
* also covers turning the flag off — split models re-initialize fresh).
*
* `modelOrder` (custom display order) is reconciled the same way: vanished
* ids are pruned, newly discovered models are appended in catalog order.
*/
function reconcileConfig(config, models) {
	const keyToMerged = /* @__PURE__ */ new Map();
	for (const model of models) {
		keyToMerged.set(model.id, model.id);
		if (!config.ignoreModelIdPrefix) continue;
		for (const provider of model.providers) if (stripModelIdPrefix(provider.id) === model.id && !keyToMerged.has(provider.id)) keyToMerged.set(provider.id, model.id);
	}
	const grouped = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(config.models)) {
		const mergedId = keyToMerged.get(key);
		if (mergedId === void 0) continue;
		const list = grouped.get(mergedId) ?? [];
		list.push({
			key,
			entry
		});
		grouped.set(mergedId, list);
	}
	const next = {};
	for (const model of models) {
		const ids = model.providers.map((provider) => provider.provider);
		const list = grouped.get(model.id);
		let base;
		if (list !== void 0 && list.length > 0) {
			const exact = list.find((group) => group.key === model.id);
			const ordered = exact === void 0 ? list : [exact, ...list.filter((group) => group.key !== model.id)];
			const order = [];
			for (const group of ordered) for (const id of group.entry.order) if (!order.includes(id)) order.push(id);
			base = {
				order,
				active: exact?.entry.active ?? ordered[0].entry.active,
				enabled: exact?.entry.enabled ?? ordered[0].entry.enabled !== false
			};
		}
		const view = {
			...config,
			models: { ...next }
		};
		if (base !== void 0) view.models[model.id] = base;
		const entry = syncConfig(view, model.id, ids).models[model.id];
		if (entry !== void 0) next[model.id] = entry;
	}
	const storedOrder = config.modelOrder;
	let modelOrder;
	let orderChanged = false;
	if (storedOrder !== void 0) {
		const catalogIds = new Set(models.map((model) => model.id));
		modelOrder = storedOrder.filter((id) => catalogIds.has(id));
		orderChanged = modelOrder.length !== storedOrder.length;
		for (const model of models) if (!modelOrder.includes(model.id)) {
			modelOrder.push(model.id);
			orderChanged = true;
		}
	}
	return {
		models: next,
		modelOrder,
		changed: !sameModels(next, config.models) || orderChanged
	};
}
/** Switch a model's active provider (no-op when already active). */
function setActive(config, modelId, providerId, catalogProviderIds) {
	if (!catalogProviderIds.includes(providerId)) throw new Error(`provider ${providerId} is not in the catalog for model ${modelId}`);
	const synced = syncConfig(config, modelId, catalogProviderIds);
	const next = synced.models;
	const entry = next[modelId];
	if (entry === void 0) return {
		models: next,
		changed: synced.changed
	};
	if (entry.active === providerId) return {
		models: next,
		changed: synced.changed
	};
	next[modelId] = {
		...entry,
		active: providerId
	};
	return {
		models: next,
		changed: true
	};
}
/** Replace a model's provider preference order (active left untouched). */
function setOrder(config, modelId, order, catalogProviderIds) {
	const catalog = new Set(catalogProviderIds);
	const clean = order.filter((id) => catalog.has(id));
	for (const id of catalogProviderIds) if (!clean.includes(id)) clean.push(id);
	const synced = syncConfig(config, modelId, catalogProviderIds);
	const next = synced.models;
	const entry = next[modelId];
	if (entry === void 0) return {
		models: next,
		changed: synced.changed
	};
	if (entry.order.length === clean.length && entry.order.every((id, i) => id === clean[i])) return {
		models: next,
		changed: synced.changed
	};
	next[modelId] = {
		...entry,
		order: [...clean]
	};
	return {
		models: next,
		changed: true
	};
}
/**
* Dereference one config field as the loader may hand it over.
*
* dsh >= 0.1.7 owns plugin configuration as entry config, and every field the
* `Config` schema marks `.volatile()` arrives as a stable REFERENCE
* (`{ get() }`, schemastery's `Volatile<T>`) instead of a plain value — a
* reference serializes to `{}`. Reading such a field raw silently yields
* `models: {}`, `modelSort: 'custom'`, an empty `modelOrder` and no
* `recentlyUsed`: the stored document is dropped, and the next persist
* overwrites it with catalog defaults. Plain values pass through unchanged, so
* this is safe for the write paths and for callers that already hold a
* resolved document.
*/
function derefField(value) {
	if (value !== null && typeof value === "object" && typeof value.get === "function") return value.get();
	return value;
}
/** Dereference every own field of a config object (per-field volatile refs). */
function derefConfig(value) {
	const root = derefField(value);
	if (root === null || typeof root !== "object" || Array.isArray(root)) return root;
	const out = {};
	for (const [key, field] of Object.entries(root)) out[key] = derefField(field);
	return out;
}
/** Shape-validate an unknown value as a RouterConfigShape (lenient). */
function normalizeConfig(value) {
	const models = {};
	const source = derefConfig(value);
	if (typeof source !== "object" || source === null) return {
		models,
		showQuickSwitch: true,
		ignoreModelIdPrefix: true,
		modelSort: "custom",
		modelOrder: [],
		recentlyUsed: {}
	};
	const root = source;
	const showQuickSwitch = root.showQuickSwitch !== false;
	const ignoreModelIdPrefix = root.ignoreModelIdPrefix !== false;
	const modelSort = root.modelSort === "name" || root.modelSort === "recent" ? root.modelSort : "custom";
	const modelOrder = Array.isArray(root.modelOrder) ? root.modelOrder.filter((x) => typeof x === "string") : [];
	const recentlyUsed = {};
	if (typeof root.recentlyUsed === "object" && root.recentlyUsed !== null) {
		for (const [id, ts] of Object.entries(root.recentlyUsed)) if (typeof ts === "number" && Number.isFinite(ts)) recentlyUsed[id] = ts;
	}
	const raw = root.models;
	if (typeof raw !== "object" || raw === null) return {
		models,
		showQuickSwitch,
		ignoreModelIdPrefix,
		modelSort,
		modelOrder,
		recentlyUsed
	};
	for (const [id, entry] of Object.entries(raw)) {
		if (typeof entry !== "object" || entry === null) continue;
		const e = entry;
		const order = Array.isArray(e.order) ? e.order.filter((x) => typeof x === "string") : [];
		const active = typeof e.active === "string" ? e.active : order[0] ?? "";
		if (active === "") continue;
		models[id] = {
			order,
			active,
			enabled: e.enabled !== false
		};
	}
	return {
		models,
		showQuickSwitch,
		ignoreModelIdPrefix,
		modelSort,
		modelOrder,
		recentlyUsed
	};
}
//#endregion
//#region src/server/catalog.ts
const EMPTY_CATALOG = {
    providers: [],
    providerNames: new Map(),
    models: [],
    byId: new Map(),
    credentialConfigured: new Map(),
    complete: false,
};
/**
 * Read the resolved value of another plugin's settings section, if the
 * settings plane describes it. The descriptor's `ns` is the profile entry id,
 * so the value is that entry's resolved Config (defaults → composition base →
 * user layer). `describe()` lists only entries that declare volatile
 * (form-writable) fields, and redaction is off here because the caller reads a
 * non-secret field (`apiKeyEnv`). An undescribed section, or an unavailable
 * settings service, yields undefined.
 */
function settingsSection(ctx, ns) {
    try {
        const descriptor = ctx.settings
            .describe({ redactSecrets: false })
            .find(candidate => candidate.ns === ns);
        return descriptor?.value;
    }
    catch {
        return undefined;
    }
}
/**
 * Determine whether one provider has usable credentials. Generic: the
 * configurable-provider directory names the settings section + path where the
 * provider's profile (and its optional apiKeyEnv) lives; the credentials seam
 * answers whether that reference currently resolves. Providers without a
 * directory entry or without an apiKeyEnv answer "configured" (unknown —
 * never gray out what we cannot verify).
 */
async function detectCredentialConfigured(ctx, entry) {
    if (entry === undefined)
        return true;
    const section = settingsSection(ctx, entry.settingsNs);
    let profile = section;
    for (const key of entry.settingsPath) {
        if (typeof profile !== 'object' || profile === null) {
            profile = undefined;
            break;
        }
        profile = profile[key];
    }
    const apiKeyEnv = typeof profile === 'object' && profile !== null
        ? profile.apiKeyEnv
        : undefined;
    if (typeof apiKeyEnv !== 'string' || apiKeyEnv.trim() === '')
        return true;
    let credentials;
    try {
        credentials = ctx.get('credentials');
    }
    catch {
        credentials = undefined;
    }
    if (credentials === undefined)
        return true;
    try {
        return (await credentials.describe(credentialRef(apiKeyEnv.trim()))).configured;
    }
    catch {
        return true;
    }
}
/** Rebuild the live router catalog from the LLM registry. */
async function buildCatalog(ctx, ignorePrefix = false) {
    const routes = ctx.llm.listProviders().filter(provider => provider.id !== ROUTER_PROVIDER_ID);
    const directory = new Map(ctx.llm.listConfigurableProviders().map(entry => [entry.provider, {
            provider: entry.provider,
            displayName: entry.displayName,
            settingsNs: entry.settingsNs,
            settingsPath: entry.settingsPath,
        }]));
    const providers = [];
    const providerNames = new Map();
    const credentialConfigured = new Map();
    const registered = new Set(routes.map(route => route.id));
    let complete = routes.length > 0
        && [...directory.keys()].every(id => id === ROUTER_PROVIDER_ID || registered.has(id));
    for (const route of routes) {
        const entry = directory.get(route.id);
        providerNames.set(route.id, entry?.displayName || route.name || route.id);
        const seen = new Set();
        const models = [];
        try {
            for (const model of await ctx.llm.listModels(route.id)) {
                if (seen.has(model.id))
                    continue;
                seen.add(model.id);
                models.push({ id: model.id, name: model.name });
            }
            // Treat successful-but-empty discovery as pending too: providers may
            // register before their model lists are ready during startup.
            if (models.length === 0)
                complete = false;
        }
        catch {
            complete = false;
            // Keep the live catalog honest; persisted preferences survive separately.
        }
        providers.push({ id: route.id, name: route.name, models });
        credentialConfigured.set(route.id, await detectCredentialConfigured(ctx, entry));
    }
    const models = mergeModels(providers, { ignorePrefix });
    const byId = new Map(models.map(model => [model.id, model]));
    return { providers, providerNames, models, byId, credentialConfigured, complete };
}
//#endregion
//#region src/server/adapter.ts
/**
* The virtual `model-router` LLM adapter. Registered for the single provider
* route `model-router`, it advertises the merged catalog and, at request time,
* rewrites the provider field to the model's currently active provider and
* delegates in-process to `ctx.llm.stream` — credentials, retry, streaming
* and metering all stay inside the real adapter's pipeline. Incoming model
* ids are matched with the leading vendor prefix ignored when the settings
* flag is on, and delegation always uses the active provider's raw local id.
*/
/**
* Find the merged model for an incoming model id. Exact lookup first; when
* prefix-ignore is on, a miss falls back to the prefix-stripped id so a raw
* `deepseek/deepseek-v4-flash` request matches the merged `deepseek-v4-flash`
* (advertised ids are already stripped and hit exactly). Unadvertised ids do
* not match.
*/
function mergedFor(facts, modelId) {
	const byId = facts.catalog().byId;
	const direct = byId.get(modelId);
	if (direct !== void 0) return direct;
	if (!facts.config().ignoreModelIdPrefix) return null;
	const stripped = stripModelIdPrefix(modelId);
	if (stripped === modelId) return null;
	return byId.get(stripped) ?? null;
}
/**
* Resolve the effective route for one model id: the stored active provider
* when still present, otherwise the first remaining order entry, otherwise
* the catalog head. Unadvertised model ids do not route.
*/
function routeFor(facts, modelId) {
	const merged = mergedFor(facts, modelId);
	if (merged === null) return null;
	const ids = merged.providers.map((provider) => provider.provider);
	const active = resolveActive(facts.config(), merged.id, ids);
	return active === null ? null : { provider: active };
}
/** The raw provider-local id of one provider entry inside a merged model. */
function entryRawId(merged, providerId) {
	return merged.providers.find((provider) => provider.provider === providerId)?.id ?? merged.id;
}
function unroutable(model) {
	return new LlmError(`model-router: no provider serves model "${model}"`, "NO_ADAPTER");
}
/**
* Resolve one model id to its active provider and merged model, rejecting
* unadvertised or currently unroutable ids before any provider I/O.
*/
function bindRoute(facts, modelId) {
	const merged = mergedFor(facts, modelId);
	const route = merged === null ? null : routeFor(facts, modelId);
	if (merged === null || route === null) throw unroutable(modelId);
	if (facts.config().models[merged.id]?.enabled === false) {
		throw new LlmError(`model-router: model "${modelId}" is disabled`, "NO_ADAPTER");
	}
	return {
		route,
		merged
	};
}
var ModelRouterAdapter = class extends LlmAdapter {
	facts;
	constructor(facts) {
		super();
		this.facts = facts;
	}
	providerInfo(provider) {
		return {
			id: provider,
			name: "Model Router"
		};
	}
	async listModels(_provider) {
		const config = this.facts.config();
		const { models } = this.facts.catalog();
		const names = this.facts.providerNames();
		const out = [];
		for (const merged of sortModelsForList(models, config)) {
			if (config.models[merged.id]?.enabled === false) continue;
		const display = displayProvider(merged, routeFor(this.facts, merged.id)?.provider);
			if (display === null) continue;
			out.push({
				provider: ROUTER_PROVIDER_ID,
				id: merged.id,
				name: display.name,
				description: `via ${names.get(display.provider) ?? display.provider}`
			});
		}
		return out;
	}
	async resolveModel(_provider, model, signal) {
		const { route, merged } = bindRoute(this.facts, model);
		return this.resolveRoutedIdentity(route, merged, signal);
	}
	/**
	* Bind the route generation at preparation time: a provider switch or
	* catalog refresh between preparation and dispatch cannot combine one
	* generation's metadata with another's endpoint, matching the host's
	* one-generation dispatch contract.
	*/
	async prepareCall(_provider, model, signal) {
		const { route, merged } = bindRoute(this.facts, model);
		return {
			model: await this.resolveRoutedIdentity(route, merged, signal),
			stream: (options) => this.streamRouted(options, route, merged)
		};
	}
	async *stream(options) {
		const { route, merged } = bindRoute(this.facts, options.model);
		yield* this.streamRouted(options, route, merged);
	}
	/**
	* Delegate with the provider's raw local id (it may carry a vendor/
	* prefix the real provider needs), then normalize the resolved identity
	* back to the merged display id so sessions/metering never leak prefixes.
	*/
	async resolveRoutedIdentity(route, merged, signal) {
		const resolved = await this.facts.llm().resolveModelInfo(route.provider, entryRawId(merged, route.provider), signal);
		const display = displayProvider(merged, route.provider);
		return {
			...resolved,
			provider: ROUTER_PROVIDER_ID,
			id: merged.id,
			name: display?.name ?? resolved.name
		};
	}
	async *streamRouted(options, route, merged) {
		try {
			this.facts.noteModelUsed(merged.id);
		} catch {}
		yield* this.facts.llm().stream({
			...options,
			provider: route.provider,
			model: entryRawId(merged, route.provider)
		});
	}
};
//#endregion
//#region src/server/service.ts
const NS = ROUTER_SETTINGS_NS;
/**
 * Settings document schema: one entry per model id.
 *
 * Every writable field stays `.volatile()`: the settings plane refuses a
 * namespace whose form has no volatile field, and `settings.replace` refuses
 * non-volatile paths. The exported schema is nevertheless ASSERTED to the
 * plain `z<RouterConfigShape>` (the declared type it had before the
 * schemastery bump) for two reasons:
 *  - since schemastery 3.18.3 a `.volatile()` field's output types as
 *    `Volatile<T>`, so `: z<RouterConfigShape>` no longer *compiles*, while the
 *    inferred schema type cannot be named in the emitted declarations either
 *    (TS2742: it would need a pnpm-nested cosmokit type, and `pnpm build` runs
 *    tsc in declaration mode);
 *  - the plain shape is what consumers actually observe: the loader hands the
 *    fields over as live `{ get() }` cells and `normalizeConfig` unwinds them.
 * The assertion is type-level only — the runtime schema keeps its volatile
 * markers, which is what the settings plane reads.
 */
const RouterConfigSchema = z.object({
    // Volatile marks what the settings plane may write: the settings page and
    // settings.replace both refuse non-volatile fields.
    models: z.dict(z.object({
        order: z.array(z.string()),
        active: z.string(),
        enabled: z.boolean(),
    })).volatile(),
    // Older documents predate the toggles; normalizeConfig defaults both on.
    // Schemastery object keys are input-optional, so absent is valid here.
    showQuickSwitch: z.boolean().volatile(),
    ignoreModelIdPrefix: z.boolean().volatile(),
    modelSort: z.union([z.const('custom'), z.const('name'), z.const('recent')]).volatile(),
    modelOrder: z.array(z.string()).volatile(),
    recentlyUsed: z.dict(z.number()).volatile(),
});
class ModelRouterService {
    ctx;
    cached = {
        providers: [],
        providerNames: new Map(),
        models: [],
        byId: new Map(),
        credentialConfigured: new Map(),
        complete: false,
    };
    /** Serialize read-modify-write operations, not precomputed snapshots. */
    writeQueue = Promise.resolve();
    stopped = false;
    inflight = null;
    cachedAt = 0;
    /** Optional host settings service; absent in profiles without one (no persistence). */
    settings;
    /** Live config document (seeded from the entry config, updated on write). */
    configDoc;
    registration;
    /** How long a built catalog is considered fresh before being rebuilt. */
    catalogTtlMs = 30_000;
    /**
     * Debounced recent-use persistence (see noteModelUsed / flushUsage). Kept
     * long on purpose: every persist writes the entry config, which restarts
     * this plugin's entry, so usage bookkeeping must not stream live traffic.
     */
    usageFlushMs = 60_000;
    usageDebounce = null;
    pendingUsage = {};
    usageFlushRunning = false;
    constructor(ctx, config) {
        this.ctx = ctx;
        this.configDoc = normalizeConfig(config);
    }
    /** Register the settings seam + adapter and wire topology listeners. */
    start() {
        this.stopped = false;
        // Optional settings service: without one the router still routes
        // (config falls back to catalog order) but cannot persist. The service's
        // shape is only used through SettingsReplaceFace; there is no namespace
        // registration to make on dsh >= 0.1.7.
        this.ctx.inject(['settings'], (sctx) => {
            this.settings = sctx.settings;
        });
        const adapter = new ModelRouterAdapter(this);
        this.registration = this.ctx.llm.registerAdapter([ROUTER_PROVIDER_ID], adapter);
        // Provider topology changes (added/removed providers, catalog swaps)
        // invalidate the cache and reconcile the stored document.
        this.ctx.on('llm/adapters-updated', () => {
            void this.refreshAndReconcile();
        });
        // First load + reconcile: never block plugin startup on the catalog.
        void this.refreshAndReconcile();
    }
    stop() {
        this.stopped = true;
        // Drop pending recent-use bookkeeping instead of flushing it: on dsh >=
        // 0.1.7 every persist is an entry-config write, which reloads this plugin
        // (teardown included), so writing from stop() would re-enter the loader
        // while it is tearing this very entry down. The timestamps are best-effort
        // ordering hints for the `recent` display mode, so losing the last
        // debounce window is harmless.
        if (this.usageDebounce !== null) {
            clearTimeout(this.usageDebounce);
            this.usageDebounce = null;
        }
        this.pendingUsage = {};
        this.registration?.();
        this.registration = undefined;
    }
    // ── RouterFacts ──────────────────────────────────────────────────────────
    catalog() {
        return { models: this.cached.models, byId: this.cached.byId };
    }
    config() {
        return this.configDoc;
    }
    providerNames() {
        return this.cached.providerNames;
    }
    llm() {
        return this.ctx.llm;
    }
    /**
     * Record one model request for the `recent` display order. Fire-and-forget
     * (the adapter never awaits it): timestamps accumulate in memory and are
     * persisted debounced, so a burst of requests coalesces into one settings
     * write.
     */
    noteModelUsed(modelId) {
        if (this.settings === undefined)
            return;
        this.pendingUsage[modelId] = Date.now();
        if (this.usageDebounce !== null)
            return;
        this.usageDebounce = setTimeout(() => {
            this.usageDebounce = null;
            void this.flushUsage();
        }, this.usageFlushMs);
    }
    /** Persist accumulated usage timestamps (merging with any concurrent writes). */
    async flushUsage() {
        if (this.usageFlushRunning)
            return;
        this.usageFlushRunning = true;
        const pending = this.pendingUsage;
        this.pendingUsage = {};
        try {
            if (this.settings === undefined || Object.keys(pending).length === 0)
                return;
            await this.writeConfig(current => ({
                ...current,
                recentlyUsed: { ...current.recentlyUsed, ...pending },
            }));
        }
        catch (error) {
            // Re-queue the failed batch so a transient write failure does not lose
            // usage history; the next request retries it.
            this.pendingUsage = { ...pending, ...this.pendingUsage };
            this.ctx.logger.warn(`model-router: usage persist failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        finally {
            this.usageFlushRunning = false;
        }
    }
    // ── catalog lifecycle ────────────────────────────────────────────────────
    /**
     * Return the live catalog, rebuilding it only when it is stale (older than
     * `catalogTtlMs`) or `force` is set. Concurrent callers share one in-flight
     * build; a failed build keeps the last good catalog.
     *
     * The TTL is what keeps the composer quick-switcher snappy: every
     * `state()` RPC goes through here, and without a cache each one rebuilt the
     * catalog — including per-provider `listModels` network calls — which is
     * what made the button gray out (routerLoading) for the whole duration.
     * Topology events (`llm/adapters-updated`) and explicit user refreshes pass
     * `force` so the cache never hides real changes.
     */
    refreshCatalog(force = false) {
        if (!force && this.inflight === null && Date.now() - this.cachedAt < this.catalogTtlMs) {
            return Promise.resolve(this.cached);
        }
        if (this.inflight !== null)
            return this.inflight;
        this.inflight = buildCatalog(this.ctx, this.config().ignoreModelIdPrefix)
            .then((catalog) => {
            this.cached = catalog;
            this.cachedAt = Date.now();
            return catalog;
        })
            .catch((error) => {
            this.ctx.logger.warn(`model-router: catalog refresh failed: ${error instanceof Error ? error.message : String(error)}`);
            return this.cached;
        })
            .finally(() => {
            this.inflight = null;
        });
        return this.inflight;
    }
    /** Refresh discovery without treating temporarily absent models as deleted preferences. */
    async refreshAndReconcile() {
        const catalog = await this.refreshCatalog(true);
        if (this.settings === undefined || this.stopped)
            return;
        try {
            await this.writeConfig(current => {
                // A queued reconcile must not apply an obsolete or incomplete catalog.
                if (catalog !== this.cached || !catalog.complete || catalog.models.length === 0)
                    return null;
                const registered = new Set(catalog.providers.map(provider => provider.id));
                if (Object.values(current.models).some(entry => [entry.active, ...entry.order].some(id => !registered.has(id))))
                    return null;
                const { models, modelOrder } = reconcileConfig(current, catalog.models);
                // Even successful discovery can temporarily omit individual models.
                // Persist additions/repairs, but retain missing models and custom order.
                const order = [...current.modelOrder];
                for (const id of modelOrder ?? []) {
                    if (!order.includes(id))
                        order.push(id);
                }
                return { ...current, models: { ...current.models, ...models }, modelOrder: order };
            });
        }
        catch (error) {
            this.ctx.logger.warn(`model-router: reconcile persist failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    // ── actions ──────────────────────────────────────────────────────────────
    /** Effective active provider for one model id (null when unroutable). */
    activeFor(modelId) {
        const ids = this.cached.byId.get(modelId)?.providers.map(provider => provider.provider) ?? [];
        return resolveActive(this.config(), modelId, ids);
    }
    /** The complete state view for the settings page. */
    async state() {
        await this.refreshCatalog();
        const catalog = this.cached;
        const config = this.config();
        const names = catalog.providerNames;
        const creds = catalog.credentialConfigured;
        return {
            writable: this.settings !== undefined,
            showQuickSwitch: config.showQuickSwitch,
            ignoreModelIdPrefix: config.ignoreModelIdPrefix,
            modelSort: config.modelSort,
            modelOrder: config.modelOrder,
            providers: catalog.providers.map(provider => ({
                id: provider.id,
                name: names.get(provider.id) ?? provider.id,
                credentialConfigured: creds.get(provider.id) ?? true,
            })),
            models: sortModelsForList(catalog.models, config).map((model) => {
                const ids = model.providers.map(provider => provider.provider);
                const stored = config.models[model.id] ?? initialConfigFor(ids);
                const active = resolveActive(config, model.id, ids);
                const activeEntry = model.providers.find(provider => provider.provider === active) ?? model.providers[0];
                return {
                    id: model.id,
                    name: activeEntry?.name ?? model.id,
                    active,
                    enabled: stored?.enabled !== false,
                    order: stored?.order ?? [...ids],
                    providers: model.providers.map(provider => ({
                        id: provider.provider,
                        name: names.get(provider.provider) ?? provider.provider,
                        credentialConfigured: creds.get(provider.provider) ?? true,
                    })),
                };
            }),
        };
    }
    /** Switch the active provider for one model (persisted, live on next request). */
    async switchActive(modelId, providerId) {
        await this.refreshCatalog();
        const ids = this.cached.byId.get(modelId)?.providers.map(provider => provider.provider);
        if (ids === undefined || ids.length === 0) {
            throw new Error(`model-router: model "${modelId}" is not served by any provider`);
        }
        await this.writeConfig(current => {
            const { models, changed } = setActive(current, modelId, providerId, ids);
            return changed ? { ...current, models } : null;
        });
    }
    /** Toggle whether one merged model may be advertised and routed. */
    async setModelEnabled(modelId, enabled) {
        await this.refreshCatalog();
        const model = this.cached.byId.get(modelId);
        if (model === undefined || model.providers.length === 0) {
            throw new Error(`model-router: model "${modelId}" is not served by any provider`);
        }
        const ids = model.providers.map(provider => provider.provider);
        await this.writeConfig(current => {
            const synced = syncConfig(current, modelId, ids);
            const entry = synced.models[modelId];
            if (entry === undefined)
                throw new Error(`model-router: model "${modelId}" has no configuration`);
            if (entry.enabled === enabled && !synced.changed)
                return null;
            return { ...current, models: { ...synced.models, [modelId]: { ...entry, enabled } } };
        });
    }
    /** Replace the preference order for one model (active left untouched). */
    async reorder(modelId, order) {
        await this.refreshCatalog();
        const ids = this.cached.byId.get(modelId)?.providers.map(provider => provider.provider);
        if (ids === undefined || ids.length === 0) {
            throw new Error(`model-router: model "${modelId}" is not served by any provider`);
        }
        await this.writeConfig(current => {
            const { models, changed } = setOrder(current, modelId, order, ids);
            return changed ? { ...current, models } : null;
        });
    }
    /** Toggle the composer quick route-switcher button (global, persisted). */
    async setShowQuickSwitch(value) {
        await this.writeConfig(current => current.showQuickSwitch === value
            ? null : { ...current, showQuickSwitch: value });
    }
    /**
     * Toggle prefix-ignored model matching (global, persisted). Persists the
     * flag first, then rebuilds the catalog with the new merge rule and
     * reconciles stored config (migrates prefixed keys to merged ids when
     * turning on; split models re-initialize when turning off).
     */
    async setIgnoreModelIdPrefix(value) {
        await this.writeConfig(current => current.ignoreModelIdPrefix === value
            ? null : { ...current, ignoreModelIdPrefix: value });
        await this.refreshAndReconcile();
    }
    /** Switch the model-list display order mode (global, persisted). */
    async setModelSort(mode) {
        await this.writeConfig(current => current.modelSort === mode
            ? null : { ...current, modelSort: mode });
    }
    /**
     * Replace the explicit custom model order (global, persisted). Vanished
     * ids are pruned and missing catalog models appended, so the stored order
     * always covers the live catalog.
     */
    async setModelOrder(order) {
        await this.refreshCatalog();
        const ids = new Set(this.cached.models.map(model => model.id));
        const clean = order.filter(id => ids.has(id));
        for (const model of this.cached.models) {
            if (!clean.includes(model.id))
                clean.push(model.id);
        }
        await this.writeConfig(current => ({ ...current, modelOrder: clean }));
    }
    /** Compute and persist each mutation against the latest successfully written config. */
    writeConfig(update) {
        const write = this.writeQueue.then(async () => {
            if (this.stopped)
                throw new Error('model-router: service has stopped');
            if (this.settings === undefined) {
                throw new Error('model-router: settings service is not available in this profile');
            }
            const current = this.config();
            const updated = update(current);
            if (updated === null)
                return;
            const next = normalizeConfig(updated);
            if (JSON.stringify(next) === JSON.stringify(current))
                return;
            await this.settings.replace(NS, next);
            this.configDoc = next;
        });
        // One failed write must reject its caller without poisoning later actions.
        this.writeQueue = write.catch(() => { });
        return write;
    }
}
//#endregion
//#region src/server/rpc.ts
const API_PREFIX = "/plugins/@fonlan/dsh-model-router/api";
function header(headers, name) {
	const value = headers[name];
	return typeof value === "string" ? value : void 0;
}
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
}
function isTrustedApiRequest(req, trustedHosts) {
	const host = header(req.headers, "host");
	if (host === void 0) return false;
	let hostUrl;
	try {
		hostUrl = new URL(`http://${host}`);
	} catch {
		return false;
	}
	if (!isLoopbackHostname(hostUrl.hostname) && !trustedHosts.includes(hostUrl.host) && !trustedHosts.includes(hostUrl.hostname)) return false;
	if (header(req.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = header(req.headers, "origin");
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
}
function trustedHostsOf(ctx) {
	for (const entry of ctx.get("loader")?.entries?.() ?? []) if (entry.options?.name === "connection") return entry.options.config?.trustedHosts ?? [];
	return [];
}
function writeJson(res, body) {
	res.writeHead(200, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store"
	});
	res.end(JSON.stringify(body));
}
function writeError(res, code, message, status = 400) {
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store"
	});
	res.end(JSON.stringify({
		ok: false,
		error: {
			code,
			message
		}
	}));
}
async function readJsonBody(req) {
	const chunks = [];
	for await (const chunk of req) chunks.push(chunk);
	const raw = Buffer.concat(chunks).toString("utf8");
	if (raw.trim() === "") return {};
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "object" && parsed !== null ? parsed : {};
	} catch {
		return {};
	}
}
function registerApiRoutes(ctx, service) {
	const fence = (req) => isTrustedApiRequest(req, trustedHostsOf(ctx));
	const disposers = [];
	const route = (name, handler) => {
		disposers.push(ctx.webServer.register({
			kind: "prefix",
			path: `${API_PREFIX}/${name}`,
			handler: async (req, res) => {
				if (!fence(req)) {
					writeError(res, "forbidden", "forbidden", 403);
					return;
				}
				if (req.method !== "POST" && req.method !== "GET") {
					writeError(res, "method", "method not allowed", 405);
					return;
				}
				const payload = await readJsonBody(req);
				try {
					writeJson(res, {
						ok: true,
						value: await handler(payload)
					});
				} catch (error) {
					writeError(res, "error", error instanceof Error ? error.message : String(error));
				}
			}
		}));
	};
	route("state", async () => service.state());
	route("switch-active", async (p) => {
		const modelId = requireString(p.modelId, "modelId");
		const providerId = requireString(p.providerId, "providerId");
		await service.switchActive(modelId, providerId);
		return service.state();
	});
	route("set-model-enabled", async (p) => {
		const modelId = requireString(p.modelId, "modelId");
		if (typeof p.enabled !== "boolean") throw new Error("enabled 必须是布尔值");
		await service.setModelEnabled(modelId, p.enabled);
		return service.state();
	});
	route("reorder", async (p) => {
		const modelId = requireString(p.modelId, "modelId");
		if (!Array.isArray(p.order) || !p.order.every((id) => typeof id === "string")) throw new Error("order 必须是提供商 id 数组");
		await service.reorder(modelId, p.order);
		return service.state();
	});
	route("refresh", async () => {
		await service.refreshAndReconcile();
		return service.state();
	});
	route("set-show-quick-switch", async (p) => {
		if (typeof p.value !== "boolean") throw new Error("value 必须是布尔值");
		await service.setShowQuickSwitch(p.value);
		return service.state();
	});
	route("set-ignore-model-id-prefix", async (p) => {
		if (typeof p.value !== "boolean") throw new Error("value 必须是布尔值");
		await service.setIgnoreModelIdPrefix(p.value);
		return service.state();
	});
	route("set-model-sort", async (p) => {
		if (p.mode !== "custom" && p.mode !== "name" && p.mode !== "recent") throw new Error("mode 必须是 custom、name 或 recent");
		await service.setModelSort(p.mode);
		return service.state();
	});
	route("set-model-order", async (p) => {
		if (!Array.isArray(p.order) || !p.order.every((id) => typeof id === "string")) throw new Error("order 必须是模型 id 数组");
		await service.setModelOrder(p.order);
		return service.state();
	});
	return () => {
		for (const dispose of disposers) dispose();
	};
}
function requireString(value, name) {
	if (typeof value !== "string" || value.trim() === "") throw new Error(`${name} 不能为空`);
	return value;
}
//#endregion
//#region src/index.ts
const name = "@fonlan/dsh-model-router";
const inject = ["llm"];
const Config = RouterConfigSchema;
function apply(ctx, config) {
	const service = new ModelRouterService(ctx, config);
	ctx.effect(() => {
		service.start();
		return () => service.stop();
	}, "model-router: service");
	ctx.inject(["webServer"], (sctx) => {
		sctx.effect(() => registerApiRoutes(sctx, service), "model-router: api routes");
	});
}
//#endregion
export { Config, apply, inject, name };
