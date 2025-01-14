<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">白名单管理</h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input type="text" v-model="searchQuery" placeholder="搜索白名单..."
                 class="bg-gray-700 text-white px-4 py-2 rounded-full !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
          <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button @click="showAddModal = true"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm whitespace-nowrap">
          <i class="fas fa-plus mr-2"></i>添加白名单
        </button>
      </div>
    </div>

    <!-- 信息提示 -->
    <div class="bg-blue-600 text-white p-4 rounded-lg mb-6">
      <i class="fas fa-info-circle mr-2"></i>
      白名单规则用于自动通过符合条件的内容。请谨慎设置以确保内容质量。
    </div>

    <!-- 白名单列表 -->
    <div class="bg-gray-800 rounded-lg overflow-hidden mb-6">
      <table class="w-full whitelist-management__table">
        <thead>
        <tr class="bg-gray-700">
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
          <td class="px-6 py-4 whitespace-nowrap">{{ item.info }}</td>
          <td class="px-6 py-4">{{ item.tagNameList.join(', ') }}</td>
          <td class="px-6 py-4">{{ item.titleKeyWordList.join(', ') }}</td>
          <td class="px-6 py-4">{{ item.coverKeyword.join(', ') }}</td>
          <td class="px-6 py-4">{{ item.descKeyWordList.join(', ') }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button @click="editWhitelistItem(item)"
                    class="text-blue-400 hover:text-blue-300 mr-3 !rounded-button whitespace-nowrap">
              <i class="fas fa-edit mr-1"></i>编辑
            </button>
            <button @click="deleteWhitelistItem(item)"
                    class="text-red-400 hover:text-red-300 !rounded-button whitespace-nowrap">
              <i class="fas fa-trash-alt mr-1"></i>删除
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加/编辑白名单项模态框 -->
    <div v-if="showAddModal || showEditModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">{{ showAddModal ? '添加白名单' : '编辑白名单' }}</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="ruleName">规则名称</label>
          <input type="text" id="ruleName" v-model="currentItem.info"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="tagNameList">标签关键词（用逗号分隔）</label>
          <input type="text" id="tagNameList" v-model="tagKeywordsInput"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="titleKeyWordList">标题关键词（用逗号分隔）</label>
          <input type="text" id="titleKeyWordList" v-model="titleKeywordsInput"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="coverKeyword">封面关键词（用逗号分隔）</label>
          <input type="text" id="coverKeyword" v-model="coverKeywordsInput"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="descKeyWordList">描述关键词（用逗号分隔）</label>
          <input type="text" id="descKeyWordList" v-model="descriptionKeywordsInput"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md !rounded-button hover:bg-gray-500 whitespace-nowrap">
            取消
          </button>
          <button @click="saveWhitelistItem"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md !rounded-button hover:bg-blue-600 whitespace-nowrap">
            {{ showAddModal ? '添加' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import api from "@/api";

export default {
  name: "white-list-view",
  data() {
    return {
      searchQuery: '',
      showAddModal: false,
      showEditModal: false,
      pageNo:1,
      pageSize:10,
      currentItem: {
        info: '',
        tagNameList: [],
        titleKeyWordList: [],
        coverKeyword: [],
        descKeyWordList: []
      },
      tagKeywordsInput: '',
      titleKeywordsInput: '',
      coverKeywordsInput: '',
      descriptionKeywordsInput: '',
      whitelist: [
        {
          id: 1,
          info: '教育内容',
          tagNameList: ['教育', '学习', '知识'],
          titleKeyWordList: ['课程', '教程', '学习方法'],
          coverKeyword: ['书籍', '黑板', '学生'],
          descKeyWordList: ['提高', '技能', '专业知识']
        },
        {
          id: 2,
          info: '科技新闻',
          tagNameList: ['科技', 'IT', '创新'],
          titleKeyWordList: ['发布', '更新', '革命性'],
          coverKeyword: ['设备', '芯片', '数据'],
          descKeyWordList: ['突破', '领先', '改变世界']
        },
        {
          id: 3,
          info: '健康生活',
          tagNameList: ['健康', '养生', '运动'],
          titleKeyWordList: ['健康饮食', '锻炼方法', '心理健康'],
          coverKeyword: ['蔬菜', '运动器材', '瑜伽'],
          descKeyWordList: ['营养', '体重管理', '压力缓解']
        },
        {
          id: 4,
          info: '旅游探索',
          tagNameList: ['旅游', '探险', '文化'],
          titleKeyWordList: ['景点推荐', '旅行攻略', '文化体验'],
          coverKeyword: ['风景', '地标', '美食'],
          descKeyWordList: ['独特体验', '当地风情', '历史遗迹']
        },
        {
          id: 5,
          info: '财经资讯',
          tagNameList: ['财经', '投资', '经济'],
          titleKeyWordList: ['市场分析', '投资策略', '经济政策'],
          coverKeyword: ['股市', '货币', '图表'],
          descKeyWordList: ['风险管理', '理财', '经济增长']
        }
      ]
    };
  },
  computed: {
    filteredWhitelist() {
      const query = this.searchQuery.toLowerCase();
      console.log(this.whitelist);
      return this.whitelist.filter(item =>

          {

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
    }
  },
  mounted() {

    this.fetchWhitelist();
  },
  methods: {
    async fetchWhitelist() {

      try {
        const response = await api.getWhiteRuleList(this.pageNo, this.pageSize);
        this.whitelist = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },
    async fetchData(type) {
      try {
        const [accessType, dictType] = type.split(',');
        const response = await api.getDictList(accessType, dictType);
        this.arrData[type] = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },

    /**
     * 添加关键词
     * @param accessType
     * @param dictType
     * @param keywordItem
     * @returns {Promise<void>}
     */
    async addKeyword(accessType, dictType, keywordItem) {
      try {
        const response = await api.addDict(keywordItem);
        if (!response.success) {
          this.$message({
            message: response.message,
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }
    },
    /**
     * 删除关键词
     * @param accessType
     * @param dictType
     * @param keywordItem
     * @returns {Promise<void>}
     */
    async removeKeyword(accessType, dictType, keywordItem) {

      try {
        const response = await api.delDictById(keywordItem.id);
        if (!response.success) {
          this.$message({
            message: response.message,
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }
    },
    editWhitelistItem(item) {
      this.currentItem = {...item};
      this.tagKeywordsInput = item.tagNameList.join(', ');
      this.titleKeywordsInput = item.titleKeyWordList.join(', ');
      this.coverKeywordsInput = item.coverKeyword.join(', ');
      this.descriptionKeywordsInput = item.descKeyWordList.join(', ');
      this.showEditModal = true;
    },
    deleteWhitelistItem(item) {
      if (confirm(`确定要删除名为"${item.info}"的白名单规则吗？`)) {
        this.whitelist = this.whitelist.filter(i => i.id !== item.id);
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.resetForm();
    },
    resetForm() {
      this.currentItem = {
        info: '',
        tagNameList: [],
        titleKeyWordList: [],
        coverKeyword: [],
        descKeyWordList: []
      };
      this.tagKeywordsInput = '';
      this.titleKeywordsInput = '';
      this.coverKeywordsInput = '';
      this.descriptionKeywordsInput = '';
    },
    saveWhitelistItem() {
      const newItem = {
        ...this.currentItem,
        tagNameList: this.tagKeywordsInput.split(',').map(k => k.trim()).filter(k => k),
        titleKeyWordList: this.titleKeywordsInput.split(',').map(k => k.trim()).filter(k => k),
        coverKeyword: this.coverKeywordsInput.split(',').map(k => k.trim()).filter(k => k),
        descKeyWordList: this.descriptionKeywordsInput.split(',').map(k => k.trim()).filter(k => k)
      };

      if (this.showAddModal) {
        newItem.id = this.whitelist.length + 1;
        this.whitelist.push(newItem);
      } else {
        const index = this.whitelist.findIndex(item => item.id === this.currentItem.id);
        if (index !== -1) {
          this.whitelist[index] = newItem;
          this.$set(this.whitelist, index, newItem)
        }
      }
      this.closeModal();
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
