# BiliRec Web UI 设计规范

## 1. 整体风格

- **主题**: Material Design 3 (Material You)
- **设计理念**: 现代简洁，浅色背景配合紫色/蓝色强调色
- **技术栈**: Vue 2 + TailwindCSS 3.4.17
- **配色系统**: Material Design 3 动态色彩系统

---

## 2. 颜色系统

### 2.1 背景色 (Surface Colors)

| 用途 | 类名 | 说明 |
|------|------|------|
| 主卡片背景 | `bg-surface-container` | 标准卡片背景 |
| 次级背景 | `bg-surface-container-high` | 信息区块、次级卡片 |
| 最深背景 | `bg-surface-container-highest` | 输入框、选择器 |
| 页面背景 | `bg-surface` | 整个应用背景 |
| 禁用背景 | `bg-surface-variant` | 禁用状态 |

### 2.2 强调色容器 (Container Colors)

| 用途 | 类名 | 说明 |
|------|------|------|
| 主色容器 | `bg-primary-container` | 运行中状态、主强调 |
| 次色容器 | `bg-secondary-container` | 图标背景、白名单 |
| 第三色容器 | `bg-tertiary-container` | 等待中状态 |
| 错误容器 | `bg-error-container` | 错误提示、黑名单 |

### 2.3 文字颜色 (On Colors)

| 用途 | 类名 | 说明 |
|------|------|------|
| 主要文字 | `text-on-surface` | 标题、正文 |
| 次要文字 | `text-on-surface-variant` | 描述、提示 |
| 主色上文字 | `text-on-primary` | 主按钮文字 |
| 主容器上文字 | `text-on-primary-container` | 主容器内文字 |
| 次容器上文字 | `text-on-secondary-container` | 次容器内文字 |
| 错误容器上文字 | `text-on-error-container` | 错误容器内文字 |

### 2.4 强调色

| 用途 | 类名 | 说明 |
|------|------|------|
| 主按钮/主操作 | `bg-primary` / `text-on-primary` | 主要交互按钮 |
| 主色 | `text-primary` | 链接、高亮 |
| 成功/白名单 | `bg-secondary-container` / `text-on-secondary-container` | 白名单相关 |
| 错误/黑名单 | `bg-error-container` / `text-on-error-container` | 黑名单、删除 |

### 2.5 边框颜色

| 用途 | 类名 | 说明 |
|------|------|------|
| 标准边框 | `border-outline-variant` | 输入框、卡片边框 |
| 强调边框 | `border-primary` | 聚焦状态 |

---

## 3. 圆角规范

| 组件 | 圆角类名 | 尺寸 |
|------|----------|------|
| 卡片 | `rounded-xl` | 12px |
| 按钮（主要） | `rounded-full` | 全圆角（药丸形） |
| 按钮（次要） | `rounded-lg` | 8px |
| 输入框 | `rounded-lg` | 8px |
| 图标容器 | `rounded-xl` | 12px |
| 小标签/徽章 | `rounded-full` | 全圆角 |

---

## 4. 阴影系统

```css
/* 轻微阴影 - 卡片默认 */
.elevation-1 { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); }

/* 中等阴影 - 卡片悬停 */
.elevation-2 { box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12); }

/* 强阴影 - 模态框 */
.elevation-3 { box-shadow: 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12); }
```

---

## 5. 组件样式规范

### 5.1 卡片（Card）- 任务卡片风格

```vue
<!-- 标准任务卡片 -->
<div class="bg-surface-container p-5 rounded-xl elevation-1 hover:elevation-2 transition-all duration-200">
  <!-- 任务头部 -->
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
        <i class="fas fa-icon text-2xl text-on-secondary-container"></i>
      </div>
      <div>
        <h3 class="text-base font-medium text-on-surface">标题</h3>
        <p class="text-xs text-on-surface-variant line-clamp-1">描述</p>
      </div>
    </div>
    <span class="px-3 py-1 text-xs font-medium rounded-full bg-primary-container text-on-primary-container">
      状态
    </span>
  </div>
  
  <!-- 内容区域 -->
  <div class="mb-4">
    <slot></slot>
  </div>
  
  <!-- 按钮 -->
  <button class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-primary text-on-primary hover:bg-primary/90">
    <i class="fas fa-play"></i>
    <span>执行</span>
  </button>
</div>
```

