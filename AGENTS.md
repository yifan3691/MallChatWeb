# AGENTS.md

## 适用范围

- 本仓库是 MallChat 的前端项目，技术栈为 Vue 3 + TypeScript + Vite。
- 包管理器使用 `pnpm`。
- README 推荐运行环境为 Node 16.18+。
- `package.json` 中约束的最低版本为 Node `>=16.16.0`、pnpm `>=8.4`。

## 仓库专属说明文件

- 未发现仓库内的 Cursor 规则目录 `.cursor/rules/`。
- 未发现 `.cursorrules` 文件。
- 未发现 `.github/copilot-instructions.md`。
- 在新增其它工具专属说明前，默认将本文件视为本仓库的主要代理协作说明。

## 项目结构速览

- `src/main.ts`：应用启动入口，注册 Pinia、router、全局指令和全局样式。
- `src/router/`：路由定义与导航守卫。
- `src/services/`：接口地址、请求封装、共享请求/响应类型。
- `src/stores/`：Pinia 状态仓库，大部分共享状态都在这里。
- `src/hooks/`：组合式函数，命名通常为 `useX`。
- `src/components/`：可复用组件，包含基于 TSX 的 `VirtualList`。
- `src/views/`：页面级功能，大部分界面开发都在这里完成。
- `config/`：Vite 基础、开发、生产配置及构建插件。
- `src/auto-imports.d.ts` 与 `src/components.d.ts`：自动生成文件，除非明确处理生成机制，否则不要手改。

## 安装与运行

- 安装依赖：`pnpm install`
- 启动本地开发环境：`pnpm dev`
- 使用 HTTPS 启动开发环境：`pnpm dev:https`
- 预览生产构建结果：`pnpm preview`

## 构建命令

- 完整构建：`pnpm build`
- 仅生产构建：`pnpm build-only`
- 生成打包分析报告：`pnpm report`
- 仅做类型检查：`pnpm type-check`

## Lint 与格式化命令

- 全仓库 ESLint：`pnpm lint`
- 样式与 Vue SFC 样式块检查：`pnpm lint:style`
- 对 `src/` 执行 Prettier 写入：`pnpm link:format`
- 手动执行暂存区检查配置：`pnpm link:lint-staged`

## 单文件校验命令

- 校验单个 TS/JS/Vue 文件：`pnpm exec eslint src/path/to/file.ts --fix`
- 校验单个 Vue/CSS/SCSS 文件：`pnpm exec stylelint "src/path/to/file.vue" --fix`
- 格式化单个文件：`pnpm exec prettier --write src/path/to/file.ts`
- TypeScript 类型检查由 `vue-tsc` 统一在仓库级执行，当前没有单文件 type-check 脚本。

## 测试现状

- 当前 `package.json` 中没有 `test` 脚本。
- 仓库中没有 Vitest、Jest、Mocha 等测试配置。
- 没有发现 `*.spec.*` 或 `*.test.*` 测试文件。
- 因为尚未接入测试框架，所以当前不存在可用的“单个测试运行命令”。
- 除非你亲自补充了测试框架和测试文件，否则不要声称已经运行了测试。
- 目前建议的校验手段是：`pnpm type-check`、`pnpm lint`、`pnpm lint:style`、`pnpm build`。

## 构建与工具说明

- Vite 配置位于 `config/`，不在仓库根目录。
- 开发环境使用 `config/vite.config.dev.ts`。
- 生产环境使用 `config/vite.config.prod.ts`，并启用了压缩、可视化分析、图片压缩插件。
- `@` 路径别名映射到 `src`。
- 项目启用了自动导入和组件自动注册，但为保证可读性，很多地方仍然保留显式导入，新增代码时也应优先考虑清晰度。

## 从配置中提炼出的核心规范

- Prettier 是格式化的最终准则。
- 默认格式：2 空格缩进、无分号、单引号、保留尾随逗号、`printWidth` 为 100。
- ESLint 允许 `any`，但这只是放宽限制，不代表鼓励滥用。
- ESLint 禁止未使用变量，并不鼓励空函数。
- 生产环境禁止保留 `debugger`。
- Vue 单文件组件的 `<template>`、`<script>`、`<style>` 代码块之间应保留空行。
- Stylelint 通过 `stylelint-config-recess-order` 约束 CSS 属性顺序。
- CSS 类名允许使用中划线和下划线。

## 导入约定

- 导入顺序尽量保持为：Vue/框架相关、第三方依赖、`@/` 别名模块、相对路径模块、副作用样式导入。
- 不同导入分组之间保留一个空行。
- 仅用于类型的导入使用 `import type`。
- 跨功能目录引用时优先使用 `@/` 别名。
- 同一功能目录内部的引用优先使用相对路径。
- 纯样式或副作用导入尽量放在导入列表靠后位置。
- 不要留下未使用的导入，仓库 lint 会报错。

## TypeScript 约定

- Vue SFC 默认使用 TypeScript，即 `<script setup lang="ts">`。
- 对导出的函数、组合式函数、store API、服务层方法尽量写出明确类型。
- 当 `ref`、`reactive`、空对象或空数组的推断不够可靠时，主动补充类型。
- 优先使用 `Partial`、`Pick`、`Record` 等工具类型，而不是随意写宽泛对象。
- 共享接口类型统一放在 `src/services/types.ts`。
- 消息、房间等领域已有枚举或常量时，优先复用，不要重复发明。
- 除非周边代码本身就高度动态或 DOM 驱动，否则尽量不要新增 `any`。
- 如果必须使用 `any`，把不安全边界收敛在局部，避免扩散。

