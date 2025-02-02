<template>
  <div class="min-h-screen overflow-y-auto bg-gray-900"  style="width: 100%" >
    <main class="max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-2rem)]">
      <div class="mb-8 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-white">历史处理过的视频</h1>
          <div class="flex space-x-2">
            <span
              v-for="type in handleTypes"
              :key="type.value"
              :class="[
                'px-3 py-1 text-sm !rounded-button cursor-pointer',
                currentType === type.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              ]"
              @click="handleTypeChange(type.value)"
            >{{ type.label }}</span>
          </div>
        </div>
        <!-- 新增搜索框部分 -->
        <div class="flex items-center space-x-2">
          <input
            v-model="search"
            type="text"
            placeholder="搜索视频..."
            class="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-button focus:outline-none focus:border-blue-500"
            @keyup.enter="handleSearch"
          />
          <button
            @click="handleSearch"
            class="px-4 py-2 bg-blue-600 text-white rounded-button hover:bg-blue-700 focus:outline-none"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div class="flex-1 w-full flex flex-col">
        <div v-if="videoList.length > 0" class="grid grid-cols-2 gap-6">
          <div
            v-for="video in videoList"
            :key="video.bvid"
            :class="[
              'bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-500 video-card cursor-pointer',
              video.processed ? 'opacity-50 processed-card' : ''
            ]"
            @click="goToBilibili(video.bvid)"
          >
            <div class="relative">
              <img 
                :src="$getPic(video.coverUrl)" 
                :class="[
                  'w-full h-48 object-cover rounded-lg',
                  video.handleType === 'DISLIKE' ? 'blur-cover' : ''
                ]" 
                :alt="video.title"
              >

            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-white line-clamp-2">{{ video.title }}</h3>
              <div class="mt-2 flex items-center text-sm text-gray-400">
                <img :src="$getPic(video.owner?.face)" class="w-6 h-6 rounded-full" :alt="video.owner?.name">
                <span class="ml-2">{{ video.owner?.name }}</span>
              </div>
              <p class="mt-2 text-sm text-gray-400 line-clamp-2">{{ video.desc }}</p>
              <!-- 添加显示原因的部分 -->
              <div v-if="shouldShowReason(video)" class="mt-2 text-sm">
                <span class="text-gray-400">原因：</span>
                <span :class="{
                  'text-green-400': video.handleType === 'THUMB_UP',
                  'text-red-400': video.handleType === 'DISLIKE'
                }" v-html="getReasonText(video)">

                </span>
              </div>
              <div class="mt-4 flex items-center justify-between">
              <div class="flex space-x-2">
                  <button 
                    :disabled="video.processed"
                    @click.stop="handleVideo(video, 'THUMB_UP')"
                    :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap',
                      video.handleType === 'THUMB_UP' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border border-gray-600 text-gray-800    bg-orange-200'
                    ]"
                  >
                    <i class="fas fa-thumbs-up mr-2"></i>
                    {{ video.handleType === 'THUMB_UP' ? '历史点赞' : '纠正为：点赞' }}
                  </button>
                  <button 
                    :disabled="video.processed"
                    @click.stop="handleVideo(video, 'DISLIKE')"
                    :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap',
                      video.handleType === 'DISLIKE' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border border-gray-600 text-gray-800    bg-orange-200'
                    ]"
                  >
                    <i class="fas fa-thumbs-down mr-2"></i>
                    {{ video.handleType === 'DISLIKE' ? '历史点踩' : '纠正为：点踩' }}
                  </button>
                  <button 
                    :disabled="video.processed"
                    @click.stop="handleVideo(video, 'OTHER')"
                    :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap',
                      video.handleType === 'OTHER' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border border-gray-600 text-gray-800    bg-orange-200'
                    ]"
                  >
                    <i class="fas fa-question-circle mr-2"></i>
                    {{ video.handleType === 'OTHER' ? '历史其他' : '纠正为：其他' }}
                  </button>
                </div>
                <span v-if="video.processed" class="text-green-500">
                  <i class="fas fa-check-circle mr-1"></i>已处理
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="flex-1 w-full flex flex-col items-center justify-center">
          <i class="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
          <p class="text-gray-400 text-lg">暂无视频</p>
          <p class="text-gray-500 mt-2">请稍后再来查看或切换其他分类</p>
        </div>

        <div class="w-full mt-8">
          <nav class="flex justify-center items-center space-x-2">
            <button
              class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <template v-for="(item, index) in displayedPages">
              <span
                v-if="item === '...'"
                :key="'ellipsis' + index"
                class="px-3 py-2 text-gray-500"
              >...</span>
              <button
                v-else
                :key="item"
                :class="[
                  'px-3 py-2 !rounded-button',
                  currentPage === item ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                ]"
                @click="changePage(item)"
              >{{ item }}</button>
            </template>
            <button
              class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'review-page',
  data() {
    return {
      handleTypes: [
        { value: 'ALL', label: '全部' },
        { value: 'THUMB_UP', label: '待点赞' },
        { value: 'DISLIKE', label: '待点踩' },
        { value: 'OTHER', label: '其他' }
      ],
      currentType: 'ALL',
      videoList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      processedVideos: new Set(), // 新增：用于跟踪已处理的视频
      pendingCount: 0,
      confirmedCount: 0,
      isProcessing: false, // 新增：用于跟踪是否正在处理
      search:''
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    displayedPages() {
      const result = []
      const current = this.currentPage
      const total = this.totalPages
      
      // 当总页数小于等于7时，显示所有页码
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          result.push(i)
        }
        return result
      }
      
      // 添加第一页
      result.push(1)
      
      // 处理中间页码
      if (current <= 3) {
        // 当前页靠近开始
        for (let i = 2; i <= 5; i++) {
          result.push(i)
        }
        result.push('...')
        result.push(total)
      } else if (current >= total - 2) {
        // 当前页靠近结束
        result.push('...')
        for (let i = total - 4; i <= total; i++) {
          result.push(i)
        }
      } else {
        // 当前页在中间
        result.push('...')
        for (let i = current - 1; i <= current + 1; i++) {
          result.push(i)
        }
        result.push('...')
        result.push(total)
      }
      
      return result
    }
  },
  created() {
    this.fetchVideoList()
  },
  methods: {
    async fetchVideoList() {
      try {
        const params = {
          page: this.currentPage ,
          size: this.pageSize,
          handleType: this.currentType === 'ALL' ? '' : this.currentType,
          search:this.search
        }
        const response = await api.getAlreadyHandleVideo(params)
        if (response.data) {
          this.videoList = response.data.records
          this.total = response.data.total
          // 初始化待处理数量
          this.pendingCount = response.data.total
        }
      } catch (error) {
        console.error('获取视频列表失败:', error)
      }
    },
    handleTypeChange(type) {
      this.currentType = type
      this.currentPage = 1
      this.fetchVideoList()
    },
    changePage(page) {
      this.currentPage = page
      this.fetchVideoList()
    },
    getHandleTypeLabel(type) {
      const typeMap = {
        'THUMB_UP': '待点赞',
        'DISLIKE': '待点踩',
        'OTHER': '待处理'
      }
      return typeMap[type] || '待处理'
    },
    async handleVideo(video, newHandleType) {
      try {
        if (video.handleType == newHandleType){
          return;
        }
        const flag = confirm("确定要纠正之前的处理结果吗？");
        if (!flag){
          return;
        }
        const reason = video.handleType !== newHandleType ? '用户修改为' + newHandleType : undefined;
        await api.processVideo(video.id, newHandleType, reason,true);
        
        // 使用 Vue.set 确保响应式更新
        this.$set(video, 'processed', true);
        // 同时记录到 Set 中确保状态持久
        this.processedVideos.add(video.id);
        
        // 更新计数
        this.pendingCount = Math.max(0, this.pendingCount - 1);
        this.confirmedCount++;
        
        this.$message('处理成功', 'success');
      } catch (error) {
        this.$message('处理失败：' + error.message, 'error');
      }
    },
    async handleAllVideos() {
      if (this.isProcessing) return;
      
      try {
        this.isProcessing = true;
        const unprocessedVideos = this.videoList.filter(v => !v.processed);
        
        for (const video of unprocessedVideos) {
          await this.handleVideo(video, video.handleType);
        }
        
        this.$message('批量处理完成', 'success');
      } catch (error) {
        this.$message('批量处理失败：' + error.message, 'error');
      } finally {
        this.isProcessing = false;
      }
    },
    shouldShowReason(video) {
      return (video.handleType === 'THUMB_UP' && video.thumbUpReason) || 
             (video.handleType === 'DISLIKE' && video.blackReason);
    },

    getReasonText(video) {
      if (video.handleType === 'THUMB_UP') {
        return video.thumbUpReason;
      } else if (video.handleType === 'DISLIKE') {
        return video.blackReason;
      }
      return '';
    },
    goToBilibili(bvid) {
      const url = 'https://www.bilibili.com/video/' + bvid;
      window.open(url, '_blank');
    },
    handleSearch() {
      this.currentPage = 1; // 重置页码
      this.fetchVideoList();
    },
  }
}
</script>

<style scoped>
.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.tag-white {
  background-color: #10B981;
  color: white;
}
.tag-black {
  background-color: #EF4444;
  color: white;
}
.tag-other {
  background-color: #6B7280;
  color: white;
}
.blur-cover {
  filter: blur(8px);
}
.processed-card {
  position: relative;
  pointer-events: none;
  border: 2px solid #10B981 !important;
  background-color: rgba(16, 185, 129, 0.1) !important;
  opacity: 0.7 !important;
}

.processed-card button {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.processed-card::before {
  content: '已处理';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1.2em;
  z-index: 10;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  background: linear-gradient(to right, #4B5563, #6B7280);
}
</style>