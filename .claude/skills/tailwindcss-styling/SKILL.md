---
name: tailwindcss-styling
description: |
  当需要进行 UI 样式开发时自动使用此 Skill。

  触发场景：
  - 编写或修改组件样式
  - 设计页面布局
  - 创建按钮、表单等 UI 元素
  - 调整颜色、间距、排版

  触发词：样式、CSS、Tailwind、样式设计、UI、界面、布局、颜色、按钮、表单、卡片、美化、样式调整
---

# TailwindCSS 样式开发规范

本项目使用 TailwindCSS 3.4.17 构建 UI，采用深色科技风格，所有样式应遵循本规范以保持界面一致性。

## 一、设计系统概览

### 核心设计理念
- **风格定位**: 深色科技风格，现代简洁
- **主色调**: 蓝色系（#3B82F6）作为主要强调色
- **辅助色**: 绿色系（#10B981）作为成功/确认状态
- **背景**: 深灰阶梯（gray-700/gray-800）营造层次感
- **交互**: 悬停提升、阴影变化、平滑过渡

### 颜色规范

#### 主色调
```css
/* Primary Color - 主色调 */
--primary: #3B82F6;  /* blue-500/600 */
--primary-hover: #2563EB; /* blue-600/700 */

/* Secondary Color - 辅助色 */
--secondary: #10B981; /* green-500 */
```

#### 背景色阶梯
```html
<!-- 主背景（页面容器） -->
bg-gray-900  <!-- 最深背景，整个应用背景 -->

<!-- 卡片背景 -->
bg-gray-800  <!-- 主卡片背景 -->
bg-gray-700  <!-- 次级卡片/输入框背景 -->

<!-- 悬停/激活状态 -->
bg-gray-600  <!-- 悬停状态 -->
bg-gray-500  <!-- 禁用/等待状态 -->
```

#### 文字颜色
```html
text-white        <!-- 主要文字 -->
text-gray-300     <!-- 次要文字 -->
text-gray-400     <!-- 描述文字 -->
text-gray-500     <!-- 占位符文字 -->
```

#### 状态颜色
```html
text-blue-400     <!-- 信息/链接 -->
text-green-400    <!-- 成功/白名单/点赞 -->
text-red-400      <!-- 错误/删除/黑名单 -->
text-orange-300   <!-- 警告/待处理 -->
text-purple-400   <!-- 特殊状态 -->
text-pink-400     <!-- 强调数据 -->
text-yellow-400   <!-- 提示/警告 -->
```

## 二、布局系统

### 页面布局模板

```vue
<template>
  <!-- 标准页面容器 -->
  <div class="flex-1 p-8 overflow-y-auto">

    <!-- 页面头部 -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold">页面标题</h2>
        <p class="text-gray-400 mt-1">页面描述文字</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- 头部操作按钮 -->
      </div>
    </header>

    <!-- 页面内容 -->
    <div class="content-area">
      <!-- 内容区域 -->
    </div>

  </div>
</template>
```

### 网格布局系统

```html
<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- 自动适配：1列 → 2列 → 4列 -->
</div>

<!-- 卡片网格（常用） -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-start">
  <!-- 任务卡片网格 -->
</div>

<!-- 两列布局 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- 左右分栏 -->
</div>
```

### Flex 布局模式

```html
<!-- 水平居中，两端对齐 -->
<div class="flex justify-between items-center">
  <div>左侧内容</div>
  <div>右侧内容</div>
</div>

<!-- 水平居中，垂直居中 -->
<div class="flex items-center justify-center">
  <div>居中内容</div>
</div>

<!-- 垂直布局 -->
<div class="flex flex-col space-y-4">
  <div>项目1</div>
  <div>项目2</div>
</div>
```

### 间距规范

```html
<!-- 页面内边距 -->
class="p-8"   <!-- 32px - 页面级 -->
class="p-6"   <!-- 24px - 卡片级 -->
class="p-4"   <!-- 16px - 小区域级 -->

<!-- 外边距 -->
class="mb-8"  <!-- 32px - 大间距 -->
class="mb-6"  <!-- 24px - 中间距 -->
class="mb-4"  <!-- 16px - 标准间距 -->
class="mb-2"  <!-- 8px - 小间距 -->

<!-- Flex 项目间距 -->
class="space-x-4"  <!-- 水平间距 16px -->
class="space-y-2"  <!-- 垂直间距 8px -->
```