### 5.2 按钮（Button）

```vue
<!-- 主按钮（Filled） -->
<button class="w-full flex items-center justify-center gap-2 px-4 py-2.5 
               bg-primary text-on-primary rounded-full text-sm font-medium 
               hover:bg-primary/90 transition-all duration-200">
  <i class="fas fa-play"></i>
  <span>执行</span>
</button>

<!-- 禁用按钮 -->
<button disabled class="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                        bg-surface-container-highest text-on-surface-variant rounded-full 
                        text-sm font-medium cursor-not-allowed">
  <i class="fas fa-spinner fa-spin"></i>
  <span>执行中...</span>
</button>

<!-- 文字按钮 -->
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 
               text-primary hover:bg-primary-container/30 
               rounded-lg transition-all duration-150">
  <i class="fas fa-edit text-xs"></i>
  <span>编辑</span>
</button>
```

### 5.3 输入框（Input）

```vue
<!-- 标准输入框 -->
<input class="w-full bg-surface-container-highest text-on-surface px-3 py-2 
               rounded-lg border border-outline-variant 
               focus:outline-none focus:border-primary text-sm">

<!-- 带图标输入框 -->
<div class="relative">
  <i class="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"></i>
  <input class="w-full bg-surface-container-highest text-on-surface pl-9 pr-3 py-2 
                 rounded-lg border border-outline-variant 
                 focus:outline-none focus:border-primary text-sm">
</div>
```

### 5.4 开关（Switch）

```vue
<!-- 开关组件 -->
<button class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
        :class="enabled ? 'bg-primary' : 'bg-surface-container-highest'">
  <span class="sr-only">切换状态</span>
  <span class="inline-block h-4 w-4 transform rounded-full bg-on-primary transition duration-200"
        :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
</button>
```

### 5.5 章节标题

```vue
<!-- 标准章节标题 -->
<section class="mb-10">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
      <i class="fas fa-icon text-on-secondary-container"></i>
    </div>
    <h2 class="text-xl font-medium text-on-surface">章节标题</h2>
  </div>
  <!-- 内容 -->
</section>

<!-- 黑名单章节 -->
<section class="mb-10">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center">
      <i class="fas fa-ban text-on-error-container"></i>
    </div>
    <h2 class="text-xl font-medium text-on-surface">黑名单操作</h2>
  </div>
</section>

<!-- 白名单章节 -->
<section class="mb-10">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
      <i class="fas fa-check-circle text-on-secondary-container"></i>
    </div>
    <h2 class="text-xl font-medium text-on-surface">白名单操作</h2>
  </div>
</section>
```

### 5.6 状态标签

```vue
<!-- 运行中 -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-primary-container text-on-primary-container">
  运行中
</span>

<!-- 未启动 -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-surface-container-highest text-on-surface-variant">
  未启动
</span>

<!-- 排队中 -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-tertiary-container text-on-tertiary-container">
  排队中
</span>
```

---

## 6. 排版规范

### 6.1 字体大小

| 样式名 | 类名 | 大小 | 行高 | 字间距 |
|--------|------|------|------|--------|
| 页面标题 | `text-xl` / `text-2xl` | 20px / 24px | - | - |
| 章节标题 | `text-xl` | 20px | - | - |
| 卡片标题 | `text-base` | 16px | - | - |
| 正文 | `text-sm` | 14px | - | - |
| 小字/标签 | `text-xs` | 12px | - | - |

### 6.2 字重

- 标题: `font-medium` (500)
- 正文: 默认 (400)
- 按钮: `font-medium` (500)

---

## 7. 间距规范

### 7.1 内边距

| 尺寸 | 类名 | 用途 |
|------|------|------|
| 标准卡片 | `p-5` | 20px - 任务卡片 |
| 紧凑 | `p-4` | 16px |
| 内容区块 | `p-3` | 12px - 信息网格 |

### 7.2 外边距

| 尺寸 | 类名 | 用途 |
|------|------|------|
| 章节间距 | `mb-10` | 40px - 章节之间 |
| 卡片间距 | `mb-4` | 16px - 卡片内部 |
| 元素间距 | `gap-3` / `gap-4` | 12px / 16px |

