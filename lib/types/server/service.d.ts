/**
 * The model-router service: settings persistence, live catalog cache, the
 * virtual adapter registration, topology-triggered reconciliation, and the
 * mutation actions the API surface exposes.
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type ModelSortMode, type RouterConfigShape } from '../shared/config.js';
import { type RouterCatalog } from './catalog.js';
import { type RouterFacts } from './adapter.js';
export declare const NS = "model-router";
/**
 * The slice of the host settings service this plugin writes through. dsh >=
 * 0.1.7 owns plugin configuration as entry config (the plugin's `Config`
 * schema), so the router reads the document it was applied with and persists
 * updates via `settings.replace`, which writes the profile patch.
 */
export interface SettingsReplaceFace {
    replace(ns: string, section: object, expectedRevision?: number): Promise<void>;
}
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
export declare const RouterConfigSchema: z<RouterConfigShape>;
/** The settings-page state view served by the API. */
export interface ModelRouterState {
    /**
     * Whether this deployment can persist configuration. False (a profile
     * without the host settings service) makes the page render read-only.
     */
    writable: boolean;
    /** Whether provider switching is shown inside the composer model picker menu. */
    showQuickSwitch: boolean;
    /** Whether model ids are matched with their leading vendor/ prefix ignored. */
    ignoreModelIdPrefix: boolean;
    /** The model-list display order mode (custom | name | recent). */
    modelSort: ModelSortMode;
    /** Explicit model id order for custom mode (display order). */
    modelOrder: string[];
    providers: Array<{
        id: string;
        name: string;
        credentialConfigured: boolean;
    }>;
    models: Array<{
        id: string;
        /** Display name following the effective active provider. */
        name: string;
        /** Effective active provider (never null while the model has providers). */
        active: string | null;
        /** Whether this model is enabled for routing. */
        enabled: boolean;
        /** Effective provider preference order. */
        order: string[];
        providers: Array<{
            id: string;
            name: string;
            credentialConfigured: boolean;
        }>;
    }>;
}
export declare class ModelRouterService implements RouterFacts {
    private readonly ctx;
    private cached;
    /** Serialize read-modify-write operations, not precomputed snapshots. */
    private writeQueue;
    private stopped;
    private inflight;
    private cachedAt;
    /** Optional host settings service; absent in profiles without one (no persistence). */
    private settings;
    /** Live config document (seeded from the entry config, updated on write). */
    private configDoc;
    private registration;
    /** How long a built catalog is considered fresh before being rebuilt. */
    private readonly catalogTtlMs;
    /**
     * Debounced recent-use persistence (see noteModelUsed / flushUsage). Kept
     * long on purpose: every persist writes the entry config, which restarts
     * this plugin's entry, so usage bookkeeping must not stream live traffic.
     */
    private readonly usageFlushMs;
    private usageDebounce;
    private pendingUsage;
    private usageFlushRunning;
    constructor(ctx: Context, config: RouterConfigShape);
    /** Register the settings seam + adapter and wire topology listeners. */
    start(): void;
    stop(): void;
    catalog(): {
        models: RouterCatalog['models'];
        byId: RouterCatalog['byId'];
    };
    config(): RouterConfigShape;
    providerNames(): ReadonlyMap<string, string>;
    llm(): import("@deepseek-ai/dsh-llm").LlmRuntime;
    /**
     * Record one model request for the `recent` display order. Fire-and-forget
     * (the adapter never awaits it): timestamps accumulate in memory and are
     * persisted debounced, so a burst of requests coalesces into one settings
     * write.
     */
    noteModelUsed(modelId: string): void;
    /** Persist accumulated usage timestamps (merging with any concurrent writes). */
    private flushUsage;
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
    refreshCatalog(force?: boolean): Promise<RouterCatalog>;
    /** Refresh discovery without treating temporarily absent models as deleted preferences. */
    refreshAndReconcile(): Promise<void>;
    /** Effective active provider for one model id (null when unroutable). */
    activeFor(modelId: string): string | null;
    /** The complete state view for the settings page. */
    state(): Promise<ModelRouterState>;
    /** Switch the active provider for one model (persisted, live on next request). */
    switchActive(modelId: string, providerId: string): Promise<void>;
    /** Toggle whether one merged model may be advertised and routed. */
    setModelEnabled(modelId: string, enabled: boolean): Promise<void>;
    /** Replace the preference order for one model (active left untouched). */
    reorder(modelId: string, order: string[]): Promise<void>;
    /** Toggle the composer quick route-switcher button (global, persisted). */
    setShowQuickSwitch(value: boolean): Promise<void>;
    /**
     * Toggle prefix-ignored model matching (global, persisted). Persists the
     * flag first, then rebuilds the catalog with the new merge rule and
     * reconciles stored config (migrates prefixed keys to merged ids when
     * turning on; split models re-initialize when turning off).
     */
    setIgnoreModelIdPrefix(value: boolean): Promise<void>;
    /** Switch the model-list display order mode (global, persisted). */
    setModelSort(mode: ModelSortMode): Promise<void>;
    /**
     * Replace the explicit custom model order (global, persisted). Vanished
     * ids are pruned and missing catalog models appended, so the stored order
     * always covers the live catalog.
     */
    setModelOrder(order: string[]): Promise<void>;
    /** Compute and persist each mutation against the latest successfully written config. */
    private writeConfig;
}