## 三、卡片组件样式

### 主卡片（深色）

```vue
<template>
  <!-- 标准主卡片 -->
  <div class="bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-bold mb-4">卡片标题</h3>
    <p class="text-gray-400">卡片内容</p>
  </div>

  <!-- 带悬停效果的卡片 -->
  <div class="bg-gray-800 rounded-lg shadow-md hover:shadow-lg
              transform hover:-translate-y-1
              transition-all duration-200 p-6">
    <h3 class="text-lg font-semibold text-center mb-2">悬停卡片</h3>
  </div>
</template>
```

### 次级卡片（较浅）

```vue
<template>
  <div class="bg-gray-700 rounded-lg p-6">
    <h3 class="text-lg font-medium">次级卡片</h3>
    <p class="text-sm text-gray-400 mt-2">用于次要信息展示</p>
  </div>
</template>
```

### 数据卡片（带图标）

```vue
<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg">数据标题</h3>
      <i class="fas fa-chart-line text-2xl text-primary"></i>
    </div>
    <p class="text-3xl font-bold text-primary mb-1">1,234</p>
    <p class="text-sm text-gray-400">数据描述</p>
  </div>
</template>
```

## 四、按钮系统

### 主要按钮（Primary）

```vue
<template>
  <!-- 标准主按钮 -->
  <button class="bg-blue-600 hover:bg-blue-700
                text-white px-4 py-2 rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500">
    <i class="fas fa-plus mr-2"></i>
    <span>添加</span>
  </button>

  <!-- 较小版本 -->
  <button class="bg-blue-500 hover:bg-blue-600
                text-white px-3 py-1.5 rounded-md text-sm">
    操作
  </button>

  <!-- 带图标的按钮（左对齐图标） -->
  <button class="bg-blue-600 hover:bg-blue-700
                text-white px-4 py-2 rounded-lg">
    <i class="fas fa-sync-alt mr-2"></i>
    刷新数据
  </button>
</template>
```

### 成功按钮（Secondary）

```vue
<template>
  <button class="bg-green-500 hover:bg-green-600
                text-white px-4 py-2 rounded-lg
                transition-colors duration-200">
    <i class="fas fa-check mr-2"></i>
    确认
  </button>
</template>
```

### 危险按钮

```vue
<template>
  <button class="bg-red-500 hover:bg-red-600
                text-white px-4 py-2 rounded-lg
                transition-colors duration-200">
    <i class="fas fa-trash-alt mr-2"></i>
    删除
  </button>
</template>
```

### 次要按钮（灰色）

```vue
<template>
  <button class="bg-gray-600 hover:bg-gray-500
                text-white px-4 py-2 rounded-lg
                transition-colors duration-200">
    取消
  </button>
</template>
```

### 禁用状态

```vue
<template>
  <button disabled
          class="bg-blue-600 text-white px-4 py-2 rounded-lg
                 disabled:opacity-50 disabled:cursor-not-allowed">
    执行中...
  </button>
</template>
```

### 图标按钮（圆形）

```vue
<template>
  <button class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700
                text-white flex items-center justify-center
                transition-colors duration-200">
    <i class="fas fa-plus"></i>
  </button>
</template>
```

### 文字链接按钮

```vue
<template>
  <button class="text-blue-400 hover:text-blue-300
                focus:outline-none">
    <i class="fas fa-edit mr-1"></i>
    编辑
  </button>

  <button class="text-red-400 hover:text-red-300">
    <i class="fas fa-trash-alt mr-1"></i>
    删除
  </button>
</template>
```

## 五、表单元素

### 输入框（标准）

```vue
<template>
  <!-- 文本输入框 -->
  <input
    type="text"
    v-model="inputValue"
    placeholder="请输入内容"
    class="w-full bg-gray-700 text-white px-4 py-2 rounded-md
           focus:outline-none focus:ring-2 focus:ring-blue-500
           placeholder-gray-500"
  />

  <!-- 带图标的输入框 -->
  <div class="relative">
    <input
      type="text"
      placeholder="搜索..."
      class="w-full bg-gray-700 text-white px-4 py-2 rounded-md
             pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <i class="fas fa-search absolute left-3 top-1/2
             transform -translate-y-1/2 text-gray-400"></i>
  </div>

  <!-- 搜索框（右侧按钮） -->
  <div class="flex">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="搜索..."
      class="flex-grow bg-gray-700 text-white px-4 py-2 rounded-l-md
             focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      @click="handleSearch"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md
             focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <i class="fas fa-search"></i>
    </button>
  </div>
</template>
```

