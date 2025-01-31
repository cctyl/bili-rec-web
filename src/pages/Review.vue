<template>
  <div class="min-h-screen overflow-y-auto bg-gray-900" >
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-white">待审核视频</h1>
          <div class="flex space-x-2">
            <span class="px-3 py-1 text-sm !rounded-button bg-blue-600 text-white">全部</span>
            <span class="px-3 py-1 text-sm !rounded-button bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer">待审核</span>
            <span class="px-3 py-1 text-sm !rounded-button bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer">已审核</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 video-card">
          <div class="relative">
            <img src="https://ai-public.mastergo.com/ai/img_res/6dddae482a7e73acee20fc4554293e64.jpg" class="w-full h-48 object-cover rounded-lg" alt="视频封面">
            <span class="absolute top-2 right-2 px-2 py-1 text-xs tag-white !rounded-button">白名单</span>
            <span class="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black bg-opacity-60 text-white !rounded-button">12:34</span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-white line-clamp-2">【钢琴】春日暖阳下的《梦中的婚礼》演奏视频</h3>
            <div class="mt-2 flex items-center text-sm text-gray-400">
              <img src="https://ai-public.mastergo.com/ai/img_res/628a23871748d15f6ab7be727ff11d73.jpg" class="w-6 h-6 rounded-full" alt="UP主头像">
              <span class="ml-2">音乐小天使</span>
              <span class="mx-2">·</span>
              <span>播放 23.5万</span>
            </div>
            <p class="mt-2 text-sm text-gray-400 line-clamp-2">分享一段在阳光明媚的下午录制的钢琴演奏视频，希望这优美的旋律能带给大家一份温暖与感动。</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-check mr-2"></i>确认白名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-ban mr-2"></i>加入黑名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-question-circle mr-2"></i>其他
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 video-card">
          <div class="relative">
            <img src="https://ai-public.mastergo.com/ai/img_res/5fe10c52bd3c0555e1243640ed4f8947.jpg" class="w-full h-48 object-cover rounded-lg" alt="视频封面">
            <span class="absolute top-2 right-2 px-2 py-1 text-xs tag-black !rounded-button">黑名单</span>
            <span class="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black bg-opacity-60 text-white !rounded-button">18:22</span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-white line-clamp-2">【游戏实况】最新版本绝地求生精彩时刻集锦</h3>
            <div class="mt-2 flex items-center text-sm text-gray-400">
              <img src="https://ai-public.mastergo.com/ai/img_res/4391e2fa2659e99889f5a8c943a2eb1f.jpg" class="w-6 h-6 rounded-full" alt="UP主头像">
              <span class="ml-2">游戏达人小王</span>
              <span class="mx-2">·</span>
              <span>播放 15.8万</span>
            </div>
            <p class="mt-2 text-sm text-gray-400 line-clamp-2">本期为大家带来最新版本的精彩操作集锦，包含多个惊险刺激的对局回放，让我们一起来感受游戏的魅力！</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-check mr-2"></i>确认黑名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-check-circle mr-2"></i>加入白名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-question-circle mr-2"></i>其他
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 video-card">
          <div class="relative">
            <img src="https://ai-public.mastergo.com/ai/img_res/1e383c8e6d8eeecaa0e4cf1e3e097165.jpg" class="w-full h-48 object-cover rounded-lg" alt="视频封面">
            <span class="absolute top-2 right-2 px-2 py-1 text-xs tag-other !rounded-button">待定</span>
            <span class="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black bg-opacity-60 text-white !rounded-button">08:45</span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-white line-clamp-2">【美食】传统川菜红烧牛肉的完美还原</h3>
            <div class="mt-2 flex items-center text-sm text-gray-400">
              <img src="https://ai-public.mastergo.com/ai/img_res/857fd28b651fa1cce7382ee620f3270b.jpg" class="w-6 h-6 rounded-full" alt="UP主头像">
              <span class="ml-2">厨艺大师张师傅</span>
              <span class="mx-2">·</span>
              <span>播放 8.2万</span>
            </div>
            <p class="mt-2 text-sm text-gray-400 line-clamp-2">今天为大家带来正宗的川菜红烧牛肉制作方法，从选材到最后的摆盘，每一步都很重要，一起来学习吧！</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-check mr-2"></i>确认其他
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-check-circle mr-2"></i>加入白名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-ban mr-2"></i>加入黑名单
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 video-card">
          <div class="relative">
            <img src="https://ai-public.mastergo.com/ai/img_res/58d722a1007768291fa5f7ce7bfe4e7d.jpg" class="w-full h-48 object-cover rounded-lg" alt="视频封面">
            <span class="absolute top-2 right-2 px-2 py-1 text-xs tag-white !rounded-button">白名单</span>
            <span class="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black bg-opacity-60 text-white !rounded-button">15:30</span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-white line-clamp-2">【旅行】苏州园林之美 - 拙政园春日游记</h3>
            <div class="mt-2 flex items-center text-sm text-gray-400">
              <img src="https://ai-public.mastergo.com/ai/img_res/28186f7106b294a45877d009c5cbebbb.jpg" class="w-6 h-6 rounded-full" alt="UP主头像">
              <span class="ml-2">漫游记录者</span>
              <span class="mx-2">·</span>
              <span>播放 12.3万</span>
            </div>
            <p class="mt-2 text-sm text-gray-400 line-clamp-2">春日游览苏州拙政园，感受中国古典园林的精髓，带您领略江南园林之美，体验传统文化的魅力。</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-check mr-2"></i>确认白名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-ban mr-2"></i>加入黑名单
                </button>
                <button class="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 !rounded-button whitespace-nowrap">
                  <i class="fas fa-question-circle mr-2"></i>其他
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700 disabled:opacity-50" disabled>
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="px-3 py-2 bg-blue-600 text-white !rounded-button">1</button>
          <button class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700">2</button>
          <button class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700">3</button>
          <button class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700">4</button>
          <button class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700">5</button>
          <button class="px-3 py-2 border border-gray-600 text-gray-300 !rounded-button hover:bg-gray-700">
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'review-page'
}
</script>

<style scoped>
.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
</style>