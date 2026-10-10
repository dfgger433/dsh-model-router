/**
 * Provider discovery for the router: every registered LLM provider route
 * (minus the router itself) becomes a ProviderInfo, models merge through the
 * shared core (by exact id, or by prefix-stripped id when `ignorePrefix` is
 * on), and per-provider credential status is detected generically through the
 * configurable-provider directory + the credentials seam.
 */
import type { Context } from '@deepseek-ai/cordis';
import { type MergedModel, type ProviderInfo } from '../shared/config.js';
/** Live router catalog: everything the router can advertise and route to. */
export interface RouterCatalog {
    /** All providers (minus the router) in registration order. */
    providers: ProviderInfo[];
    /** Provider id → human display name (configurable-directory name when known). */
    providerNames: Map<string, string>;
    /** Models merged across providers (exact id, or stripped when flag on). */
    models: MergedModel[];
    /** Model id → merged model. */
    byId: Map<string, MergedModel>;
    /** Provider id → whether the provider currently has usable credentials. */
    credentialConfigured: Map<string, boolean>;
    /** False while discovery is empty, a provider is pending, or listModels failed. */
    complete: boolean;
}
/** Rebuild the live router catalog from the LLM registry. */
export declare function buildCatalog(ctx: Context, ignorePrefix?: boolean): Promise<RouterCatalog>;
