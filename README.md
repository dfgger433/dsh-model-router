# dsh-model-router v2

**dsh-model-router** 是一个 [DSH](https://github.com/deepseek-ai/dsh) 插件。它注册虚拟 provider `model-router`，把宿主 LLM 注册表中的 provider 和模型聚合成一个目录，并在请求时按每个模型保存的 active provider 路由到真实 adapter。

本仓库维护用户 fork `dfgger433/dsh-model-router` 的 `v2` 分支。发布和维护只面向这个 fork 的 `v2`；不会添加上游 remote，也不会把维护提交推送到 `main` 或 `master`。

## 当前实现

- **Model Router 聚合**：服务端读取已注册的 LLM provider，按模型 ID 合并目录。默认忽略模型 ID 的第一个 `vendor/` 前缀，例如 `deepseek/deepseek-v4-flash` 与 `deepseek-v4-flash` 可以合并；关闭该设置后按完整 ID 区分。委派时仍使用真实 provider 的原始模型 ID。
- **active 与 order**：每个聚合模型分别保存 `active` provider 和 `order` provider 顺序。`active` 决定请求实际路由到哪里；`order` 用于设置页和模型选择器中的 provider 展示及偏好顺序。当前请求失败会直接返回错误，不会按 `order` 自动故障转移。
- **模型 enabled 开关**：设置页每个模型卡片都有启用开关。`enabled: false` 的模型从 `model-router` 对外目录隐藏，并在 `resolveModel`、`prepareCall` 和 `stream` 建立路由时拒绝；旧配置没有该字段时按 `true` 处理。启用状态与其他路由配置一起持久化。
- **设置页**：客户端在设置侧栏注册“模型路由”页面，展示聚合模型及 provider。页面支持切换 active、刷新目录、切换模型 enabled、拖拽 provider 顺序、设置模型列表排序，以及控制模型选择菜单中的 provider 切换入口和模型 ID 前缀匹配选项。没有可用凭据的 provider 会显示为不可选；没有宿主 settings service 时页面可以读取但会显示为只读。
- **provider order 拖拽**：页面按照 `model.order` 渲染 provider 列表；拖拽后提交完整 provider ID 顺序并持久化。缺失的 provider 会被清理，新发现的 provider 会追加到末尾，active 单独维护，不因拖拽自动改变。
- **模型选择菜单切换**：当前选择的是 `model-router` 模型且存在多个可用 provider 时，模型选择菜单可以显示 provider 入口。设置页的开关控制该入口；切换会影响所有会话的后续请求。该入口不会替代设置页中的完整排序管理。
- **configurable provider 注册与发现**：路由器通过宿主 LLM 的 provider 注册表发现真实 provider，并读取 `listConfigurableProviders()` 提供的 provider 目录和设置路径，用于显示名称及通用凭据状态。路由器自身注册为普通 LLM adapter `model-router`，不是另一个需要 API 密钥的 configurable provider。
- **配置持久化**：路由配置作为插件 entry config 使用 `model-router` 命名空间保存，包括 `models`、`active`、`order`、`enabled`、模型显示顺序和相关设置。拓扑变化后服务会同步 provider 与模型；旧配置会补齐默认值。
- **实时委派**：请求仍以 `provider=model-router` 进入宿主管线；适配器在 resolve、prepare 或 stream 阶段绑定 active provider，再以真实 provider 和原始模型 ID 调用宿主 LLM adapter。凭据、重试、流式和计量继续由真实 adapter 处理。

## 配置示例

配置由宿主 profile 管理，不要把个人 profile 配置文件复制或提交到仓库：

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

`active` 是当前实际路由目标，`order` 是 provider 偏好和显示顺序。新增或移除 provider、模型后，服务会在目录完整时同步配置；旧模型缺少 `enabled` 时默认启用。

## 安装

### 从用户 fork 的 v2 分支安装

```sh
git clone --branch v2 https://github.com/dfgger433/dsh-model-router.git
cd dsh-model-router
dsh plugin --profile web add .
```

当前分支包含与 `src/` 对应的预构建 `lib/`，安装时不需要复制个人 profile 配置，也不需要提交 `node_modules/`。`cordis.patch.yml` 会把插件挂载到目标 profile。服务端更新后重启 profile；客户端更新后重新构建宿主 web bundle，开发环境可使用宿主已有的 HMR 链路。

### 本地目录安装

如果已经取得本仓库目录（其中包含 `lib/index.js` 和 `lib/client.js`），可以直接执行：

```sh
dsh plugin --profile web add .
```

发布树只保留运行所需的 `src/`、预构建 `lib/`、`package.json`、`cordis.patch.yml`、`README.md` 和 `LICENSE`。不要复制或提交 `node_modules/`、profile 配置、日志、临时缓存或 backup。

## v2 fork 维护

维护时使用用户 fork 的 `v2` 分支和唯一 remote：

```sh
git remote -v
git switch v2
git pull --ff-only origin v2
# 修改并验证后
git push origin HEAD:refs/heads/v2
```

提交前确认工作区只包含发布树文件，并运行基础检查。发布目标是 `https://github.com/dfgger433/dsh-model-router/tree/v2`；不要推送 `main`、`master` 或其他分支，也不要添加原仓库 remote。

## 开发与验证

这个 v2 发布树提交已构建的 `lib/`，没有开发 checkout 的依赖、构建配置和测试目录。修改 `src/` 后，应在包含宿主依赖与构建配置的开发 checkout 中重新生成 `lib/`，再把对应发布文件同步到本树。

```sh
node --check lib/index.js
node --check lib/client.js
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
git diff --check
```

## License

MIT — 详见 [LICENSE](./LICENSE)。
