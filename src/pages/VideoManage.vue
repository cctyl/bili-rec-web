<template>
  <div class="min-h-screen overflow-y-auto bg-gray-900" style="width: 100%">
    <main class="max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-2rem)]">
      <div class="mb-8 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-white">{{ pageTitle }}</h1>
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
        <div class="flex items-center space-x-6">
          <!-- 搜索框 -->
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
          <!-- 待审核模式显示计数器 -->
          <template v-if="isReviewMode">
            <div class="flex items-center">
              <span class="text-yellow-500">
                <i class="fas fa-clock mr-2"></i>
                待处理:
              </span>
              <span class="ml-2 text-xl font-bold text-yellow-400">{{ pendingCount }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500">
                <i class="fas fa-check-circle mr-2"></i>
                已确认:
              </span>
              <span class="ml-2 text-xl font-bold text-green-400">{{ confirmedCount }}</span>
            </div>
          </template>
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
          >
            <div class="relative" @click="goToBilibili(video)">
              <img
                  :src="$getPic(video.pic)"
                  :class="[
                  'w-full h-48 object-cover rounded-lg',
                  video.handle_type === 'BLACK' ? 'blur-cover' : ''
                ]"
                  :alt="video.title"
              >
              <span v-if="isReviewMode" :class="[
                'absolute top-2 right-2 px-2 py-1 text-xs !rounded-button',
                `tag-${video.handle_type.toLowerCase()}`
              ]">{{ getHandleTypeLabel(video.handle_type) }}</span>
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
                  'text-green-400': video.handle_type === 'WHITE',
                  'text-red-400': video.handle_type === 'BLACK'
                }" v-html="getReasonText(video)">
                </span>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex space-x-2">
                  <button
                      :disabled="video.processed"
                      @click.stop="handleVideo(video, 'WHITE')"
                      :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap',
                      video.handle_type === 'WHITE'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : (isReviewMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' : 'border border-gray-600 text-gray-800 bg-orange-200')
                    ]"
                  >
                    <i class="fas fa-thumbs-up mr-2"></i>
                    {{ getWhiteButtonText(video) }}
                  </button>
                  <button
                      :disabled="video.processed"
                      @click.stop="handleVideo(video, 'BLACK')"
                      :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap',
                      video.handle_type === 'BLACK'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : (isReviewMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' : 'border border-gray-600 text-gray-800 bg-orange-200')
                    ]"
                  >
                    <i class="fas fa-thumbs-down mr-2"></i>
                    {{ getBlackButtonText(video) }}
                  </button>
                  <button
                      :disabled="video.processed"
                      @click.stop="handleVideo(video, 'OTHER')"
                      :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap',
                      video.handle_type === 'OTHER'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : (isReviewMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' : 'border border-gray-600 text-gray-800 bg-orange-200')
                    ]"
                  >
                    <i class="fas fa-question-circle mr-2"></i>
                    {{ getOtherButtonText(video) }}
                  </button>
                  <button
                      @click.stop="recheck(video)"
                      :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap relative',
                      'bg-purple-500 text-white hover:bg-purple-600'
                    ]"
                  >
                    <i class="fas fa-sync-alt mr-2"></i>
                    重新核验
                    <!-- 添加 tooltip -->
                    <div v-if="video.recheckResult"
                         class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96"
                         style="pointer-events: auto;"
                    >
                      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-lg text-sm border border-gray-700">
                        <!-- AI 匹配结果 -->
                        <div v-if="video.matchResult.ai_match" class="mb-3 pb-3 border-b border-gray-700">
                          <div class="flex items-center mb-2">
                            <i class="fas fa-robot mr-2" style="color: #8B5CF6;"></i>
                            <span class="font-medium">AI 识别结果</span>
                          </div>
                          <div class="flex items-center text-gray-300 mb-1">
                            <span class="text-gray-400 mr-2">类型：</span>
                            <span>{{ getAccessTypeLabel(video.matchResult.ai_match.match_type) }}</span>
                          </div>
                          <div class="flex items-start text-gray-300">
                            <span class="text-gray-400 mr-2 mt-0.5">原因：</span>
                            <span>{{ video.matchResult.ai_match.reason }}</span>
                          </div>
                        </div>

                        <!-- 单次匹配结果 -->
                        <div v-if="video.matchResult.single_match" class="mb-3 pb-3 border-b border-gray-700">
                          <div class="flex items-center mb-2">
                            <i class="fas fa-crosshairs mr-2" style="color: #3B82F6;"></i>
                            <span class="font-medium">单次规则匹配</span>
                            <span v-if="video.matchResult.single_match.match_type" class="ml-2 px-2 py-0.5 text-xs rounded" :class="{
                              'bg-green-600 text-white': video.matchResult.single_match.match_type === 'WHITE',
                              'bg-red-600 text-white': video.matchResult.single_match.match_type === 'BLACK'
                            }">
                              {{ getAccessTypeLabel(video.matchResult.single_match.match_type) }}
                            </span>
                          </div>
                          <div class="space-y-1 text-gray-300">
                            <div v-if="video.matchResult.single_match.mid && video.matchResult.single_match.mid.length > 0">
                              <span class="text-gray-400 mr-2">UP主：</span>
                              <span>{{ formatArray(video.matchResult.single_match.mid) }}</span>
                            </div>
                            <div v-if="video.matchResult.single_match.tid && video.matchResult.single_match.tid.length > 0">
                              <span class="text-gray-400 mr-2">分区：</span>
                              <span>{{ formatArray(video.matchResult.single_match.tid) }}</span>
                            </div>
                            <div v-if="video.matchResult.single_match.title && video.matchResult.single_match.title.length > 0">
                              <span class="text-gray-400 mr-2">标题：</span>
                              <span>{{ formatArray(video.matchResult.single_match.title) }}</span>
                            </div>
                            <div v-if="video.matchResult.single_match.desc && video.matchResult.single_match.desc.length > 0">
                              <span class="text-gray-400 mr-2">描述：</span>
                              <span>{{ formatArray(video.matchResult.single_match.desc) }}</span>
                            </div>
                            <div v-if="video.matchResult.single_match.tag && video.matchResult.single_match.tag.length > 0">
                              <span class="text-gray-400 mr-2">标签：</span>
                              <span>{{ formatArray(video.matchResult.single_match.tag) }}</span>
                            </div>
                            <div v-if="video.matchResult.single_match.cover && video.matchResult.single_match.cover.length > 0">
                              <span class="text-gray-400 mr-2">封面：</span>
                              <span>{{ formatArray(video.matchResult.single_match.cover) }}</span>
                            </div>
                            <div v-if="video.matchResult.single_match.match_count !== undefined">
                              <span class="text-gray-400 mr-2">匹配数：</span>
                              <span>{{ video.matchResult.single_match.match_count }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 复杂匹配结果 -->
                        <div v-if="video.matchResult.complex_match" class="mb-3 pb-3 border-b border-gray-700">
                          <div class="flex items-center mb-2">
                            <i class="fas fa-project-diagram mr-2" style="color: #10B981;"></i>
                            <span class="font-medium">复杂规则匹配</span>
                            <span v-if="video.matchResult.complex_match.match_type" class="ml-2 px-2 py-0.5 text-xs rounded" :class="{
                              'bg-green-600 text-white': video.matchResult.complex_match.match_type === 'WHITE',
                              'bg-red-600 text-white': video.matchResult.complex_match.match_type === 'BLACK'
                            }">
                              {{ getAccessTypeLabel(video.matchResult.complex_match.match_type) }}
                            </span>
                          </div>
                          <div class="space-y-1 text-gray-300">
                            <div v-if="video.matchResult.complex_match.list_rule && video.matchResult.complex_match.list_rule.length > 0">
                              <span class="text-gray-400 mr-2">联合规则：</span>
                              <span>{{ formatArray(video.matchResult.complex_match.list_rule) }}</span>
                            </div>
                            <div v-if="video.matchResult.complex_match.title_or_desc && video.matchResult.complex_match.title_or_desc.length > 0">
                              <span class="text-gray-400 mr-2">标题或描述：</span>
                              <span>{{ formatArray(video.matchResult.complex_match.title_or_desc) }}</span>
                            </div>
                            <div v-if="video.matchResult.complex_match.tag_or_desc && video.matchResult.complex_match.tag_or_desc.length > 0">
                              <span class="text-gray-400 mr-2">标签或描述：</span>
                              <span>{{ formatArray(video.matchResult.complex_match.tag_or_desc) }}</span>
                            </div>
                            <div v-if="video.matchResult.complex_match.match_count !== undefined">
                              <span class="text-gray-400 mr-2">匹配数：</span>
                              <span>{{ video.matchResult.complex_match.match_count }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 用户处理原因 -->
                        <div v-if="video.matchResult.user_handle_reason" class="text-gray-300">
                          <div class="flex items-start">
                            <i class="fas fa-user-edit mr-2 mt-0.5" style="color: #F59E0B;"></i>
                            <div>
                              <span class="text-gray-400 mr-2">处理原因：</span>
                              <span>{{ video.matchResult.user_handle_reason }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 无匹配结果提示 -->
                        <div v-if="!video.matchResult.ai_match && !video.matchResult.single_match && !video.matchResult.complex_match && !video.matchResult.user_handle_reason" class="text-gray-400">
                          <i class="fas fa-info-circle mr-2"></i>未匹配任何规则
                        </div>
                      </div>
                      <div class="tooltip-arrow"></div>
                    </div>
                  </button>
                  <!-- 查看处理原因按钮 -->
                  <button
                      v-if="isReviewMode"
                      @click.stop="showHandleReasonDetail(video)"
                      :class="[
                      'px-4 py-2 !rounded-button whitespace-nowrap relative',
                      'bg-orange-500 text-white hover:bg-orange-600'
                    ]"
                  >
                    <i class="fas fa-info-circle mr-2"></i>
                    处理原因
                    <!-- 处理原因详情 tooltip -->
                    <div v-if="video.showingHandleReason"
                         class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96"
                         style="pointer-events: auto;"
                    >
                      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-lg text-sm border border-gray-700">
                        <!-- AI 匹配结果 -->
                        <div v-if="video.handleReasonData?.ai_match" class="mb-3 pb-3 border-b border-gray-700">
                          <div class="flex items-center mb-2">
                            <i class="fas fa-robot mr-2" style="color: #8B5CF6;"></i>
                            <span class="font-medium">AI 识别结果</span>
                          </div>
                          <div class="flex items-center text-gray-300 mb-1">
                            <span class="text-gray-400 mr-2">类型：</span>
                            <span>{{ getAccessTypeLabel(video.handleReasonData.ai_match.match_type) }}</span>
                          </div>
                          <div class="flex items-start text-gray-300">
                            <span class="text-gray-400 mr-2 mt-0.5">原因：</span>
                            <span>{{ video.handleReasonData.ai_match.reason }}</span>
                          </div>
                        </div>

                        <!-- 单次匹配结果 -->
                        <div v-if="video.handleReasonData?.single_match" class="mb-3 pb-3 border-b border-gray-700">
                          <div class="flex items-center mb-2">
                            <i class="fas fa-crosshairs mr-2" style="color: #3B82F6;"></i>
                            <span class="font-medium">单次规则匹配</span>
                            <span v-if="video.handleReasonData.single_match.match_type" class="ml-2 px-2 py-0.5 text-xs rounded" :class="{
                              'bg-green-600 text-white': video.handleReasonData.single_match.match_type === 'WHITE',
                              'bg-red-600 text-white': video.handleReasonData.single_match.match_type === 'BLACK'
                            }">
                              {{ getAccessTypeLabel(video.handleReasonData.single_match.match_type) }}
                            </span>
                          </div>
                          <div class="space-y-1 text-gray-300">
                            <div v-if="video.handleReasonData.single_match.mid && video.handleReasonData.single_match.mid.length > 0">
                              <span class="text-gray-400 mr-2">UP主：</span>
                              <span>{{ formatArray(video.handleReasonData.single_match.mid) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.single_match.tid && video.handleReasonData.single_match.tid.length > 0">
                              <span class="text-gray-400 mr-2">分区：</span>
                              <span>{{ formatArray(video.handleReasonData.single_match.tid) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.single_match.title && video.handleReasonData.single_match.title.length > 0">
                              <span class="text-gray-400 mr-2">标题：</span>
                              <span>{{ formatArray(video.handleReasonData.single_match.title) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.single_match.desc && video.handleReasonData.single_match.desc.length > 0">
                              <span class="text-gray-400 mr-2">描述：</span>
                              <span>{{ formatArray(video.handleReasonData.single_match.desc) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.single_match.tag && video.handleReasonData.single_match.tag.length > 0">
                              <span class="text-gray-400 mr-2">标签：</span>
                              <span>{{ formatArray(video.handleReasonData.single_match.tag) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.single_match.cover && video.handleReasonData.single_match.cover.length > 0">
                              <span class="text-gray-400 mr-2">封面：</span>
                              <span>{{ formatArray(video.handleReasonData.single_match.cover) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.single_match.match_count !== undefined">
                              <span class="text-gray-400 mr-2">匹配数：</span>
                              <span>{{ video.handleReasonData.single_match.match_count }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 复杂匹配结果 -->
                        <div v-if="video.handleReasonData?.complex_match" class="mb-3 pb-3 border-b border-gray-700">
                          <div class="flex items-center mb-2">
                            <i class="fas fa-project-diagram mr-2" style="color: #10B981;"></i>
                            <span class="font-medium">复杂规则匹配</span>
                            <span v-if="video.handleReasonData.complex_match.match_type" class="ml-2 px-2 py-0.5 text-xs rounded" :class="{
                              'bg-green-600 text-white': video.handleReasonData.complex_match.match_type === 'WHITE',
                              'bg-red-600 text-white': video.handleReasonData.complex_match.match_type === 'BLACK'
                            }">
                              {{ getAccessTypeLabel(video.handleReasonData.complex_match.match_type) }}
                            </span>
                          </div>
                          <div class="space-y-1 text-gray-300">
                            <div v-if="video.handleReasonData.complex_match.rule_name">
                              <span class="text-gray-400 mr-2">规则名称：</span>
                              <span>{{ video.handleReasonData.complex_match.rule_name }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.list_rule && video.handleReasonData.complex_match.list_rule.length > 0">
                              <span class="text-gray-400 mr-2">联合规则：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.list_rule) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.title_or_desc && video.handleReasonData.complex_match.title_or_desc.length > 0">
                              <span class="text-gray-400 mr-2">标题或描述：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.title_or_desc) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.tag_or_desc && video.handleReasonData.complex_match.tag_or_desc.length > 0">
                              <span class="text-gray-400 mr-2">标签或描述：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.tag_or_desc) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.mid && video.handleReasonData.complex_match.mid.length > 0">
                              <span class="text-gray-400 mr-2">UP主：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.mid) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.tid && video.handleReasonData.complex_match.tid.length > 0">
                              <span class="text-gray-400 mr-2">分区：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.tid) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.title && video.handleReasonData.complex_match.title.length > 0">
                              <span class="text-gray-400 mr-2">标题：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.title) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.desc && video.handleReasonData.complex_match.desc.length > 0">
                              <span class="text-gray-400 mr-2">描述：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.desc) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.tag && video.handleReasonData.complex_match.tag.length > 0">
                              <span class="text-gray-400 mr-2">标签：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.tag) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.cover && video.handleReasonData.complex_match.cover.length > 0">
                              <span class="text-gray-400 mr-2">封面：</span>
                              <span>{{ formatArray(video.handleReasonData.complex_match.cover) }}</span>
                            </div>
                            <div v-if="video.handleReasonData.complex_match.match_count !== undefined">
                              <span class="text-gray-400 mr-2">匹配数：</span>
                              <span>{{ video.handleReasonData.complex_match.match_count }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 用户处理原因 -->
                        <div v-if="video.handleReasonData?.user_handle_reason" class="text-gray-300">
                          <div class="flex items-start">
                            <i class="fas fa-user-edit mr-2 mt-0.5" style="color: #F59E0B;"></i>
                            <div>
                              <span class="text-gray-400 mr-2">处理原因：</span>
                              <span>{{ video.handleReasonData.user_handle_reason }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 无处理原因提示 -->
                        <div v-if="!video.handleReasonData?.ai_match && !video.handleReasonData?.single_match && !video.handleReasonData?.complex_match && !video.handleReasonData?.user_handle_reason" class="text-gray-400">
                          <i class="fas fa-info-circle mr-2"></i>暂无原因
                        </div>
                      </div>
                      <div class="tooltip-arrow"></div>
                    </div>
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
          <p class="text-gray-400 text-lg">{{ emptyText }}</p>
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
              >{{ item }}
              </button>
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

    <!-- 待审核模式下显示悬浮固定的一键处理按钮 -->
    <button
        v-if="isReviewMode"
        @click="handleAllVideos"
        :disabled="!videoList.length || isProcessing"
        class="fixed-process-btn"
    >
      <i class="fas fa-magic mr-2"></i>
      <span>一键处理</span>
      <span v-if="isProcessing" class="ml-2">
        <i class="fas fa-circle-notch fa-spin"></i>
      </span>
    </button>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'video-manage-page',
  props: {
    mode: {
      type: String,
      default: 'review', // 'review' 或 'history'
      validator: value => ['review', 'history'].includes(value)
    }
  },
  data() {
    return {
      handleTypes: [
        {value: 'WHITE', label: '已点赞'},
        {value: 'BLACK', label: '已点踩'},
        {value: '', label: '全部'},
        {value: 'OTHER', label: '其他'}
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
    }
  },
  computed: {
    isReviewMode() {
      return this.mode === 'review'
    },
    pageTitle() {
      return this.isReviewMode ? '待审核视频' : '历史处理过的视频'
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
    this.fetchVideoList()
  },
  methods: {
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
        'WHITE': '待点赞',
        'BLACK': '待点踩',
        'OTHER': '待处理'
      }
      return typeMap[type] || '待处理'
    },
    getWhiteButtonText(video) {
      if (this.isReviewMode) {
        return video.handle_type === 'WHITE' ? '确认点赞' : '点赞'
      }
      return video.handle_type === 'WHITE' ? '历史点赞' : '纠正为：点赞'
    },
    getBlackButtonText(video) {
      if (this.isReviewMode) {
        return video.handle_type === 'BLACK' ? '确认点踩' : '点踩'
      }
      return video.handle_type === 'BLACK' ? '历史点踩' : '纠正为：点踩'
    },
    getOtherButtonText(video) {
      if (this.isReviewMode) {
        return video.handle_type === 'OTHER' ? '确认其他' : '其他'
      }
      return video.handle_type === 'OTHER' ? '历史其他' : '纠正为：其他'
    },
    async recheck(video) {
      try {
        let resp
        if (this.isReviewMode) {
          resp = await api.testRule({
            bvid: video.bvid,
            ai_chat_enable: true,
            single_match_enable: true,
            complex_match_enable: true,
          })
        } else {
          resp = await api.checkVideo(video.bvid)
        }

        if (resp.code === 200) {
          this.$set(video, 'recheckResult', true)
          if (this.isReviewMode) {
            this.$set(video, 'matchResult', resp.data)
          } else {
            this.$set(video, 'whiteResult', resp.data.whiteResult)
            this.$set(video, 'blackResult', resp.data.blackResult)
            this.$set(video, 'thumbUpReason', resp.data.thumbUpReason)
            this.$set(video, 'blackReason', resp.data.blackReason)
          }

          setTimeout(() => {
            this.$set(video, 'recheckResult', null)
            if (this.isReviewMode) {
              this.$set(video, 'matchResult', null)
            } else {
              this.$set(video, 'whiteResult', null)
              this.$set(video, 'blackResult', null)
            }
          }, 6000)
        }
      } catch (error) {
        this.$message('核验失败：' + error.message, 'error')
      }
    },
    async handleVideo(video, newHandleType) {
      try {
        // 历史模式下，如果类型相同则直接返回
        if (!this.isReviewMode && video.handle_type === newHandleType) {
          return
        }

        // 历史模式下需要确认
        if (!this.isReviewMode) {
          const flag = confirm("确定要纠正之前的处理结果吗？")
          if (!flag) {
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
      api.watchVideo(video.aid)
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
      if (video.showingHandleReason) {
        this.$set(video, 'showingHandleReason', false)
        return
      }

      const handleReasonData = video.handle_reason

      this.$set(video, 'showingHandleReason', true)
      this.$set(video, 'handleReasonData', handleReasonData)

      setTimeout(() => {
        this.$set(video, 'showingHandleReason', false)
        this.$set(video, 'handleReasonData', null)
      }, 6000)
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchVideoList()
    }
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

/* 添加悬浮按钮样式 */
.fixed-process-btn {
  position: fixed;
  right: 40px;
  bottom: 40px;
  padding: 16px 24px;
  background: linear-gradient(to right, #3B82F6, #2563EB);
  color: white;
  font-weight: 500;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fixed-process-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(to right, #2563EB, #1D4ED8);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.6);
}

.fixed-process-btn:disabled {
  background: linear-gradient(to right, #4B5563, #6B7280);
  transform: none;
  box-shadow: none;
}

.tooltip {
  z-index: 1000;
  pointer-events: none;
}

.tooltip-arrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px 8px 0;
  border-style: solid;
  border-color: rgb(31, 41, 55) transparent transparent transparent;
}

.tooltip .bg-gray-800 {
  position: relative;
  border: 1px solid rgb(55, 65, 81);
  max-height: 400px;
  overflow-y: auto;
}
</style>
