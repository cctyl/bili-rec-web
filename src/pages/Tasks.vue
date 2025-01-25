<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- 定时任务管理   -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">定时任务管理</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-6 space-y-6">
      <div v-for="task in tasks" :key="task.id"
           class="break-inside-avoid mb-6 rounded-lg p-6 bg-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-1  active:shadow-inner transition-all duration-200">
        <div
            class="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div class="flex items-center justify-center mb-4">
            <!-- 将 img 标签替换为 FontAwesome 图标 -->
            <i :class="task.img" class="w-16 h-16 rounded-full text-4xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-center mb-2">{{ task.taskName }}</h3>
          <p class="text-sm text-gray-400 text-center mb-4">{{ task.description }}</p>
        </div>

        <div class="task-details">
          <div class="flex justify-center mb-2">
            <span :class="statusClass(task.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ getStatus(task.currentRunStatus) }}
            </span>

          </div>
          <div class="task-info-grid">
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
                <i class="fas fa-clock"></i>
                <span>上次运行时间</span>
              </div>
              <div class="task-info-value">{{ task.lastRunTime }}</div>
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
            <div class="task-info-item" v-if="task.isEnabled">
              <div class="task-info-label">
                <i class="fas fa-clock"></i>
                <span>定时运行时间</span>
              </div>

              <template v-if="task.editScheduledHour">
                <select
                    v-model="task.scheduledHour"
                    class="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    @change="changeScheduledTime(task)"
                    @blur="task.editScheduledHour=false"
                >
                  <option v-for="hour in 24" :key="hour-1" :value="hour-1">{{ hour - 1 }}:00</option>
                </select>
                <button
                    @click="task.editScheduledHour=false"
                    class="ml-2 text-gray-400 hover:text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </template>
              <template v-else>
                <span @click="task.editScheduledHour=true" class="cursor-pointer hover:text-blue-400">
                  {{ task.scheduledHour }}:00
                </span>
              </template>

              <!--              <div class="task-info-value">{{ task.scheduledHour }}:00</div>-->
            </div>
            <div class="task-info-item" v-if="task.isEnabled">
              <div class="task-info-label">
                <i class="fas fa-hourglass-half"></i>
                <span>预计下次运行</span>
              </div>
              <div class="task-info-value">{{ getNextRunTime(task.scheduledHour) }}小时后</div>
            </div>
          </div>
          <!-- 在 task-info-grid div 下方添加以下代码 -->
          <div class="mt-4 flex justify-center">
            <button
                @click.stop="triggerTask(task)"
                :disabled="! (task.currentRunStatus ==='STOPPED')"
                class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-play mr-2"></i>
              <span>{{ task.currentRunStatus === 'STOPPED' ? '手动触发' : '执行中...' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>


    <!-- 其他可触发操作 -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">其他可触发操作</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-6 space-y-6">

      <SimpleCard
          title="处理视频-就按你说的做"
          :trigger="triggerTask"
          img="fas fa-robot"
          desc="按机器判断处理所有未人工审核的视频，程序初始判断的是白名单就按白名单处理，是黑名单就按黑名单处理"
      ></SimpleCard>


      <SimpleCard
          title="处理视频-主动触发三次处理"
          :trigger="triggerTask"
          img="fas fa-play-circle"
          desc="立即开始三次处理，而不是等定时任务处理"
      ></SimpleCard>

      <SimpleCard
          title="保存某个视频下的所有评论"
          :trigger="saveVideoComment"
          img="fas fa-comments"
          desc="保存某个视频下的所有评论，方便后续cha shui biao"
      >
        <input placeholder="https://www.bilibili.com/video/BV1HcfsYxEFA/"
               v-model="saveVideoCommentUrl"
               class="flex-grow mr-4 bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">

      </SimpleCard>
    </div>


    <!-- 黑名单操作 -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">黑名单操作</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-6 space-y-6">

      <SimpleCard
          title="对指定分区的 排行榜、热门视频进行点踩"
          :trigger="triggerTask"
          img="fas fa-ban"
          desc="选择一个分区，对该分区的 排行榜、热门视频进行点踩"
      ></SimpleCard>


      <SimpleCard
          title="判断指定视频是否符合黑名单"
          :trigger="triggerTask"
          img="fas fa-exclamation-triangle"
          desc="输入视频链接，判断指定视频是否符合黑名单"
      ></SimpleCard>

      <SimpleCard
          title="对指定用户的视频进行点踩"
          :trigger="triggerTask"
          img="fas fa-thumbs-down"
          desc="输入对方的主页地址，对指定用户的视频进行点踩"
      ></SimpleCard>
    </div>


    <!-- 白名单操作 -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">白名单操作</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-6 space-y-6">

      <SimpleCard
          title="根据用户视频/视频列表训练白名单规则"
          :trigger="triggerTask"
          img="fas fa-list-check"
          desc="输入用户主页地址，或者一批视频列表，根据这些视频提供的信息，补充白名单规则"
      ></SimpleCard>



      <SimpleCard
          title="对指定用户的视频进行点赞"
          :trigger="triggerTask"
          img="fas fa-thumbs-up"
          desc="输入对方的主页地址，对该用户的所有视频均进行点赞"
      ></SimpleCard>
    </div>

  </div>

</template>

<script>
import api from "@/api";
import SimpleCard from "@/components/SimpleCard.vue";

export default {
  name: "home-view",
  components: {SimpleCard},
  data() {
    return {
      showNewTaskModal: false,
      newTask: {
        name: '',
        description: ''
      },
      tasks: [],
      saveVideoCommentUrl: '',
    };
  },
  mounted() {

    this.fetchTaskData();
  },
  methods: {
    /**
     * 保存视频下评论
     */
   async saveVideoComment(){


      const bvPattern = /BV[a-zA-Z0-9]{10}/; // BV 号通常是 12 位字符（BV + 10 位字母数字）
      const match = this.saveVideoCommentUrl  .match(bvPattern);

      if (match) {
        const bvId = match[0]; // 提取匹配的 BV 号
        try {
          const response = await api.saveVideoComment(bvId);
          if (response.success) {
            this.$message(response.message, '任务已开始');
          }
        } catch (error) {
          console.error('Failed to  saveVideoComment', error);
        }

      } else {
        this.$message('格式错误，未提取到BV号', 'error');
        this.saveVideoCommentUrl ='';
      }

    },

    changeScheduledTime(task) {
      api.updateTaskEnabled(task);
      task.editScheduledHour = false
    },
    getNextRunTime(hour) {

      return 24 + hour - new Date().getHours();
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
    async triggerTask(task) {
      try {
        task.currentRunStatus = 'WAITING';
        const response = await api.triggerTask(task.classMethodName);
        if (!response.success) {
          this.$message(response.message, 'error');
        } else {
          this.$message(response.message, 'success');
        }

        await api.fetchTaskData();

      } catch (error) {
        console.error('Failed to  triggerTask', error);
      }

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
        response.data.forEach(task => {
          task.editScheduledHour = false
        })
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