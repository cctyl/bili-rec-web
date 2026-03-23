<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <h2 class="text-2xl font-bold mb-8">{{ accessTypeName }}管理</h2>

    <!-- 信息提示 -->
    <div class="bg-red-600 text-white p-4 rounded-lg mb-6">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      {{ accessTypeName }}规则用于自动点踩符合条件的内容。请谨慎设置以避免误判。
      以下三中规则同时生效，任意一个匹配则视频被判定为{{ accessTypeName }}
    </div>
    <!-- AI 提示词模块 -->
    <CollapsibleCard
        title="AI 匹配"
        desc="用自然语言，向 ai 描述你所讨厌的视频的特征，比如：不喜欢王者荣耀"
        :collapsed="collapsibleStates.aiPrompt"
        @toggle="collapsibleStates.aiPrompt = !collapsibleStates.aiPrompt"
    >
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
    </CollapsibleCard>


    <!-- 单一匹配部分    -->
    <CollapsibleCard
        title="包含匹配"
        :desc="'任意维度关键词匹配，打为'+accessTypeName"
        :collapsed="collapsibleStates.oneMatch"
        @toggle="collapsibleStates.oneMatch = !collapsibleStates.oneMatch"
    >

      <CollapsibleCard
          v-for="dictTypeStr in dictTypeEnum " :key="dictTypeStr"
          :title="dictTypeDesc[dictTypeStr]"
          :desc="'当'+dictTypeDesc[dictTypeStr] + '中包含以下关键词时，将自动点踩'"
          :collapsed="collapsibleStates[dictTypeStr]['NORMAL']"
          @toggle="collapsibleStates[dictTypeStr]['NORMAL'] =!collapsibleStates[dictTypeStr]['NORMAL']"
      >
        <KeywordListComponent
            hint="添加新关键词"
            title=""
            :keyword-list-prop="keywordListPropObj"
            :on-submit="submitKeyword"
            :access-type="accessType"
            status="NORMAL"
            :dict-type="dictTypeStr"
            desc=""
            :add="addKeyword"
            :remove="removeKeyword"
            :ref="dictTypeStr+'Component'"
        >

          <button
              v-if="dictTypeStr==='MID'"
              @click="urlAddMid"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
            <i class="fas fa-link mr-2"></i>使用对方个人主页url添加
          </button>


          <button
              v-if="dictTypeStr==='TID'"
              @click="showTidModal = true  "
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
            <i class="fas fa-plus mr-2"></i>从记录的分区中选择
          </button>

        </KeywordListComponent>


      </CollapsibleCard>


      <!--      <CollapsibleCard
                title="包含匹配"
                :desc="'任意维度关键词匹配，打为'+accessTypeName"
                :collapsed="collapsibleStates.oneMatch"
                @toggle="collapsibleStates.oneMatch = !collapsibleStates.oneMatch"
            >
              <KeywordListComponent
                  hint="添加新关键词"
                  title=""
                  :keyword-list-prop="keywordListPropObj"
                  :on-submit="submitKeyword"
                  :access-type="accessType"
                  status="NORMAL"
                  dict-type="MID"
                  desc=""
                  :add="addKeyword"
                  :remove="removeKeyword"
                  ref="MIDComponent"
              >

                <button
                    @click="urlAddMid"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap mr-4">
                  <i class="fas fa-link mr-2"></i>使用对方个人主页url添加
                </button>
              </KeywordListComponent>
            </CollapsibleCard>-->

    </CollapsibleCard>


    <!-- 复合匹配部分    -->
    <CollapsibleCard
        title="复合包含匹配"
        desc="复合规则内，三个以上规则匹配，则匹配成功"
        :collapsed="collapsibleStates.allMatch"
        @toggle="collapsibleStates.allMatch = !collapsibleStates.allMatch"
    >

      <AssociateRule :access-type="accessType"></AssociateRule>
    </CollapsibleCard>


    <!-- 忽略部分 - 暂时关闭    -->
    <!--  黑名单已经是精确匹配+复合匹配了，不需要再忽略，如果还出错，说明单一匹配太严格了   -->
    <!--
        <CollapsibleCard
            title="忽略匹配"
            desc="这里面的关键词不会被匹配，防止误杀"
            :collapsed="collapsibleStates.ignore"
            @toggle="collapsibleStates.ignore = !collapsibleStates.ignore"
        >


          <CollapsibleCard
              v-for="dictTypeStr in dictTypeEnum " :key="dictTypeStr"
              :title="dictTypeDesc[dictTypeStr]"
              desc=""
              :collapsed="collapsibleStates[dictTypeStr]['IGNORE']"
              @toggle="collapsibleStates[dictTypeStr]['IGNORE'] = !collapsibleStates[dictTypeStr]['IGNORE']"
          >
            <KeywordListComponent
                hint="添加新关键词"
                title=""
                :keyword-list-prop="keywordListPropObj"
                :on-submit="submitKeyword"
                :access-type="accessType"
                status="IGNORE"
                :dict-type="dictTypeStr"
                desc=""
                :add="addKeyword"
                :remove="removeKeyword"
            >
            </KeywordListComponent>
          </CollapsibleCard>


        </CollapsibleCard>
    -->


    <!-- 筛选部分  - 暂时关闭  -->
    <!--
        <CollapsibleCard
            title="筛选新关键词"
            desc="程序经过训练后产生的匹配关键词，你可以接受或者忽略"
            :collapsed="collapsibleStates.selectTrain"
            @toggle="collapsibleStates.selectTrain = !collapsibleStates.selectTrain"
        >

          <CollapsibleCard
              v-for="dictTypeStr in dictTypeEnum " :key="dictTypeStr"
              :title="dictTypeDesc[dictTypeStr]"
              desc=""
              :collapsed="collapsibleStates[dictTypeStr]['CACHE']"
              @toggle="collapsibleStates[dictTypeStr]['CACHE'] = !collapsibleStates[dictTypeStr]['CACHE']"
          >


            <Select :available-keywords-prop="keywordListPropObj"
                    :submit-keyword-selection="submitKeywordSelection"
                    title=""
                    :access-type="accessType"
                    status="CACHE"
                    :dict-type="dictTypeStr"
                    desc="">
            </Select>


          </CollapsibleCard>

        </CollapsibleCard>

    -->

    <!--分区选择弹窗-->
    <PartitionDialog
        :showTidModalProp.sync="showTidModal"
        :dict-arr="keywordListPropObj['TID']['NORMAL']"
        :confirm="handleRegionConfirm"
    >
    </PartitionDialog>

  </div>
