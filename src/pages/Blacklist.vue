<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <h2 class="text-2xl font-bold mb-8">黑名单管理</h2>

    <!-- 信息提示 -->
    <div class="bg-red-600 text-white p-4 rounded-lg mb-6">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      黑名单规则用于自动点踩符合条件的内容。请谨慎设置以避免误判。
    </div>

    <!-- 黑名单关键词列表 -->
    <KeywordListComponent
        hint="添加新关键词"
        title="黑名单关键词"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,KEYWORD,NORMAL"
        desc="当 视频标题 或 视频简介 中包含以下关键词时，将自动点踩"
        :add="addKeyword"
        :remove="removeKeyword"
    >


    </KeywordListComponent>

    <!-- 黑名单分区ID列表 -->
    <KeywordListComponent
        hint="添加新分区 ID"
        title="黑名单分区 ID"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,TID,NORMAL"
        desc="当 视频分区 ID 为以下 ID 时，将自动点踩"
        :add="addKeyword"
        :remove="removeKeyword"
    >

      <button
          @click="showTidModal = true "
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
        <i class="fas fa-plus mr-2"></i>从记录的分区中选择
      </button>

    </KeywordListComponent>

    <!-- 黑名单 UP 主 ID 列表 -->
    <KeywordListComponent
        hint="添加新 UP 主 ID"
        title="黑名单 UP 主 ID"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,MID,NORMAL"
        desc="当 视频 UP 主 ID 为以下 ID 时，将自动点踩"
        ref="BLACKMIDKeywordListComponent"
        :add="addKeyword"
        :remove="removeKeyword"
    >

      <button
          @click="urlAddMid"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
        <i class="fas fa-link mr-2"></i>使用对方个人主页url添加
      </button>

    </KeywordListComponent>
    <!-- 黑名单标签列表 -->
    <KeywordListComponent
        hint="添加新标签 "
        title="黑名单标签"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,TAG,NORMAL"
        desc="当 视频标签 中包含以下任意标签时，将自动点踩"
        :add="addKeyword"
        :remove="removeKeyword"
    ></KeywordListComponent>

    <!-- 忽略的黑名单关键词列表 -->
    <KeywordListComponent
        hint="添加关键词 "
        title="忽略的黑名单关键词"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,KEYWORD,IGNORE"
        desc="即你认为这些关键词是通用的,不应当作为黑名单判断的依据,以下关键词不会进入关键词筛选(不会自动加入黑名单)"
        :add="addKeyword"
        :remove="removeKeyword"
    ></KeywordListComponent>

    <!-- 忽略的黑名单关键词列表 -->
    <KeywordListComponent
        hint="添加新标签 "
        title="忽略的黑名单标签"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,TAG,IGNORE"
        desc="即你认为这些标签是通用的,不应当作为黑名单判断的依据,以下标签不会进入标签筛选(不会自动加入黑名单)"
        :add="addKeyword"
        :remove="removeKeyword"
    ></KeywordListComponent>

    <!-- 关键词筛选界面 -->
    <Select :available-keywords-prop="arrData"
            type="BLACK,KEYWORD,CACHE"
            :submit-keyword-selection="submitKeywordSelection"
            title="关键词筛选"
            desc=
                "
            以下是根据你之前点踩的视频生成的黑名单关键词，请选择保留或抛弃.
            如果你选择采纳,它会出现在上方的[黑名单关键词]中,
            如果你选择抛弃,它会出现在上方的[忽略的关键词]中
            选择的结果会在下次任务中生效.
            ">

    </Select>

    <!-- 标签筛选界面 -->
    <Select :available-keywords-prop="arrData"
            type="BLACK,TAG,CACHE"
            :submit-keyword-selection="submitKeywordSelection"
            title="标签筛选" desc="以下是根据你之前点踩的视频生成的黑名单标签，请选择保留或抛弃;
            如果你选择采纳,它会出现在上方的[黑名单标签]中,
            如果你选择抛弃,它会出现在上方的[忽略的黑名单标签]中
            选择的结果会在下次任务中生效">

    </Select>

    <!-- AI 提示词模块 -->
    <div class="bg-gray-800 p-6 rounded-lg mb-8">
      <h3 class="text-xl font-semibold mb-4 text-white">AI 提示词设置</h3>

      <div class="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-6">
        <p class="text-blue-200 text-sm leading-relaxed">
          <i class="fas fa-lightbulb mr-2"></i>
          用自然语言，向 ai 描述你所讨厌的视频的特征，比如：不喜欢王者荣耀
        </p>
      </div>

      <div class="flex flex-col space-y-4">
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">AI 提示词内容</label>
          <div class="flex space-x-4">
            <textarea
              v-model="aiPromptContent"
              :disabled="!aiPromptEditable"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border resize-none transition-all duration-200',
                aiPromptEditable
                  ? 'bg-gray-700 text-white border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600'
                  : 'bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed opacity-75'
              ]"
              rows="4"
              :placeholder="aiPromptEditable ? '请输入你讨厌的视频特征描述，例如：不喜欢王者荣耀相关的游戏视频...' : '点击编辑按钮开始输入...'"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="toggleAiPromptEdit"
            :class="[
              'text-white px-6 py-2 rounded-lg focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105',
              aiPromptEditable
                ? 'bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 border border-green-600'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 border border-blue-600'
            ]"
          >
            <i :class="aiPromptEditable ? 'fas fa-save animate-pulse' : 'fas fa-edit'" class="mr-2"></i>
            {{ aiPromptEditable ? '保存' : '编辑' }}
          </button>
        </div>
      </div>
    </div>

    <!--分区选择弹窗-->
    <PartitionDialog
        :showTidModalProp.sync="showTidModal"
        :dict-arr="arrData['BLACK,TID,NORMAL']"
        :confirm="handleRegionConfirm"
    >
    </PartitionDialog>

  </div>
