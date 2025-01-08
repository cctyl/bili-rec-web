<template>

    <!-- 主内容区 -->
    <div class="flex-1 p-8 overflow-y-auto">
      <h2 class="text-2xl font-bold mb-8">黑名单管理</h2>

      <!-- 信息提示 -->
      <div class="bg-red-600 text-white p-4 rounded-lg mb-6">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        黑名单规则用于自动拦截符合条件的内容。请谨慎设置以避免误判。
      </div>

      <!-- 黑名单关键词列表 -->
      <div class="mb-8">
        <h3 class="text-xl font-bold mb-4">黑名单关键词</h3>
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex mb-4">
            <input v-model="newKeyword" type="text" placeholder="添加新关键词" class="flex-grow bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button @click="addKeyword" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              <i class="fas fa-plus mr-2"></i>添加
            </button>
          </div>
          <div class="flex flex-wrap">
            <div v-for="keyword in blacklistKeywords" :key="keyword" class="bg-gray-700 text-white px-3 py-1 rounded-full !rounded-button mr-2 mb-2 flex items-center">
              {{ keyword }}
              <button @click="removeKeyword(keyword)" class="ml-2 text-red-400 hover:text-red-300 focus:outline-none">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 黑名单分区ID列表 -->
      <div class="mb-8">
        <h3 class="text-xl font-bold mb-4">黑名单分区 ID</h3>
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex mb-4">
            <input v-model="newSectionId" type="number" placeholder="添加新分区 ID" class="flex-grow bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button @click="addSectionId" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              <i class="fas fa-plus mr-2"></i>添加
            </button>
          </div>
          <div class="flex flex-wrap">
            <div v-for="id in blacklistSectionIds" :key="id" class="bg-gray-700 text-white px-3 py-1 rounded-full !rounded-button mr-2 mb-2 flex items-center">
              {{ id }}
              <button @click="removeSectionId(id)" class="ml-2 text-red-400 hover:text-red-300 focus:outline-none">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 黑名单UP主ID列表 -->
      <div class="mb-8">
        <h3 class="text-xl font-bold mb-4">黑名单 UP 主 ID</h3>
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex mb-4">
            <input v-model="newUploaderId" type="number" placeholder="添加新 UP 主 ID" class="flex-grow bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button @click="addUploaderId" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              <i class="fas fa-plus mr-2"></i>添加
            </button>
          </div>
          <div class="flex flex-wrap">
            <div v-for="id in blacklistUploaderIds" :key="id" class="bg-gray-700 text-white px-3 py-1 rounded-full !rounded-button mr-2 mb-2 flex items-center">
              {{ id }}
              <button @click="removeUploaderId(id)" class="ml-2 text-red-400 hover:text-red-300 focus:outline-none">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  name:"black-list-view",
  data() {
    return {
      blacklistKeywords: ['暴力', '色情', '赌博', '诈骗', '违法'],
      blacklistSectionIds: [1001, 1002, 1003],
      blacklistUploaderIds: [12345, 67890, 24680],
      newKeyword: '',
      newSectionId: '',
      newUploaderId: ''
    };
  },
  methods: {
    addKeyword() {
      if (this.newKeyword && !this.blacklistKeywords.includes(this.newKeyword)) {
        this.blacklistKeywords.push(this.newKeyword);
        this.newKeyword = '';
      }
    },
    removeKeyword(keyword) {
      this.blacklistKeywords = this.blacklistKeywords.filter(k => k !== keyword);
    },
    addSectionId() {
      const id = parseInt(this.newSectionId);
      if (id && !this.blacklistSectionIds.includes(id)) {
        this.blacklistSectionIds.push(id);
        this.newSectionId = '';
      }
    },
    removeSectionId(id) {
      this.blacklistSectionIds = this.blacklistSectionIds.filter(sectionId => sectionId !== id);
    },
    addUploaderId() {
      const id = parseInt(this.newUploaderId);
      if (id && !this.blacklistUploaderIds.includes(id)) {
        this.blacklistUploaderIds.push(id);
        this.newUploaderId = '';
      }
    },
    removeUploaderId(id) {
      this.blacklistUploaderIds = this.blacklistUploaderIds.filter(uploaderId => uploaderId !== id);
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
</style>