</template>

<script>
import api from '@/api/index.js';
import PartitionDialog from "@/components/PartitionDialog.vue";
import CollapsibleCard from "@/components/CollapsibleCard.vue";
import KeywordListComponent from "@/components/KeywordList.vue";
import AssociateRule from "@/components/AssociateRule.vue";

export default {
  name: "black-list-view",
  components: {
    PartitionDialog,
    CollapsibleCard,
    AssociateRule,
    KeywordListComponent,
  },
  props: ['accessType'],
  data() {
    return {
      // accessType: 'BLACK',
      newKeyword: '',
      newSectionId: '',
      newUploaderId: '',
      dictTypeEnum: [
        'TITLE',
        'MID',
        'TAG',
        'TID',
        'DESC',
        'COVER',
        // 'SEARCH_KEYWORD',
        // 'KEYWORD',
        // 'STOP_WORDS',
        // 'AI_JUDGMENT_PROMPT'
      ],

      dictStatus: ['NORMAL'],

      dictTypeDesc: {
        TAG: '视频标签',
        DESC: '视频简介',
        TITLE: '标题',
        COVER: '封面',
        MID: 'up主id',
        TID: '分区id',
        SEARCH_KEYWORD: '搜索词',
        KEYWORD: '通用关键词',
        STOP_WORDS: '停顿词',
        AI_JUDGMENT_PROMPT: 'AI判断提示词'
      },


      //存放 TAG  TID 等对应的字典数据,每个对象包含NORMAL，IGNORE
      keywordListPropObj: {
        // 'TAG':{
        //  'NORMAL':[],
        //  'IGNORE':[],
        // }
      },

      showTidModal: false,
      // AI 提示词相关数据
      aiPromptContent: '',
      aiPromptEditable: false,
      existingAiPromptId: null, // 存储现有 AI 提示词的 ID
      // 折叠状态,true 为折叠
      collapsibleStates: {

        allMatch: false,//大分区，复合规则匹配
        oneMatch: false,//大分区，单一匹配
        ignore: false,//大分区,忽略
        selectTrain: false,//大分区，选择训练出来的
        aiPrompt: false,         // AI 提示词设置
      },

    };
  },
  created() {

    this.dataInit();
  },

  watch: {

    // 或者监听 props 的变化（因为 accessType 是通过 props 传入的）
    accessType: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.dataInit();
        }
      },
      immediate: false
    }
  },
  computed: {


    accessTypeName() {

      if (this.accessType === 'BLACK') {
        return "黑名单"
      } else if (this.accessType === 'WHITE') {
        return "白名单"
      } else {
        return "其他规则"
      }
    }
  },
  methods: {


    /**
     * 初始化入口
     */
    dataInit() {
      this.initKeywordListPropObj();
      for (let dictType of this.dictTypeEnum) {
        for (const dictStatus of this.dictStatus) {
          this.fetchData(dictType, dictStatus);
        }
      }
      // 获取 AI 提示词
      this.fetchAiPromptData();
    },

    /**
     * 给对象初始化空值
     */
    initKeywordListPropObj() {

      for (let dictType of this.dictTypeEnum) {
        this.$set(this.keywordListPropObj, dictType, {});
        //对象初始化，必须是响应式的
        this.$set(this.collapsibleStates, dictType, {});
        for (const dictStatus of this.dictStatus) {
          this.$set(this.keywordListPropObj[dictType], dictStatus, []);
          this.$set(this.collapsibleStates[dictType], dictStatus, true);
        }
        console.log("初始化" + dictType)
      }


    },

    /**
     * 获取 AI 提示词数据
     */
    async fetchAiPromptData() {
      try {
        const response = await api.getDictList(this.accessType, 'AI_JUDGMENT_PROMPT', 'NORMAL');
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
        const response = await api.batchRemoveAndUpdate(this.accessType, 'TID', dictArr);
        if (!response.success) {
          this.$message(response.message,
              'error'
          );
        } else {
          this.$message(response.message, 'success');
          this.fetchData('TID', 'NORMAL')
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }


    },
    urlAddMid() {

      const refs = this.$refs.MIDComponent;

      let comp = null;
      if (Array.isArray(refs)) {
        comp = refs[0];
      } else if (refs) {
        comp = refs;
      }


      let url = comp.getNewKeyWord();
      let xxxPart = this.$getMid(url);
      if (xxxPart) {
        // 创建一个新的URL对象
        comp.setNewKeyWord(xxxPart);


        api.getUserNameByMid(xxxPart).then((response) => {
          comp.setNewDesc(response.data);
          comp.addKeyword();


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

    /**
     * 查询字典数据
     * @param dictType 字典类型
     * @param status 状态
     * @returns {Promise<void>}
     */
    async fetchData(dictType, status) {
      try {
        const response = await api.getDictList(this.accessType, dictType, status);
        this.keywordListPropObj[dictType][status] = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },

    /**
     * 提交选择的训练结果
     * @param accessType
     * @param dictType
     * @param status
     * @param selectedKeywords
     * @param discardedKeywords
     * @returns {Promise<void>}
     */
    async submitKeywordSelection(accessType, dictType, status, selectedKeywords, discardedKeywords) {
      try {
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
        if (response.code !== 200) {

          this.$message(response.message,
              'error'
          );
        } else {
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
        if (response.code !== 200) {
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