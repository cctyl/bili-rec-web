<template>
  <!-- 左侧导航栏 - Material Design 3 Navigation Drawer -->
  <nav class="w-72 bg-surface-container-low p-3 flex flex-col h-screen elevation-1">
    <!-- Logo Section -->
    <div class="mb-6 px-4 py-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
          <i class="fas fa-play-circle text-xl text-on-primary-container"></i>
        </div>
        <div>
          <h1 class="text-xl font-medium text-on-surface">BiliRec</h1>
          <p class="text-xs text-on-surface-variant">视频管理系统</p>
        </div>
      </div>
    </div>

    <!-- Navigation Items -->
    <ul class="space-y-1 flex-grow">
      <li>
        <router-link 
          to="/home" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-chart-line text-lg"></i>
          </div>
          <span class="text-sm font-medium">总览</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/tasks" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-tasks text-lg"></i>
          </div>
          <span class="text-sm font-medium">任务管理</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/review" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-clipboard-check text-lg"></i>
          </div>
          <span class="text-sm font-medium">视频审核</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/history-video" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-history text-lg"></i>
          </div>
          <span class="text-sm font-medium">历史处理视频</span>
        </router-link>
      </li>

      <!-- Divider -->
      <li class="py-2">
        <div class="h-px bg-outline-variant mx-4"></div>
      </li>

      <li>
        <router-link 
          to="/whitelist" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-check-circle text-lg"></i>
          </div>
          <span class="text-sm font-medium">白名单管理</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/blacklist" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-ban text-lg"></i>
          </div>
          <span class="text-sm font-medium">黑名单管理</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/other-setting" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-sliders-h text-lg"></i>
          </div>
          <span class="text-sm font-medium">其他配置</span>
        </router-link>
      </li>

      <li>
        <router-link 
          to="/settings" 
          class="flex items-center gap-4 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 group"
          active-class="bg-secondary-container text-on-secondary-container hover:bg-secondary-container"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="fas fa-cog text-lg"></i>
          </div>
          <span class="text-sm font-medium">系统配置</span>
        </router-link>
      </li>
    </ul>

    <!-- Footer Section -->
    <div class="mt-auto pt-4 border-t border-outline-variant">
      <div class="px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
            <i class="fas fa-user text-sm text-on-tertiary-container"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-on-surface truncate">管理员</p>
            <p class="text-xs text-on-surface-variant truncate">admin@bilirec.com</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "header-view"
}
</script>

<style scoped>
/* Active state indicator animation */
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