### 下拉选择框

```vue
<template>
  <select
    v-model="selectedValue"
    class="bg-gray-700 text-white px-4 py-2 rounded-md
           focus:outline-none focus:ring-2 focus:ring-blue-500
           appearance-none cursor-pointer"
  >
    <option value="option1">选项 1</option>
    <option value="option2">选项 2</option>
  </select>
</template>
```

### 标签输入（Tag Input）

```vue
<template>
  <!-- 标签显示 -->
  <div class="flex flex-wrap gap-2">
    <span
      v-for="tag in tags"
      :key="tag"
      class="bg-gray-700 text-white px-3 py-1 rounded-full
             flex items-center text-sm"
    >
      {{ tag }}
      <button
        @click="removeTag(tag)"
        class="ml-2 text-gray-400 hover:text-white"
      >
        <i class="fas fa-times"></i>
      </button>
    </span>
  </div>
</template>
```

## 六、数据展示

### 表格样式

```vue
<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-700">
          <th class="px-6 py-3 text-left text-xs font-medium
                     text-gray-300 uppercase tracking-wider">
            列名 1
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium
                     text-gray-300 uppercase tracking-wider">
            列名 2
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium
                     text-gray-300 uppercase tracking-wider">
            操作
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
        <tr v-for="item in items" :key="item.id"
            class="hover:bg-gray-750">
          <td class="px-6 py-4 whitespace-nowrap">
            {{ item.value }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-blue-400 hover:text-blue-300 mr-3">
              <i class="fas fa-edit mr-1"></i>编辑
            </button>
            <button class="text-red-400 hover:text-red-300">
              <i class="fas fa-trash-alt mr-1"></i>删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

### 状态徽章（Badge）

```vue
<template>
  <!-- 成功状态 -->
  <span class="bg-green-500 text-white px-2 py-1
             text-xs font-semibold rounded-full">
    成功
  </span>

  <!-- 运行中状态 -->
  <span class="bg-blue-500 text-white px-2 py-1
             text-xs font-semibold rounded-full">
    运行中
  </span>

  <!-- 错误状态 -->
  <span class="bg-red-400 text-white px-2 py-1
             text-xs font-semibold rounded-full">
    错误
  </span>

  <!-- 等待状态 -->
  <span class="bg-gray-500 text-white px-2 py-1
             text-xs font-semibold rounded-full">
    等待中
  </span>
</template>
```

### 信息提示框

```vue
<template>
  <!-- 蓝色信息框 -->
  <div class="bg-blue-600 text-white p-4 rounded-lg">
    <i class="fas fa-info-circle mr-2"></i>
    这是一条重要的提示信息
  </div>

  <!-- 红色警告框 -->
  <div class="bg-red-600 text-white p-4 rounded-lg">
    <i class="fas fa-exclamation-triangle mr-2"></i>
    这是一条警告信息
  </div>

  <!-- 绿色成功框 -->
  <div class="bg-green-600 text-white p-4 rounded-lg">
    <i class="fas fa-check-circle mr-2"></i>
    操作成功
  </div>
</template>
```

## 七、导航菜单

### 侧边栏导航

```vue
<template>
  <nav class="w-64 bg-gray-800 p-4 flex flex-col">
    <!-- Logo 区域 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-primary">Logo</h1>
    </div>

    <!-- 菜单列表 -->
    <ul class="space-y-2 flex-grow">
      <li>
        <router-link
          to="/home"
          class="flex items-center p-3 text-gray-300
                 hover:bg-gray-700 rounded-md
                 transition-colors duration-200"
          active-class="bg-primary"
        >
          <i class="fas fa-home w-6"></i>
          <span class="ml-3">首页</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/tasks"
          class="flex items-center p-3 text-gray-300
                 hover:bg-gray-700 rounded-md"
          active-class="bg-primary"
        >
          <i class="fas fa-tasks w-6"></i>
          <span class="ml-3">任务管理</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
