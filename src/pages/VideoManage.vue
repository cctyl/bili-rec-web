<template>
  <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
    <!-- Header Section -->
    <header class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
          <i class="fas fa-video text-xl text-on-primary-container"></i>
        </div>
        <div>
          <h1 class="text-3xl font-medium text-on-surface">{{ pageTitle }}</h1>
          <p class="text-sm text-on-surface-variant mt-1">{{ isReviewMode ? '审核待处理的视频内容' : '查看已处理的历史视频' }}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <!-- 搜索框 -->
        <div class="flex items-center gap-2">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"></i>
            <input v-model="search" type="text" placeholder="搜索视频..."
              class="bg-surface-container-highest text-on-surface pl-10 pr-4 py-2.5 rounded-full border border-outline-variant focus:outline-none focus:border-primary transition-colors w-64"
              @keyup.enter="handleSearch">
          </div>
          <button @click="handleSearch"
            class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <!-- 待审核模式显示计数器 -->
        <template v-if="isReviewMode">
          <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
            <div class="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
              <i class="fas fa-clock text-sm text-on-tertiary-container"></i>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant">待处理</p>
              <p class="text-lg font-medium text-tertiary">{{ pendingCount }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
            <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
              <i class="fas fa-check-circle text-sm text-on-secondary-container"></i>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant">已确认</p>
              <p class="text-lg font-medium text-secondary">{{ confirmedCount }}</p>
            </div>
          </div>
        </template>
      </div>
    </header>

    <!-- 分类标签 -->
    <div class="flex gap-2 mb-6">
      <button v-for="type in handleTypes" :key="type.value" @click="handleTypeChange(type.value)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="currentType === type.value
          ? 'bg-secondary-container text-on-secondary-container'
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'">
        {{ type.label }}
      </button>
    </div>

    <!-- 视频列表 -->
    <div class="flex-1 w-full flex flex-col">
      <div v-if="videoList.length > 0" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        <div v-for="video in videoList" :key="video.bvid"
          class="bg-surface-container rounded-2xl overflow-hidden elevation-1 transition-all duration-300 border border-outline-variant/30 cursor-pointer"
          :class="video.processed ? 'opacity-60 processed-card' : 'hover:elevation-2 hover:-translate-y-1'">
          <!-- 视频封面区域 -->
          <div class="relative overflow-hidden group" @click="goToBilibili(video)">
            <img :src="$getPic(video.pic)"
              class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              :class="video.handle_type === 'BLACK' ? 'blur-cover' : ''" :alt="video.title">
            <!-- 渐变遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <!-- 状态标签 - 左上角 -->
            <span v-if="isReviewMode"
              class="absolute top-4 left-4 px-4 py-1.5 text-xs font-medium rounded-full elevation-1"
              :class="getHandleTypeClass(video.handle_type)">
              {{ getHandleTypeLabel(video.handle_type) }}
            </span>

            <!-- 播放图标 -->
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div class="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center elevation-2">
                <i class="fas fa-play text-2xl text-on-primary ml-1"></i>
              </div>
            </div>
          </div>

          <!-- 视频信息区域 -->
          <div class="p-5">
            <!-- 标题 -->
            <h3 class="text-lg font-medium text-on-surface line-clamp-2 mb-3 leading-snug">{{ video.title }}</h3>

            <!-- UP主信息 - Material 3 List Item 风格 -->
            <div class="flex items-center gap-3 mb-4 p-3 bg-surface-container-high rounded-xl">
              <div
                class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-outline-variant/50">
                <template v-if="video.owner?.face">
                  <img :src="$getPic(video.owner.face)" class="w-full h-full object-cover" :alt="video.owner?.name || 'UP主'">
                </template>
                <template v-else>
                  <i class="fas fa-user text-lg text-on-surface-variant"></i>
                </template>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-on-surface truncate">{{ video.owner?.name || '-' }}</p>
                <p class="text-xs text-on-surface-variant">UP主</p>
              </div>
            </div>

            <!-- 描述 -->
            <p class="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">{{ video.desc }}</p>

            <!-- 原因显示 - Material 3 Banner 风格 -->
            <div v-if="shouldShowReason(video)" class="mb-4 p-4 rounded-xl border-l-4"
              :class="video.handle_type === 'WHITE' ? 'bg-secondary-container/50 border-secondary' : 'bg-error-container/50 border-error'">
              <div class="flex items-start gap-2">
                <i class="fas mt-0.5 text-sm"
                  :class="video.handle_type === 'WHITE' ? 'fa-check-circle text-secondary' : 'fa-exclamation-circle text-error'"></i>
                <div>
                  <span class="text-xs font-medium text-on-surface-variant block mb-1">匹配原因</span>
                  <span class="text-sm text-on-surface" v-html="getReasonText(video)"></span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 - Material 3 Segmented Button 风格 -->
            <div class="flex gap-2 mb-3">
              <!-- 主操作按钮组 -->
              <div class="flex-1 flex bg-surface-container-high rounded-full p-1">
                <button :disabled="video.processed" @click.stop="handleVideo(video, 'WHITE')"
                  class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  :class="video.handle_type === 'WHITE' && !video.processed
                    ? 'bg-secondary text-on-secondary elevation-1'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'">
                  <i class="fas fa-thumbs-up"></i>
                  <span>{{ getWhiteButtonText(video) }}</span>
                </button>
                <button :disabled="video.processed" @click.stop="handleVideo(video, 'BLACK')"
                  class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  :class="video.handle_type === 'BLACK' && !video.processed
                    ? 'bg-error text-on-error elevation-1'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'">
                  <i class="fas fa-thumbs-down"></i>
                  <span>{{ getBlackButtonText(video) }}</span>
                </button>
                <button :disabled="video.processed" @click.stop="handleVideo(video, 'OTHER')"
                  class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  :class="video.handle_type === 'OTHER' && !video.processed
                    ? 'bg-primary text-on-primary elevation-1'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'">
                  <i class="fas fa-question-circle"></i>
                  <span>{{ getOtherButtonText(video) }}</span>
                </button>
              </div>
            </div>

            <!-- 辅助操作按钮 -->
            <div class="flex gap-2">
              <button @click.stop="recheck(video)"
                class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80 transition-all duration-200 flex items-center justify-center gap-2">
                <i class="fas fa-sync-alt"></i>
                <span>重新核验</span>
              </button>
              <button @click.stop="showHandleReasonDetail(video)"
                class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-all duration-200 flex items-center justify-center gap-2">
                <i class="fas fa-info-circle"></i>
                <span>处理原因</span>
              </button>
            </div>

            <!-- 已处理标记 - Material 3 Chip 风格 -->
            <div v-if="video.processed" class="mt-4 flex items-center justify-center">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container">
                <i class="fas fa-check-circle"></i>
                <span class="text-sm font-medium">已处理</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex-1 w-full flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-4">
          <i class="fas fa-inbox text-3xl text-on-surface-variant"></i>
        </div>
        <p class="text-on-surface-variant text-lg font-medium">{{ emptyText }}</p>
        <p class="text-on-surface-variant/70 text-sm mt-1">请稍后再来查看或切换其他分类</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="w-full mt-8">
        <nav class="flex justify-center items-center gap-2">
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            :class="currentPage === 1
              ? 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
            :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <template v-for="(item, index) in displayedPages">
            <span v-if="item === '...'" :key="'ellipsis' + index" class="px-3 py-2 text-on-surface-variant">...</span>
            <button v-else :key="item"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-sm font-medium"
              :class="currentPage === item
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
              @click="changePage(item)">
              {{ item }}
            </button>
          </template>
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            :class="currentPage === totalPages
              ? 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
            :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>

    <!-- 一键处理悬浮按钮 -->
    <button v-if="isReviewMode" @click="handleAllVideos" :disabled="!videoList.length || isProcessing"
      class="fixed right-6 bottom-6 px-6 py-3 rounded-full bg-primary text-on-primary font-medium elevation-2 hover:elevation-3 transition-all duration-300 flex items-center gap-2 z-50"
      :class="(!videoList.length || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'">
      <i class="fas" :class="isProcessing ? 'fa-circle-notch fa-spin' : 'fa-magic'"></i>
      <span>{{ isProcessing ? '处理中...' : '一键处理' }}</span>
    </button>

    <!-- Tooltip Modal -->
    <div v-if="activeTooltip" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeTooltip">
      <div class="absolute inset-0 bg-black/50" @click="closeTooltip"></div>
      <div class="bg-surface-container p-6 rounded-2xl elevation-3 max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <button @click="closeTooltip" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-medium text-on-surface mb-4">核验结果</h3>
        <!-- AI 匹配结果 -->
        <div v-if="activeTooltip?.ai_match" class="mb-4 p-4 bg-surface-container-high rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center">
              <i class="fas fa-robot text-on-tertiary-container"></i>
            </div>
            <span class="font-medium text-on-surface">AI 识别结果</span>
          </div>
          <div class="text-sm text-on-surface-variant">
            <p>类型：{{ getAccessTypeLabel(activeTooltip.ai_match.match_type) }}</p>
            <p>原因：{{ activeTooltip.ai_match.reason }}</p>
          </div>
        </div>
        <!-- 单次匹配结果 -->
        <div v-if="activeTooltip?.single_match" class="mb-4 p-4 bg-surface-container-high rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <i class="fas fa-crosshairs text-on-primary-container"></i>
              </div>
              <span class="font-medium text-on-surface">单次规则匹配</span>
              <span v-if="activeTooltip.single_match.match_type" 
                class="px-2 py-0.5 text-xs rounded-full"
                :class="activeTooltip.single_match.match_type === 'WHITE' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'">
                {{ getAccessTypeLabel(activeTooltip.single_match.match_type) }}
              </span>
            </div>
          </div>
          <div class="text-sm text-on-surface-variant space-y-1">
            <p v-if="activeTooltip.single_match.mid?.length">UP主：{{ formatArray(activeTooltip.single_match.mid) }}</p>
            <p v-if="activeTooltip.single_match.tid?.length">分区：{{ formatArray(activeTooltip.single_match.tid) }}</p>
            <p v-if="activeTooltip.single_match.title?.length">标题：{{ formatArray(activeTooltip.single_match.title) }}</p>
            <p v-if="activeTooltip.single_match.desc?.length">描述：{{ formatArray(activeTooltip.single_match.desc) }}</p>
            <p v-if="activeTooltip.single_match.tag?.length">标签：{{ formatArray(activeTooltip.single_match.tag) }}</p>
            <p v-if="activeTooltip.single_match.cover?.length">封面：{{ formatArray(activeTooltip.single_match.cover) }}</p>
          </div>
        </div>
        <!-- 复杂匹配结果 -->
        <div v-if="activeTooltip?.complex_match" class="mb-4 p-4 bg-surface-container-high rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
                <i class="fas fa-project-diagram text-on-secondary-container"></i>
              </div>
              <span class="font-medium text-on-surface">复杂规则匹配</span>
              <span v-if="activeTooltip.complex_match.match_type"
                class="px-2 py-0.5 text-xs rounded-full"
                :class="activeTooltip.complex_match.match_type === 'WHITE' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'">
                {{ getAccessTypeLabel(activeTooltip.complex_match.match_type) }}
              </span>
            </div>
          </div>
          <div class="text-sm text-on-surface-variant space-y-1">
            <p v-if="activeTooltip.complex_match.list_rule?.length">联合规则：{{ formatArray(activeTooltip.complex_match.list_rule) }}</p>
            <p v-if="activeTooltip.complex_match.title_or_desc?.length">标题或描述：{{ formatArray(activeTooltip.complex_match.title_or_desc) }}</p>
            <p v-if="activeTooltip.complex_match.tag_or_desc?.length">标签或描述：{{ formatArray(activeTooltip.complex_match.tag_or_desc) }}</p>
          </div>
        </div>
        <!-- 用户处理原因 -->
        <div v-if="activeTooltip?.user_handle_reason" class="p-4 bg-surface-container-high rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <i class="fas fa-user-edit text-on-primary-container"></i>
            </div>
            <span class="font-medium text-on-surface">处理原因</span>
          </div>
          <p class="text-sm text-on-surface-variant">{{ activeTooltip.user_handle_reason }}</p>
        </div>
        <!-- 无结果提示 -->
        <div v-if="!activeTooltip?.ai_match && !activeTooltip?.single_match && !activeTooltip?.complex_match && !activeTooltip?.user_handle_reason" class="p-4 bg-surface-container-high rounded-xl text-center">
          <i class="fas fa-info-circle text-on-surface-variant mb-2"></i>
          <p class="text-on-surface-variant">未匹配任何规则</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'video-manage-page',
  props: {
    mode: {
      type: String,
      default: 'review',
      validator: value => ['review', 'history'].includes(value)
    }
  },
  data() {
    return {
      handleTypes: [
        { value: 'WHITE', label: '已点赞' },
        { value: 'BLACK', label: '已点踩' },
        { value: '', label: '全部' },
        { value: 'OTHER', label: '其他' }
      ],
      currentType: 'WHITE',
      videoList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      processedVideos: new Set(),
      pendingCount: 0,
      confirmedCount: 0,
      isProcessing: false,
      search: '',
      timer: null,
      activeTooltip: null,
    }
  },
  computed: {
    isReviewMode() {
      return this.mode === 'review'
    },
    pageTitle() {
      return this.isReviewMode ? '待审核视频' : '历史处理视频'
    },
    emptyText() {
      return this.isReviewMode ? '暂无待处理的视频' : '暂无视频'
    },
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    displayedPages() {
      const result = []
      const current = this.currentPage
      const total = this.totalPages

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          result.push(i)
        }
        return result
      }

      result.push(1)

      if (current <= 3) {
        for (let i = 2; i <= 5; i++) {
          result.push(i)
        }
        result.push('...')
        result.push(total)
      } else if (current >= total - 2) {
        result.push('...')
        for (let i = total - 4; i <= total; i++) {
          result.push(i)
        }
      } else {
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
    this.initPageData()
  },
  watch: {
    '$route.path'(newPath, oldPath) {
      // 当在 /review 和 /history-video 之间切换时，重新初始化页面数据
      if ((newPath === '/review' && oldPath === '/history-video') ||
          (newPath === '/history-video' && oldPath === '/review')) {
        this.initPageData()
      }
    }
  },
  methods: {
    initPageData() {
      // 重置页面状态
      this.currentPage = 1
      this.currentType = 'WHITE'
      this.search = ''
      this.processedVideos = new Set()
      this.pendingCount = 0
      this.confirmedCount = 0
      this.videoList = []
      this.total = 0
      this.fetchVideoList()
    },
    async fetchVideoList() {
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          handleType: this.currentType,
          search: this.search,
          handle_step: this.isReviewMode ? 1 : 100,
        }
        const response = await api.getAlreadyHandleVideo(params)
        console.log(response)
        if (response.data) {
          this.videoList = response.data.records
          this.total = response.data.total
          this.pendingCount = response.data.total
          // 异步加载缺失的 UP 主信息
          this.loadMissingOwnerInfo()
        }
      } catch (error) {
        console.error('获取视频列表失败:', error)
      }
    },
    /**
     * 异步加载缺失的 UP 主信息
     */
    loadMissingOwnerInfo() {
      this.videoList.forEach(async (video) => {
        // 如果已经有 owner 信息，则跳过
        if (video.owner?.name && video.owner.name !== '-') {
          return
        }
        // 使用视频的 id 字段作为 aid 调用接口获取 UP 主信息
        const aid = video.aid || video.id
        if (aid) {
          try {
            const response = await api.getOwnerByAid(aid)
            if (response.code === 200 && response.data) {
              this.$set(video, 'owner', response.data)
            }
          } catch (error) {
            console.error(`获取视频 ${aid} 的 UP 主信息失败:`, error)
          }
        }
      })
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
        'WHITE': '待点赞',
        'BLACK': '待点踩',
        'OTHER': '待处理'
      }
      return typeMap[type] || '待处理'
    },
    getHandleTypeClass(type) {
      switch (type) {
        case 'WHITE':
          return 'bg-secondary-container text-on-secondary-container'
        case 'BLACK':
          return 'bg-error-container text-on-error-container'
        case 'OTHER':
          return 'bg-surface-container-highest text-on-surface-variant'
        default:
          return 'bg-surface-container-highest text-on-surface-variant'
      }
    },
    getWhiteButtonText(video) {
      if (this.isReviewMode) {
        return video.handle_type === 'WHITE' ? '确认' : '点赞'
      }
      return video.handle_type === 'WHITE' ? '已点赞' : '改为点赞'
    },
    getBlackButtonText(video) {
      if (this.isReviewMode) {
        return video.handle_type === 'BLACK' ? '确认' : '点踩'
      }
      return video.handle_type === 'BLACK' ? '已点踩' : '改为点踩'
    },
    getOtherButtonText(video) {
      if (this.isReviewMode) {
        return video.handle_type === 'OTHER' ? '确认' : '其他'
      }
      return video.handle_type === 'OTHER' ? '已其他' : '改为其他'
    },
    async recheck(video) {
      try {
        const resp = await api.testRule({
          bvid: video.bvid,
          ai_chat_enable: true,
          single_match_enable: true,
          complex_match_enable: true,
        })

        if (resp.code === 200) {
          // 将响应回填到视频的 handle_reason 字段
          this.$set(video, 'handle_reason', resp.data);
          this.activeTooltip = resp.data;
        }
      } catch (error) {
        this.$message('核验失败：' + error.message, 'error')
      }
    },
    closeTooltip() {
      this.activeTooltip = null;
    },
    async handleVideo(video, newHandleType) {
      try {
        if (!this.isReviewMode && video.handle_type === newHandleType) {
          return
        }

        if (!this.isReviewMode) {
          const confirmed = await this.$confirm(
            '确定要纠正之前的处理结果吗？',
            '确认纠正',
            '确定',
            '取消'
          );
          if (!confirmed) {
            return
          }
        }

        const reason = video.handle_type !== newHandleType ? '用户修改为' + newHandleType : undefined
        await api.processVideo(video.id, newHandleType, reason, !this.isReviewMode)

        this.$set(video, 'processed', true)
        this.processedVideos.add(video.id)

        this.pendingCount = Math.max(0, this.pendingCount - 1)
        this.confirmedCount++

        if (this.isReviewMode) {
          const processedCount = this.videoList.filter(video => video.processed === true).length
          if (processedCount === this.videoList.length) {
            this.$message('即将刷新页面', 'success')
            setTimeout(() => {
              this.fetchVideoList()
            }, 500)
          } else {
            this.$message('处理成功', 'success')
          }
        } else {
          this.$message('处理成功', 'success')
        }
      } catch (error) {
        this.$message('处理失败：' + error.message, 'error')
      }
    },
    async handleAllVideos() {
      if (this.isProcessing) return

      try {
        this.isProcessing = true
        const unprocessedVideos = this.videoList.filter(v => !v.processed)

        for (const video of unprocessedVideos) {
          await this.handleVideo(video, video.handle_type)
        }

        this.$message('批量处理完成', 'success')
      } catch (error) {
        this.$message('批量处理失败：' + error.message, 'error')
      } finally {
        this.isProcessing = false
      }
    },
    shouldShowReason(video) {
      return (video.handle_type === 'WHITE' && video.thumbUpReason) ||
        (video.handle_type === 'BLACK' && video.blackReason)
    },
    getReasonText(video) {
      if (video.handle_type === 'WHITE') {
        return video.thumbUpReason
      } else if (video.handle_type === 'BLACK') {
        return video.blackReason
      }
      return ''
    },
    goToBilibili(video) {
      const url = 'https://www.bilibili.com/video/' + video.bvid
      window.open(url, '_blank')
    },
    formatArray(arr) {
      if (!arr || !Array.isArray(arr) || arr.length === 0) {
        return ''
      }
      return arr.join(', ')
    },
    getAccessTypeLabel(type) {
      const typeMap = {
        'WHITE': '白名单',
        'BLACK': '黑名单',
        'UNKNOWN': '未知'
      }
      return typeMap[type] || type
    },
    showHandleReasonDetail(video) {
      // 显示处理原因的 tooltip
      this.activeTooltip = video.handle_reason || { user_handle_reason: '暂无处理原因' };
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchVideoList()
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blur-cover {
  filter: blur(8px);
}

.processed-card {
  position: relative;
  border: 2px solid #4A4458;
}

.processed-card::after {
  content: '已处理';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(74, 68, 88, 0.95);
  color: #E8DEF8;
  padding: 12px 24px;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  z-index: 10;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
