<template>
  <main class="flex-1 p-6 overflow-auto custom-scrollbar">
    <header class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">总览</h1>
        <p class="text-gray-400 mt-1">欢迎回来，管理员。这里是您的系统概览。</p>
      </div>
      <div class="flex items-center">
        <div class="relative mr-4">
          <input type="text" placeholder="搜索..."
                 class="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
            class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2 !rounded-button whitespace-nowrap">
          <i class="fas fa-sync-alt mr-2"></i>刷新数据
        </button>
        <button class="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full !rounded-button whitespace-nowrap">
          <i class="fas fa-bell"></i>
        </button>
      </div>
    </header>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">当前运行任务数</h3>
          <i class="fas fa-tasks text-2xl text-primary"></i>
        </div>
        <p class="text-3xl font-bold text-primary">12</p>
        <p class="text-sm text-gray-400 mt-2">较昨日 <span class="text-green-400">+2</span></p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">黑名单规则数</h3>
          <i class="fas fa-ban text-2xl text-red-400"></i>
        </div>
        <p class="text-3xl font-bold text-red-400">256</p>
        <p class="text-sm text-gray-400 mt-2">较昨日 <span class="text-red-400">+15</span></p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">白名单规则数</h3>
          <i class="fas fa-check-circle text-2xl text-green-400"></i>
        </div>
        <p class="text-3xl font-bold text-green-400">1024</p>
        <p class="text-sm text-gray-400 mt-2">较昨日 <span class="text-green-400">+32</span></p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">系统运行天数</h3>
          <i class="fas fa-calendar-alt text-2xl text-yellow-400"></i>
        </div>
        <p class="text-3xl font-bold text-yellow-400">365</p>
        <p class="text-sm text-gray-400 mt-2">稳定运行中</p>
      </div>
    </div>

    <!-- 历史处理数据卡片 -->
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-xl font-bold mb-4">历史处理数据</h2>
      <div class="grid grid-cols-3 gap-6">
        <div>
          <h3 class="text-lg mb-2">白名单数据</h3>
          <div id="whitelistChart" style="width: 100%; height: 200px;"></div>
        </div>
        <div>
          <h3 class="text-lg mb-2">黑名单数据</h3>
          <div id="blacklistChart" style="width: 100%; height: 200px;"></div>
        </div>
        <div>
          <h3 class="text-lg mb-2">其他数据</h3>
          <div id="otherDataChart" style="width: 100%; height: 200px;"></div>
        </div>
      </div>
    </div>

    <!-- 待处理数据卡片 -->
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-xl font-bold mb-4">待处理数据</h2>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg mb-2">待二次处理数据</h3>
          <div class="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div class="bg-primary h-4 rounded-full" style="width: 70%"></div>
          </div>
          <div class="flex justify-between text-sm">
            <span>进度：70%</span>
            <span>1400 / 2000 条</span>
          </div>
        </div>
        <div>
          <h3 class="text-lg mb-2">待三次处理数据</h3>
          <div class="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div class="bg-secondary h-4 rounded-full" style="width: 30%"></div>
          </div>
          <div class="flex justify-between text-sm">
            <span>进度：30%</span>
            <span>600 / 2000 条</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务信息卡片 -->
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-xl font-bold mb-4">任务信息</h2>
      <div class="mb-4">
        <p class="mb-2">下一个将要运行的任务：<span class="font-bold text-yellow-400">数据清洗任务</span></p>
        <p class="text-sm text-gray-400">预计开始时间：2023-06-15 08:00:00</p>
      </div>
      <h3 class="text-lg mb-3">当前正在运行的任务：</h3>
      <ul class="space-y-4">
        <li class="bg-gray-700 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold">日志分析任务</span>
            <span class="text-sm text-gray-400">已运行 2 小时 15 分钟</span>
          </div>
          <div class="w-full bg-gray-600 rounded-full h-4">
            <div class="bg-blue-500 h-4 rounded-full" style="width: 75%"></div>
          </div>
          <div class="flex justify-between mt-2 text-sm">
            <span>进度：75%</span>
            <span>预计剩余时间：45 分钟</span>
          </div>
        </li>
        <li class="bg-gray-700 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold">数据备份任务</span>
            <span class="text-sm text-gray-400">已运行 4 小时 30 分钟</span>
          </div>
          <div class="w-full bg-gray-600 rounded-full h-4">
            <div class="bg-green-500 h-4 rounded-full" style="width: 90%"></div>
          </div>
          <div class="flex justify-between mt-2 text-sm">
            <span>进度：90%</span>
            <span>预计剩余时间：30 分钟</span>
          </div>
        </li>
        <li class="bg-gray-700 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold">系统监控任务</span>
            <span class="text-sm text-gray-400">持续运行中</span>
          </div>
          <div class="w-full bg-gray-600 rounded-full h-4">
            <div class="bg-yellow-500 h-4 rounded-full" style="width: 100%"></div>
          </div>
          <div class="flex justify-between mt-2 text-sm">
            <span>状态：正常</span>
            <span>上次检查：5 分钟前</span>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  name: "home-view"
}
</script>

<style scoped>

</style>