<template>
  <!-- 左侧导航栏 - Material Design 3 Navigation Rail / Drawer -->
  <nav 
    class="bg-surface-container-low flex flex-col h-screen elevation-1 transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'w-20' : 'w-72'"
  >
    <!-- Toggle Button -->
    <div class="flex justify-end p-2">
      <button 
        @click="toggleCollapse"
        class="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors duration-200"
        :title="isCollapsed ? '展开' : '收起'"
      >
        <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>

    <!-- Logo Section -->
    <div class="mb-6 px-4 py-2">
      <div class="flex items-center" :class="isCollapsed ? 'justify-center' : 'gap-3'">
        <div class="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
          <i class="fas fa-play-circle text-xl text-on-primary-container"></i>
        </div>
        <div v-show="!isCollapsed" class="overflow-hidden">
          <h1 class="text-xl font-medium text-on-surface whitespace-nowrap">BiliRec</h1>
          <p class="text-xs text-on-surface-variant whitespace-nowrap">视频管理系统</p>
        </div>
      </div>
    </div>

    <!-- Navigation Items -->
    <ul class="space-y-1 flex-grow px-3">
      <li>
        <router-link 
          to="/home" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-chart-line text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">总览</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/tasks" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-tasks text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">任务管理</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/review" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-clipboard-check text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">视频审核</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/history-video" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-history text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">历史处理</span>
        </router-link>
      </li>

      <!-- Divider -->
      <li class="py-2">
        <div class="h-px bg-outline-variant" :class="isCollapsed ? 'mx-2' : 'mx-4'"></div>
      </li>

      <li>
        <router-link 
          to="/whitelist" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-check-circle text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">白名单</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/blacklist" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-ban text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">黑名单</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/other-setting" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-sliders-h text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">其他配置</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/settings" 
          class="flex items-center py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          :class="isCollapsed ? 'justify-center px-3' : 'gap-4 px-4'"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-cog text-lg"></i>
          </div>
          <span v-show="!isCollapsed" class="text-sm font-medium whitespace-nowrap">系统配置</span>
        </router-link>
      </li>
    </ul>

    <!-- Footer Section -->
    <div class="mt-auto pt-4 border-t border-outline-variant">
      <div class="px-4 py-3">
        <div class="flex items-center" :class="isCollapsed ? 'justify-center' : 'gap-3'">
          <div class="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center flex-shrink-0">
            <i class="fas fa-user text-sm text-on-tertiary-container"></i>
          </div>
          <div v-show="!isCollapsed" class="flex-1 min-w-0 overflow-hidden">
            <p class="text-sm font-medium text-on-surface truncate">管理员</p>
            <p class="text-xs text-on-surface-variant truncate">admin</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "header-view",
  data() {
    return {
      isCollapsed: true
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>

<style scoped>
/* Active state indicator */
.router-link-active {
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--color-secondary);
  border-radius: 0 3px 3px 0;
}
</style>
