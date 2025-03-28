<template>
  <!-- 左侧导航栏 -->
  <nav class="w-64 bg-gray-800 p-4 flex flex-col">
    <div class="mb-8">
      <h1 class="text-2xl font-['Pacifico'] text-primary">logo</h1>
    </div>
    <ul class="space-y-2 flex-grow">

      <li>
        <router-link to="/watch-uploader-list" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-tasks w-6"></i>
          <span class="ml-3">观察中up主列表</span>
        </router-link>
      </li>

      <li>
        <router-link to="/home" class="flex items-center p-3 text-white  rounded-md" active-class="bg-primary">
          <i class="fas fa-chart-line w-6"></i>
          <span class="ml-3">总览</span>
        </router-link>
      </li>
      <li>
        <router-link to="/tasks" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-tasks w-6"></i>
          <span class="ml-3">任务管理</span>
        </router-link>
      </li>

      <li>
        <router-link to="/review" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-eye w-6"></i>
          <span class="ml-3">视频审核</span>
        </router-link>
      </li>

      <li>
        <router-link to="/history-video" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-eye w-6"></i>
          <span class="ml-3">历史处理视频</span>
        </router-link>
      </li>
      <li>
        <router-link to="/other-setting" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-wrench w-6"></i>
          <span class="ml-3">其他配置</span>
        </router-link>
      </li>
      <li>
        <router-link to="/whitelist" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-check-circle w-6"></i>
          <span class="ml-3">白名单管理</span>
        </router-link>
      </li>
      <li>
        <router-link to="/blacklist" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-ban w-6"></i>
          <span class="ml-3">黑名单管理</span>
        </router-link>
      </li>
      <li>
        <router-link to="/settings" class="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md" active-class="bg-primary">
          <i class="fas fa-cog w-6"></i>
          <span class="ml-3">系统配置</span>
        </router-link>
      </li>

    </ul>

  </nav>
</template>

<script>
export default {
  name: "header-view"
}
</script>

<style scoped>

</style>