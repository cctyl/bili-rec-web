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

    <!-- 白名单联合规则列表 -->
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



    <!-- 白名单关键词列表 -->
    <KeywordListComponent
        hint="添加新关键词"
        title="白名单关键词"
        :keyword-list-prop="arrData"
        type="WHITE,KEYWORD"
        desc="当 视频标题 或 视频简介 中包含以下关键词时，将判断为白名单"
        :add="addKeyword"
        :remove="removeKeyword"
    >

    </KeywordListComponent>

    <!-- 白名单用户id -->
    <KeywordListComponent
            hint="添加新关键词"
            title="白名单用户id"
            :keyword-list-prop="arrData"
            type="WHITE,MID"
            desc="当 视频 UP 主 ID 为以下 ID 时，将自动点赞"
            :add="addKeyword"
            :remove="removeKeyword"
            ref="WhiteMIDKeywordListComponent"
    >

      <button
              @click="urlAddMid"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
        <i class="fas fa-link mr-2"></i>使用对方个人主页url添加
      </button>

    </KeywordListComponent>



    <!-- 白名单分区ID列表 -->
    <KeywordListComponent
        hint="添加新分区 ID"
        title="白名单分区 ID"
        :keyword-list-prop="arrData"
        type="WHITE,TID"
        desc="当 视频分区 ID 为以下 ID 时，将自动点赞"
        :add="addKeyword"
        :remove="removeKeyword"
    >

      <button
          @click="showTidModal = true  "
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
        <i class="fas fa-plus mr-2"></i>从记录的分区中选择
      </button>

    </KeywordListComponent>

    <!-- 白名单标签列表 -->
    <KeywordListComponent
        hint="添加新标签 "
        title="白名单标签"
        :keyword-list-prop="arrData"

        type="WHITE,TAG"
        desc="当 视频标签 中包含以下任意标签时，将判断为白名单"
        :add="addKeyword"
        :remove="removeKeyword"
    ></KeywordListComponent>

    <!-- 忽略的关键词列表 -->
    <KeywordListComponent
        hint="添加新关键词"
        title="忽略的关键词"
        :keyword-list-prop="arrData"
        type="WHITE,IGNORE_KEYWORD"
        desc="忽略的关键词不会在训练中进入白名单规则"
        :add="addKeyword"
        :remove="removeKeyword"
    >
    </KeywordListComponent>

    <!--分区选择弹窗-->
    <PartitionDialog
        :showTidModalProp.sync="showTidModal"
        :dict-arr="arrData['WHITE,TID']"
        :confirm="handleRegionConfirm"
    >
    </PartitionDialog>

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
        <TagInput
            label="标签关键词"
            :tags="currentItem"
            type="tagNameList"
            :on-add="addTag"
            :on-remove="removeTag"
        />

        <TagInput
            label="标题关键词"
            :tags="currentItem"
            type="titleKeyWordList"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="视频描述关键词"
            :tags="currentItem"
            type="descKeyWordList"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="封面关键词(开发中)"
            :tags="currentItem"
            type="coverKeyword"
            :on-add="addTag"
            :on-remove="removeTag"
        />


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
import TagInput from "@/components/TagInput";
import KeywordListComponent from "@/components/KeywordList.vue";
import PartitionDialog from "@/components/PartitionDialog.vue";

export default {
  name: "white-list-view",
  components: {
    PartitionDialog,
    KeywordListComponent,
    TagInput
  },
  data() {
    return {
      searchQuery: '',
      showAddModal: false,
      showEditModal: false,
      pageNo: 1,
      pageSize: 999,
      currentItem: {
        info: '',
        tagNameList: [],
        titleKeyWordList: [],
        coverKeyword: [],
        descKeyWordList: []
      },
      arrData: {
        'WHITE,IGNORE_KEYWORD': [],
        'WHITE,MID': [],
        'WHITE,TID': [],
        'WHITE,KEYWORD': [],
        'WHITE,TAG': [],

      },
      whitelist: [],
      showTidModal: false,

    };
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
    }
  },
  mounted() {

    this.fetchWhitelist();
    for (let key in this.arrData) {
      this.fetchData(key);
    }
  },
  methods: {
    urlAddMid() {

      let url = this.$refs.WhiteMIDKeywordListComponent.getNewKeyWord();
      let xxxPart = this.$getMid(url);
      if (xxxPart) {
        // 创建一个新的URL对象
        this.$refs.WhiteMIDKeywordListComponent.setNewKeyWord(xxxPart);


        api.getUserNameByMid(xxxPart).then((response) => {
          this.$refs.WhiteMIDKeywordListComponent.setNewDesc(response.data);
          this.$refs.WhiteMIDKeywordListComponent.addKeyword();


        }).catch((error) => {
          console.error('Failed to fetch user name:', error);
        });


      } else {
        alert("请输入正确的url,如:https://space.bilibili.com/123456")
      }
    },
    /**
     * 确认添加分区
     */
    async handleRegionConfirm(dictArr) {
      this.showTidModal = false;
      try {
        const response = await api.batchRemoveAndUpdate('WHITE', 'TID', dictArr);
        if (!response.success) {
          this.$message(response.message,
              'error'
          );
        } else {
          this.$message(response.message, 'success');
          this.fetchData('WHITE,TID')
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }


    },


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
          this.$message(response.message,
              'error'
          );
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
          this.$message(response.message,
              'error'
          );
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }
    },
    editWhitelistItem(item) {
      this.currentItem = {...item};
      this.showEditModal = true;
    },
    async deleteWhitelistItem(item) {
      if (confirm(`确定要删除名为"${item.info}"的白名单规则吗？`)) {

        const response = await api.delWhiteRuleById(item.id);
        if (response.success) {
          this.$message('删除成功',
              'success'
          );
          this.whitelist = this.whitelist.filter(i => i.id !== item.id);
        } else {
          this.$message('删除失败',
              'error'
          );
        }

      }
    },
    addTag(type, input) {
      this.currentItem[type].push(input);
    },
    removeTag(type, index) {
      this.currentItem[type].splice(index, 1);
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
    },

    resetForm() {
      this.currentItem = {
        info: '',
        tagNameList: [],
        titleKeyWordList: [],
        coverKeyword: [],
        descKeyWordList: []
      };

    },

    /**
     * 保存白名单
     * @returns {Promise<void>}
     */
    async saveWhitelistItem() {
      const newItem = {
        ...this.currentItem,
      };
      for (const [key, value] of Object.entries(newItem)) {
        //如果newItem[key]是数组,那么过滤掉数组内的空字符串
        if (Array.isArray(value)) {
          newItem[key] = value.filter(item => item !== '');
        }
      }


      const response = await api.addOrUpdateWhiteRule(newItem);
      if (response.success) {
        this.$message('保存成功',
            'success'
        );


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
        this.fetchWhitelist();
      } else {
        this.$message('保存失败',
            'error'
        );

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


</style>
