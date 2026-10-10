/**
 * @fonlan/dsh-model-router host half: the virtual model-router provider.
 *
 * Registers one `model-router` LLM adapter that aggregates every configured
 * provider and model (strict model-id merge), routes each request to the
 * model's currently active provider by in-process delegation, keeps the
 * per-model provider order/active config in the entry config of this bundle
 * (dsh >= 0.1.7: the `Config` schema below is the settings document), and
 * serves the fenced JSON API the web settings page calls.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { RouterConfigShape } from './shared/config.js';
export declare const name = "@fonlan/dsh-model-router";
export declare const inject: string[];
export declare const Config: import("@deepseek-ai/schemastery").default<RouterConfigShape>;
export declare function apply(ctx: Context, config: RouterConfigShape): void;
