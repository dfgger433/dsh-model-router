window.__ModuleLoader__.load({
	id: "@fonlan/dsh-model-router",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		_deepseek_ai_dsh_client_ui_primitives = __toESM(_deepseek_ai_dsh_client_ui_primitives, 1);
		//#region src/client/locales.ts
		const LOCALE_NS = "model-router";
		const zh = {
			settingsTitle: "模型路由",
			sectionSub: "模型聚合、提供商切换与优先级顺序",
			readOnly: "本部署的设置为只读。",
			loading: "加载中…",
			loadFailed: "加载失败：{message}",
			retry: "重试",
			refresh: "刷新",
			empty: "没有可路由的提供商或模型，请先在设置中添加提供商。",
			modelsCount: "共 {count} 个模型",
			activeBadge: "当前",
			noCredential: "未配置 API 密钥，不可选",
			dragHint: "拖拽调整优先级顺序",
			switchFailed: "切换失败：{message}",
			reorderFailed: "排序失败：{message}",
			providerCount: "{count} 个提供商",
			modelEnabled: "已启用",
			modelDisabled: "已禁用",
			modelEnabledAria: "切换 {model} 是否参与路由",
			modelToggleFailed: "模型开关失败：{message}",
			seatLabel: "模型选择（含提供商切换）",
			menuAria: "模型、提供商与推理等级",
			menuModel: "模型",
			menuProvider: "提供商",
			menuEffort: "推理等级",
			triggerFallback: "选择模型",
			triggerSelectAria: "选择模型",
			triggerAria: "选择模型，当前 {model}",
			triggerAriaEffort: "选择模型，当前 {model}，推理等级 {effort}",
			effortProviderDefault: "Default",
			statusLoading: "正在刷新模型列表…",
			errorAction: "模型操作失败：{message}",
			actionReload: "重新加载",
			warningGroupLoad: "{name} 加载失败：{message}",
			emptyModels: "没有可用的模型。",
			emptyEfforts: "当前模型未提供推理等级。",
			routeMenuTitle: "{model} · 选择提供商",
			routeLoading: "加载路由…",
			noCredentialShort: "未配置凭据",
			globalRouteHint: "切换后对所有会话的后续请求生效",
			showQuickSwitchLabel: "在模型选择菜单中显示提供商切换",
			showQuickSwitchDescription: "开启后，当当前模型是 model-router 路由时，模型选择弹出菜单会显示提供商列表入口，可直接切换该模型的激活提供商。",
			ignorePrefixLabel: "匹配时忽略模型 ID 前缀",
			ignorePrefixDescription: "开启后，deepseek/deepseek-v4-flash 与 deepseek-v4-flash 视为同一模型，统一显示不带前缀的模型 id（默认开启）。",
			sortTitle: "模型显示顺序",
			sortDescription: "模型选择列表中 model-router 分组内模型的排列方式。",
			sortModeCustom: "自定义",
			sortModeName: "按名称",
			sortModeRecent: "最近使用",
			sortModeDescCustom: "按下方拖拽的手动顺序排列",
			sortModeDescName: "按模型名称排序（数字感知）",
			sortModeDescRecent: "最近用过的模型排在最前",
			sortCustomHint: "拖拽调整模型在模型选择列表中的显示顺序",
			sortFailed: "排序设置失败：{message}"
		};
		const en = {
			settingsTitle: "Model Router",
			sectionSub: "Model aggregation, provider switching and preference order",
			readOnly: "This deployment stores settings read-only.",
			loading: "Loading…",
			loadFailed: "Load failed: {message}",
			retry: "Retry",
			refresh: "Refresh",
			empty: "No routable providers or models yet — add providers in settings first.",
			modelsCount: "{count} models",
			activeBadge: "active",
			noCredential: "No API key configured — not selectable",
			dragHint: "Drag to adjust preference order",
			switchFailed: "Switch failed: {message}",
			reorderFailed: "Reorder failed: {message}",
			providerCount: "{count} providers",
			modelEnabled: "Enabled",
			modelDisabled: "Disabled",
			modelEnabledAria: "Toggle whether {model} participates in routing",
			modelToggleFailed: "Model toggle failed: {message}",
			seatLabel: "Model selection (with provider switching)",
			menuAria: "Model, provider and reasoning effort",
			menuModel: "Model",
			menuProvider: "Provider",
			menuEffort: "Effort",
			triggerFallback: "Select model",
			triggerSelectAria: "Select model",
			triggerAria: "Select model, current {model}",
			triggerAriaEffort: "Select model, current {model}, reasoning effort {effort}",
			effortProviderDefault: "Default",
			statusLoading: "Refreshing model list…",
			errorAction: "Model operation failed: {message}",
			actionReload: "Reload",
			warningGroupLoad: "{name} failed to load: {message}",
			emptyModels: "No models available.",
			emptyEfforts: "This model provides no reasoning effort levels.",
			routeMenuTitle: "{model} · Choose provider",
			routeLoading: "Loading routes…",
			noCredentialShort: "No credentials",
			globalRouteHint: "Changes apply to subsequent requests in all sessions",
			showQuickSwitchLabel: "Show provider switching in the model picker",
			showQuickSwitchDescription: "When enabled, the model picker menu shows a provider list entry that switches the active provider, for model-router routes.",
			ignorePrefixLabel: "Ignore model ID prefix when matching",
			ignorePrefixDescription: "When enabled, deepseek/deepseek-v4-flash and deepseek-v4-flash are treated as the same model and shown without the prefix (on by default).",
			sortTitle: "Model display order",
			sortDescription: "How models inside the model-router group are ordered in the model picker.",
			sortModeCustom: "Custom",
			sortModeName: "By name",
			sortModeRecent: "Recently used",
			sortModeDescCustom: "Manual order via drag below",
			sortModeDescName: "Sort by model name (numeric-aware)",
			sortModeDescRecent: "Most recently used models first",
			sortCustomHint: "Drag to reorder models in the model picker",
			sortFailed: "Sort setting failed: {message}"
		};
		//#endregion
		//#region src/client/api.ts
		var ModelRouterApiError = class extends Error {
			code;
			constructor(code, message) {
				super(message);
				this.code = code;
			}
		};
		async function call(method, payload = {}) {
			let response;
			try {
				response = await fetch(`/plugins/@fonlan/dsh-model-router/api/${method}`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(payload)
				});
			} catch (error) {
				throw new ModelRouterApiError("network", error instanceof Error ? error.message : String(error));
			}
			const parsed = await response.json().catch(() => null);
			if (!response.ok || parsed === null || parsed.ok !== true || parsed.value === void 0) throw new ModelRouterApiError(parsed?.error?.code ?? "http", parsed?.error?.message ?? `HTTP ${response.status}`);
			return parsed.value;
		}
		const api = {
			state: () => call("state"),
			setModelEnabled: (modelId, enabled) => call("set-model-enabled", { modelId, enabled }),
			switchActive: (modelId, providerId) => call("switch-active", {
				modelId,
				providerId
			}),
			reorder: (modelId, order) => call("reorder", {
				modelId,
				order
			}),
			refresh: () => call("refresh"),
			setShowQuickSwitch: (value) => call("set-show-quick-switch", { value }),
			setIgnoreModelIdPrefix: (value) => call("set-ignore-model-id-prefix", { value }),
			setModelSort: (mode) => call("set-model-sort", { mode }),
			setModelOrder: (order) => call("set-model-order", { order })
		};
		//#endregion
		//#region \0dsh-css:/home/runner/work/dsh-model-router/dsh-model-router/src/client/settings-section.css.mjs
		const css$1 = "/* Model Router settings page — the page owns one entry in the settings\n   sidebar and renders its content in the panel's content column. Styles are\n   theme-consistent via DSW alias variables; the page draws its own static\n   header (title plus a one-line summary) over the always-visible controls. */\n\n/* page layout */\n\n.mr-page {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  max-width: 720px;\n}\n\n.mr-page-head {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.mr-page-title {\n  margin: 0;\n  color: var(--dsw-alias-label-primary, #e6e6e6);\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.mr-page-sub {\n  margin: 0;\n  color: var(--dsw-alias-label-tertiary, #8b93a7);\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n/* body layout */\n\n.mr-body {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.mr-settings-readonly {\n  color: var(--dsw-alias-label-tertiary, #8b93a7);\n  margin: 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n/* ── page body: the router controls ─────────────────────────────────────── */\n\n.mr-root {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 0 0 4px;\n}\n\n.mr-quick-switch {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  padding: 8px 10px;\n  border: 1px solid var(--dsw-alias-border-inverted);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-module-platform);\n  cursor: pointer;\n}\n\n.mr-quick-switch input[type=\"checkbox\"] {\n  margin-top: 2px;\n  accent-color: var(--dsw-alias-accent);\n}\n\n.mr-quick-switch-copy {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n\n.mr-quick-switch-label {\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.mr-quick-switch-desc {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.mr-toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.mr-count {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.mr-button {\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  background: var(--dsw-alias-interactive-bg-hover);\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 8px;\n  font-size: 12px;\n  line-height: 18px;\n  padding: 3px 10px;\n}\n\n.mr-button:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n  filter: brightness(1.08);\n}\n\n.mr-button:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n.mr-error {\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  border-radius: 8px;\n  padding: 7px 8px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.mr-empty {\n  color: var(--dsw-alias-label-tertiary);\n  padding: 16px 0;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.mr-models {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.mr-card {\n  border: 1px solid var(--dsw-alias-border-inverted);\n  border-radius: 12px;\n  padding: 10px 12px;\n  background: var(--dsw-alias-bg-module-platform);\n  transition: opacity 0.12s;\n}\n\n.mr-card-busy {\n  opacity: 0.6;\n  pointer-events: none;\n}\n\n.mr-card-header {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  min-width: 0;\n}\n\n.mr-model-name {\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 20px;\n}\n\n.mr-model-id {\n  color: var(--dsw-alias-label-tertiary);\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n  font-size: 12px;\n  line-height: 18px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  min-width: 0;\n  flex: 1;\n}\n\n.mr-provider-count {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n  flex: none;\n}\n\n.mr-model-toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  margin-left: auto;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 18px;\n  white-space: nowrap;\n  cursor: pointer;\n}\n\n.mr-model-toggle input {\n  margin: 0;\n  accent-color: var(--dsw-alias-accent);\n}\n\n.mr-drag-hint {\n  margin: 2px 0 6px;\n  color: var(--dsw-alias-label-caption);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.mr-providers {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.mr-provider {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  border: 1px solid transparent;\n  border-radius: 10px;\n  padding: 2px 8px 2px 4px;\n}\n\n.mr-provider-active {\n  background: var(--dsw-alias-interactive-bg-hover);\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.mr-provider-nocred {\n  opacity: 0.55;\n}\n\n.mr-provider-drop {\n  border-color: var(--dsw-alias-border-brand);\n}\n\n.mr-grip {\n  color: var(--dsw-alias-label-caption);\n  cursor: grab;\n  font-size: 12px;\n  line-height: 20px;\n  flex: none;\n  user-select: none;\n}\n\n.mr-grip:active {\n  cursor: grabbing;\n}\n\n.mr-provider-button {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: baseline;\n  gap: 6px;\n  color: var(--dsw-alias-label-primary);\n  background: none;\n  border: none;\n  text-align: left;\n  cursor: pointer;\n  font: inherit;\n  padding: 4px 0;\n}\n\n.mr-provider-button:disabled {\n  cursor: default;\n}\n\n.mr-provider-name {\n  font-size: 13px;\n  line-height: 20px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.mr-provider-nocred-label {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n  flex: none;\n}\n\n.mr-active-badge {\n  flex: none;\n  color: var(--dsw-alias-label-inverted, #fff);\n  background: var(--dsw-alias-border-brand, #4d6bfe);\n  border-radius: 999px;\n  font-size: 11px;\n  line-height: 16px;\n  padding: 0 8px;\n}\n\n/* ── model display order ────────────────────────────────────────────────── */\n\n.mr-sort {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 8px 10px;\n  border: 1px solid var(--dsw-alias-border-inverted);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.mr-sort-head {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.mr-sort-title {\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.mr-sort-desc {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.mr-sort-modes {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.mr-sort-mode {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  padding: 5px 6px;\n  cursor: pointer;\n}\n\n.mr-sort-mode:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.mr-sort-mode input[type=\"radio\"] {\n  margin-top: 2px;\n  accent-color: var(--dsw-alias-accent);\n}\n\n.mr-sort-mode-copy {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n\n.mr-sort-mode-label {\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.mr-sort-mode-desc {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.mr-sort-custom {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  border-top: 1px solid var(--dsw-alias-border-l2, #2a3346);\n  padding-top: 8px;\n}\n\n.mr-sort-hint {\n  color: var(--dsw-alias-label-caption);\n  margin: 0;\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.mr-sort-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  max-height: 280px;\n  overflow-y: auto;\n}\n\n.mr-sort-item {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  border: 1px solid var(--dsw-alias-border-l2, #2a3346);\n  border-radius: 8px;\n  padding: 4px 8px 4px 4px;\n  background: var(--dsw-alias-bg-layer-1, #0d1017);\n}\n\n.mr-sort-item-drop {\n  border-color: var(--dsw-alias-border-brand);\n}\n\n.mr-sort-item-busy {\n  opacity: 0.6;\n  pointer-events: none;\n}\n\n.mr-sort-model-name {\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  min-width: 0;\n}\n\n.mr-sort-model-id {\n  color: var(--dsw-alias-label-tertiary);\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n  font-size: 11px;\n  line-height: 16px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  flex: 1;\n  text-align: right;\n}\n";
		const tagId$1 = "@fonlan/dsh-model-router/settings-section.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@fonlan/dsh-model-router";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/settings-section.tsx
		/**
		* The Model Router settings page (设置 → 侧栏「模型路由」).
		*
		* Registers into the settings.section slot, so the page owns one entry in the
		* settings sidebar and renders its content in the panel's content column. The
		* page draws its own static header (title plus a one-line summary) over the
		* router controls: every routed model with its providers, their order and the
		* provider the model currently routes to. All reads/mutations go through the
		* plugin's fenced API; the server persists into this plugin's loader-entry
		* config (dsh >= 0.1.7), so a switch here is live for the next request
		* globally.
		*
		* The page needs no settings service: whether the deployment can persist is
		* reported by the API itself (`state.writable`), so the page registers and
		* mounts everywhere the host half serves its API. A read-only deployment
		* shows the banner and disables the mutation controls.
		*/
		function arrayMove(list, from, to) {
			const next = [...list];
			const [item] = next.splice(from, 1);
			next.splice(to, 0, item);
			return next;
		}
		function getOrderedProviders(model) {
			const byId = new Map(model.providers.map((provider) => [provider.id, provider]));
			const providers = model.order.flatMap((id) => {
				const provider = byId.get(id);
				if (provider === void 0) return [];
				byId.delete(id);
				return [provider];
			});
			return [...providers, ...byId.values()];
		}
		function useLocaleRevision(ctx) {
			const subscribe = (0, react.useCallback)((onChange) => {
				try {
					return ctx.locale.subscribe(onChange);
				} catch {
					return () => {};
				}
			}, [ctx]);
			const getSnapshot = (0, react.useCallback)(() => {
				try {
					return ctx.locale.getLocale().revision;
				} catch {
					return 0;
				}
			}, [ctx]);
			return (0, react.useSyncExternalStore)(subscribe, getSnapshot);
		}
		function makeSettingsSection(ctx) {
			const t = (() => {
				try {
					return ctx.locale.bind(LOCALE_NS);
				} catch {
					return (key) => key;
				}
			})();
			return function ModelRouterSettingsSection() {
				useLocaleRevision(ctx);
				const [state, setState] = (0, react.useState)(null);
				const [error, setError] = (0, react.useState)(null);
				const [loading, setLoading] = (0, react.useState)(true);
				const [busyModel, setBusyModel] = (0, react.useState)(null);
				const [drag, setDrag] = (0, react.useState)(null);
				const [quickSwitchBusy, setQuickSwitchBusy] = (0, react.useState)(false);
				const [ignorePrefixBusy, setIgnorePrefixBusy] = (0, react.useState)(false);
				const [sortBusy, setSortBusy] = (0, react.useState)(false);
				const [modelDrag, setModelDrag] = (0, react.useState)(null);
				const load = (0, react.useCallback)(async () => {
					setLoading(true);
					try {
						const next = await api.state();
						setState(next);
						setError(null);
					} catch (cause) {
						setError(cause instanceof Error ? cause.message : String(cause));
					} finally {
						setLoading(false);
					}
				}, []);
				(0, react.useEffect)(() => {
					load();
				}, [load]);
				const toggleModel = (0, react.useCallback)(async (model, enabled) => {
					setBusyModel(model.id);
					try {
						setState(await api.setModelEnabled(model.id, enabled));
						setError(null);
					} catch (cause) {
						setError(t("modelToggleFailed", { message: cause instanceof Error ? cause.message : String(cause) }));
					} finally {
						setBusyModel(null);
					}
				}, [t]);
				const switchActive = (0, react.useCallback)(async (model, providerId) => {
					if (model.active === providerId) return;
					setBusyModel(model.id);
					try {
						setState(await api.switchActive(model.id, providerId));
						setError(null);
					} catch (cause) {
						setError(t("switchFailed", { message: cause instanceof Error ? cause.message : String(cause) }));
					} finally {
						setBusyModel(null);
					}
				}, [t]);
				const reorder = (0, react.useCallback)(async (model, from, to) => {
					if (from === to) return;
					const order = arrayMove(getOrderedProviders(model).map((provider) => provider.id), from, to);
					setState((prev) => prev === null ? prev : {
						...prev,
						models: prev.models.map((m) => m.id === model.id ? {
							...m,
							order
						} : m)
					});
					setBusyModel(model.id);
					try {
						setState(await api.reorder(model.id, order));
						setError(null);
					} catch (cause) {
						setError(t("reorderFailed", { message: cause instanceof Error ? cause.message : String(cause) }));
						setState((prev) => prev === null ? prev : {
							...prev,
							models: prev.models.map((m) => m.id === model.id ? {
								...m,
								order: model.order
							} : m)
						});
					} finally {
						setBusyModel(null);
					}
				}, [t]);
				const toggleQuickSwitch = (0, react.useCallback)(async (value) => {
					if (state === null) return;
					const previous = state.showQuickSwitch;
					setState((prev) => prev === null ? prev : {
						...prev,
						showQuickSwitch: value
					});
					setQuickSwitchBusy(true);
					try {
						setState(await api.setShowQuickSwitch(value));
						setError(null);
					} catch (cause) {
						setState((prev) => prev === null ? prev : {
							...prev,
							showQuickSwitch: previous
						});
						setError(cause instanceof Error ? cause.message : String(cause));
					} finally {
						setQuickSwitchBusy(false);
					}
				}, [state]);
				const toggleIgnorePrefix = (0, react.useCallback)(async (value) => {
					if (state === null) return;
					const previous = state.ignoreModelIdPrefix;
					setState((prev) => prev === null ? prev : {
						...prev,
						ignoreModelIdPrefix: value
					});
					setIgnorePrefixBusy(true);
					try {
						setState(await api.setIgnoreModelIdPrefix(value));
						setError(null);
					} catch (cause) {
						setState((prev) => prev === null ? prev : {
							...prev,
							ignoreModelIdPrefix: previous
						});
						setError(cause instanceof Error ? cause.message : String(cause));
					} finally {
						setIgnorePrefixBusy(false);
					}
				}, [state]);
				const changeModelSort = (0, react.useCallback)(async (mode) => {
					if (state === null || state.modelSort === mode) return;
					const previous = state.modelSort;
					setState((prev) => prev === null ? prev : {
						...prev,
						modelSort: mode
					});
					setSortBusy(true);
					try {
						setState(await api.setModelSort(mode));
						setError(null);
					} catch (cause) {
						setState((prev) => prev === null ? prev : {
							...prev,
							modelSort: previous
						});
						setError(t("sortFailed", { message: cause instanceof Error ? cause.message : String(cause) }));
					} finally {
						setSortBusy(false);
					}
				}, [state, t]);
				const moveModel = (0, react.useCallback)(async (from, to) => {
					if (state === null || from === to) return;
					const order = arrayMove(state.models.map((model) => model.id), from, to);
					setState((prev) => prev === null ? prev : {
						...prev,
						modelOrder: order
					});
					setSortBusy(true);
					try {
						setState(await api.setModelOrder(order));
						setError(null);
					} catch (cause) {
						setState((prev) => prev === null ? prev : {
							...prev,
							modelOrder: state.modelOrder
						});
						setError(t("sortFailed", { message: cause instanceof Error ? cause.message : String(cause) }));
					} finally {
						setSortBusy(false);
					}
				}, [state, t]);
				const writable = state?.writable ?? true;
				const models = (0, react.useMemo)(() => state?.models ?? [], [state]);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "mr-page",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "mr-page-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: "mr-page-title",
							children: t("settingsTitle")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "mr-page-sub",
							children: t("sectionSub")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "mr-body",
						children: [!loading && state !== null && !writable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "mr-settings-readonly",
							role: "status",
							children: t("readOnly")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "mr-root",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "mr-quick-switch",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: state?.showQuickSwitch ?? true,
										disabled: loading || quickSwitchBusy || !writable,
										onChange: (event) => void toggleQuickSwitch(event.target.checked)
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "mr-quick-switch-copy",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-quick-switch-label",
											children: t("showQuickSwitchLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-quick-switch-desc",
											children: t("showQuickSwitchDescription")
										})]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "mr-quick-switch",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: state?.ignoreModelIdPrefix ?? true,
										disabled: loading || ignorePrefixBusy || !writable,
										onChange: (event) => void toggleIgnorePrefix(event.target.checked)
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "mr-quick-switch-copy",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-quick-switch-label",
											children: t("ignorePrefixLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-quick-switch-desc",
											children: t("ignorePrefixDescription")
										})]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "mr-sort",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "mr-sort-head",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "mr-sort-title",
												children: t("sortTitle")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "mr-sort-desc",
												children: t("sortDescription")
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "mr-sort-modes",
											role: "radiogroup",
											"aria-label": t("sortTitle"),
											children: [
												"custom",
												"name",
												"recent"
											].map((mode) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "mr-sort-mode",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "mr-model-sort",
													checked: state?.modelSort === mode,
													disabled: loading || sortBusy || !writable,
													onChange: () => void changeModelSort(mode)
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													className: "mr-sort-mode-copy",
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "mr-sort-mode-label",
														children: t(`sortMode${mode[0].toUpperCase()}${mode.slice(1)}`)
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "mr-sort-mode-desc",
														children: t(`sortModeDesc${mode[0].toUpperCase()}${mode.slice(1)}`)
													})]
												})]
											}, mode))
										}),
										state?.modelSort === "custom" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "mr-sort-custom",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "mr-sort-hint",
												children: t("sortCustomHint")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
												className: "mr-sort-list",
												children: models.map((model, index) => {
													const dropTarget = modelDrag !== null && modelDrag.index !== index;
													return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
														className: [
															"mr-sort-item",
															dropTarget ? "mr-sort-item-drop" : "",
															sortBusy ? "mr-sort-item-busy" : ""
														].filter(Boolean).join(" "),
														draggable: !sortBusy && writable,
														onDragStart: (event) => {
															setModelDrag({ index });
															event.dataTransfer.effectAllowed = "move";
															try {
																event.dataTransfer.setData("text/plain", model.id);
															} catch {}
														},
														onDragOver: (event) => {
															event.preventDefault();
															if (modelDrag !== null && modelDrag.index !== index) {
																event.preventDefault();
																event.dataTransfer.dropEffect = "move";
															}
														},
														onDrop: (event) => {
															if (modelDrag !== null && modelDrag.index !== index) {
																event.preventDefault();
																moveModel(modelDrag.index, index);
															}
															setModelDrag(null);
														},
														onDragEnd: () => setModelDrag(null),
														children: [
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
																className: "mr-grip",
																"aria-hidden": "true",
																children: "⠿"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
																className: "mr-sort-model-name",
																children: model.name
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
																className: "mr-sort-model-id",
																children: model.id
															})
														]
													}, model.id);
												})
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "mr-toolbar",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "mr-count",
										children: t("modelsCount", { count: models.length })
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mr-button",
										onClick: () => void load(),
										disabled: loading,
										children: t("refresh")
									})]
								}),
								error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-error",
									role: "alert",
									children: error
								}),
								loading && models.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-empty",
									children: t("loading")
								}),
								!loading && models.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-empty",
									children: t("empty")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-models",
									children: models.map((model) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelCard, {
										model,
										t,
										readOnly: !writable,
										busy: busyModel === model.id,
										dragging: drag,
										onDragStart: (index) => setDrag({
											modelId: model.id,
											index
										}),
										onDragEnd: () => setDrag(null),
										onDrop: (index) => {
											if (drag !== null && drag.modelId === model.id) reorder(model, drag.index, index);
											setDrag(null);
										},
										onToggle: (enabled) => void toggleModel(model, enabled),
										onSwitch: (providerId) => void switchActive(model, providerId)
									}, model.id))
								})
							]
						})]
					})]
				});
			};
		}
		function ModelCard(props) {
			const { model, t, readOnly, busy, dragging } = props;
			const providers = getOrderedProviders(model);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: `mr-card${busy ? " mr-card-busy" : ""}`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "mr-card-header",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mr-model-name",
								children: model.name
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mr-model-id",
								children: model.id
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mr-provider-count",
								children: t("providerCount", { count: model.providers.length })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: "mr-model-toggle",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: model.enabled,
									disabled: readOnly || busy,
									onChange: (event) => props.onToggle(event.target.checked),
									"aria-label": t("modelEnabledAria", { model: model.name })
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									children: model.enabled ? t("modelEnabled") : t("modelDisabled")
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "mr-drag-hint",
						children: t("dragHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: "mr-providers",
						children: providers.map((provider, index) => {
							const active = provider.id === model.active;
							const selectable = provider.credentialConfigured;
							const dropTarget = dragging !== null && dragging.modelId === model.id && dragging.index !== index;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								className: [
									"mr-provider",
									active ? "mr-provider-active" : "",
									!selectable ? "mr-provider-nocred" : "",
									dropTarget ? "mr-provider-drop" : ""
								].filter(Boolean).join(" "),
								draggable: !busy && !readOnly && providers.length > 1,
								title: selectable ? void 0 : t("noCredential"),
								onDragStart: (event) => {
									props.onDragStart(index);
									event.dataTransfer.effectAllowed = "move";
									try {
										event.dataTransfer.setData("text/plain", model.id);
									} catch {}
								},
								onDragOver: (event) => {
									if (dragging !== null && dragging.modelId === model.id && dragging.index !== index && !busy && !readOnly && providers.length > 1) {
										event.preventDefault();
										event.dataTransfer.dropEffect = "move";
									}
								},
								onDrop: (event) => {
									event.preventDefault();
									if (dragging !== null && dragging.modelId === model.id) {
										props.onDrop(index);
									}
								},
								onDragEnd: () => props.onDragEnd(),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "mr-grip",
										"aria-hidden": "true",
										children: "⠿"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "mr-provider-button",
										disabled: !selectable || busy || active || readOnly,
										onClick: () => props.onSwitch(provider.id),
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-provider-name",
											children: provider.name
										}), !selectable && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "mr-provider-nocred-label",
											children: ["· ", t("noCredential")]
										})]
									}),
									active && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "mr-active-badge",
										children: t("activeBadge")
									})
								]
							}, provider.id);
						})
					})
				]
			});
		}
		//#endregion
		//#region src/client/icons.tsx
		/** The runtime export table, read by capability instead of by one hard-coded name. */
		const table = _deepseek_ai_dsh_client_ui_primitives;
		/** First name the runtime actually provides (a missing export is `undefined`). */
		function firstDefined(...names) {
			for (const name of names) {
				let candidate;
				try {
					candidate = table[name];
				} catch {
					continue;
				}
				if (typeof candidate === "function") return candidate;
			}
		}
		/** One-path stroked glyph fallback (16×16 viewBox — the 0.1.7 artwork). */
		function glyph(path, defaultSize) {
			return function Glyph({ size = defaultSize, className }) {
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					width: size,
					height: size,
					className,
					viewBox: "0 0 16 16",
					fill: "none",
					xmlns: "http://www.w3.org/2000/svg",
					"aria-hidden": "true",
					strokeWidth: 1,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: path,
						stroke: "currentColor"
					})
				});
			};
		}
		/** Warning circle fallback (the 0.1.7 artwork: ring, stem, dot). */
		function WarningFallback({ size = 16, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				className,
				viewBox: "0 0 16 16",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": "true",
				strokeWidth: 1,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z",
						stroke: "currentColor"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M8 4.29199V9.79199",
						stroke: "currentColor"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M8 10.708V11.708",
						stroke: "currentColor"
					})
				]
			});
		}
		/**
		* Shell icons used by the model seat.
		*
		* DSH 0.1.7 renamed every size-suffixed icon export (`IconCheckOutline16`,
		* `IconChevronDownOutline14`, …) into stroke-weight variants (`…OutlineRegular`
		* 1px / `…OutlineMedium` 1.3px). A stale named import resolves to `undefined`
		* and React then throws "Element type is invalid" while rendering the slot
		* entry — the whole seat is dropped from the conversation input instead of
		* degrading (this is exactly what the 0.1.7 upgrade did to this plugin).
		* Resolve the names at runtime, newest first, so the next rename lands on
		* another shipped variant or on the inlined artwork below.
		*/
		const CheckIcon = firstDefined("IconCheckOutlineRegular", "IconCheckOutlineMedium", "IconCheckOutline16") ?? glyph("M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4", 16);
		const ChevronDownIcon = firstDefined("IconChevronDownOutlineRegular", "IconChevronDownOutlineMedium", "IconChevronDownOutline14") ?? glyph("M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6", 14);
		const ChevronRightIcon = firstDefined("IconChevronRightOutlineRegular", "IconChevronRightOutlineMedium", "IconChevronRightOutline14") ?? glyph("M6 12L9.29289 8.70711C9.68342 8.31658 9.68342 7.68342 9.29289 7.29289L6 4", 14);
		const WarningIcon = firstDefined("IconWarningOutlineRegular", "IconWarningOutlineMedium", "IconWarningOutline16") ?? WarningFallback;
		//#endregion
		//#region \0dsh-css:/home/runner/work/dsh-model-router/dsh-model-router/src/client/model-seat.css.mjs
		const css = "/*\n * Composer model seat (shadows the host ModelSelect). Styles mirror the host\n * ModelSelect.module.css exactly (same tokens, sizes and spacing) so the\n * replacement is visually indistinguishable, plus the provider pane's title\n * and hint rows.\n */\n\n.mr-seat-root {\n  min-width: 0;\n  position: relative;\n}\n\n.mr-seat-trigger {\n  min-width: 0;\n  max-width: 220px;\n  height: 28px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  border-radius: 24px;\n  outline: none;\n  align-items: center;\n  gap: 4px;\n  padding: 0 4px 0 8px;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 20px;\n  display: flex;\n}\n\n.mr-seat-trigger:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.mr-seat-trigger:focus-visible {\n  box-shadow: 0 0 0 2px var(--dsw-alias-border-l3);\n}\n\n.mr-seat-trigger:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n\n.mr-seat-triggerLabel {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n\n.mr-seat-triggerEffort {\n  color: var(--dsw-alias-label-caption);\n  flex: none;\n}\n\n.mr-seat-chevron {\n  color: var(--dsw-alias-label-caption);\n  flex: none;\n  transition: transform 0.12s;\n}\n\n.mr-seat-chevronOpen {\n  transform: rotate(180deg);\n}\n\n.mr-seat-menu {\n  z-index: 20;\n  border: 1px solid var(--dsw-alias-border-inverted);\n  background: var(--dsw-specific-menu);\n  width: min(240px, 100vw - 32px);\n  max-height: min(360px, 100vh - 96px);\n  box-shadow: var(--dsw-shadow-lv3);\n  color: var(--dsw-alias-label-primary);\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n  border-radius: 12px;\n  flex-direction: column;\n  padding: 4px;\n  display: flex;\n  position: absolute;\n  bottom: calc(100% + 8px);\n  right: 0;\n  overflow: hidden;\n}\n\n.mr-seat-status,\n.mr-seat-empty {\n  color: var(--dsw-alias-label-tertiary);\n  padding: 10px;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.mr-seat-error,\n.mr-seat-warning {\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  border-radius: 8px;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 8px;\n  margin-bottom: 4px;\n  padding: 7px 8px;\n  font-size: 12px;\n  line-height: 18px;\n  display: flex;\n}\n\n.mr-seat-warning {\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-state-warn-label);\n}\n\n.mr-seat-retry {\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  flex: none;\n  padding: 0;\n  font-weight: 600;\n}\n\n.mr-seat-groups {\n  min-height: 0;\n  overflow-y: auto;\n}\n\n.mr-seat-group + .mr-seat-group {\n  margin-top: 4px;\n}\n\n.mr-seat-groupTitle {\n  z-index: 1;\n  background: var(--dsw-specific-menu);\n  color: var(--dsw-alias-label-tertiary);\n  padding: 5px 8px 3px;\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 18px;\n  position: sticky;\n  top: 0;\n}\n\n/* Provider pane: non-sticky title row above the provider list. */\n.mr-seat-title {\n  color: var(--dsw-alias-label-tertiary);\n  padding: 5px 8px 3px;\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 18px;\n}\n\n.mr-seat-option {\n  width: 100%;\n  min-height: 38px;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  border-radius: 10px;\n  outline: none;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 8px;\n  display: flex;\n}\n\n.mr-seat-option:hover:not(:disabled),\n.mr-seat-option:focus-visible {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.mr-seat-selected {\n  background: transparent;\n}\n\n.mr-seat-option:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n\n.mr-seat-optionCopy {\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n  display: flex;\n}\n\n.mr-seat-modelName {\n  color: inherit;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 20px;\n  overflow: hidden;\n}\n\n.mr-seat-description {\n  color: var(--dsw-alias-label-tertiary);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 12px;\n  line-height: 18px;\n  overflow: hidden;\n}\n\n.mr-seat-check {\n  color: var(--dsw-alias-label-primary);\n  flex: 0 0 18px;\n  place-items: center;\n  display: grid;\n}\n\n.mr-seat-cell {\n  width: 100%;\n  height: 40px;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  text-align: left;\n  background: transparent;\n  border: none;\n  border-radius: 10px;\n  align-items: center;\n  gap: 8px;\n  padding: 0 10px;\n  font-size: 14px;\n  line-height: 22px;\n  display: flex;\n}\n\n.mr-seat-cell:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.mr-seat-cellLabel {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: auto;\n  min-width: 0;\n  overflow: hidden;\n}\n\n.mr-seat-cellValue {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  color: var(--dsw-alias-label-tertiary);\n  flex: 0 auto;\n  overflow: hidden;\n}\n\n.mr-seat-cellChevron {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n}\n\n/* Global hint footer of the provider pane. */\n.mr-seat-hint {\n  color: var(--dsw-alias-label-tertiary);\n  padding: 5px 8px 3px;\n  font-size: 12px;\n  line-height: 18px;\n  border-top: 1px solid var(--dsw-alias-border-l2);\n  margin-top: 4px;\n}\n\n/*\n * Mobile portrait: the composer row is an inline-size container. With the\n * quick route switcher gone from the right tool row, let the model seat\n * absorb the remaining row width (same rule the old switcher enforced).\n * The breakpoint matches DSH's own narrow-composer rule (<=460px).\n */\n@container (width <= 460px) {\n  [data-slot=\"conversation.input.model\"] > * {\n    flex: 1 1 0;\n    min-width: 0;\n    max-width: 100%;\n  }\n\n  [data-slot=\"conversation.input.model\"] [aria-haspopup=\"menu\"] {\n    width: 100%;\n    max-width: 100%;\n  }\n}\n";
		const tagId = "@fonlan/dsh-model-router/model-seat.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@fonlan/dsh-model-router";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/model-seat.tsx
		const ROUTER_PROVIDER_ID = "model-router";
		/**
		* The composer model seat, shadowing the host ModelSelect at a lower slot
		* priority. It renders the same two-level Model / Effort menu as the host
		* (model list grouped by provider, reasoning effort levels), plus a third
		* Provider row that opens the model-router provider list — the former quick
		* route-switcher button moved into the model picker, on par with the model
		* and effort menus.
		*
		* Shadowing contract: the host ui-model-selection registers the
		* `conversation.input.model` occupant at priority 0; this entry registers at
		* priority -1, so the renderer projects this component as the single-slot
		* winner while the host entry stays as the abdication fallback. Both entries
		* share the same per-session ModelDirectory, so selections stay consistent
		* with the /model popup and the host picker.
		*/
		function ModelRouterSeat({ locked, available, directory, load, select, t }) {
			const directoryState = (0, react.useSyncExternalStore)((onChange) => directory.subscribe(onChange), () => directory.getSnapshot(), () => directory.getSnapshot());
			const current = directoryState.current;
			const [open, setOpen] = (0, react.useState)(false);
			const [pane, setPane] = (0, react.useState)("root");
			const lastActionRef = (0, react.useRef)("load");
			const [toast, setToast] = (0, react.useState)(null);
			const toastSeq = (0, react.useRef)(0);
			const rootRef = (0, react.useRef)(null);
			const triggerRef = (0, react.useRef)(null);
			const itemRefs = (0, react.useRef)([]);
			const id = (0, react.useId)();
			const [routerState, setRouterState] = (0, react.useState)(null);
			const [routerLoading, setRouterLoading] = (0, react.useState)(false);
			const [routerError, setRouterError] = (0, react.useState)(null);
			const [busyProvider, setBusyProvider] = (0, react.useState)(null);
			const isRouterModel = available && current?.provider === ROUTER_PROVIDER_ID;
			const modelId = isRouterModel ? current.model : null;
			const loadRouterState = (0, react.useCallback)(async (silent = false) => {
				if (!silent) setRouterLoading(true);
				try {
					setRouterState(await api.state());
					setRouterError(null);
				} catch (cause) {
					setRouterError(cause instanceof Error ? cause.message : String(cause));
				} finally {
					if (!silent) setRouterLoading(false);
				}
			}, []);
			(0, react.useEffect)(() => {
				if (!available) return;
				load();
			}, [available, load]);
			(0, react.useEffect)(() => {
				if (!available) return;
				loadRouterState();
			}, [available, loadRouterState]);
			(0, react.useEffect)(() => {
				setPane("root");
				setBusyProvider(null);
				setRouterError(null);
			}, [modelId]);
			const refreshTimer = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!isRouterModel || modelId === null || directoryState.status !== "ready") return;
				if (refreshTimer.current !== null) clearTimeout(refreshTimer.current);
				refreshTimer.current = setTimeout(() => {
					refreshTimer.current = null;
					loadRouterState(true);
				}, 300);
				return () => {
					if (refreshTimer.current !== null) clearTimeout(refreshTimer.current);
					refreshTimer.current = null;
				};
			}, [
				directoryState.status,
				isRouterModel,
				loadRouterState,
				modelId
			]);
			const routeModel = (0, react.useMemo)(() => modelId === null ? void 0 : routerState?.models.find((model) => model.id === modelId), [modelId, routerState]);
			const providers = (0, react.useMemo)(() => {
				if (routeModel === void 0) return [];
				const byId = new Map(routeModel.providers.map((provider) => [provider.id, provider]));
				const ordered = routeModel.order.map((id) => byId.get(id)).filter((provider) => provider !== void 0);
				const seen = new Set(ordered.map((provider) => provider.id));
				return [...ordered, ...routeModel.providers.filter((provider) => !seen.has(provider.id))];
			}, [routeModel]);
			const switchProvider = (0, react.useCallback)(async (providerId) => {
				if (modelId === null || routeModel === void 0 || routeModel.active === providerId) {
					setOpen(false);
					return;
				}
				setBusyProvider(providerId);
				try {
					const next = await api.switchActive(modelId, providerId);
					setRouterState(next);
					setRouterError(null);
					setOpen(false);
					load();
				} catch (cause) {
					setRouterError(t("switchFailed", { message: cause instanceof Error ? cause.message : String(cause) }));
				} finally {
					setBusyProvider(null);
				}
			}, [
				load,
				modelId,
				routeModel,
				t
			]);
			const choices = (0, react.useMemo)(() => directoryState.groups.flatMap((group) => group.models.map((model) => ({
				group,
				model,
				selection: {
					provider: group.id,
					model: model.id,
					...model.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: model.reasoning.defaultEffort }
				}
			}))), [directoryState.groups]);
			const currentChoice = choices[current === null ? -1 : choices.findIndex((c) => c.selection.provider === current?.provider && c.selection.model === current.model)];
			const reasoning = currentChoice?.model.reasoning;
			const effectiveEffort = current?.reasoningEffort ?? reasoning?.defaultEffort;
			const effortLabel = reasoning === void 0 ? void 0 : effectiveEffort === void 0 ? t("effortProviderDefault") : reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort;
			const effortChoices = (0, react.useMemo)(() => reasoning === void 0 ? [] : [...reasoning.defaultEffort === void 0 ? [{
				key: "provider-default",
				effort: void 0,
				label: t("effortProviderDefault")
			}] : [], ...reasoning.efforts.map((effort) => ({
				key: `effort:${effort.id}`,
				effort: effort.id,
				label: effort.name,
				...effort.description === void 0 ? {} : { description: effort.description }
			}))], [reasoning, t]);
			const busy = directoryState.status === "selecting";
			const reload = () => {
				lastActionRef.current = "load";
				load();
			};
			(0, react.useEffect)(() => {
				if (!open) return;
				const closeOutside = (event) => {
					if (!rootRef.current?.contains(event.target)) setOpen(false);
				};
				document.addEventListener("mousedown", closeOutside);
				return () => {
					document.removeEventListener("mousedown", closeOutside);
				};
			}, [open]);
			if (!available) return null;
			const show = () => {
				setPane("root");
				setOpen(true);
				reload();
				loadRouterState();
			};
			const close = (restoreFocus = false) => {
				setOpen(false);
				setPane("root");
				if (restoreFocus) queueMicrotask(() => {
					triggerRef.current?.focus();
				});
			};
			const moveFocus = (offset) => {
				const items = itemRefs.current.filter((item) => item !== null);
				if (items.length === 0) return;
				const active = items.findIndex((item) => item === document.activeElement);
				items[(Math.max(active, 0) + offset + items.length) % items.length]?.focus();
			};
			const onRootKeyDown = (event) => {
				if (event.key === "Escape" && open) {
					event.preventDefault();
					if (pane !== "root") setPane("root");
					else close(true);
					return;
				}
				if (!open) return;
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					moveFocus(event.key === "ArrowDown" ? 1 : -1);
				}
			};
			const onBlur = (event) => {
				if (event.relatedTarget instanceof Node && rootRef.current?.contains(event.relatedTarget)) return;
				close();
			};
			const settleSelection = (accepted) => {
				if (accepted) {
					if (rootRef.current !== null) close(true);
					return;
				}
				const message = directory.getSnapshot().error;
				if (message !== null) {
					toastSeq.current += 1;
					setToast({
						seq: toastSeq.current,
						text: t("errorAction", { message })
					});
				}
			};
			const choose = (selection) => {
				if (current !== null && current.provider === selection.provider && current.model === selection.model) {
					close(true);
					return;
				}
				lastActionRef.current = "select";
				select(selection).then(settleSelection);
			};
			const chooseEffort = (effort) => {
				if (current === null) return;
				if (effectiveEffort === effort) {
					close(true);
					return;
				}
				const selection = {
					provider: current.provider,
					model: current.model,
					...effort === void 0 ? {} : { reasoningEffort: effort }
				};
				lastActionRef.current = "select";
				select(selection).then(settleSelection);
			};
			const modelLabel = currentChoice?.model.name ?? t("triggerFallback");
			const triggerLabel = effortLabel === void 0 ? modelLabel : `${modelLabel} · ${effortLabel}`;
			const triggerAria = currentChoice === void 0 ? t("triggerSelectAria") : effortLabel === void 0 ? t("triggerAria", { model: modelLabel }) : t("triggerAriaEffort", {
				model: modelLabel,
				effort: effortLabel
			});
			const activeProviderName = providers.find((provider) => provider.id === routeModel?.active)?.name ?? routeModel?.active ?? t("routeLoading");
			const providerRowVisible = isRouterModel && routerState !== null && routerState.showQuickSwitch !== false && routerState.providers.length >= 2 && routeModel !== void 0 && providers.length >= 2;
			itemRefs.current = [];
			let itemIndex = 0;
			const itemRef = () => {
				const at = itemIndex++;
				return (node) => {
					itemRefs.current[at] = node;
				};
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: "mr-seat-root",
				onKeyDown: onRootKeyDown,
				onBlur,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						ref: triggerRef,
						type: "button",
						className: "mr-seat-trigger",
						"aria-label": triggerAria,
						"aria-haspopup": "menu",
						"aria-expanded": open,
						"aria-controls": open ? `${id}-menu` : void 0,
						title: triggerLabel,
						disabled: locked,
						onClick: () => {
							if (open) close();
							else show();
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mr-seat-triggerLabel",
								children: modelLabel
							}),
							effortLabel !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mr-seat-triggerEffort",
								children: effortLabel
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `mr-seat-chevron${open ? " mr-seat-chevronOpen" : ""}`,
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronDownIcon, {})
							})
						]
					}),
					open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						id: `${id}-menu`,
						className: "mr-seat-menu",
						role: "menu",
						"aria-label": t("menuAria"),
						"aria-busy": directoryState.status === "loading" || busy,
						children: [
							pane === "root" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									ref: itemRef(),
									type: "button",
									role: "menuitem",
									className: "mr-seat-cell",
									onClick: () => setPane("model"),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellLabel",
											children: t("menuModel")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellValue",
											children: modelLabel
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellChevron",
											"aria-hidden": true,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronRightIcon, {})
										})
									]
								}),
								providerRowVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									ref: itemRef(),
									type: "button",
									role: "menuitem",
									className: "mr-seat-cell",
									onClick: () => setPane("provider"),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellLabel",
											children: t("menuProvider")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellValue",
											children: activeProviderName
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellChevron",
											"aria-hidden": true,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronRightIcon, {})
										})
									]
								}),
								reasoning !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									ref: itemRef(),
									type: "button",
									role: "menuitem",
									className: "mr-seat-cell",
									onClick: () => setPane("effort"),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellLabel",
											children: t("menuEffort")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellValue",
											children: effortLabel
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "mr-seat-cellChevron",
											"aria-hidden": true,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronRightIcon, {})
										})
									]
								})
							] }),
							pane === "model" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								directoryState.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-seat-status",
									children: t("statusLoading")
								}),
								directoryState.error !== null && lastActionRef.current === "load" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "mr-seat-error",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("errorAction", { message: directoryState.error }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mr-seat-retry",
										onClick: reload,
										children: t("retry")
									})]
								}),
								directoryState.failures.map((failure) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "mr-seat-warning",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("warningGroupLoad", {
										name: failure.name,
										message: failure.message
									}) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mr-seat-retry",
										onClick: reload,
										children: t("retry")
									})]
								}, failure.id)),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-seat-groups",
									children: directoryState.groups.map((group) => {
										const headingId = `${id}-${group.id}`;
										return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
											role: "group",
											"aria-labelledby": headingId,
											className: "mr-seat-group",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: "mr-seat-groupTitle",
												id: headingId,
												children: group.name
											}), group.models.map((model) => {
												const selected = current?.provider === group.id && current.model === model.id;
												return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
													ref: itemRef(),
													type: "button",
													role: "menuitemradio",
													"aria-checked": selected,
													className: `mr-seat-option${selected ? " mr-seat-selected" : ""}`,
													title: model.name,
													disabled: busy,
													onClick: () => choose({
														provider: group.id,
														model: model.id
													}),
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "mr-seat-optionCopy",
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
															className: "mr-seat-modelName",
															children: model.name
														}), model.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
															className: "mr-seat-description",
															children: model.description
														})]
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "mr-seat-check",
														"aria-hidden": true,
														children: selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {}) : null
													})]
												}, model.id);
											})]
										}, group.id);
									})
								}),
								directoryState.status === "ready" && choices.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-seat-empty",
									children: t("emptyModels")
								})
							] }),
							pane === "provider" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [routerError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "mr-seat-error",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: routerError }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mr-seat-retry",
									onClick: () => {
										loadRouterState();
										load();
									},
									children: t("retry")
								})]
							}), routeModel === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "mr-seat-status",
								children: t("routeLoading")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-seat-title",
									children: t("routeMenuTitle", { model: modelId ?? "" })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-seat-groups",
									children: providers.map((provider) => {
										const selected = routeModel.active === provider.id;
										return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											ref: itemRef(),
											type: "button",
											role: "menuitemradio",
											"aria-checked": selected,
											className: `mr-seat-option${selected ? " mr-seat-selected" : ""}`,
											disabled: !provider.credentialConfigured || busyProvider !== null,
											onClick: () => void switchProvider(provider.id),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "mr-seat-optionCopy",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "mr-seat-modelName",
													children: provider.name
												}), !provider.credentialConfigured && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "mr-seat-description",
													children: t("noCredentialShort")
												})]
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "mr-seat-check",
												"aria-hidden": true,
												children: selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {}) : null
											})]
										}, provider.id);
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "mr-seat-hint",
									children: t("globalRouteHint")
								})
							] })] }),
							pane === "effort" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [directoryState.error !== null && lastActionRef.current === "load" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "mr-seat-error",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("errorAction", { message: directoryState.error }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mr-seat-retry",
									onClick: reload,
									children: t("actionReload")
								})]
							}), effortChoices.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "mr-seat-empty",
								children: t("emptyEfforts")
							}) : effortChoices.map((level) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								ref: itemRef(),
								type: "button",
								role: "menuitemradio",
								"aria-checked": effectiveEffort === level.effort,
								className: `mr-seat-option${effectiveEffort === level.effort ? " mr-seat-selected" : ""}`,
								disabled: busy,
								onClick: () => chooseEffort(level.effort),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "mr-seat-optionCopy",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "mr-seat-modelName",
										children: level.label
									}), level.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "mr-seat-description",
										children: level.description
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "mr-seat-check",
									"aria-hidden": true,
									children: effectiveEffort === level.effort ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {}) : null
								})]
							}, level.key))] })
						]
					}),
					toast !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
						text: toast.text,
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WarningIcon, {}),
						anchor: rootRef.current?.closest("[data-composer-card]") ?? null,
						onDone: () => setToast(null)
					}, toast.seq)
				]
			});
		}
		/**
		* Idle directory snapshot for the inert seat face. Mirrors the shape the
		* official `ModelDirectory` store starts from, including `pending` (the
		* selection an in-flight `select` submitted; null when none) — required by
		* `ModelDirectoryState` and present in both 0.1.x and 0.2.x.
		*/
		const EMPTY_DIRECTORY_STATE = {
			current: null,
			routable: null,
			groups: [],
			failures: [],
			status: "idle",
			pending: null,
			error: null
		};
		/**
		* Inert face for the pathological case where the session directory cannot be
		* resolved even after `remote.session` mounted. The seat renders nothing
		* (available: false), but crucially the slot entry never throws, so it is
		* never abdicated and the host seat can keep the cell alive on the next
		* registration pass.
		*/
		const INERT_DIRECTORY_STORE = {
			subscribe: () => () => {},
			getSnapshot: () => EMPTY_DIRECTORY_STATE,
			update: () => {},
			set: () => {}
		};
		/**
		* Build the seat face without ever throwing out of the slot `inject` hook.
		*
		* The seat registration below depends on `remote.session` (the namespace is
		* mounted asynchronously at startup), so by the time this runs the host
		* `modelDirectories.directoryFor(sessionId)` resolves — the original race is
		* gone by construction. The try/catch here is belt-and-braces: a throwing
		* inject would permanently abdicate this slot entry in the renderer
		* (`reportEntryError` with `abdicate` for single slots), after which the host
		* seat takes over and the Provider row never appears again.
		*/
		function seatFace(models, sessions, sessionId) {
			let directory = null;
			try {
				directory = models.directoryFor(sessionId);
			} catch {}
			if (directory === null) return {
				available: false,
				directory: INERT_DIRECTORY_STORE,
				load: () => {},
				select: () => Promise.resolve(false)
			};
			let available = true;
			try {
				available = sessions.subagentAddress(sessionId) === void 0;
			} catch {}
			return {
				available,
				directory: directory.store,
				load: () => {
					if (available) directory?.load().catch(() => {});
				},
				select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
			};
		}
		/**
		* Register the model seat onto the composer's named model slot (priority -1
		* shadows the host seat). The inject block additionally depends on
		* `remote.session` so the seat registers only after the remote session
		* namespace has mounted — `directoryFor` can throw while it is still mounting,
		* and a throwing inject permanently abdicates the entry (the host seat then
		* wins and the Provider row never appears).
		*/
		function registerModelRouterSeat(ctx) {
			const t = ctx.locale.bind(LOCALE_NS);
			ctx.inject([
				"slots",
				"modelDirectories",
				"remote.session"
			], (scope) => {
				const face = scope;
				face.slots.inject("conversation.input.model", () => face.slots.register({
					name: "conversation.input.model",
					id: "model-router-model-seat",
					priority: -1,
					label: () => t("seatLabel"),
					locale: LOCALE_NS,
					inject: (sessionId) => seatFace(face.modelDirectories, face.sessions, sessionId)
				}, ModelRouterSeat));
			});
		}
		//#endregion
		//#region src/client/index.tsx
		/** The settings sidebar entry this page owns (must stay stable). */
		const SECTION_ID = "model-router";
		/** Services required before mounting (provided by the client runtime).
		*  `remote.session` is included like the host ui-model-selection declares it:
		*  the seat's `directoryFor` depends on the namespace, which mounts
		*  asynchronously at startup. */
		const inject = [
			"slots",
			"locale",
			"modelDirectories",
			"sessions",
			"connection",
			"remote",
			"remote.session"
		];
		/** Client plugin body. */
		function apply(ctx) {
			ctx.effect(() => {
				const off = ctx.locale.register(LOCALE_NS, {
					zh,
					en
				});
				return () => off();
			}, "model-router: dictionaries");
			const t = ctx.locale.bind(LOCALE_NS);
			const SettingsSection = makeSettingsSection(ctx);
			const slots = ctx.slots;
			slots.inject("settings.section", () => slots.register({
				name: "settings.section",
				id: SECTION_ID,
				order: 300,
				label: () => t("settingsTitle"),
				locale: LOCALE_NS
			}, SettingsSection));
			registerModelRouterSeat(ctx);
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map