</template>

<script>
import api from '@/api/index.js';
import Select from "@/components/Select.vue";
import KeywordListComponent from "@/components/KeywordList.vue";
import PartitionDialog from "@/components/PartitionDialog.vue";

export default {
  name: "black-list-view",
  components: {
    PartitionDialog,
    KeywordListComponent,
    Select,
  },
  data() {
    return {
      // BLACK_KEYWORD: ['暴力', '色情', '赌博', '诈骗', '违法'],
      // blackTidList: [1001, 1002, 1003],
      // blackUserIdList: [12345, 67890, 24680],
      // blackTagList: [12345, 67890, 24680],
      // ignoreKeyWordList: [12345, 67890, 24680],
      // ignoreTagList: [12345, 67890, 24680],
      // availableKeywords: ['关键词1', '关键词2', '关键词3'],
      // availableTagwords: ['标签1', '标签2', '标签3'],
      newKeyword: '',
      newSectionId: '',
      newUploaderId: '',
      arrData: {
        'BLACK,KEYWORD,NORMAL': [],
        'BLACK,TAG,NORMAL': [],
        'BLACK,TID,NORMAL': [],
        'BLACK,MID,NORMAL': [],
        'BLACK,TAG,IGNORE': [],
        'BLACK,KEYWORD,IGNORE': [],
        'BLACK,KEYWORD,CACHE': [],
        'BLACK,TAG,CACHE': []
      },
      showTidModal: false,
      // AI 提示词相关数据
      aiPromptContent: '',
      aiPromptEditable: false,
      existingAiPromptId: null, // 存储现有 AI 提示词的 ID
    };
  },

  mounted() {

    for (let key in this.arrData) {
      this.fetchData(key);
    }
    // 获取 AI 提示词
    this.fetchAiPromptData();
  },
  computed: {},
  methods: {

    /**
     * 获取 AI 提示词数据
     */
    async fetchAiPromptData() {
      try {
        const response = await api.getDictList('BLACK', 'AI_JUDGMENT_PROMPT', 'NORMAL');
        if (response.code === 200 && response.data.list.length > 0) {
          const aiPromptItem = response.data.list[0];
          this.aiPromptContent = aiPromptItem.value;
          this.existingAiPromptId = aiPromptItem.id; // 保存现有记录的 ID
        } else {
          // 如果没有数据，设置默认内容
          this.aiPromptContent = '';
          this.existingAiPromptId = null;
        }
      } catch (error) {
        console.error('Failed to fetch AI prompt data:', error);
      }
    },

    /**
     * 切换 AI 提示词编辑状态
     */
    async toggleAiPromptEdit() {
      if (this.aiPromptEditable) {
        // 保存模式
        await this.saveAiPrompt();
      } else {
        // 编辑模式
        this.aiPromptEditable = true;
      }
    },

    /**
     * 保存 AI 提示词
     */
    async saveAiPrompt() {
      if (!this.aiPromptContent.trim()) {
        this.$message('AI 提示词内容不能为空', 'error');
        return;
      }

      try {
        const keywordItem = {
          value: this.aiPromptContent.trim(),
          desc: '',
          dict_type: 'AI_JUDGMENT_PROMPT',
          access_type: 'BLACK',
          status: 'NORMAL'
        };

        // 如果有现有记录，先删除旧记录
        if (this.existingAiPromptId) {
          console.log('删除旧的 AI 提示词记录，ID:', this.existingAiPromptId);
          const deleteResponse = await api.delDictById(this.existingAiPromptId);
          if (deleteResponse.code !== 200) {
            console.error('Failed to delete old AI prompt:', deleteResponse.message);
            // 即使删除失败，也继续尝试添加新记录
          }
        }

        // 添加新记录
        const response = await api.addDict(keywordItem);
        if (response.code === 200) {
          this.$message('AI 提示词保存成功', 'success');
          this.aiPromptEditable = false;
          // 重新获取数据以更新 ID
          await this.fetchAiPromptData();
        } else {
          this.$message(response.message, 'error');
        }
      } catch (error) {
        console.error('Failed to save AI prompt:', error);
        this.$message('AI 提示词保存失败', 'error');
      }
    },

    /**
     * 确认添加分区
     */
    async handleRegionConfirm(dictArr) {
      this.showTidModal = false;
      try {
        const response = await api.batchRemoveAndUpdate('BLACK', 'TID', dictArr);
        if (!response.success) {
          this.$message(response.message,
              'error'
          );
        } else {
          this.$message(response.message, 'success');
          this.fetchData('BLACK,TID')
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }


    },
    urlAddMid() {
      let url = this.$refs.BLACKMIDKeywordListComponent.getNewKeyWord();
      let xxxPart = this.$getMid(url);
      if (xxxPart) {
        // 创建一个新的URL对象
        this.$refs.BLACKMIDKeywordListComponent.setNewKeyWord(xxxPart);


        api.getUserNameByMid(xxxPart).then((response) => {
          this.$refs.BLACKMIDKeywordListComponent.setNewDesc(response.data);
          this.$refs.BLACKMIDKeywordListComponent.addKeyword();


        }).catch((error) => {
          console.error('Failed to fetch user name:', error);
        });


      } else {
        alert("请输入正确的url,如:https://space.bilibili.com/123456")
      }
    },
    submitKeyword(type, keywordList) {
      console.log(type, keywordList)
    },
    async fetchData(type) {
      try {
        const [accessType, dictType,status] = type.split(',');
        const response = await api.getDictList(accessType, dictType,status);
        this.arrData[type] = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },


    async submitKeywordSelection(type, selectedKeywords, discardedKeywords) {
      try {
        const dictType = type.split(',')[1];
        await api.submitSelectTrainResult(dictType, {
          selectedId: selectedKeywords.map(item => item.id),
          discardedId: discardedKeywords.map(item => item.id)
        });
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
      keywordItem.access_type = accessType;
      keywordItem.dict_type = dictType;
      try {
        const response = await api.addDict(keywordItem);
        if (response.code!==200) {

          this.$message(response.message,
              'error'
          );
        }else {
          keywordItem.id = response.data;
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
        if (response.code!==200) {

          this.$message(response.message,
              'error'
          );
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
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

.partition-dialog {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box {
  padding: 8px;
  border: 1px solid #4B5563;
  border-radius: 4px;
  background-color: #374151;
  color: #F9FAFB;
}

.partition-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #4B5563;
  border-radius: 4px;
  padding: 10px;
}

.partition-item {
  margin-bottom: 5px;
}

.confirm-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #0056b3;
}

.custom-checkbox {
  appearance: none;
  background-color: #374151;
  border: 1px solid #4B5563;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  margin-right: 2px;
}

.custom-checkbox:checked {
  background-color: #3B82F6;
  border: 1px solid #3B82F6;
}


</style>