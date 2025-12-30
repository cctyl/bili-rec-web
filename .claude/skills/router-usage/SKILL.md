---
name: router-usage
description: |
  当需要进行 Vue Router 路由开发时自动使用此 Skill。

  触发场景：
  - 新增路由配置
  - 页面跳转导航
  - 路由参数传递
  - 路由守卫处理
  - 动态路由匹配

  触发词：路由、router、导航、跳转、$router、$route、页面跳转、路由配置、路由守卫、router-link、router-view
---

# Vue Router 路由使用规范

本项目使用 Vue Router 3.6.5 进行路由管理，采用 hash 模式。所有路由配置在 `src/router/index.js`。

## 项目路由架构

### 核心文件结构

```
src/
├── router/
│   └── index.js      # 路由配置文件
├── components/
│   └── Nav.vue       # 导航组件（使用 router-link）
└── App.vue           # 根组件（包含 router-view）
```

### 路由配置概览

```javascript
// src/router/index.js
import VueRouter from 'vue-router'

const router = new VueRouter({
    mode: 'hash',  // 使用 hash 模式
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/tasks', component: Tasks },
        // ...更多路由
    ]
})
```

### 现有路由列表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | - | 重定向到 /home |
| `/home` | Home | 总览页面 |
| `/tasks` | Tasks | 任务管理 |
| `/whitelist` | Whitelist | 白名单管理 |
| `/blacklist` | Blacklist | 黑名单管理 |
| `/review` | Review | 视频审核 |
| `/history-video` | HistoryVideo | 历史记录 |
| `/watch-uploader-list` | WatchUploaderList | UP主观察 |
| `/settings` | Settings | 系统设置 |
| `/other-setting` | OtherSetting | 其他设置 |

## 一、新增路由配置

### 步骤 1：创建页面组件

```vue
<!-- src/pages/NewPage.vue -->
<template>
  <div class="flex-1 p-8 overflow-y-auto">
    <h2 class="text-2xl font-bold mb-8">新页面</h2>
    <!-- 页面内容 -->
  </div>
</template>

<script>
export default {
  name: "new-page-view",
  data() {
    return {
      // 数据
    };
  },
  mounted() {
    // 初始化
  },
  methods: {
    // 方法
  }
};
</script>
```

### 步骤 2：在路由配置中注册

```javascript
// src/router/index.js

// 1. 导入组件
import NewPage from "@/pages/NewPage.vue";

// 2. 在 routes 数组中添加路由配置
const router = new VueRouter({
    mode: 'hash',
    routes: [
        // ... 其他路由
        {
            path: '/new-page',  // 路由路径
            component: NewPage, // 组件
        },
    ]
})
```

### 步骤 3：在导航菜单中添加链接

```vue
<!-- src/components/Nav.vue -->
<template>
  <nav class="w-64 bg-gray-800 p-4 flex flex-col">
    <ul class="space-y-2 flex-grow">
      <!-- 其他导航项 -->

      <!-- 新增导航项 -->
      <li>
        <router-link
          to="/new-page"
          class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md"
          active-class="bg-primary"
        >
          <i class="fas fa-icon w-6"></i>
          <span class="ml-3">新页面</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
```

## 二、声明式导航（router-link）

### 基础用法

```vue
<template>
  <!-- 导航到指定路径 -->
  <router-link to="/home">
    首页
  </router-link>

  <!-- 使用 v-bind 动态绑定 -->
  <router-link :to="homePath">
    首页
  </router-link>

  <!-- 带查询参数 -->
  <router-link to="/home?tab=popular">
    热门
  </router-link>

  <!-- 带哈希 -->
  <router-link to="/home#section1">
    第一部分
  </router-link>
</template>
```

### 项目中的导航样式规范

```vue
<!-- 标准导航链接样式 -->
<router-link
  to="/home"
  class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md"
  active-class="bg-primary"
>
  <i class="fas fa-chart-line w-6"></i>
  <span class="ml-3">总览</span>
</router-link>
```

