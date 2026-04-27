<template>
  <!-- 主内容区 -->
  <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
    <!-- Header Section -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-medium text-on-surface">任务管理</h1>
        <p class="text-sm text-on-surface-variant mt-2">管理和监控所有定时任务</p>
      </div>
    </header>

    <!-- 定时任务管理 -->
    <section class="mb-10">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
          <i class="fas fa-clock text-on-primary-container"></i>
        </div>
        <h2 class="text-xl font-medium text-on-surface">定时任务</h2>
      </div>

      <!-- 任务卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="task in filterTaskList" :key="task.id"
             class="bg-surface-container p-5 rounded-xl elevation-1 hover:elevation-2 transition-all duration-200">
          <!-- 任务头部 -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
                <i :class="task.img" class="text-2xl text-on-secondary-container"></i>
              </div>
              <div>
                <h3 class="text-base font-medium text-on-surface">{{ task.task_name }}</h3>
                <p class="text-xs text-on-surface-variant line-clamp-1">{{ task.description }}</p>
              </div>
            </div>
            <span :class="statusClass(task.current_run_status)" class="px-3 py-1 text-xs font-medium rounded-full">
              {{ getStatus(task.current_run_status) }}
            </span>
          </div>

          <!-- 任务信息网格 -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-surface-container-high rounded-lg p-3">
              <div class="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <i class="fas fa-redo text-primary"></i>
                <span>总运行次数</span>
              </div>
              <p class="text-lg font-medium text-on-surface">{{ task.total_run_count }}</p>
            </div>
            <div class="bg-surface-container-high rounded-lg p-3">
              <div class="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <i class="fas fa-stopwatch text-secondary"></i>
                <span>上次耗时</span>
              </div>
              <p class="text-lg font-medium text-on-surface">{{ task.last_run_duration }}秒</p>
            </div>
            <div class="bg-surface-container-high rounded-lg p-3">
              <div class="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <i class="fas fa-history text-tertiary"></i>
                <span>上次运行</span>
              </div>
              <p class="text-sm font-medium text-on-surface truncate">{{ $parseIsoDateStr(task.last_run_time) }}</p>
            </div>
            <div class="bg-surface-container-high rounded-lg p-3">
              <div class="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <i class="fas fa-power-off text-primary"></i>
                <span>启用状态</span>
              </div>
              <button @click="handleTaskStatusChange(task)"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                      :class="task.is_enabled ? 'bg-primary' : 'bg-surface-container-highest'">
                <span class="sr-only">切换任务状态</span>
                <span class="inline-block h-4 w-4 transform rounded-full bg-on-primary transition duration-200"
                      :class="task.is_enabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </button>
            </div>
          </div>

          <!-- 定时设置 -->
          <div v-if="task.is_enabled" class="mb-4 p-3 bg-surface-container-high rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <i class="fas fa-calendar-clock text-on-surface-variant text-sm"></i>
                  <template v-if="task.editScheduledHour">
                    <select v-model="task.scheduled_hour"
                            class="bg-surface-container-highest text-on-surface rounded-lg px-3 py-1.5 text-sm border border-outline-variant focus:outline-none focus:border-primary"
                            @change="changeScheduledTime(task)"
                            @blur="task.editScheduledHour=false">
                      <option v-for="hour in 24" :key="hour-1" :value="hour-1">{{ hour - 1 }}:00</option>
                    </select>
                    <button @click="task.editScheduledHour=false"
                            class="text-on-surface-variant hover:text-error transition-colors">
                      <i class="fas fa-times"></i>
                    </button>
                  </template>
                  <template v-else>
                    <span @click="task.editScheduledHour=true" class="cursor-pointer hover:text-primary transition-colors text-sm font-medium">
                      每天 {{ task.scheduled_hour }}:00
                    </span>
                  </template>
                </div>
              </div>
              <span class="text-xs text-on-surface-variant">
                预计 {{ getNextRunTime(task.scheduled_hour) }} 小时后运行
              </span>
            </div>
          </div>

          <!-- 触发按钮 -->
          <button @click.stop="triggerTask(task)"
                  :disabled="!(task.current_run_status ==='STOPPED')"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                  :class="task.current_run_status === 'STOPPED' 
                    ? 'bg-primary text-on-primary hover:bg-primary/90' 
                    : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'">
            <i class="fas" :class="task.current_run_status === 'STOPPED' ? 'fa-play' : 'fa-spinner fa-spin'"></i>
            <span>{{ task.current_run_status === 'STOPPED' ? '手动触发' : '执行中...' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 黑名单操作 -->
    <section class="mb-10">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center">
          <i class="fas fa-ban text-on-error-container"></i>
        </div>
        <h2 class="text-xl font-medium text-on-surface">黑名单操作</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleCard
            :status="getTaskStatus('io.github.cctyl.controller.BlackRuleController.BLACKByTid')"
            title="分区排行榜点踩"
            :trigger="thumbDown"
            img="fas fa-chart-bar"
            desc="选择分区，对该分区的排行榜、热门视频进行点踩">
          <RegionComponent
              :partitions="partitions"
              :handle-partition="handlePartitionCheck">
          </RegionComponent>
        </SimpleCard>

        <SimpleCard
            :status="getTaskStatus('io.github.cctyl.controller.BlackRuleController.BLACKByUserId')"
            title="指定用户视频点踩"
            :trigger="BLACKUserVideo"
            img="fas fa-user-slash"
            desc="输入用户主页地址，对该用户的所有视频进行点踩">
          <div class="space-y-3">
            <div class="relative">
              <i class="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"></i>
              <input placeholder="https://space.bilibili.com/123456"
                     v-model="blackSpaceUrl"
                     class="w-full bg-surface-container-highest text-on-surface pl-9 pr-3 py-2 rounded-lg border border-outline-variant focus:outline-none focus:border-primary text-sm">
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-on-surface-variant">加入黑名单规则训练</span>
              <button @click="blackSpaceTrain = !blackSpaceTrain"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                      :class="blackSpaceTrain ? 'bg-primary' : 'bg-surface-container-highest'">
                <span class="sr-only">切换训练状态</span>
                <span class="inline-block h-4 w-4 transform rounded-full bg-on-primary transition duration-200"
                      :class="blackSpaceTrain ? 'translate-x-6' : 'translate-x-1'"></span>
              </button>
            </div>
          </div>
        </SimpleCard>
      </div>
    </section>

    <!-- 白名单操作 -->
    <section class="mb-10">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
          <i class="fas fa-check-circle text-on-secondary-container"></i>
        </div>
        <h2 class="text-xl font-medium text-on-surface">白名单操作</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleCard
            :status="getTaskStatus('io.github.cctyl.controller.WhiteRuleController.thumbUpUserAllVideo')"
            title="指定用户视频点赞"
            :trigger="thumbUpUserVideo"
            img="fas fa-thumbs-up"
            desc="输入用户主页地址，对该用户的所有视频进行点赞">
          <div class="relative">
            <i class="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"></i>
            <input placeholder="https://space.bilibili.com/123456"
                   v-model="whiteSpaceUrl"
                   class="w-full bg-surface-container-highest text-on-surface pl-9 pr-3 py-2 rounded-lg border border-outline-variant focus:outline-none focus:border-primary text-sm">
          </div>
        </SimpleCard>
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/api";
import SimpleCard from "@/components/SimpleCard.vue";
import RegionComponent from "@/components/Region.vue";

export default {
  name: "home-view",
  components: {
    RegionComponent,
    SimpleCard
  },
  data() {
    return {
      showNewTaskModal: false,
      newTask: {
        name: '',
        description: ''
      },
      tasks: [],
      saveVideoCommentUrl: '',
      showTidModal: true,
      partitions: [
        {
          tid: 1,
          code: 'douga',
          name: '动画(主分区)',
          desc: '',
          router: '/v/douga',
          pid: null,
        },
      ],
      isBlackUrl: '',
      isWhiteUrl: '',
      blackRes: null,
      whiteRes: null,
      whiteSpaceUrl: '',
      blackSpaceUrl: '',
      blackSpaceTrain: false,
      tagObj: {
        bvTag: [],
      },
      whiteSpaceTrainUrl: '',
      useTagInput: false,
      rulelist: [],
      pageNo: 1,
      pageSize: 999,
      searchQuery: '',
      selectRuleId: null,
    };
  },
  mounted() {
    this.fetchTaskData();
    this.fetchRegionList();
  },
  computed: {
    filteredWhitelist() {
      const query = this.searchQuery.toLowerCase();
      console.log(this.rulelist);
      return this.rulelist.filter(item => {
        try {
          return (item.info && item.info.toLowerCase().includes(query)) ||
              (item.tagNameList && item.tagNameList.some(keyword => keyword.toLowerCase().includes(query))) ||
              (item.titleKeyWordList && item.titleKeyWordList.some(keyword => keyword.toLowerCase().includes(query))) ||
              (item.coverKeyword && item.coverKeyword.some(keyword => keyword.toLowerCase().includes(query))) ||
              (item.descKeyWordList && item.descKeyWordList.some(keyword => keyword.toLowerCase().includes(query)));
        } catch (err) {
          console.log(err);
        }
      });
    },
    filterTaskList() {
      return this.tasks.filter(task => {
        return task.task_name;
      });
    },
  },
  methods: {
    async trainWhiteRule() {
      let flag = false;
      if (this.selectRuleId) {
        const ruleItem = this.rulelist.filter(item => {
          return item.id == this.selectRuleId
        });
        flag = confirm(`你选择的规则是：${ruleItem[0].info} ，接下来将根据你输入的视频对该规则进行训练`);
      } else {
        flag = confirm("你没有选择规则哦，将创建一个全新的规则");
      }

      if (flag) {
        try {
          const params = {};

          if (this.selectRuleId) {
            params.id = this.selectRuleId;
          }
          params.trainedBvidList = [];
          if (this.useTagInput) {
            params.trainedBvidList = this.tagObj.bvTag;
          } else {
            const mid = this.$getMid(this.whiteSpaceTrainUrl);
            console.log('mid=' + mid);
            if (!mid) {
              this.$message('无法解析UP主ID', 'error');
              return;
            }
            params.mid = mid;
          }

          console.log(params);
          const response = await api.trainWhiteRule(params);
          if (response.success) {
            this.$message('训练任务已提交', 'success');
          } else {
            this.$message(response.message || '训练失败', 'error');
          }
        } catch (error) {
          console.error('Failed to train white rule:', error);
        }
      }
    },

    async fetchWhitelist() {
      console.log("fetchWhitelist")
      try {
        const response = await api.getWhiteRuleList(this.pageNo, this.pageSize);
        this.whitelist = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },
    addTag(type, input) {
      this.tagObj[type].push(input);
    },
    removeTag(type, index) {
      this.tagObj[type].splice(index, 1);
    },
    async BLACKUserVideo() {
      const mid = this.$getMid(this.blackSpaceUrl);
      if (mid) {
        try {
          const response = await api.BLACKUserVideo(mid, this.blackSpaceTrain);
          if (response.success) {
            this.$message(response.message, 'success');
          }
        } catch (error) {
          console.error('Failed to  saveVideoComment', error);
        }
      } else {
        console.log(mid)
        this.$message('mid 提取失败', 'error');
      }
    },

    async thumbUpUserVideo() {
      const mid = this.$getMid(this.whiteSpaceUrl);
      if (mid) {
        try {
          const response = await api.thumbUpUserVideo(mid * 1);
          if (response.success) {
            this.$message(response.message, 'success');
          }
        } catch (error) {
          console.error('Failed to  saveVideoComment', error);
        }
      } else {
        console.log(mid)
        this.$message('mid 提取失败', 'error');
      }
    },

    async isWhite() {
      try {
        const bvId = this.$getBvid(this.isWhiteUrl);
        if (bvId) {
          const response = await api.isWhite(bvId);
          this.whiteRes = response.data;
        } else {
          console.log(bvId)
          this.$message('bvid 提取失败', 'error')
        }
      } catch (error) {
        console.error('Failed to  fetchRegionList:', error);
      }
    },

    async isBlack() {
      try {
        const bvId = this.$getBvid(this.isBlackUrl);
        if (bvId) {
          const response = await api.isBlack(bvId);
          this.blackRes = response.data;
        } else {
          this.$message('bvid 提取失败', 'error')
        }
      } catch (error) {
        console.error('Failed to  fetchRegionList:', error);
      }
    },

    async fetchRegionList() {
      try {
        const response = await api.getRegionList();
        this.partitions = response.data;
      } catch (error) {
        console.error('Failed to  fetchRegionList:', error);
      }
    },
    handlePartitionCheck() {
    },
    async thumbDown() {
      const filterArr = this.partitions.filter((item) => {
        return item.checked
      });
      if (filterArr.length < 1) {
        this.$message('请先选择分区', 'warning');
        return;
      }

      const nameStr = filterArr.map((item) => {
        return item.name;
      }).join(",");
      if (confirm("确定对 " + nameStr + " 等分区进行点踩吗")) {
        const tidArr = filterArr.map((item) => {
          return item.tid
        });

        try {
          const response = await api.disklikeByTid(tidArr);
          if (response.success) {
            this.$message(response.message, '任务已开始');
          }
          this.fetchRegionList()
        } catch (error) {
          console.error('Failed to  thumbDown', error);
        }
      }
    },

    async saveVideoComment() {
      const bvId = this.$getBvid(this.saveVideoCommentUrl);
      if (bvId) {
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
        this.saveVideoCommentUrl = '';
      }
    },

    changeScheduledTime(task) {
      api.updateTaskEnabled(task);
      task.editScheduledHour = false
    },
    getNextRunTime(hour) {
      const now = new Date().getHours();
      if (now < hour) {
        return hour - now;
      }
      return 24 + hour - now;
    },
    handleTaskStatusChange(task) {
      task.is_enabled = !task.is_enabled;
      api.updateTaskEnabled(task);
    },
    statusClass(status) {
      switch (status) {
        case 'RUNNING':
          return 'bg-primary-container text-on-primary-container';
        case 'STOPPED':
          return 'bg-secondary-container text-on-secondary-container';
        case 'WAITING':
          return 'bg-tertiary-container text-on-tertiary-container';
        default:
          return 'bg-surface-container-highest text-on-surface-variant';
      }
    },
    async triggerTask(task) {
      try {
        task.currentRunStatus = 'WAITING';
        const response = await api.triggerTask(task.class_method_name);
        if (!response.success) {
          this.$message(response.message, 'error');
        } else {
          this.$message(response.message, 'success');
        }
        await this.fetchTaskData();
      } catch (error) {
        console.error('Failed to  triggerTask', error);
      }
    },
    createNewTask() {
      console.log('创建新任务', this.newTask);
      this.showNewTaskModal = false;
      this.newTask = { name: '', description: '' };
    },
    async fetchTaskData() {
      try {
        const response = await api.getTaskList();
        console.log(response)
        response.data.forEach(task => {
          task.editScheduledHour = false
        })
        this.tasks = response.data;
        console.log(this.tasks)
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
    },
    getTaskStatus(classMethodName) {
      const arr = this.tasks.filter((item) => {
        return item.class_method_name === classMethodName
      })
      if (arr.length > 0) {
        return arr[0].currentRunStatus
      } else {
        return '无状态';
      }
    },
  }
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