```

### 面包屑导航

```vue
<template>
  <nav class="flex items-center space-x-2 text-sm mb-6">
    <router-link to="/" class="text-gray-400 hover:text-white">
      首页
    </router-link>
    <i class="fas fa-chevron-right text-gray-600"></i>
    <router-link to="/tasks" class="text-gray-400 hover:text-white">
      任务管理
    </router-link>
    <i class="fas fa-chevron-right text-gray-600"></i>
    <span class="text-gray-300">任务详情</span>
  </nav>
</template>
```

## 八、模态框（Modal）

```vue
<template>
  <!-- 遮罩层 -->
  <div class="fixed inset-0 bg-black bg-opacity-50
              flex items-center justify-center z-50">
    <!-- 模态框主体 -->
    <div class="bg-gray-800 p-8 rounded-lg
                w-2/3 max-w-2xl
                max-h-[90vh] overflow-y-auto">
      <!-- 标题 -->
      <h3 class="text-xl font-bold mb-4">模态框标题</h3>

      <!-- 内容 -->
      <div class="mb-6">
        <p class="text-gray-400">模态框内容...</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-4">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-600 text-white rounded-md
                 hover:bg-gray-500"
        >
          取消
        </button>
        <button
          @click="confirmAction"
          class="px-4 py-2 bg-blue-500 text-white rounded-md
                 hover:bg-blue-600"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>
```

## 九、列表项

### 标准列表项

```vue
<template>
  <div class="bg-gray-700 rounded-lg p-4
              hover:bg-gray-600
              transition-colors duration-200">
    <div class="flex justify-between items-center">
      <div>
        <h4 class="text-lg font-semibold">列表项标题</h4>
        <p class="text-sm text-gray-400 mt-1">描述信息</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="text-blue-400 hover:text-blue-300">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-400 hover:text-red-300">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>
```

### 关键词标签列表

```vue
<template>
  <div class="bg-gray-800 rounded-lg p-4">
    <!-- 输入区域 -->
    <div class="flex mb-4">
      <input
        v-model="newKeyword"
        placeholder="添加新关键词"
        class="flex-grow mr-4 bg-gray-700 text-white
               px-4 py-2 rounded-l-md
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="addKeyword"
        class="bg-blue-500 hover:bg-blue-600 text-white
               px-4 py-2 rounded-r-md
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i class="fas fa-plus mr-2"></i>
        添加
      </button>
    </div>

    <!-- 标签列表 -->
    <div class="flex flex-wrap" style="max-height: 200px; overflow: auto">
      <div
        v-for="keyword in keywordList"
        :key="keyword.id"
        class="bg-gray-700 text-white px-3 py-1
               rounded-full mr-2 mb-2
               flex items-center"
      >
        <span>{{ keyword.value }}</span>
        <button
          @click="removeKeyword(keyword)"
          class="ml-2 text-red-400 hover:text-red-300"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>
```

## 十、常见布局模式

### 左右分栏布局

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- 左侧主内容 (占2列) -->
    <div class="lg:col-span-2">
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-bold mb-4">主内容</h3>
        <!-- 主要内容 -->
      </div>
    </div>

    <!-- 右侧边栏 (占1列) -->
    <div class="lg:col-span-1">
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-bold mb-4">侧边栏</h3>
        <!-- 侧边栏内容 -->
      </div>
    </div>
  </div>
</template>
```

### 上下堆叠布局

```vue
<template>
  <div class="space-y-6">
    <div class="bg-gray-800 rounded-lg p-6">
      <!-- 第一部分 -->
    </div>

    <div class="bg-gray-800 rounded-lg p-6">
      <!-- 第二部分 -->
    </div>

    <div class="bg-gray-800 rounded-lg p-6">
      <!-- 第三部分 -->
    </div>
  </div>
</template>
```

### 居中布局

```vue
<template>
  <!-- 水平垂直居中 -->
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-gray-800 rounded-lg p-8 max-w-md w-full">
      <!-- 居中的内容 -->
    </div>
  </div>
</template>
```

## 十一、悬停和交互效果

### 卡片悬停效果

```vue
<template>
  <!-- 标准悬停效果 -->
  <div class="bg-gray-800 rounded-lg p-6
              hover:shadow-lg
              transform hover:-translate-y-1
              transition-all duration-200">
    <!-- 卡片内容 -->
  </div>

  <!-- 点击效果 -->
  <div class="bg-gray-800 rounded-lg p-6
              active:shadow-inner
              transition-all duration-200">
    <!-- 卡片内容 -->
  </div>
</template>
```