**样式说明**：
- `flex items-center p-3` - Flex 布局，垂直居中，内边距
- `text-gray-300` - 默认文字颜色
- `hover:bg-gray-700` - 鼠标悬停背景色
- `rounded-md` - 圆角
- `active-class="bg-primary"` - 激活状态背景色（蓝色）
- 图标使用 Font Awesome，固定宽度 `w-6`
- 文字与图标间距 `ml-3`

### 完整导航组件示例

```vue
<template>
  <nav class="w-64 bg-gray-800 p-4 flex flex-col">
    <div class="mb-8">
      <h1 class="text-2xl font-['Pacifico'] text-primary">Logo</h1>
    </div>

    <ul class="space-y-2 flex-grow">
      <li v-for="item in menuItems" :key="item.path">
        <router-link
          :to="item.path"
          class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
          active-class="bg-primary text-white"
        >
          <i :class="['fas', item.icon, 'w-6']"></i>
          <span class="ml-3">{{ item.title }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "navigation",
  data() {
    return {
      menuItems: [
        { path: '/home', title: '总览', icon: 'fa-chart-line' },
        { path: '/tasks', title: '任务管理', icon: 'fa-tasks' },
        { path: '/review', title: '视频审核', icon: 'fa-eye' },
        // ...更多菜单项
      ]
    };
  }
};
</script>
```

## 三、编程式导航（$router）

### 基础导航方法

```javascript
// 字符串路径
this.$router.push('/home')

// 对象格式
this.$router.push({ path: '/home' })

// 命名路由（如果配置了 name）
this.$router.push({ name: 'home' })

// 带查询参数
this.$router.push({ path: '/home', query: { tab: 'popular' } })

// 结果: /home?tab=popular
```

### 前进/后退

```javascript
// 前进一步
this.$router.go(1)

// 后退一步
this.$router.go(-1)

// 前进 3 步
this.$router.go(3)

// 后退 2 步
this.$router.go(-2)
```

### 替换当前路由

```javascript
// 不会在历史记录中留下记录
this.$router.replace('/home')

// 或使用 push 的 replace 选项
this.$router.push({ path: '/home', replace: true })
```

### 实际应用示例

```javascript
export default {
  methods: {
    /**
     * 保存后跳转到列表页
     */
    async saveAndNavigate() {
      try {
        const response = await api.saveData(this.formData);
        if (response.code === 200) {
          this.$message('保存成功', 'success');
          // 跳转到列表页
          this.$router.push('/list');
        }
      } catch (error) {
        console.error('Failed to save:', error);
      }
    },

    /**
     * 带参数跳转到详情页
     */
    viewDetail(id) {
      this.$router.push({
        path: '/detail',
        query: { id: id }
      });
    },

    /**
     * 返回上一页
     */
    goBack() {
      this.$router.go(-1);
    },

    /**
     * 跳转到设置页（替换历史记录）
     */
    goToSettings() {
      this.$router.replace('/settings');
    }
  }
};
```

## 四、路由参数获取

### 获取当前路由信息

```javascript
export default {
  mounted() {
    // 获取当前路径
    console.log(this.$route.path);  // '/home'

    // 获取完整 URL（包含查询参数和哈希）
    console.log(this.$route.fullPath);  // '/home?tab=popular#section1'

    // 获取查询参数
    console.log(this.$route.query);  // { tab: 'popular' }

    // 获取哈希
    console.log(this.$route.hash);  // '#section1'

    // 获取路由名称
    console.log(this.$route.name);  // 'home'（如果配置了 name）
  }
};
```

### 动态路由参数

```javascript
// 路由配置
{
  path: '/user/:id',
  component: User,
  name: 'user'
}

// 跳转
this.$router.push('/user/123')

// 在目标组件中获取参数
export default {
  mounted() {
    console.log(this.$route.params.id);  // '123'
  }
};
```

