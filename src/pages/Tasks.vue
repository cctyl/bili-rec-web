<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">任务管理</h2>
      <div class="flex items-center space-x-4">
<!--        <div class="relative">
          <input type="text" placeholder="搜索任务..."
                 class="bg-gray-700 text-white px-4 py-2 rounded-full !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
          <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>-->

      </div>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-6 space-y-6">
      <div v-for="task in tasks" :key="task.id"
           class="break-inside-avoid mb-6 rounded-lg p-6 bg-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-1  active:shadow-inner transition-all duration-200">
        <button @click="triggerTask(task)"
                class="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div class="flex items-center justify-center mb-4">
            <img :src="task.img" :alt="task.name" class="w-16 h-16 rounded-full">
          </div>
          <h3 class="text-lg font-semibold text-center mb-2">{{ task.name }}</h3>
          <p class="text-sm text-gray-400 text-center mb-4">{{ task.description }}</p>
        </button>

        <div class="task-details">
          <div class="flex justify-center mb-2">
            <span :class="statusClass(task.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ getStatus(task.currentRunStatus) }}
            </span>
          </div>
          <div class="task-info-grid">
            <div class="task-info-item">
              <div class="task-info-label">
                <i class="fas fa-clock"></i>
                <span>上次运行时间</span>
              </div>
              <div class="task-info-value">{{ task.lastRunTime }}</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">
                <i class="fas fa-hourglass-half"></i>
                <span>预计下次运行</span>
              </div>
              <div class="task-info-value">{{ getNextRunTime(task.scheduledHour) }}小时后</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">
                <i class="fas fa-toggle-on"></i>
                <span>定时任务状态</span>
              </div>
              <div class="task-info-value">
                <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" :id="'task-status-toggle'+task.id" v-model="task.isEnabled"
                         @click="handleTaskStatusChange(task)"
                         class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label :for="'task-status-toggle'+task.id"
                         class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
            <div class="task-info-item" v-if="task.isEnabled" >
              <div class="task-info-label">
                <i class="fas fa-clock"></i>
                <span >定时运行时间</span>
              </div>

              <template v-if="task.editScheduledHour">
                <select
                    v-model="task.scheduledHour"
                    class="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    @change="changeScheduledTime(task)"
                    @blur="task.editScheduledHour=false"
                >
                  <option v-for="hour in 24" :key="hour-1" :value="hour-1">{{hour-1}}:00</option>
                </select>
                <button
                    @click="task.editScheduledHour=false"
                    class="ml-2 text-gray-400 hover:text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </template>
              <template v-else>
                <span @click = "task.editScheduledHour=true" class="cursor-pointer hover:text-blue-400">
                  {{ task.scheduledHour }}:00
                </span>
              </template>

<!--              <div class="task-info-value">{{ task.scheduledHour }}:00</div>-->
            </div>
            <div class="task-info-item">
              <div class="task-info-label">
                <i class="fas fa-tasks"></i>
                <span>总运行次数</span>
              </div>
              <div class="task-info-value">{{ task.totalRunCount }}</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">
                <i class="fas fa-stopwatch"></i>
                <span>上次运行耗时</span>
              </div>
              <div class="task-info-value">{{ task.lastRunDuration }}秒</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">
                <i class="fas fa-file-alt"></i>
                <span>任务名称</span>
              </div>
              <div class="task-info-value">{{ task.taskName }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import api from "@/api";

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
          lastRunTime: '2023-05-15 10:30',
          isEnabled: true,
          scheduledHour: '2',
          totalRunCount: 10,
          lastRunDuration: 120,
          taskName: '关键词搜索任务',
          image: 'https://ai-public.mastergo.com/ai/img_res/d9ea4e38b09cfbabf797ee5f1da2dbda.jpg',
          classMethodName: 'io.github.cctyl.service.impl.BiliService.doSearchTask'
        },
        {
          id: 2,
          name: '热门排行榜任务',
          description: '抓取热门排行榜的数据，加入待处理列表',
          status: '已完成',
          lastRunTime: '2023-05-14 18:45',
          isEnabled: false,
          scheduledHour: '4',
          totalRunCount: 20,
          lastRunDuration: 180,
          taskName: '热门排行榜任务',
          image: 'https://ai-public.mastergo.com/ai/img_res/eb80ba97bcf3718a5ca9d54c8ba017e4.jpg',
          classMethodName: 'io.github.cctyl.service.impl.BiliService.doHotRankTask'
        },
        {
          id: 3,
          name: '首页排行榜任务',
          description: '连续抓取首页排行榜的数据，加入待处理列表',
          status: '已暂停',
          lastRunTime: '2023-05-13 01:30',
          isEnabled: true,
          scheduledHour: '6',
          totalRunCount: 15,
          lastRunDuration: 150,
          taskName: '首页排行榜任务',
          image: 'https://ai-public.mastergo.com/ai/img_res/7782cf5be64ab7e6359ea032631b1d37.jpg',
          classMethodName: "io.github.cctyl.service.impl.BiliService.doHomeRecommendTask"
        }
      ]
    };
  },
  mounted() {

    this.fetchTaskData();
  },
  methods: {
    changeScheduledTime(task){
      api.updateTaskEnabled(task);
      task.editScheduledHour=false
    },
    getNextRunTime(hour) {

      return 24 + hour  - new Date().getHours();
    },
    handleTaskStatusChange(task) {
      task.isEnabled = !task.isEnabled;
      console.log('定时任务状态:', task.isEnabled);
      console.log(task.id)
      api.updateTaskEnabled(task);

    },
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
    },
    async fetchTaskData() {
      try {
        const response = await api.getTaskList();
        response.data .forEach(task => {task.editScheduledHour = false})
        this.tasks = response.data;

      } catch (error) {
        console.error('Failed to  fetchTaskData:', error);
      }
    },
    getStatus(str) {
      switch (str) {
        case "RUNNING":
          return '运行中';
        case "STOPPED":
          return '未启动';
        case "WAITING":
          return '排队中';
        default:
          return str;
      }
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

.task-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1rem;
}

.task-info-item {
  background-color: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(74, 85, 104, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.task-info-label {
  display: flex;
  align-items: center;
  color: #9CA3AF;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.task-info-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-info-item:hover {
  background-color: rgba(45, 55, 72, 0.8);
  transform: translateY(-2px);
}

.task-info-label i {
  margin-right: 0.5rem;
  font-size: 1rem;
  color: #60A5FA;
}

/* 开关样式 */
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>