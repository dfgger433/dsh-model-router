/**
 * @fonlan/dsh-model-router shared routing core — pure functions, no side
 * effects, unit-tested in test/config.test.ts and shared verbatim between the
 * server half (route resolution at request time) and the client bundle
 * (settings page rendering).
 *
 * Decided semantics (grilling session, all recommendations accepted):
 * - Merge: models are merged across providers by model id — by exact id, or
 *   (when ignoreModelIdPrefix is on) by id with the first `vendor/` segment
 *   stripped, so `deepseek/deepseek-v4-flash` and `deepseek-v4-flash` are the
 *   same model. Display always uses the merged (prefix-free) id; each provider
 *   entry keeps its own raw local id for delegation.
 * - Per-model provider config: an order[] (future auto-failover preference)
 *   plus an independent active provider (what requests actually route to).
 * - First-seen provider order: for a never-configured model the initial
 *   order is provider discovery order and the initial active is its head.
 * - Vanished providers: pruned from order; when active vanishes, fall back to
 *   the first remaining provider automatically.
 * - New providers for a known model: appended at the end of order; active
 *   untouched.
 * - Prefix-ignore migration: stored config keyed by a now-stripped raw id
 *   moves to the merged id (unprefixed entry wins when both exist; order is a
 *   deduped union). Turning the flag off does not migrate back — the split
 *   models re-initialize from discovery order.
 */
/** One provider's view of one model. */
export interface ProviderModelInfo {
    /** Provider id the model belongs to. */
    provider: string;
    /** Provider-local raw model id, exactly as the provider advertises it
     *  (may carry a `vendor/` prefix; this is the id delegation must use). */
    id: string;
    /** Provider-local display name. */
    name: string;
    /** Provider-local context window (tokens), when advertised. */
    contextWindow?: number;
    /** Provider-local max output tokens, when advertised. */
    maxTokens?: number;
}
/** One configured provider as discovered from the host. */
export interface ProviderInfo {
    id: string;
    /** Provider display name when advertised. */
    name?: string;
    models: Array<Omit<ProviderModelInfo, 'provider'>>;
}
/** One merged model across all providers. */
export interface MergedModel {
    /** Merged display id — the raw id with the leading segment stripped when
     *  prefix-ignore is on, so it is always shown without a vendor prefix. */
    id: string;
    /** Per-provider entries in provider discovery order (raw local ids). */
    providers: ProviderModelInfo[];
}
/** Router configuration for one model (keyed by merged id). */
export interface RouterModelConfig {
    /** Provider ids in preference order (future auto-failover). */
    order: string[];
    /** The provider requests currently route to. */
    active: string;
    /** Whether this model may be advertised and routed by model-router. */
    enabled: boolean;
}
/**
 * How the router orders the model list it advertises to the host model
 * picker (the `model-router` group in DSH's model selection box).
 *
 * - `custom`: the explicit `modelOrder` array wins; models absent from it are
 *   appended in catalog (first-seen) order.
 * - `name`: models sorted by their display name (active provider's name),
 *   falling back to the merged id.
 * - `recent`: models sorted by most-recently-used first (timestamp desc);
 *   never-used models come last in catalog order.
 *
 * Absent/unknown documents normalize to `custom` (the pre-existing catalog
 * order, so upgrading is a no-op until the user changes it).
 */
