<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- 定时任务管理   -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">定时任务管理</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-start">
      <div v-for="task in filterTaskList" :key="task.id"
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
            <span :class="statusClass(task.currentRunStatus)" class="px-2 py-1 text-xs font-semibold rounded-full">
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
    <div class="flex justify-between items-center mb-8 mt-8">
      <h2 class="text-2xl font-bold">其他可触发操作</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-start">


      <SimpleCard
          :status="getTaskStatus('io.github.cctyl.controller.ReplyController.saveVideoReplay')"
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
    <div class="flex justify-between items-center mb-8 mt-8">
      <h2 class="text-2xl font-bold">黑名单操作</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-start">

      <SimpleCard
          :status="getTaskStatus('io.github.cctyl.controller.BlackRuleController.dislikeByTid')"
          title="对指定分区的 排行榜、热门视频进行点踩"
          :trigger="thumbDown"
          img="fas fa-ban"
          desc="选择一个分区，对该分区的 排行榜、热门视频进行点踩"
      >

        <RegionComponent
            :partitions="partitions"
            :handle-partition="handlePartitionCheck"
        >
        </RegionComponent>

      </SimpleCard>


      <SimpleCard
          :status="getTaskStatus('RUNNING')"
          title="判断指定视频是否符合黑名单"
          :trigger="isBlack"
          img="fas fa-exclamation-triangle"
          desc="输入视频链接，判断指定视频是否符合黑名单"
      >

        <input placeholder="https://www.bilibili.com/video/BV1HcfsYxEFA/"
               v-model="isBlackUrl"
               class="flex-grow mr-4 bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">

        <div slot="other" v-if="blackRes">


          <div class="task-info-item ">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>视频：</span>
            </div>
            <div class="">{{ blackRes.videoDetail.title }}</div>
          </div>
          <div class="task-info-item " :style="blackRes.total ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>结论</span>
            </div>
            <div class="task-info-value">{{ blackRes.total === true ? '黑名单' : '不属于黑名单' }}</div>
          </div>
          <div class="task-info-item " v-if="blackRes.total===true"
               :style="blackRes.total ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>黑名单原因</span>
            </div>
            <div class="" v-html="blackRes.blackReason"></div>
          </div>
          <div class="task-info-item" :style="blackRes.midMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>用户id是否匹配</span>
            </div>
          </div>
          <div class="task-info-item" :style="blackRes.tidMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>分区是否匹配</span>
            </div>
          </div>
          <div class="task-info-item" :style="blackRes.coverMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>封面是否匹配</span>
            </div>
          </div>
          <div class="task-info-item" :style="blackRes.tagMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>标签是否匹配</span>
            </div>
          </div>
          <div class="task-info-item" :style="blackRes.titleMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>标题是否匹配</span>
            </div>
          </div>
          <div class="task-info-item" :style="blackRes.descMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>描述是否匹配</span>
            </div>
          </div>
        </div>

      </SimpleCard>

      <SimpleCard
          :status="getTaskStatus('io.github.cctyl.controller.BlackRuleController.dislikeByUserId')"
          title="对指定用户的视频进行点踩"
          :trigger="dislikeUserVideo"
          img="fas fa-thumbs-down"
          desc="输入对方的主页地址，对指定用户的视频进行点踩"
      >

        <input placeholder="https://space.bilibili.com/123456"
               v-model="blackSpaceUrl"
               class="flex-grow mr-4 bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">

        <div slot="other" class="task-info-item"
             style="display: flex; flex-direction: row;justify-content: space-between;">
          <div class="task-info-label">
            <span>将这些视频加入黑名单规则训练</span>

          </div>

          <div class=" relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'task-status-toggleblackSpaceUrl'" v-model="blackSpaceTrain"
                   class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label :for="'task-status-toggleblackSpaceUrl'"
                   class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>

        </div>


      </SimpleCard>
    </div>


    <!-- 白名单操作 -->
    <div class="flex justify-between items-center mb-8 mt-8">
      <h2 class="text-2xl font-bold">白名单操作</h2>
    </div>
    <!-- 任务瀑布流布局 -->
    <div class="flex flex-wrap gap-6">

      <SimpleCard
          :status="getTaskStatus('RUNNING')"
          class="flex-grow basis-[300px]"
          title="判断指定视频是否符合白名单"
          :trigger="isWhite"
          img="fas fa-exclamation-triangle"
          desc="输入视频链接，判断指定视频是否符合白名单"
      >

        <input placeholder="https://www.bilibili.com/video/BV1HcfsYxEFA/"
               v-model="isWhiteUrl"
               class="flex-grow mr-4 bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">

        <div slot="other" v-if="whiteRes">


          <div class="task-info-item ">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>视频：</span>
            </div>
            <div class="">{{ whiteRes.videoDetail.title }}</div>
          </div>
          <div class="task-info-item " :style="whiteRes.total ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>结论</span>
            </div>
            <div class="task-info-value">{{ whiteRes.total === true ? '白名单' : '不属于白名单' }}</div>
          </div>
          <div class="task-info-item " v-if="whiteRes.total===true"
               :style="whiteRes.total ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>白名单原因</span>
            </div>
            <div class="" v-html="whiteRes.thumbUpReason"></div>
          </div>
          <div class="task-info-item" :style="whiteRes.midMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>用户id是否匹配</span>
            </div>
          </div>
          <div class="task-info-item" :style="whiteRes.tidMatch ?'background-color: #3864ed;':''">
            <div class="task-info-label">
              <i class="fas fa-tasks"></i>
              <span>分区是否匹配</span>
            </div>
          </div>


        </div>

      </SimpleCard>

      <SimpleCard
          :status="getTaskStatus('io.github.cctyl.controller.WhiteRuleController.thumbUpUserAllVideo')"
          class="flex-grow basis-[300px]"
          title="对指定用户的视频进行点赞"
          :trigger="thumbUpUserVideo"
          img="fas fa-thumbs-up"
          desc="输入对方的主页地址，对该用户的所有视频均进行点赞"
      >
        <input placeholder="https://space.bilibili.com/123456"
               v-model="whiteSpaceUrl"
               class="flex-grow mr-4 bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
      </SimpleCard>
      <SimpleCard
          :status="getTaskStatus('io.github.cctyl.controller.WhiteRuleController.addTrain')"
          class="flex-grow basis-[600px]"

          title="根据用户视频/视频列表训练白名单规则"
          :trigger="trainWhiteRule"
          img="fas fa-list-check"
          desc="输入用户主页地址，或者一批视频列表，根据这些视频提供的信息，补充白名单规则。<br>注意,只有出现了三次以上的关键词才会被采纳，如果没有关键词被采纳，规则将不会被生成。<br>
                为了避免这种尴尬的事情发生，，请保证提供较多的相同类型的视频"
      >
        <div class="block w-full">
          <!-- 开关控制器 -->
          <div class="flex items-center justify-between mb-4">
            <span
                class="mr-2 text-sm px-2 py-1 bg-gray-700 rounded"
                style="color:#9CA3AF"
            >{{ useTagInput ? '根据指定的视频进行训练' : '根据指定用户投稿的视频进行训练' }}</span>
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox"
                     v-model="useTagInput"
                     :id="'mode-toggle'"
                     class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label :for="'mode-toggle'"
                     class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
              </label>
            </div>
          </div>

          <!-- 条件渲染两种输入方式 -->
          <template v-if="!useTagInput">
            <div class="mb-2">up主个人主页链接</div>
            <input
                placeholder="https://space.bilibili.com/123456"
                v-model="whiteSpaceTrainUrl"
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
          </template>
          <TagInput
              v-else
              label="BV号"
              :tags="tagObj"
              type="bvTag"
              :on-add="addTag"
              :on-remove="removeTag"
          />
        </div>

        <!-- 白名单列表 -->
        <div slot="other" class="bg-gray-800 rounded-lg overflow-hidden mb-6 mt-6 pr-4">

          <div class="flex justify-between items-center mb-8">
            <h5 class="text-2xl font-bold">选择一个规则用于训练</h5>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input type="text" v-model="searchQuery" placeholder="搜索白名单..."
                       class="bg-gray-700 text-white px-4 py-2 rounded-full !rounded-button focus:outline-none focus:ring-2  text-sm">
                <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <!-- 新增清除按钮 -->
            <button

                @click="selectRuleId = null"
                class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm flex items-center"
            >
              <i class="fas fa-times mr-2"></i>
              清除选择
            </button>

          </div>
          <table class="w-full whitelist-management__table">
            <thead>
            <tr class="bg-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">规则名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">标签关键词</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">标题关键词</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">封面关键词</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">描述关键词</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
            <tr v-for="item in filteredWhitelist" :key="item.id" class="hover:bg-gray-750">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="radio" v-model="selectRuleId" :value="item.id" name="rid">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.info }}</td>
              <td class="px-6 py-4">{{ item.tagNameList.join(', ') }}</td>
              <td class="px-6 py-4">{{ item.titleKeyWordList.join(', ') }}</td>
              <td class="px-6 py-4">{{ item.coverKeyword.join(', ') }}</td>
              <td class="px-6 py-4">{{ item.descKeyWordList.join(', ') }}</td>

            </tr>
            </tbody>
          </table>
        </div>


      </SimpleCard>


    </div>

  </div>