### 按钮悬停效果

```vue
<template>
  <!-- 颜色过渡 -->
  <button class="bg-blue-600 hover:bg-blue-700
                text-white px-4 py-2 rounded-lg
                transition-colors duration-200">
    按钮
  </button>

  <!-- 缩放效果 -->
  <button class="bg-blue-600 hover:scale-105
                text-white px-4 py-2 rounded-lg
                transition-transform duration-200">
    按钮
  </button>
</template>
```

### 链接悬停效果

```vue
<template>
  <a href="#" class="text-blue-400 hover:text-blue-300
                 transition-colors duration-200">
    链接文字
  </a>

  <!-- 带下划线动画 -->
  <a href="#" class="text-blue-400 hover:text-blue-300
                 border-b border-transparent
                 hover:border-blue-300
                 transition-all duration-200">
    链接文字
  </a>
</template>
```

## 十二、响应式设计

### 断点系统

```html
<!-- TailwindCSS 默认断点 -->
sm: 640px   /* 小屏幕 */
md: 768px   /* 中等屏幕（平板） */
lg: 1024px  /* 大屏幕（桌面） */
xl: 1280px  /* 超大屏幕 */
```

### 响应式布局示例

```vue
<template>
  <!-- 移动端1列，平板2列，桌面4列 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- 卡片 -->
  </div>

  <!-- 移动端隐藏，桌面显示 -->
  <div class="hidden md:block">
    桌面端才显示的内容
  </div>

  <!-- 移动端显示，桌面隐藏 -->
  <div class="block md:hidden">
    移动端才显示的内容
  </div>

  <!-- 响应式字体 -->
  <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
    响应式标题
  </h1>

  <!-- 响应式内边距 -->
  <div class="p-4 md:p-6 lg:p-8">
    响应式内边距
  </div>
</template>
```

## 十三、图标使用规范

### Font Awesome 图标

```vue
<template>
  <!-- 标准图标 -->
  <i class="fas fa-home"></i>

  <!-- 带文字的图标 -->
  <button>
    <i class="fas fa-plus mr-2"></i>
    <span>添加</span>
  </button>

  <!-- 彩色图标 -->
  <i class="fas fa-check-circle text-green-400 text-2xl"></i>

  <!-- 图标大小 -->
  <i class="fas fa-home text-sm">   <!-- 小图标 -->
  <i class="fas fa-home text-base"> <!-- 标准图标 -->
  <i class="fas fa-home text-lg">   <!-- 大图标 -->
  <i class="fas fa-home text-2xl">  <!-- 超大图标 -->
  <i class="fas fa-home text-3xl">  <!-- 特大图标 -->
</template>
```

### 常用图标映射

```javascript
// 功能性图标
'fas fa-plus'           // 添加/新增
'fas fa-edit'           // 编辑
'fas fa-trash-alt'      // 删除
'fas fa-save'           // 保存
'fas fa-search'         // 搜索
'fas fa-filter'         // 筛选
'fas fa-sync-alt'       // 刷新/同步
'fas fa-times'          // 关闭/取消
'fas fa-check'          // 确认/完成

// 导航图标
'fas fa-home'           // 首页
'fas fa-tasks'          // 任务
'fas fa-chart-line'     // 总览/统计
'fas fa-cog'            // 设置
'fas fa-user'           // 用户

// 状态图标
'fas fa-check-circle'   // 成功/白名单
'fas fa-exclamation-circle' // 警告
'fas fa-ban'            // 禁止/黑名单
'fas fa-info-circle'    // 信息
'fas fa-play'           // 播放/执行
'fas fa-pause'          // 暂停
'fas fa-stop'           // 停止

// 方向图标
'fas fa-chevron-right'  // 右箭头
'fas fa-chevron-left'   // 左箭头
'fas fa-chevron-up'     // 上箭头
'fas fa-chevron-down'   // 下箭头
```

## 十四、常见错误和正确做法

### ❌ 错误做法