export type ModelSortMode = 'custom' | 'name' | 'recent';
/** The whole router config document. */
export interface RouterConfigShape {
    models: Record<string, RouterModelConfig>;
    /**
     * Whether the provider switching entry is shown inside the composer model
     * picker menu (settings → 模型路由 → 在模型选择菜单中显示提供商切换). Stored
     * globally; absent/unknown documents normalize to `true`.
     */
    showQuickSwitch: boolean;
    /**
     * Whether model ids are matched with their leading `vendor/` segment
     * ignored (settings → 模型路由 → 匹配时忽略模型 ID 前缀), so
     * `deepseek/deepseek-v4-flash` and `deepseek-v4-flash` merge into one model
     * displayed as `deepseek-v4-flash`. Absent/unknown documents normalize to
     * `true`.
     */
    ignoreModelIdPrefix: boolean;
    /**
     * The model-list display order mode (settings → 模型路由 → 模型显示顺序).
     * Absent/unknown documents normalize to `custom`.
     */
    modelSort: ModelSortMode;
    /**
     * Explicit model id order for `custom` mode, in display order. Kept
     * reconciled against the catalog (vanished ids pruned, new ids appended).
     * Absent/unknown documents normalize to `[]`.
     */
    modelOrder: string[];
    /**
     * Merged model id → last-use epoch millis, for `recent` mode. Written by
     * the router adapter whenever a model request streams. Absent/unknown
     * documents normalize to `{}`.
     */
    recentlyUsed: Record<string, number>;
}
export declare const ROUTER_PROVIDER_ID = "model-router";
export declare const ROUTER_SETTINGS_NS = "model-router";
/**
 * Strip the first path segment (`vendor/`) from a model id, case-sensitively.
 * Inert for ids without a prefix: no slash, an empty first segment, or an
 * empty remainder all return the input unchanged. `a/b/c` becomes `b/c`.
 */
export declare function stripModelIdPrefix(id: string): string;
export interface MergeOptions {
    /** Group by prefix-stripped id instead of the exact raw id. */
    ignorePrefix?: boolean;
}
/**
 * Merge every provider's models into one entry per model id. With
 * `ignorePrefix` the group key is the prefix-stripped id and the merged id is
 * that stripped id, while each provider entry keeps its raw local id. When a
 * single provider advertises both a prefixed and the unprefixed raw id for the
 * same group (a same-provider collision), the unprefixed raw id wins (it is
 * the canonical form); otherwise the first-seen raw id wins.
 */
export declare function mergeModels(providers: readonly ProviderInfo[], options?: MergeOptions): MergedModel[];
/** The provider view a merged model should display for (follows active). */
export declare function displayProvider(merged: MergedModel, active: string | undefined): ProviderModelInfo | null;
/** The display name a merged model advertises (active provider's name). */
export declare function displayNameOf(model: MergedModel, config: RouterConfigShape): string;
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
export declare function sortModelsForList(models: readonly MergedModel[], config: RouterConfigShape): MergedModel[];
/** Initial config for a model the user never configured: first in order wins. */
export declare function initialConfigFor(providerIds: readonly string[]): RouterModelConfig | null;
/**
 * Effective active provider for a model id.
 *
 * Rules: a stored active still present in the catalog wins; otherwise the
 * first stored order entry still present wins; otherwise the first provider
 * of the catalog wins; an empty catalog yields null.
 */
export declare function resolveActive(config: RouterConfigShape, modelId: string, catalogProviderIds: readonly string[]): string | null;
/**
 * Reconcile one model's config against the live catalog: prune vanished
 * providers, append newly discovered ones, and repair a vanished active by
 * falling back to the first remaining provider. Returns the new config, or
 * undefined when the catalog leaves nothing to route to.
 */
export declare function syncConfig(config: RouterConfigShape, modelId: string, catalogProviderIds: readonly string[]): {
    models: Record<string, RouterModelConfig>;
    changed: boolean;
};
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
export declare function reconcileConfig(config: RouterConfigShape, models: readonly MergedModel[]): {
    models: Record<string, RouterModelConfig>;
    modelOrder: string[] | undefined;
    changed: boolean;
};
/** Switch a model's active provider (no-op when already active). */
export declare function setActive(config: RouterConfigShape, modelId: string, providerId: string, catalogProviderIds: readonly string[]): {
    models: Record<string, RouterModelConfig>;
    changed: boolean;
};
/** Replace a model's provider preference order (active left untouched). */
export declare function setOrder(config: RouterConfigShape, modelId: string, order: readonly string[], catalogProviderIds: readonly string[]): {
    models: Record<string, RouterModelConfig>;
    changed: boolean;
};
/** Dereference every own field of a config object (per-field volatile refs). */
export declare function derefConfig(value: unknown): unknown;
/** Shape-validate an unknown value as a RouterConfigShape (lenient). */
export declare function normalizeConfig(value: unknown): RouterConfigShape;
