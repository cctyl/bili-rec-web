# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 2 的前端项目，用于管理B站视频的黑白名单规则、任务管理和视频审核。项目使用 Vuex 进行状态管理，Vue Router 进行路由管理，Axios 进行 API �调用。

## 开发命令

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run serve
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 项目架构

### 核心技术栈
- **前端框架**: Vue 2.6.14
- **状态管理**: Vuex 3.6.2
- **路由管理**: Vue Router 3.6.5
- **HTTP 客户端**: Axios 1.7.9
- **UI 框架**: TailwindCSS 3.4.。17
- **图标库**: Font Awesome
- **图表库**: ECharts 5.6.0
- **二维码生成**: QRCode 1.5.4

### 目录结构
```
src/
├── api/           # API 接口定义
├── assets/        # 静态资源
├── components/    # 通用组件
├── pages/         # 页面组件
├── plugins/       # 插件和工具
├── router/        # 路由配置
└── store/         # Vuex 状态管理
```

### 核心功能模块

1. **总览 (Home)**: 显示系统运行状态和统计数据
2. **任务管理 (Tasks)**: 管理自动化任务
3. **黑白名单管理**: 配置视频过滤规则
4. **视频审核 (VideoManage)**: 手动审核待处理视频
5. **历史记录 (VideoManage)**: 查看已处理视频记录
6. **系统设置 (Settings)**: 系统配置和认证

### API 接口结构
所有 API 调用统一使用 `src/api/index.js` 中的方法：

- **认证相关**: `checkAccessKey()`, `getWebQrCode()`, `checkScanResult()`, `checkTvScanResult()`, `getTvQrCode()`
- **配置管理**: `getConfigList()`, `addOrUpdateConfig()`
- **字典管理**: `getDictList()`, `addDict()`, `delDictById()`, `batchRemoveAndUpdate()`
- **黑白名单**: `getWhiteRuleList()`, `getBlackKeyWordList()`, `trainWhiteRule()`
- **任务管理**: `getTaskList()`, `updateTaskEnabled()`, `triggerTask()`
- **视频处理**: `getReady2HandleVideo()`, `getAlreadyHandleVideo()`, `processVideo()`, `watchVideo()`, `testRule()`
- **复合规则**: `getAssociateRule()`, `addAssociateRule()`, `updateRule()`, `delAssociateRule()`
- **AI 聊天**: `testAiChat()`

### 状态管理
使用 Vuex 管理全局状态，位于 `src/store/` 目录：
- **state.js**: 存储全局状态（userInfo, standardConfig）
- **actions.js**: 异步操作方法
- **mutations.js**: 同步状态修改方法
- **getters.js**: 计算属性

### 自定义插件
- **MessagePlugin** (`src/plugins/message.js`): 全局消息提示组件，通过 `this.$message(message, type)` 调用
- **Utils** (`src/plugins/utils.js`): 通用工具函数
- **增强的 console.log**: 在 main.js 中重写了 console.log，自动添加文件名和行号信息

### 路由配置
使用 hash 模式，包含以下路由：
- `/` -> 重定向到 `/home`
- `/home` - 总览页面
- `/tasks` - 任务管理
- `/whitelist` - 白名单管理（RuleList 组件，accessType: 'WHITE'）
- `/blacklist` - 黑名单管理（RuleList 组件，accessType: 'BLACK'）
- `/review` - 视频审核
- `/history-video` - 历史记录
- `/watch-uploader-list` - UP主观察
- `/settings` - 系统设置
- `/other-setting` - 其他设置



### UI/UX 规范
1. **色调**：保持一致的颜色风格
   - Primary: `#3B82F6` (blue-600)
   - Secondary: `#10B981` (green-600)
   - 其他参考 TailwindCSS 颜色规范

2. **组件样式**：使用 TailwindCSS 工具类优先，避免自定义 CSS（除非必要）

3. **消息提示**：使用全局 `this.$message(message, type)` 方法显示提示消息

### 开发规范
1. **API 调用**: 所有 API 调用使用api-request-skill skill
2. **状态更新**: 通过 Vuex actions 和 mutations 管理状态
3. **组件复用**: 通用组件位于 `src/components/` 目录
4. **错误处理**: API 调用错误统一在组件中处理
5. **权限验证**: 在 App.vue 中进行登录状态检查



## Skills 索引

本项目使用 Claude Code Skills 功能来提供特定场景的专业指导。Skills 通过触发词自动激活，提供更精准的开发建议。

| Skill | 触发词 | 说明 |
|-------|--------|------|
| api-request | API、请求、接口、axios、ajax、api调用、后端接口、数据请求 | HTTP API 开发规范，包括 API 定义、调用、错误处理等 |
| tailwindcss-styling | 样式、CSS、Tailwind、样式设计、UI、界面、布局、颜色、按钮、表单、卡片、美化、样式调整 | TailwindCSS 样式开发规范，包括颜色系统、布局系统、组件样式等 |
| router-usage | 路由、router、导航、跳转、$router、$route、页面跳转、路由配置、路由守卫、router-link、router-view | Vue Router 路由使用规范，包括路由配置、声明式导航、编程式导航、路由参数、路由守卫等 |



## ui风格与界面设计
凡是设计ui相关修改，都要使用 material-design skill 进行设计，并遵循 UI_DESIGN_GUIDE.md 的要求


### 使用说明

当你在开发中提到触发词时，对应的 Skill 会自动加载，提供详细的技术指导。例如：
- "帮我添加一个 API 接口" → 自动激活 api-request Skill
- "如何在组件中调用后端接口？" → 自动激活 api-request Skill
- "帮我设计一个卡片组件的样式" → 自动激活 material-design  Skill，以及遵循 UI_DESIGN_GUIDE.md
- "这个页面需要美化一下" → 自动激活 material-design  Skill，以及遵循 UI_DESIGN_GUIDE.md
- "帮我添加一个新的路由" → 自动激活 router-usage Skill
- "如何从列表页跳转到详情页？" → 自动激活 router-usage Skill
- "如何在导航时传递参数？" → 自动激活 router-usage Skill