### 项目实际示例

```javascript
// src/App.vue 中的使用
export default {
  methods: {
    async checkLogin() {
      // 根据当前路径决定是否检查登录
      if (this.$route.path !== '/settings') {
        try {
          const response = await api.checkAccessKey();
          if (response.message.indexOf("未登录/登录失效") !== -1) {
            this.$message(response.message, 'error');
          }
        } catch (error) {
          console.error('获取用户数据失败:', error);
        }
      }
    }
  }
}
```

### 响应路由参数变化

```javascript
export default {
  watch: {
    '$route'(to, from) {
      // 路由变化时执行
      console.log('从', from.path, '到', to.path);
      this.fetchData();
    }
  },

  // 或者监听特定参数
  watch: {
    '$route.query.id'(newId, oldId) {
      if (newId !== oldId) {
        this.fetchDetail(newId);
      }
    }
  }
};
```

## 五、路由视图（router-view）

### 基础使用

```vue
<!-- App.vue -->
<template>
  <div class="flex h-screen">
    <!-- 左侧导航栏 -->
    <Nav />

    <!-- 路由视图：渲染匹配的组件 -->
    <router-view></router-view>
  </div>
</template>
```

### 命名视图（高级用法）

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- 默认视图 -->
    <router-view></router-view>

    <!-- 命名视图 -->
    <router-view name="sidebar"></router-view>
    <router-view name="header"></router-view>
  </div>
</template>

<!-- 路由配置 -->
{
  path: '/dashboard',
  components: {
    default: Dashboard,
    sidebar: Sidebar,
    header: Header
  }
}
```

### 嵌套路由

```javascript
// 路由配置
{
  path: '/settings',
  component: Settings,
  children: [
    {
      path: 'profile',  // 实际路径: /settings/profile
      component: ProfileSettings
    },
    {
      path: 'security',  // 实际路径: /settings/security
      component: SecuritySettings
    }
  ]
}

// Settings.vue
<template>
  <div class="flex">
    <!-- 设置菜单 -->
    <SettingsMenu />

    <!-- 子路由视图 -->
    <router-view></router-view>
  </div>
</template>
```

## 六、路由守卫

### 全局前置守卫

```javascript
// src/router/index.js

router.beforeEach((to, from, next) => {
  // to: 即将进入的目标路由
  // from: 当前导航正要离开的路由
  // next: 必须调用该方法来 resolve 这个钩子

  console.log('导航从', from.path, '到', to.path);

  // 权限验证示例
  if (to.path !== '/settings') {
    // 检查登录状态
    const isLoggedIn = checkLoginStatus();
    if (!isLoggedIn) {
      // 未登录，可以重定向到登录页
      // next('/login')
      // 或者直接放行
    }
  }

  // 一定要调用 next()
  next()
})
```

### 全局后置钩子

```javascript
router.afterEach((to, from) => {
  // 导航成功完成后执行
  // 没有 next 函数

  // 修改页面标题
  document.title = to.meta.title || 'B站视频管理';

  // 滚动到页面顶部
  window.scrollTo(0, 0);
})
```

### 路由元信息

```javascript
// 路由配置
{
  path: '/home',
  component: Home,
  meta: {
    title: '总览',
    requiresAuth: true,
    icon: 'fa-chart-line'
  }
}

// 在导航守卫中使用
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 需要认证
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      return next('/login');
    }
  }
  next()
})