```vue
<!-- 错误1：使用内联样式 -->
<div style="background-color: #1f2937; padding: 16px;">
  不要使用内联样式
</div>

<!-- 错误2：硬编码颜色 -->
<div class="bg-[#3B82F6]"> <!-- 不要用任意值 -->
  应使用 Tailwind 预定义颜色
</div>

<!-- 错误3：不一致的圆角 -->
<button class="rounded-md rounded-lg"> <!-- 不要混用圆角 -->
  统一使用一种圆角
</button>

<!-- 错误4：缺少过渡效果 -->
<button class="bg-blue-600 hover:bg-blue-700">
  <!-- 缺少 transition -->
</button>

<!-- 错误5：错误的状态颜色 -->
<button class="bg-red-500">
  确认 <!-- 确认按钮不应该用红色 -->
</button>
```

### ✅ 正确做法

```vue
<!-- 正确1：使用 Tailwind 类 -->
<div class="bg-gray-800 p-4">
  使用 Tailwind 预定义类
</div>

<!-- 正确2：使用语义化颜色 -->
<button class="bg-blue-600 hover:bg-blue-700">
  主要操作
</button>

<!-- 正确3：一致的圆角 -->
<button class="rounded-lg"> <!-- 按钮统一 rounded-lg -->
  按钮
</button>

<!-- 正确4：添加过渡效果 -->
<button class="bg-blue-600 hover:bg-blue-700
              transition-colors duration-200">
  平滑过渡
</button>

<!-- 正确5：正确的状态颜色 -->
<button class="bg-blue-600">确认</button>      <!-- 主操作 -->
<button class="bg-green-500">成功</button>     <!-- 成功 -->
<button class="bg-red-500">删除</button>       <!-- 危险操作 -->
<button class="bg-gray-600">取消</button>      <!-- 次要操作 -->
```

## 十五、完整组件示例

### 数据卡片组件

```vue
<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg
              hover:shadow-xl transform hover:-translate-y-1
              transition-all duration-200">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-medium">{{ title }}</h3>
      <i :class="icon" class="text-2xl" :class="iconColor"></i>
    </div>
    <p class="text-3xl font-bold mb-1" :class="textColor">
      {{ value }}
    </p>
    <p class="text-sm text-gray-400">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    title: String,
    value: [Number, String],
    description: String,
    icon: {
      type: String,
      default: 'fas fa-chart-line'
    },
    iconColor: {
      type: String,
      default: 'text-primary'
    },
    textColor: {
      type: String,
      default: 'text-primary'
    }
  }
};
</script>
```

### 列表项组件

```vue
<template>
  <div class="bg-gray-700 rounded-lg p-4
              hover:bg-gray-600 cursor-pointer
              transition-colors duration-200">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <i :class="icon" class="text-2xl text-gray-400"></i>
        <div>
          <h4 class="text-lg font-semibold">{{ title }}</h4>
          <p class="text-sm text-gray-400">{{ description }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="bg-blue-500 text-white px-2 py-1
                     text-xs font-semibold rounded-full">
          {{ status }}
        </span>
        <button @click="onEdit" class="text-blue-400 hover:text-blue-300">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="onDelete" class="text-red-400 hover:text-red-300">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    title: String,
    description: String,
    icon: String,
    status: String,
    onEdit: Function,
    onDelete: Function
  }
};
</script>
```

## 十六、最佳实践总结

### 设计原则

1. **一致性优先**: 所有组件遵循相同的颜色、间距、圆角规范
2. **深色主题**: 使用 gray-800/gray-700 作为主要背景色
3. **蓝色主导**: #3B82F6 作为主要强调色
4. **平滑过渡**: 所有交互都应有 transition 动画
5. **响应式设计**: 移动优先，渐进增强

### 快速参考

| 元素 | 类名 |
|------|------|
| 主卡片 | `bg-gray-800 rounded-lg shadow-lg p-6` |
| 次卡片 | `bg-gray-700 rounded-lg p-4` |
| 主按钮 | `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg` |
| 输入框 | `bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500` |
| 状态徽章 | `bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-full` |
| 悬停效果 | `hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200` |

### 颜色速查表

```html
主色:      bg-blue-600        text-blue-400
成功:      bg-green-500       text-green-400
错误:      bg-red-500         text-red-400
警告:      bg-orange-500      text-orange-300
信息:      bg-blue-500        text-blue-400
背景深:    bg-gray-800
背景浅:    bg-gray-700
文字主:    text-white
文字次:    text-gray-400
```

---

**记住**: 所有样式开发都应遵循本规范，保持界面的一致性和科技感！