### 7.3 网格布局

```vue
<!-- 任务卡片网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  <!-- 卡片 -->
</div>

<!-- 黑名单/白名单操作网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- 卡片 -->
</div>
```

---

## 8. 动效规范

### 8.1 过渡时间

| 类型 | 时长 | 用途 |
|------|------|------|
| 标准 | `duration-200` | 卡片悬停、按钮交互 |
| 开关 | `duration-200` | 开关切换 |

### 8.2 悬停效果

```vue
<!-- 卡片悬停 -->
<div class="bg-surface-container elevation-1 hover:elevation-2 transition-all duration-200">

<!-- 按钮悬停 -->
<button class="bg-primary hover:bg-primary/90 transition-all duration-200">
```

---

## 9. 已修改组件清单

| 组件名 | 文件路径 | 用途 | 状态 |
|--------|----------|------|------|
| SimpleCard | `src/components/SimpleCard.vue` | 任务卡片（黑名单/白名单操作） | ✅ 已更新为 MD3 风格 |
| Tasks.vue | `src/pages/Tasks.vue` | 任务管理页面 | ✅ 已统一为 MD3 风格 |

---

## 10. 注意事项

### ✅ 必须使用的样式（Material Design 3）

- **卡片背景**: `bg-surface-container`
- **次级背景**: `bg-surface-container-high` / `bg-surface-container-highest`
- **图标容器**: `bg-secondary-container` + `text-on-secondary-container`
- **主按钮**: `bg-primary` + `text-on-primary` + `rounded-full`
- **文字**: `text-on-surface` / `text-on-surface-variant`
- **边框**: `border-outline-variant`
- **输入框**: `bg-surface-container-highest` + `border-outline-variant`

### ❌ 禁止使用的样式（旧深色主题）

- ~~`bg-gray-800`~~ - 使用 `bg-surface-container`
- ~~`bg-gray-700`~~ - 使用 `bg-surface-container-high`
- ~~`text-white`~~ - 使用 `text-on-surface`
- ~~`text-gray-400`~~ - 使用 `text-on-surface-variant`
- ~~`bg-blue-600`~~ - 使用 `bg-primary`
- ~~`border-gray-700`~~ - 使用 `border-outline-variant`

---

## 11. 快速参考

### 任务卡片完整示例

```vue
<div class="bg-surface-container p-5 rounded-xl elevation-1 hover:elevation-2 transition-all duration-200">
  <!-- 头部 -->
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
        <i class="fas fa-icon text-2xl text-on-secondary-container"></i>
      </div>
      <div>
        <h3 class="text-base font-medium text-on-surface">标题</h3>
        <p class="text-xs text-on-surface-variant">描述</p>
      </div>
    </div>
    <span class="px-3 py-1 text-xs font-medium rounded-full bg-primary-container text-on-primary-container">
      运行中
    </span>
  </div>
  
  <!-- 内容 -->
  <div class="mb-4">
    <!-- 自定义内容 -->
  </div>
  
  <!-- 按钮 -->
  <button class="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                 bg-primary text-on-primary rounded-full text-sm font-medium 
                 hover:bg-primary/90 transition-all duration-200">
    <i class="fas fa-play"></i>
    <span>执行</span>
  </button>
</div>
```

### 常用类名组合

```vue
<!-- 标准卡片 -->
class="bg-surface-container p-5 rounded-xl elevation-1 hover:elevation-2 transition-all duration-200"

<!-- 图标容器 -->
class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center"

<!-- 主按钮 -->
class="w-full flex items-center justify-center gap-2 px-4 py-2.5 
       bg-primary text-on-primary rounded-full text-sm font-medium 
       hover:bg-primary/90 transition-all duration-200"

<!-- 输入框 -->
class="w-full bg-surface-container-highest text-on-surface px-3 py-2 
       rounded-lg border border-outline-variant focus:border-primary"

<!-- 章节标题 -->
class="flex items-center gap-3 mb-6"
class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center"
class="text-xl font-medium text-on-surface"
```

---

*文档版本: 2.0*
*最后更新: 2026-04-27*
*主题: Material Design 3 (浅色)*