// 在组件中使用
export default {
  mounted() {
    document.title = this.$route.meta.title || '默认标题';
  }
}
```

### 组件内守卫

```javascript
export default {
  // 在渲染该组件的对应路由被 confirm 前调用
  beforeRouteEnter(to, from, next) {
    // 不能获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建

    // 可以通过传一个回调给 next 来访问组件实例
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.fetchData();
    })
  },

  // 在当前路由改变，但是该组件被复用时调用
  beforeRouteUpdate(to, from, next) {
    // 可以访问组件实例 `this`
    this.fetchData(to.params.id);
    next()
  },

  // 导航离开该组件的对应路由时调用
  beforeRouteLeave(to, from, next) {
    // 可以访问组件实例 `this`

    // 防止未保存的更改
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('确定要离开吗？未保存的更改将丢失。');
      if (!answer) {
        return next(false);
      }
    }

    next()
  }
};
```

## 七、路由模式

### Hash 模式（当前使用）

```javascript
const router = new VueRouter({
  mode: 'hash',
  routes: [...]
})

// URL 示例: http://example.com/#/home
```

**特点**：
- URL 中包含 `#`
- 兼容性好，不需要服务器配置
- SEO 不友好
- 适合 SPA 应用

### History 模式（可选）

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})

// URL 示例: http://example.com/home
```

**特点**：
- URL 美观，没有 `#`
- 需要服务器配置支持
- SEO 友好
- 需要处理 404 情况

**服务器配置示例**（Nginx）：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 八、常见问题和注意事项

### 1. router-link 与 a 标签的区别

```vue
<!-- ✅ 正确：使用 router-link -->
<router-link to="/home">首页</router-link>

<!-- ❌ 错误：使用 a 标签会导致页面刷新 -->
<a href="/home">首页</a>

<!-- ✅ 正确：需要外部链接时使用 a 标签 -->
<a href="https://example.com" target="_blank">外部链接</a>
```

### 2. this.$router 与 this.$route 的区别

```javascript
// this.$router - 路由实例（用于编程式导航）
this.$router.push('/home')  // ✅ 正确
this.$route.push('/home')   // ❌ 错误

// this.$route - 当前路由对象（用于获取路由信息）
console.log(this.$route.path)  // ✅ 正确
console.log(this.$router.path) // ❌ 错误
```

### 3. 重复导航错误

```javascript
// ❌ 问题：重复导航到相同路径会报错
this.$router.push('/home')
this.$router.push('/home')  // Error: NavigationDuplicated

// ✅ 解决方案 1：使用 catch
this.$router.push('/home').catch(err => {
  if (err.name !== 'NavigationDuplicated') {
    throw err;
  }
})

// ✅ 解决方案 2：在路由配置中处理
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }
  });
}
```

### 4. 路径大小写

```javascript
// ✅ 推荐：使用小写路径
{
  path: '/user-profile',
  component: UserProfile
}

// ❌ 避免：使用大写或驼峰
{
  path: '/UserProfile',
  component: UserProfile
}
```

### 5. 尾部斜杠

```javascript
// ✅ 推荐：不使用尾部斜杠
{
  path: '/home',
  component: Home
}

// ❌ 避免：使用尾部斜杠
{
  path: '/home/',
  component: Home
}

// 如果需要匹配两种情况，可以使用正则
{
  path: '/home/?',
  component: Home
}
```

## 九、完整示例：带参数的列表详情

### 路由配置

```javascript
// src/router/index.js
import VideoList from "@/pages/VideoList.vue";
import VideoDetail from "@/pages/VideoDetail.vue";

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/videos',
      component: VideoList,
      name: 'video-list',
      meta: {
        title: '视频列表',
        icon: 'fa-video'
      }
    },
    {
      path: '/video/:id',
      component: VideoDetail,
      name: 'video-detail',
      meta: {
        title: '视频详情',
        icon: 'fa-play-circle'
      }
    }
  ]
})
```

### 列表页组件

