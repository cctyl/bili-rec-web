# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 2 的前端项目，用于管理B站视频的黑白名单规则、任务管理和视频审核。项目使用 Vuex 进行状态管理，Vue Router 进行路由管理，Axios 进行 API 调用。

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
- **UI 框架**: TailwindCSS 3.4.17
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
4. **视频审核 (Review)**: 手动审核待处理视频
5. **历史记录 (HistoryVideo)**: 查看已处理视频记录
6. **系统设置 (Settings)**: 系统配置和认证
7. **UP主观察 (WatchUploaderList)**: 监控特定UP主

### API 接口结构
- **认证相关**: `checkAccessKey()`, `getWebQrCode()`, `checkScanResult()`
- **配置管理**: `getConfigList()`, `addOrUpdateConfig()`
- **字典管理**: `getDictList()`, `addDict()`, `delDictById()`
- **黑白名单**: `getWhiteRuleList()`, `getBlackKeyWordList()`, `trainWhiteRule()`
- **任务管理**: `getTaskList()`, `updateTaskEnabled()`, `triggerTask()`
- **视频处理**: `getReady2HandleVideo()`, `processVideo()`, `watchVideo()`

### 状态管理
使用 Vuex 管理全局状态，包括：
- 用户认证状态
- 系统配置数据
- 任务列表状态
- 黑白名单规则缓存

### 自定义插件
- **MessagePlugin**: 全局消息提示组件
- **Utils**: 通用工具函数
- **增强的 console.log**: 在 main.js 中重写了 console.log，自动添加文件名和行号信息

### 路由配置
使用 hash 模式，包含以下路由：
- `/` -> 重定向到 `/home`
- `/home` - 总览页面
- `/tasks` - 任务管理
- `/whitelist` - 白名单管理
- `/blacklist` - 黑名单管理
- `/review` - 视频审核
- `/history-video` - 历史记录
- `/watch-uploader-list` - UP主观察
- `/settings` - 系统设置
- `/other-setting` - 其他设置

### 开发注意事项
0. ui风格和样式要保持一致，色调：primary: '#3B82F6',secondary: '#10B981'。 
1. **API 调用**: 所有 API 调用统一使用 `src/api/index.js` 中的方法
2. **状态更新**: 通过 Vuex actions 和 mutations 管理状态
3. **组件复用**: common components 位于 `src/components/` 目录
4. **样式**: 使用 TailwindCSS，样式类遵循工具类优先原则
5. **错误处理**: API 调用错误统一在组件中处理
6. **权限验证**: 在 App.vue 中进行登录状态检查

