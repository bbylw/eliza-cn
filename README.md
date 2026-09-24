<div align="center">
  <img src="https://raw.githubusercontent.com/elizaOS/eliza/develop/packages/shared/assets/banners/elizaos_banner.svg" alt="elizaOS" width="100%" />
  <h1>elizaOS</h1>
  <p><strong>你的智能体操作系统。</strong></p>
  <p>
    <a href="https://eliza.app">Eliza</a> ·
    <a href="https://cloud.eliza.app">Eliza Cloud</a> ·
    <a href="https://os.eliza.app">elizaOS downloads</a> ·
    <a href="https://docs.elizaos.ai/">Documentation</a>
  </p>
</div>

elizaOS 是一个面向自主 AI 智能体的开源 TypeScript 框架与产品栈。这个 monorepo 包含核心运行时、Eliza 应用、CLI、云服务、原生桥接以及第一方插件。可启动的 Linux 与 Android 发行版位于独立的
[`elizaOS/os`](https://github.com/elizaOS/os) 仓库。

## 选择起点

| 目标 | 从这里开始 |
| --- | --- |
| 使用 Eliza | [打开 Web 应用](https://cloud.eliza.app)，访问 [Eliza 下载页](https://eliza.app/downloads)，或使用已发布的 [GitHub release](https://github.com/elizaOS/eliza/releases) |
| 运行本仓库 | 按 [从源码运行 Eliza](#run-eliza-from-source) |
| 构建智能体或插件 | 安装 [`elizaos`](#build-with-elizaos) CLI 并阅读 [开发者文档](https://docs.elizaos.ai/) |
| 参与贡献 | 阅读 [CONTRIBUTING.md](https://github.com/elizaOS/eliza/blob/develop/CONTRIBUTING.md) 以及 [AGENTS.md](https://github.com/elizaOS/eliza/blob/develop/AGENTS.md) 中的仓库指南 |
| 将整台设备作为 elizaOS 运行 | 使用 [`elizaOS/os`](https://github.com/elizaOS/os) 中的安装程序与目标平台指南 |

<a id="run-eliza-from-source"></a>

## 从源码运行 Eliza

该仓库在 [`package.json`](https://github.com/elizaOS/eliza/blob/develop/package.json) 中固定了 Bun 与 Node 的版本。请安装对应版本，然后：

```bash
git clone --filter=blob:none https://github.com/elizaos/eliza.git
cd eliza
bun install
bun run dev
```

`bun install` 还会准备子模块与补丁、配置受支持宿主的构建前置依赖，并构建或校验暂存态的桌面端 `libelizainference`。嵌入用的 GGUF 仍由运行时管理，并在本地推理预热阶段自动下载。如需获取归档产物 fixtures，可显式执行
`bun packages/scripts/fetch-archive-artifacts.mjs`。

常用仓库命令：

```bash
bun run build       # 使用 Turbo 构建工作区
bun run verify      # 包一致性、依赖、类型、lint 与审计门禁
bun run test        # 仓库单元测试/集成测试通道
bun run test:e2e    # 端到端通道
bun run cloud:mock  # 带 mock 的本地 Eliza Cloud 栈
```

有关包的范围划分、共享开发服务器，以及变更被视为完成前所需证据，请参见 [AGENTS.md](https://github.com/elizaOS/eliza/blob/develop/AGENTS.md)。

## 这套技术栈包含什么？

### Eliza

Eliza 是面向 Web、桌面与移动端用户的智能体应用。它的能力由运行时与已安装插件提供，包括：

- 聊天、语音、记忆、知识与文档工作流；
- 消息与 workspace 连接器；
- 日历、提醒、收件箱、目标、健康及其他个人助理领域；
- 浏览器与桌面自动化；
- 相机、电话、短信、联系人、定位及其他原生设备桥接；
- 带审批边界的非托管 EVM 与 Solana 钱包操作；
- 定时工作流、编码智能体编排，以及可安装的应用视图。

可用性取决于操作系统、已安装插件、已授予权限，以及所配置的模型或服务提供商。各包级别的 README 会记录每项能力的确切支持情况与配置方式。

### 框架

该框架与模型无关，并通过插件扩展：

- [`@elizaos/core`](https://github.com/elizaOS/eliza/tree/develop/packages/core) 定义 `AgentRuntime`、规范类型、消息循环、记忆与状态原语，以及插件契约。
- [`@elizaos/agent`](https://github.com/elizaOS/eliza/tree/develop/packages/agent) 在核心运行时之上组装一个独立的智能体与 HTTP 后端。
- [`@elizaos/app-core`](https://github.com/elizaOS/eliza/tree/develop/packages/app-core) 为 Eliza 应用目标提供共享的应用托管、API 与平台编排。
- [`@elizaos/ui`](https://github.com/elizaOS/eliza/tree/develop/packages/ui) 包含应用界面所使用的共享 React UI。
- [`elizaos`](https://github.com/elizaOS/eliza/tree/develop/packages/elizaos) 是项目与插件的脚手架、升级及部署 CLI。

一个插件会导出一个 `Plugin` 对象。插件可注册 actions、providers、evaluators、services、model handlers、routes、events、tests 与 app views。参见
[插件组件指南](https://docs.elizaos.ai/plugins/components) 以及 `plugins/` 下的第一方实现。

### 本地推理

[`@elizaos/plugin-local-inference`](https://github.com/elizaOS/eliza/tree/develop/plugins/plugin-local-inference) 提供 Eliza-1 的端侧路径。当前 Eliza-1 注册表包含基于 Gemma 4 的 2B、4B、9B 与 27B 文本层级，外加本地嵌入、语音、视觉与图像生成资源。硬件检测与模型路由会选择受支持的后端；在所需资源下载完成后，符合条件的操作可在无网络连接下运行。

本地推理不会被强制用于无法支持它的硬件。Eliza 可将每项模型能力路由到本地、直连服务提供商或 Eliza Cloud 后端。

### Eliza Cloud

[Eliza Cloud](https://cloud.eliza.app) 是可选的。它提供账号与认证服务、托管的模型路由、应用与智能体部署、远程连通性，以及跨设备产品服务。本地运行时与直接的模型服务提供商配置仍是第一等路径。

### elizaOS 发行版

独立的 [`elizaOS/os`](https://github.com/elizaOS/os) 仓库负责可启动的 Linux 与 AOSP 发行版、安装程序、发布清单，以及操作系统工具链。这个 monorepo 保留了供桌面、iOS、Android 与设备集成使用的 Eliza 应用外壳与原生运行时桥接。

<a id="build-with-elizaos"></a>

## 使用 elizaos 构建

本分支发布的 beta CLI 使用未限定作用域的 `elizaos` 包：

```bash
bun add --global elizaos@beta
elizaos create my-project --template project
elizaos create plugin-example --template plugin
```

项目是可部署的工作区；插件是可复用的能力包。打包的模板及其脚手架契约位于
`packages/elizaos/templates/`。

如需在不使用 CLI 或应用宿主的情况下直接嵌入运行时，请导入
`@elizaos/core`。场景运行器（scenario runner）提供针对真实运行时的可执行集成覆盖，并在配置后对接实时模型。

## 仓库结构

```text
packages/        运行时、宿主、UI、CLI、文档、云、原生代码与工具链
plugins/         第一方的模型、连接器、领域、应用与设备插件
scripts/         全仓库的检查、测试编排与发布工具
patches/         安装期间应用的依赖补丁
```

每个受维护的包或插件都应在其自身的 `README.md` 与配对的 `CLAUDE.md` / `AGENTS.md` 中说明其公开接口、脚本、配置与本地约束。在改动前，请先阅读最近的包指南。

## 贡献

elizaOS 聚焦于其第一方运行时、应用与受维护的集成。
我们不再接受第三方插件或注册表条目，包括新的上架、上架更新与注册表提交工具。相关 issue 与 pull request 将被以超出范围为由关闭。

在进行非平凡改动前，请先开一个 issue，并通过针对 `develop` 分支的 pull request 提交工作。[CONTRIBUTING.md](https://github.com/elizaOS/eliza/blob/develop/CONTRIBUTING.md) 定义了协调、测试、同步，以及可人工核验的证据要求。

- [Bug Report](https://github.com/elizaOS/eliza/blob/develop/.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature Request](https://github.com/elizaOS/eliza/blob/develop/.github/ISSUE_TEMPLATE/feature_request.md)
- [Agent Work Item](https://github.com/elizaOS/eliza/blob/develop/.github/ISSUE_TEMPLATE/agent_work_item.md)
- [Windows setup](https://github.com/elizaOS/eliza/blob/develop/WINDOWS.md)
- [Security policy](https://github.com/elizaOS/eliza/blob/develop/SECURITY.md)
- [Security architecture documentation](https://github.com/elizaOS/eliza/blob/develop/packages/docs/security.md)

请通过 [安全策略](https://github.com/elizaOS/eliza/blob/develop/SECURITY.md) 私下报告漏洞，而不要提交公开 issue。

## 许可证

[MIT](https://github.com/elizaOS/eliza/blob/develop/LICENSE)