## Vue 与组件约定

- 优先沿用仓库现有的 Composition API 写法。
- `script setup` 组件的 props 默认值优先使用 `withDefaults(defineProps<Props>(), ...)`。
- 组件事件使用 `defineEmits`，事件名保持稳定、语义明确。
- 仅当父组件确实需要通过 ref 调用内部能力时才使用 `defineExpose`。
- 模板尽量保持声明式，把分支逻辑和派生状态放入 `computed`、工具函数或 composable。
- `watch` / `watchEffect` 主要用于同步副作用，不要用它们替代本应放在 `computed` 中的派生逻辑。
- 可复用组件目录尽量遵循 `ComponentName/index.vue` 结构。
- 若编辑 `VirtualList`，继续保持现有 TSX 风格，不要强行改写成 SFC。

## 命名规范

- 组件目录名和组件名使用 PascalCase。
- 组合式函数使用 `useX` 风格，位于 `src/hooks/`。
- Store 使用 `useXStore` 风格，位于 `src/stores/`。
- 局部变量和函数使用 `camelCase`。
- 含义固定的常量使用 `UPPER_SNAKE_CASE`。
- 路由名使用小写字符串，如 `home`、`chat`、`contact`。
- 除非任务明确要求重命名，否则尽量保持现有文件名不变。
- 即使仓库中存在 `downloadQuenu` 这类历史命名问题，也不要顺手做跨仓库式纠错重命名。

## 状态、数据与服务层约定

- HTTP 接口封装应放在 `src/services/apis.ts` 与 `src/services/urls.ts`，不要直接散落在组件中。
- 统一复用 `src/services/request.ts` 中的 Alova 实例。
- 鉴权头注入、通用错误归一化等逻辑应由请求层负责。
- 共享应用状态、会话状态应优先进入 Pinia，而不是临时全局变量。
- 涉及持久化或缓存的状态时，要谨慎遵循现有 `localStorage` 模式。
- 修改鉴权或会话流程时，要和现有 `TOKEN`、`USER_INFO` 的读写行为保持一致。

## 错误处理规范

- 对非法输入、不支持的浏览器环境优先使用提前返回。
- 如果现有交互已经通过 `ElMessage` 提示用户，新增失败场景也保持一致。
- 服务层在规范化服务端响应后，应显式抛出或继续传递错误。
- 涉及 `localStorage`、剪贴板、媒体、选区、DOM 解析等脆弱浏览器 API 时，记得包裹 `try/catch` 或提供降级处理。
- 除非失败本来就是允许忽略的非关键路径，否则不要静默吞错。
- 鉴权相关请求失败时，要保持当前“清理本地旧凭证”的既有行为。

## 异步与资源清理

- 多步骤异步流程优先使用 `async`/`await`；若周围代码已经大量使用 `.then()`，可按局部风格保持一致。
- 你创建的定时器、对象 URL、事件监听、临时 DOM 节点都要负责清理。
- 不要留下没有清晰退出条件的轮询或递归 `setTimeout` 流程。
- 注意浏览器专属 API 的运行前提；这是前端项目，很多工具函数默认运行在浏览器环境。

## 样式约定

- 若已有 CSS 变量或主题 token，优先复用，不要随意另起一套。
- 组件局部样式默认使用 `scoped`，除非样式本身就需要全局生效。
- 保持 SCSS/CSS 属性顺序满足 stylelint 要求。
- 动态坐标或尺寸可以使用内联样式，但静态表现优先写入样式表。
- 覆盖 Element Plus 等库样式时，选择器要尽量收敛，避免影响面过大。

## 注释与文案

- 仓库里已经存在中文注释和中文界面文案，编辑时应保持原文件语言风格一致。
- 仅在代码不够直观时添加注释，不要为显而易见的赋值或调用写流水账注释。
- 注释尽量解释“为什么”，而不是机械描述“做了什么”。

## 代理执行后的校验建议

- 修改代码后的最低建议校验是：`pnpm type-check`。
- 涉及前端逻辑或样式改动时，通常还应补跑 `pnpm lint` 与 `pnpm lint:style`。
- 涉及发布、打包、配置或构建链路时，通常还应补跑 `pnpm build`。
- 由于仓库当前没有自动化测试，请在结果说明中明确写出自己实际执行了哪些校验。

## 提交规范

- 提交信息遵循 Conventional Commits，并受 `commitlint` 校验。
- 允许的 `type` 包括：`feat`、`fix`、`perf`、`style`、`docs`、`test`、`refactor`、`build`、`ci`、`chore`、`revert`、`wip`、`workflow`、`types`、`release`。
- 提交标题不能为空，且 header 长度需控制在 108 个字符以内。

## 给代理的额外提醒

- 不要手动编辑自动生成的声明文件，除非任务本身就是调整生成机制。
- 不要虚构仓库中并不存在的测试命令。
- 优先做范围明确、贴合现有模式的修改，避免顺手进行大范围清理。
- 如果你引入了新的团队约定或工作流，请同步更新本文件。
