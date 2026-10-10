/**
 * The virtual `model-router` LLM adapter. Registered for the single provider
 * route `model-router`, it advertises the merged catalog and, at request time,
 * rewrites the provider field to the model's currently active provider and
 * delegates in-process to `ctx.llm.stream` — credentials, retry, streaming
 * and metering all stay inside the real adapter's pipeline. Incoming model
 * ids are matched with the leading vendor prefix ignored when the settings
 * flag is on, and delegation always uses the active provider's raw local id.
 */
import { LlmAdapter, type LlmRuntime } from '@deepseek-ai/dsh-llm';
import type { GenerateOptions, LlmModelInfo, LlmProviderInfo, LlmResolvedModelInfo, PreparedAdapterCall, StreamChunk } from '@deepseek-ai/dsh-llm';
import { type MergedModel, type RouterConfigShape } from '../shared/config.js';
/** Facts the adapter reads from the owning service (live, per request). */
export interface RouterFacts {
    /** Current merged catalog (refreshed on topology changes). */
    catalog(): {
        models: readonly MergedModel[];
        byId: ReadonlyMap<string, MergedModel>;
    };
    /** Current stored router config. */
    config(): RouterConfigShape;
    /** Provider display names by id. */
    providerNames(): ReadonlyMap<string, string>;
    /** The LLM runtime to delegate to. */
    llm(): LlmRuntime;
    /** Record one model request for the recent-use ordering (fire-and-forget). */
    noteModelUsed(modelId: string): void;
}
/** One resolved route for a model id. */
export interface ResolvedRoute {
    provider: string;
}
/**
 * Find the merged model for an incoming model id. Exact lookup first; when
 * prefix-ignore is on, a miss falls back to the prefix-stripped id so a raw
 * `deepseek/deepseek-v4-flash` request matches the merged `deepseek-v4-flash`
 * (advertised ids are already stripped and hit exactly). Unadvertised ids do
 * not match.
 */
export declare function mergedFor(facts: RouterFacts, modelId: string): MergedModel | null;
/**
 * Resolve the effective route for one model id: the stored active provider
 * when still present, otherwise the first remaining order entry, otherwise
 * the catalog head. Unadvertised model ids do not route.
 */
export declare function routeFor(facts: RouterFacts, modelId: string): ResolvedRoute | null;
/** The raw provider-local id of one provider entry inside a merged model. */
export declare function entryRawId(merged: MergedModel, providerId: string): string;
/** One validated route plus the merged model it was resolved against. */
export interface BoundRoute {
    route: ResolvedRoute;
    merged: MergedModel;
}
/**
 * Resolve one model id to its active provider and merged model, rejecting
 * unadvertised or currently unroutable ids before any provider I/O.
 */
export declare function bindRoute(facts: RouterFacts, modelId: string): BoundRoute;
export declare class ModelRouterAdapter extends LlmAdapter {
    private readonly facts;
    constructor(facts: RouterFacts);
    providerInfo(provider: string): LlmProviderInfo;
    listModels(_provider: string): Promise<readonly LlmModelInfo[]>;
    resolveModel(_provider: string, model: string, signal?: AbortSignal): Promise<LlmResolvedModelInfo>;
    /**
     * Bind the route generation at preparation time: a provider switch or
     * catalog refresh between preparation and dispatch cannot combine one
     * generation's metadata with another's endpoint, matching the host's
     * one-generation dispatch contract.
     */
    prepareCall(_provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall>;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
    /**
     * Delegate with the provider's raw local id (it may carry a vendor/
     * prefix the real provider needs), then normalize the resolved identity
     * back to the merged display id so sessions/metering never leak prefixes.
     */
    private resolveRoutedIdentity;
    private streamRouted;
}