```vue
<!-- src/pages/VideoList.vue -->
<template>
  <div class="flex-1 p-8 overflow-y-auto">
    <h2 class="text-2xl font-bold mb-8">视频列表</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="video in videos"
        :key="video.id"
        class="bg-gray-800 rounded-lg p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        @click="viewVideo(video.id)"
      >
        <h3 class="text-lg font-semibold mb-2">{{ video.title }}</h3>
        <p class="text-gray-400">{{ video.desc }}</p>

        <!-- 使用 router-link -->
        <router-link
          :to="`/video/${video.id}`"
          class="inline-block mt-4 text-blue-400 hover:text-blue-300"
        >
          查看详情 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "video-list",
  data() {
    return {
      videos: []
    };
  },
  mounted() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await api.getVideoList();
        if (response.code === 200) {
          this.videos = response.data.list;
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    },

    /**
     * 编程式导航到详情页
     */
    viewVideo(id) {
      // 方法 1：路径格式
      this.$router.push(`/video/${id}`);

      // 方法 2：对象格式
      // this.$router.push({
      //   path: `/video/${id}`
      // });

      // 方法 3：命名路由
      // this.$router.push({
      //   name: 'video-detail',
      //   params: { id: id }
      // });
    }
  }
};
</script>
```

### 详情页组件

```vue
<!-- src/pages/VideoDetail.vue -->
<template>
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- 返回按钮 -->
    <button
      @click="goBack"
      class="mb-6 text-blue-400 hover:text-blue-300 flex items-center"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      返回列表
    </button>

    <div v-if="video" class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">{{ video.title }}</h2>
      <p class="text-gray-300 mb-6">{{ video.desc }}</p>

      <!-- 视频信息 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-gray-400">UP 主:</span>
          <span class="ml-2">{{ video.uploader }}</span>
        </div>
        <div>
          <span class="text-gray-400">时长:</span>
          <span class="ml-2">{{ video.duration }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-4 text-gray-400">加载中...</p>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "video-detail",
  data() {
    return {
      video: null
    };
  },
  mounted() {
    this.fetchVideoDetail();
  },
  methods: {
    async fetchVideoDetail() {
      // 从路由参数中获取视频 ID
      const videoId = this.$route.params.id;

      try {
        const response = await api.getVideoDetail(videoId);
        if (response.code === 200) {
          this.video = response.data;
        }
      } catch (error) {
        console.error('Failed to fetch video detail:', error);
        this.$message('加载失败', 'error');
      }
    },

    /**
     * 返回上一页
     */
    goBack() {
      this.$router.go(-1);
    }
  },
  watch: {
    /**
     * 监听路由参数变化
     */
    '$route.params.id'(newId, oldId) {
      if (newId !== oldId) {
        this.fetchVideoDetail();
      }
    }
  }
};
</script>
```

## 十、最佳实践总结

### ✅ 推荐做法

1. **所有路由配置统一在 `src/router/index.js`**
2. **使用 hash 模式**（与项目保持一致）
3. **导航菜单使用 router-link**
4. **编程式导航使用 $router.push()**
5. **获取路由信息使用 $route**
6. **路由路径使用小写和连字符**
7. **配置路由元信息（meta）**
8. **使用全局前置守卫处理权限**
9. **组件内使用 watch 监听路由变化**
10. **导航链接遵循项目样式规范**

### ❌ 避免做法

1. **使用 a 标签进行内部导航**
2. **在组件中直接修改 location.href**
3. **路径使用驼峰命名**
4. **忘记调用 next()**
5. **在 beforeRouteEnter 中访问 this**
6. **重复导航不处理错误**
7. **硬编码路由路径（字符串到处重复）**

### 路由常量管理（推荐）

```javascript
// src/router/constants.js
export const ROUTES = {
  HOME: '/home',
  TASKS: '/tasks',
  WHITELIST: '/whitelist',
  BLACKLIST: '/blacklist',
  REVIEW: '/review',
  HISTORY_VIDEO: '/history-video',
  SETTINGS: '/settings',
  OTHER_SETTING: '/other-setting',
};

// 在组件中使用
import { ROUTES } from '@/router/constants';

export default {
  methods: {
    goToHome() {
      this.$router.push(ROUTES.HOME);
    }
  }
};
```

---

**记住**：所有路由相关开发，都应遵循本 Skill 规范！