</template>

<script>
import api from "@/api";
import SimpleCard from "@/components/SimpleCard.vue";
import RegionComponent from "@/components/Region.vue";
import TagInput from "@/components/TagInput.vue";


export default {
  name: "home-view",
  components: {
    TagInput,
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
      whitelist: [],
      pageNo: 1,
      pageSize: 999,
      searchQuery: '',
      selectRuleId: null,
    };
  },
  mounted() {

    this.fetchWhitelist();
    this.fetchTaskData();
    this.fetchRegionList();
  },
  computed: {
    filteredWhitelist() {
      const query = this.searchQuery.toLowerCase();
      console.log(this.whitelist);
      return this.whitelist.filter(item => {
            try {
              return (item.info && item.info.toLowerCase().includes(query)) ||
                  (item.tagNameList && item.tagNameList.some(keyword => keyword.toLowerCase().includes(query))) ||
                  (item.titleKeyWordList && item.titleKeyWordList.some(keyword => keyword.toLowerCase().includes(query))) ||
                  (item.coverKeyword && item.coverKeyword.some(keyword => keyword.toLowerCase().includes(query))) ||
                  (item.descKeyWordList && item.descKeyWordList.some(keyword => keyword.toLowerCase().includes(query)));
            } catch (err) {
              console.log(err);
            }
          }
      );
    },
    filterTaskList() {
      return this.tasks.filter(task => {
        return task.taskName;
      });
    },
  },
  methods: {

    async trainWhiteRule() {
      let flag = false;
      if (this.selectRuleId) {
        const ruleItem = this.whitelist.filter(item => {
          return item.id == this.selectRuleId
        });
        flag = confirm(`你选择的规则是：${ruleItem[0].info} ，接下来将根据你输入的视频对该规则进行训练`);
      } else {
        flag = confirm("你没有选择规则哦，将创建一个全新的规则");
      }

      if (flag) {
        try {
          const params = {};

          // 如果选择了规则ID，添加到参数中
          if (this.selectRuleId) {
            params.id = this.selectRuleId;
          }
          params.trainedBvidList =[];
          // 根据输入方式选择参数
          if (this.useTagInput) {
            // 使用视频列表进行训练
            params.trainedBvidList = this.tagObj.bvTag;
          } else {
            // 使用UP主ID进行训练
            const mid = this.$getMid(this.whiteSpaceTrainUrl);
            console.log('mid='+mid);
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
    /**
     * 点踩用户视频
     * @returns {Promise<void>}
     */
    async dislikeUserVideo() {
      const mid = this.$getMid(this.blackSpaceUrl);
      if (mid) {
        try {
          const response = await api.dislikeUserVideo(mid, this.blackSpaceTrain);
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

    /**
     * 点赞用户视频
     * @returns {Promise<void>}
     */
    async thumbUpUserVideo() {
      const mid = this.$getMid(this.whiteSpaceUrl);
      if (mid) {
        try {
          const response = await api.thumbUpUserVideo(mid);
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
    /**
     * 对分区进行点踩
     */
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
      })
          .join(",");
      if (confirm("确定对 " + nameStr + " 等分区进行点踩吗")) {

        const tidArr = filterArr
            .map((item) => {
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

    /**
     * 保存视频下评论
     */
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

      return 24 + hour - new Date().getHours();
    },
    handleTaskStatusChange(task) {
      task.isEnabled = !task.isEnabled;
      api.updateTaskEnabled(task);

    },
    statusClass(status) {
      switch (status) {
        case 'RUNNING':
          return 'bg-green-500 text-white';
        case 'STOPPED':
          return 'bg-blue-500 text-white';
        case 'WAITING':
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

        await this.fetchTaskData();

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
    },
    /**
     * 查找指定任务的运行状态
     * @param classMethodName
     */
    getTaskStatus(classMethodName) {

      const arr = this.tasks.filter((item) => {
        return item.classMethodName === classMethodName
      })
      if (arr.length > 0) {

        // console.log(classMethodName+'-'+arr[0].currentRunStatus)
        return arr[0].currentRunStatus
      } else {
        // console.log(classMethodName+'-未知')
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