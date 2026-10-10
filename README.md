# dsh-model-router（v2 维护版）

**dsh-model-router** 是一个 [DSH](https://github.com/deepseek-ai/dsh) 插件。它注册虚拟提供商 `model-router`，把已配置的 provider/model 聚合为一个模型目录；每个聚合模型都维护自己的 active provider 与 provider 优先级顺序，实际请求在运行时路由到当前 active provider。

本仓库的 `v2` 分支是用户 fork `dfgger433/dsh-model-router` 的维护版本。它不向上游 `fonlan/dsh-model-router` 自动合并，也不对主分支（`main`/`master`）进行发布；发布目标仅为用户 fork 的 `v2`。

## 功能

- **Model Router 聚合目录**：注册 `model-router` 虚拟 provider，按 model id 合并所有已注册 provider 的模型。同一模型可有多个来源；展示名、上下文窗口和推理档位跟随当前 active provider，模型描述会标注 `via <provider>`。
- **每模型 active provider 与顺序**：每个模型保存独立的 `active` provider 和 `order`。切换 active 会立即影响后续请求；拖拽 `order` 会持久化 provider 优先级，并按该顺序显示。`order` 当前是偏好顺序，不会在请求失败时自动切换 provider。
- **模型级 enabled 开关**：每张模型卡片都有启用开关。`enabled: false` 的模型会从 router 对外模型目录隐藏，并在 `resolveModel`、`prepareCall` 和 `stream` 绑定路由之前拒绝请求。旧配置没有 `enabled` 字段时按 `enabled: true` 兼容处理。
- **设置页模型卡片**：设置 → 插件 → 插件配置 → 模型路由显示每个聚合模型及其 provider，支持切换 active、拖拽 provider 顺序、刷新目录和逐模型启用/停用。没有已配置凭据的 provider 会显示为不可选。
- **provider 优先级拖拽**：每个模型卡片的 provider 列表按照 `model.order` 渲染和保存；服务端会清理不存在的 provider，并把新发现的 provider 追加到末尾，active provider 单独维护。
- **模型列表排序**：设置页可选择自定义（拖拽 `modelOrder`）、按名称或最近使用排序。最近使用时间由路由请求异步、延迟写入，属于显示排序信息。
- **可配置 provider 注册与设置持久化**：服务端通过 model-router configurable provider 注册 router adapter，并通过 `model-router` 设置命名空间持久化 active、order、enabled、模型列表排序和相关开关。RPC 只接受受信任的同源/loopback 请求。
- **请求时实时委派**：`model-router` 保持在会话的 provider 字段中；请求发出时解析 active provider，并用 provider 的原始 model id 委派回真实 adapter，因此凭据、重试、流式和计量仍走 DSH 原有管线。
- **可选的模型选择器快捷入口**：当前选中 `model-router` 模型且存在多个可用 provider 时，模型选择菜单可显示 provider 切换项；可在设置中关闭。模型 ID 前缀忽略、模型显示排序等开关同样持久化。

## 配置示例

配置保存在 DSH profile 的 `model-router` 设置命名空间（通常由设置服务管理；不要把个人 profile 配置文件提交到本仓库）：

```yaml
model-router:
  showQuickSwitch: true
  ignoreModelIdPrefix: true
  modelSort: custom # custom | name | recent
  modelOrder:
    - deepseek-v4-flash
  models:
    deepseek-v4-flash:
      enabled: true
      order:
        - opencode-go
        - deepseek-official
      active: opencode-go
```

`active` 决定当前请求实际使用的 provider，`order` 只保存和展示 provider 偏好顺序。新增/移除 provider 或模型时，配置会在成功的目录刷新后同步；配置缺失的旧模型默认启用。

## 已知行为与兼容性

- 当前 provider 请求失败会直接返回错误；本版本不会按 `order` 自动故障转移。
- 没有 host settings service 的 CLI/headless 环境仍可按已加载配置路由，但设置页变为只读或配置写入不可用；持久化能力取决于宿主环境。
- 模型目录来自宿主 LLM adapter 注册表。provider 在启动阶段尚未完成模型枚举时，目录可能暂时不完整，刷新或拓扑事件后会再次同步。
- 开启“忽略模型 ID 前缀”时，`vendor/model` 与 `model` 可以归并展示，但委派仍使用真实 provider 所需的原始 ID；关闭该选项后模型会按完整 ID 分开。
- 已有仅含 `order`/`active` 的旧配置可继续使用，规范化时会补上 `enabled: true`。配置写入由设置服务串行化，设置页和 RPC 使用同一份持久化状态。
- 本版本依赖 DSH 的 Cordis/LLM/settings/web 注入面及 React 客户端注入面；请使用与 `package.json` peer dependencies 兼容的 DSH 版本。服务端代码更新后需要重启 profile，客户端更新需重新构建 web bundle（开发时可配合宿主的 HMR 链路）。

## 安装

### 从用户 fork 的 v2 预构建发布内容（推荐）

```sh
git clone --branch v2 https://github.com/dfgger433/dsh-model-router.git
cd dsh-model-router
dsh plugin --profile web add .
```

本分支提交已经包含与 `src/` 对应的预构建 `lib/`，安装时不需要把个人 profile 配置复制进仓库，也不需要提交 `node_modules/`。安装后 `cordis.patch.yml` 会把插件挂载到目标 profile；重启 profile 后，模型选择器中会出现 Model Router 分组，设置页会出现模型路由卡片。

### 本地目录安装

如果已经取得本仓库目录（其中必须存在 `lib/index.js` 与 `lib/client.js`），可直接安装：

```sh
dsh plugin --profile web add .
```

发布包刻意只保留运行所需的 `src/`、预构建 `lib/`、`package.json`、`cordis.patch.yml`、`README.md` 与 `LICENSE`。不要复制或提交 `node_modules/`、`.dsh/` profile 配置、临时缓存、备份或运行日志。

## 开发与验证

此 v2 发布树面向安装，提交的是已构建的 `lib/`；它不携带开发 checkout 的 TypeScript/vitest 构建配置和测试目录。修改 `src/` 后，应在包含宿主依赖与构建配置的开发 checkout 中重新生成 `lib/`，再运行等价验证并更新发布树。

本发布树可做基础语法与元数据验证：

```sh
node --check lib/index.js
node --check lib/client.js
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
git diff --check
```

- 服务端修改后需重启 profile。
- 客户端修改后需重新构建宿主 web bundle；若宿主已运行对应 HMR watcher，可使用其开发链路。
- 仅允许将维护提交推送到用户 fork 的 `v2`；本分支不会自动合并上游或推送 `main`/`master`。

## License

MIT — 详见 [LICENSE](./LICENSE)。
