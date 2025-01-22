<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">任务管理</h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input type="text" placeholder="搜索任务..."
                 class="bg-gray-700 text-white px-4 py-2 rounded-full !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
          <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

      </div>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      <div v-for="task in tasks" :key="task.id" class="break-inside-avoid mb-4">
        <button @click="triggerTask(task)"
                class="w-full bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div class="flex items-center justify-center mb-4">
            <img :src="task.image" :alt="task.name" class="w-16 h-16 rounded-full">
          </div>
          <h3 class="text-lg font-semibold text-center mb-2">{{ task.name }}</h3>
          <p class="text-sm text-gray-400 text-center mb-4">{{ task.description }}</p>
          <div class="flex justify-center">
        <span :class="statusClass(task.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
          {{ task.status }}
        </span>
          </div>
        </button>
      </div>
    </div>

    <!-- 新建任务模态框 -->
<!--    <div v-if="showNewTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg w-1/2">
        <h3 class="text-xl font-bold mb-4">新建任务</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="taskName">任务名称</label>
          <input type="text" id="taskName" v-model="newTask.name"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="taskDescription">任务描述</label>
          <textarea id="taskDescription" v-model="newTask.description" rows="3"
                    class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="showNewTaskModal = false"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md !rounded-button hover:bg-gray-500 whitespace-nowrap">
            取消
          </button>
          <button @click="createNewTask"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md !rounded-button hover:bg-blue-600 whitespace-nowrap">
            创建
          </button>
        </div>
      </div>
    </div>-->
  </div>


</template>
<script>
export default {
  name: "home-view",
  data() {
    return {
      showNewTaskModal: false,
      newTask: {
        name: '',
        description: ''
      },
      tasks: [
        {
          id: 1,
          name: '关键词搜索任务',
          description: '根据设定的关键词进行搜索，搜索的数据加入待处理列表',
          status: '运行中',
          lastRun: '2023-05-15 10:30',
          image: 'https://ai-public.mastergo.com/ai/img_res/d9ea4e38b09cfbabf797ee5f1da2dbda.jpg',
          taskName:'io.github.cctyl.service.impl.BiliService.doSearchTask'
        },
        {
          id: 2,
          name: '热门排行榜任务',
          description: '抓取热门排行榜的数据，加入待处理列表',
          status: '已完成',
          lastRun: '2023-05-14 18:45',
          image: 'https://ai-public.mastergo.com/ai/img_res/eb80ba97bcf3718a5ca9d54c8ba017e4.jpg',
          taskName: 'io.github.cctyl.service.impl.BiliService.doHotRankTask'
        },
        {
          id: 3,
          name: '首页排行榜任务',
          description: '连续抓取首页排行榜的数据，加入待处理列表',
          status: '已暂停',
          lastRun: '2023-05-13 01:30',
          image: 'https://ai-public.mastergo.com/ai/img_res/7782cf5be64ab7e6359ea032631b1d37.jpg',
          taskName: "io.github.cctyl.service.impl.BiliService.doHomeRecommendTask"
        },
/*        {
          id: 4,
          name: '异常检测',
          description: '检测系统中的异常行为',
          status: '计划中',
          lastRun: '- -',
          image: 'https://ai-public.mastergo.com/ai/img_res/bd26267ff0b505983cd98d87b7454d8b.jpg'
        },
        {
          id: 5,
          name: '性能优化',
          description: '优化系统性能和响应时间',
          status: '运行中',
          lastRun: '2023-05-15 13:05',
          image: 'https://ai-public.mastergo.com/ai/img_res/5d8c11c3f841f8f08f7b6933c88b16c7.jpg'
        }
*/
      ]
    };
  },
  methods: {
    statusClass(status) {
      switch (status) {
        case '运行中':
          return 'bg-green-500 text-white';
        case '已完成':
          return 'bg-blue-500 text-white';
        case '计划中':
          return 'bg-gray-500 text-white';
        default:
          return 'bg-gray-500 text-white';
      }
    },
    triggerTask(task) {
      // 实现触发任务的逻辑
      console.log('触发任务', task);
    },
    createNewTask() {
// 实现创建新任务的逻辑
      console.log('创建新任务', this.newTask);
      this.showNewTaskModal = false;
      this.newTask = {name: '', description: ''};
    }
  }
};
</script>
<style scoped>

body {
  font-family: 'Roboto', sans-serif;
}

/* 移除number input的默认箭头 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #2d3748;
}

::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

.task-management__modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.task-management__modal-content {
  max-height: 80vh;
  overflow-y: auto;
}

/* Material Design inspired button styles */
button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}

button:active::after {
  transform: scale(0, 0);
  opacity: .3;
  transition: 0s;
}
</style>
