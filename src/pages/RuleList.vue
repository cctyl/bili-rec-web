<template>
  <!-- 主内容区 -->
  <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
    <!-- Header Section -->
    <header class="flex items-center gap-4 mb-8">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center"
        :class="accessType === 'BLACK' ? 'bg-error-container' : 'bg-secondary-container'">
        <i class="fas text-xl"
          :class="accessType === 'BLACK' ? 'fa-ban text-on-error-container' : 'fa-check-circle text-on-secondary-container'"></i>
      </div>
      <div>
        <h1 class="text-3xl font-medium text-on-surface">{{ accessTypeName }}管理</h1>
        <p class="text-sm text-on-surface-variant mt-1">
          {{ accessType === 'BLACK' ? '自动点踩符合条件的视频内容' : '自动点赞符合条件的视频内容' }}
        </p>
      </div>
    </header>

    <!-- 信息提示 -->
    <div class="mb-6 p-4 rounded-xl flex items-start gap-3"
      :class="accessType === 'BLACK' ? 'bg-error-container/30 border border-error' : 'bg-secondary-container/30 border border-secondary'">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="accessType === 'BLACK' ? 'bg-error-container' : 'bg-secondary-container'">
        <i class="fas text-sm"
          :class="accessType === 'BLACK' ? 'fa-exclamation-triangle text-on-error-container' : 'fa-info-circle text-on-secondary-container'"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-on-surface">规则说明</p>
        <p class="text-sm text-on-surface-variant mt-1">
          {{ accessType === 'BLACK' ? '黑名单规则用于自动点踩符合条件的内容。请谨慎设置以避免误判。' : '白名单规则用于自动通过符合条件的内容。请谨慎设置以确保内容质量。' }}
          以下三种规则同时生效，任意一个匹配则视频被判定为{{ accessTypeName }}
        </p>
      </div>
    </div>

    <!-- 规则测试工具 -->
    <div class="bg-surface-container p-5 rounded-xl elevation-1 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
          <i class="fas fa-vial text-on-primary-container"></i>
        </div>
        <h3 class="text-lg font-medium text-on-surface">规则测试工具</h3>
      </div>

      <div class="space-y-4">
        <div class="relative">
          <i class="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"></i>
          <input v-model="testVideoUrl" type="text"
            placeholder="输入视频地址进行测试，例如：https://www.bilibili.com/video/BV1xx411c7mD"
            class="w-full bg-surface-container-highest text-on-surface pl-10 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary transition-colors">
        </div>

        <div class="flex flex-wrap gap-3">
          <button @click="testAiRule" :disabled="!testVideoUrl || aiTesting"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200"
            :class="aiTesting ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80'">
            <i class="fas" :class="aiTesting ? 'fa-spinner fa-spin' : 'fa-robot'"></i>
            <span>{{ aiTesting ? '测试中...' : '测试AI规则' }}</span>
          </button>
          <button @click="testSingleMatch" :disabled="!testVideoUrl || singleTesting"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200"
            :class="singleTesting ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'">
            <i class="fas" :class="singleTesting ? 'fa-spinner fa-spin' : 'fa-check-circle'"></i>
            <span>{{ singleTesting ? '测试中...' : '测试单一包含匹配' }}</span>
          </button>
          <button @click="testComplexMatch" :disabled="!testVideoUrl || complexTesting"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200"
            :class="complexTesting ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-primary-container text-on-primary-container hover:bg-primary-container/80'">
            <i class="fas" :class="complexTesting ? 'fa-spinner fa-spin' : 'fa-layer-group'"></i>
            <span>{{ complexTesting ? '测试中...' : '测试复合包含匹配' }}</span>
          </button>
        </div>

        <!-- 测试结果展示区 -->
        <div v-if="testResults.ai || testResults.single || testResults.complex" class="mt-4 pt-4 border-t border-outline-variant space-y-3">
          <h4 class="text-base font-medium text-on-surface flex items-center gap-2">
            <i class="fas fa-clipboard-list text-primary"></i>
            测试结果
          </h4>

          <!-- AI 匹配结果 -->
          <div v-if="testResults.ai" class="bg-surface-container-high p-4 rounded-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center">
                  <i class="fas fa-robot text-on-tertiary-container"></i>
                </div>
                <span class="font-medium text-on-surface">AI 匹配</span>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium"
                :class="getMatchTypeClass(testResults.ai.match_type)">
                {{ getMatchTypeText(testResults.ai.match_type) }}
              </span>
            </div>
            <div v-if="testResults.ai.reason" class="bg-surface-container p-3 rounded-lg">
              <span class="text-xs text-on-surface-variant">判断理由：</span>
              <p class="text-sm text-on-surface mt-1">{{ testResults.ai.reason }}</p>
            </div>
          </div>

          <!-- 单一匹配结果 -->
          <div v-if="testResults.single" class="bg-surface-container-high p-4 rounded-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
                  <i class="fas fa-check-circle text-on-secondary-container"></i>
                </div>
                <span class="font-medium text-on-surface">单一包含匹配</span>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium"
                :class="getMatchTypeClass(testResults.single.match_type)">
                {{ getMatchTypeText(testResults.single.match_type) }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div v-if="testResults.single.tag?.length">
                <span class="text-on-surface-variant">标签匹配：</span>
                <span class="text-primary">{{ testResults.single.tag.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.title?.length">
                <span class="text-on-surface-variant">标题匹配：</span>
                <span class="text-primary">{{ testResults.single.title.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.desc?.length">
                <span class="text-on-surface-variant">简介匹配：</span>
                <span class="text-primary">{{ testResults.single.desc.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.cover?.length">
                <span class="text-on-surface-variant">封面匹配：</span>
                <span class="text-primary">{{ testResults.single.cover.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.mid?.length">
                <span class="text-on-surface-variant">UP主ID匹配：</span>
                <span class="text-primary">{{ testResults.single.mid.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.tid?.length">
                <span class="text-on-surface-variant">分区ID匹配：</span>
                <span class="text-primary">{{ testResults.single.tid.join(', ') }}</span>
              </div>
            </div>
            <div v-if="testResults.single.match_count" class="mt-3 pt-2 border-t border-outline-variant">
              <span class="text-xs text-on-surface-variant">匹配总数：</span>
              <span class="text-tertiary font-medium">{{ testResults.single.match_count }}</span>
            </div>
          </div>

          <!-- 复合匹配结果 -->
          <div v-if="testResults.complex" class="bg-surface-container-high p-4 rounded-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                  <i class="fas fa-layer-group text-on-primary-container"></i>
                </div>
                <span class="font-medium text-on-surface">复合包含匹配</span>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium"
                :class="getMatchTypeClass(testResults.complex.match_type)">
                {{ getMatchTypeText(testResults.complex.match_type) }}
              </span>
            </div>
            <div v-if="testResults.complex.rule_name" class="mb-2">
              <span class="text-xs text-on-surface-variant">匹配规则：</span>
              <span class="text-sm text-primary">{{ testResults.complex.rule_name }}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div v-if="testResults.complex.tag?.length">
                <span class="text-on-surface-variant">标签匹配：</span>
                <span class="text-primary">{{ testResults.complex.tag.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.title?.length">
                <span class="text-on-surface-variant">标题匹配：</span>
                <span class="text-primary">{{ testResults.complex.title.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.desc?.length">
                <span class="text-on-surface-variant">简介匹配：</span>
                <span class="text-primary">{{ testResults.complex.desc.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.cover?.length">
                <span class="text-on-surface-variant">封面匹配：</span>
                <span class="text-primary">{{ testResults.complex.cover.join(', ') }}</span>
              </div>
            </div>
            <div v-if="testResults.complex.match_count" class="mt-3 pt-2 border-t border-outline-variant">
              <span class="text-xs text-on-surface-variant">匹配总数：</span>
              <span class="text-tertiary font-medium">{{ testResults.complex.match_count }}</span>
            </div>
          </div>

          <!-- 用户处理原因 -->
          <div v-if="userHandleReason"
            class="bg-tertiary-container/30 border border-tertiary p-3 rounded-xl">
            <div class="flex items-center gap-2">
              <i class="fas fa-exclamation-triangle text-tertiary"></i>
              <span class="text-sm text-on-surface-variant">{{ userHandleReason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 提示词模块 -->
    <CollapsibleCard title="AI 匹配"
      :desc="'用自然语言，向 ai 描述视频的特征，比如：' + (accessType==='BLACK'?'不':'') +'喜欢王者荣耀。匹配优先级最低。注意token消耗'"
      :collapsed="collapsibleStates.aiPrompt" @toggle="collapsibleStates.aiPrompt = !collapsibleStates.aiPrompt"
      :disabled="!standardConfig.ai_chat_enable" disabled-tip="请到系统配置中开启AI匹配">
      <div class="bg-primary-container/30 border border-primary rounded-xl p-4 mb-4">
        <p class="text-sm text-on-surface-variant flex items-start gap-2">
          <i class="fas fa-lightbulb text-primary mt-0.5"></i>
          <span>用自然语言，向 ai 描述你所{{ accessType === 'BLACK' ? '讨厌' : '喜欢' }}的视频的特征，比如：{{ accessType === 'BLACK' ? '不喜欢' : '喜欢' }}王者荣耀</span>
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-on-surface-variant mb-2">AI 提示词内容</label>
          <textarea v-model="aiPromptContent" :disabled="!aiPromptEditable"
            class="w-full px-4 py-3 rounded-xl border resize-none transition-all duration-200 bg-surface-container-highest text-on-surface border-outline-variant focus:outline-none focus:border-primary"
            :class="!aiPromptEditable ? 'opacity-60 cursor-not-allowed' : ''" rows="4"
            :placeholder="aiPromptEditable ? '请输入你' + (accessType === 'BLACK' ? '讨厌' : '喜欢') + '的视频特征描述...' : '点击编辑按钮开始输入...'"></textarea>
        </div>

        <div class="flex justify-end">
          <button @click="toggleAiPromptEdit"
            class="flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-200"
            :class="aiPromptEditable ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'">
            <i :class="aiPromptEditable ? 'fas fa-save' : 'fas fa-edit'"></i>
            <span>{{ aiPromptEditable ? '保存' : '编辑' }}</span>
          </button>
        </div>
      </div>
    </CollapsibleCard>

    <!-- 单一匹配部分 -->
    <CollapsibleCard title="单一包含匹配" :desc="'任意维度关键词匹配，打为'+accessTypeName+'。匹配优先级最高'"
      :collapsed="collapsibleStates.oneMatch" @toggle="collapsibleStates.oneMatch = !collapsibleStates.oneMatch"
      :disabled="!standardConfig.single_match" disabled-tip="请到系统配置中开启单一包含匹配">

      <CollapsibleCard v-for="dictTypeStr in dictTypeEnum " :key="dictTypeStr" :title="dictTypeDesc[dictTypeStr]"
        :desc="'当'+dictTypeDesc[dictTypeStr] + '中包含以下关键词时，将自动' + (accessType === 'BLACK' ? '点踩' : '点赞')"
        :collapsed="collapsibleStates[dictTypeStr]['NORMAL']"
        @toggle="collapsibleStates[dictTypeStr]['NORMAL'] =!collapsibleStates[dictTypeStr]['NORMAL']">
        <KeywordListComponent hint="添加新关键词" title="" :keyword-list-prop="keywordListPropObj"
          :on-submit="submitKeyword" :access-type="accessType" status="NORMAL" :dict-type="dictTypeStr" desc=""
          :add="addKeyword" :remove="removeKeyword" :ref="dictTypeStr+'Component'">

          <button v-if="dictTypeStr==='MID'" @click="urlAddMid"
            class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-all duration-200 mr-2">
            <i class="fas fa-link"></i>
            <span>使用主页URL添加</span>
          </button>

          <button v-if="dictTypeStr==='TID'" @click="showTidModal = true"
            class="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-full hover:bg-secondary/90 transition-all duration-200 mr-2">
            <i class="fas fa-plus"></i>
            <span>从分区中选择</span>
          </button>

        </KeywordListComponent>
      </CollapsibleCard>
    </CollapsibleCard>

    <!-- 复合匹配部分 -->
    <CollapsibleCard title="复合包含匹配" desc="复合规则内，三个以上规则匹配，则匹配成功。匹配优先级第二"
      :collapsed="collapsibleStates.allMatch" @toggle="collapsibleStates.allMatch = !collapsibleStates.allMatch"
      :disabled="!standardConfig.complex_match" disabled-tip="请到系统配置中开启复合规则匹配">
      <AssociateRule :access-type="accessType"></AssociateRule>
    </CollapsibleCard>

    <!--分区选择弹窗-->
    <PartitionDialog :showTidModalProp.sync="showTidModal" :dict-arr="keywordListPropObj['TID']['NORMAL']"
      :confirm="handleRegionConfirm" :access-type="accessType">
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
      keywordListPropObj: {},
      showTidModal: false,
      aiPromptContent: '',
      aiPromptEditable: false,
      existingAiPromptId: null,
      collapsibleStates: {
        allMatch: false,
        oneMatch: false,
        ignore: false,
        selectTrain: false,
        aiPrompt: false,
      },
      standardConfig: {
        ai_chat_enable: false
      },
      testVideoUrl: '',
      aiTesting: false,
      singleTesting: false,
      complexTesting: false,
      testResults: {
        ai: null,
        single: null,
        complex: null
      },
      userHandleReason: null
    };
  },
  created() {
    this.dataInit();
    this.standardConfig = JSON.parse(localStorage.getItem("standardConfig"));
    if (!this.standardConfig) {
      this.standardConfig = {
        ai_chat_enable: false
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.dataInit();
      }
    },
    testVideoUrl() {
      this.clearTestResults();
    },
    accessType() {
      this.clearTestResults();
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
    async testAiRule() {
      if (!this.testVideoUrl) {
        this.$message('请输入视频地址', 'warning');
        return;
      }
      const videoId = this.$getBvid(this.testVideoUrl);
      if (!videoId) {
        this.$message('无法识别视频ID，请检查视频地址格式', 'error');
        return;
      }
      this.aiTesting = true;
      this.testResults.ai = null;
      this.userHandleReason = null;
      try {
        const response = await api.testRule({
          bvid: videoId,
          ai_chat_enable: true,
          single_match_enable: false,
          complex_match_enable: false,
        });
        if (response.code === 200 && response.data) {
          if (response.data.ai_match) {
            this.testResults.ai = response.data.ai_match;
          } else {
            this.testResults.ai = { match_type: null, reason: '无匹配结果' };
          }
          if (response.data.user_handle_reason) {
            this.userHandleReason = response.data.user_handle_reason;
          }
        } else {
          this.$message(response.message || 'AI规则测试失败', 'error');
        }
      } catch (error) {
        console.error('AI规则测试失败:', error);
        this.$message('测试请求失败，请检查网络或后端服务', 'error');
      } finally {
        this.aiTesting = false;
      }
    },
    async testSingleMatch() {
      if (!this.testVideoUrl) {
        this.$message('请输入视频地址', 'warning');
        return;
      }
      const videoId = this.$getBvid(this.testVideoUrl);
      if (!videoId) {
        this.$message('无法识别视频ID，请检查视频地址格式', 'error');
        return;
      }
      this.singleTesting = true;
      this.testResults.single = null;
      this.userHandleReason = null;
      try {
        const response = await api.testRule({
          bvid: videoId,
          ai_chat_enable: false,
          single_match_enable: true,
          complex_match_enable: false,
        });
        if (response.code === 200 && response.data) {
          if (response.data.single_match) {
            this.testResults.single = response.data.single_match;
          } else {
            this.testResults.single = { match_type: null, match_count: 0 };
          }
          if (response.data.user_handle_reason) {
            this.userHandleReason = response.data.user_handle_reason;
          }
        } else {
          this.$message(response.message || '单一匹配测试失败', 'error');
        }
      } catch (error) {
        console.error('单一匹配测试失败:', error);
        this.$message('测试请求失败，请检查网络或后端服务', 'error');
      } finally {
        this.singleTesting = false;
      }
    },
    async testComplexMatch() {
      if (!this.testVideoUrl) {
        this.$message('请输入视频地址', 'warning');
        return;
      }
      const videoId = this.$getBvid(this.testVideoUrl);
      if (!videoId) {
        this.$message('无法识别视频ID，请检查视频地址格式', 'error');
        return;
      }
      this.complexTesting = true;
      this.testResults.complex = null;
      this.userHandleReason = null;
      try {
        const response = await api.testRule({
          bvid: videoId,
          ai_chat_enable: false,
          single_match_enable: false,
          complex_match_enable: true,
        });
        if (response.code === 200 && response.data) {
          if (response.data.complex_match) {
            this.testResults.complex = response.data.complex_match;
          } else {
            this.testResults.complex = { match_type: null, match_count: 0 };
          }
          if (response.data.user_handle_reason) {
            this.userHandleReason = response.data.user_handle_reason;
          }
        } else {
          this.$message(response.message || '复合匹配测试失败', 'error');
        }
      } catch (error) {
        console.error('复合匹配测试失败:', error);
        this.$message('测试请求失败，请检查网络或后端服务', 'error');
      } finally {
        this.complexTesting = false;
      }
    },
    getMatchTypeClass(matchType) {
      if (!matchType) return 'bg-surface-container-highest text-on-surface-variant';
      switch (matchType) {
        case 'BLACK':
          return 'bg-error-container text-on-error-container';
        case 'WHITE':
          return 'bg-secondary-container text-on-secondary-container';
        default:
          return 'bg-surface-container-highest text-on-surface-variant';
      }
    },
    getMatchTypeText(matchType) {
      if (!matchType) return '未匹配';
      switch (matchType) {
        case 'BLACK':
          return '黑名单匹配';
        case 'WHITE':
          return '白名单匹配';
        default:
          return matchType;
      }
    },
    clearTestResults() {
      this.testResults = {
        ai: null,
        single: null,
        complex: null
      };
      this.userHandleReason = null;
    },
    dataInit() {
      this.initKeywordListPropObj();
      for (let dictType of this.dictTypeEnum) {
        for (const dictStatus of this.dictStatus) {
          this.fetchData(dictType, dictStatus);
        }
      }
      this.fetchAiPromptData();
      this.clearTestResults();
    },
    initKeywordListPropObj() {
      for (let dictType of this.dictTypeEnum) {
        this.$set(this.keywordListPropObj, dictType, {});
        this.$set(this.collapsibleStates, dictType, {});
        for (const dictStatus of this.dictStatus) {
          this.$set(this.keywordListPropObj[dictType], dictStatus, []);
          this.$set(this.collapsibleStates[dictType], dictStatus, true);
        }
      }
    },
    async fetchAiPromptData() {
      try {
        const response = await api.getDictList(this.accessType, 'AI_JUDGMENT_PROMPT', 'NORMAL');
        if (response.code === 200 && response.data.list.length > 0) {
          const aiPromptItem = response.data.list[0];
          this.aiPromptContent = aiPromptItem.value;
          this.existingAiPromptId = aiPromptItem.id;
        } else {
          this.aiPromptContent = '';
          this.existingAiPromptId = null;
        }
      } catch (error) {
        console.error('Failed to fetch AI prompt data:', error);
      }
    },
    async toggleAiPromptEdit() {
      if (this.aiPromptEditable) {
        await this.saveAiPrompt();
      } else {
        this.aiPromptEditable = true;
      }
    },
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
          access_type: this.accessType,
          status: 'NORMAL'
        };
        if (this.existingAiPromptId) {
          console.log('删除旧的 AI 提示词记录，ID:', this.existingAiPromptId);
          const deleteResponse = await api.delDictById(this.existingAiPromptId);
          if (deleteResponse.code !== 200) {
            console.error('Failed to delete old AI prompt:', deleteResponse.message);
          }
        }
        const response = await api.addDict(keywordItem);
        if (response.code === 200) {
          this.$message('AI 提示词保存成功', 'success');
          this.aiPromptEditable = false;
          await this.fetchAiPromptData();
        } else {
          this.$message(response.message, 'error');
        }
      } catch (error) {
        console.error('Failed to save AI prompt:', error);
        this.$message('AI 提示词保存失败', 'error');
      }
    },
    async handleRegionConfirm(dictArr) {
      this.showTidModal = false;
      try {
        const response = await api.batchRemoveAndUpdate(this.accessType, 'TID', dictArr);
        if (!response.code === 200) {
          this.$message(response.message, 'error');
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
    async fetchData(dictType, status) {
      try {
        const response = await api.getDictList(this.accessType, dictType, status);
        this.keywordListPropObj[dictType][status] = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },
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
    async addKeyword(accessType, dictType, status, keywordItem) {
      keywordItem.access_type = accessType;
      keywordItem.dict_type = dictType;
      try {
        const response = await api.addDict(keywordItem);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
        } else {
          keywordItem.id = response.data;
          this.keywordListPropObj[dictType][status].push(keywordItem)
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }
    },
    async removeKeyword(accessType, dictType, status, keywordItem) {
      try {
        this.keywordListPropObj[dictType][status] = this.keywordListPropObj[dictType][status].filter(k => k !== keywordItem)
        const response = await api.delDictById(keywordItem.id);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
        }
      } catch (error) {
        console.error('Failed to  addKeyword', error);
      }
    }
  }
};
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #49454F;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #605D66;
}

.partition-dialog {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box {
  padding: 8px;
  border: 1px solid #938F99;
  border-radius: 8px;
  background-color: #36343B;
  color: #E6E0E9;
}

.partition-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #938F99;
  border-radius: 8px;
  padding: 10px;
}

.partition-item {
  margin-bottom: 5px;
}

.confirm-button {
  padding: 8px 16px;
  background-color: #D0BCFF;
  color: #381E72;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
}

.confirm-button:hover {
  background-color: #E8DEF8;
}

.custom-checkbox {
  appearance: none;
  background-color: #36343B;
  border: 1px solid #938F99;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  margin-right: 2px;
}

.custom-checkbox:checked {
  background-color: #D0BCFF;
  border: 1px solid #D0BCFF;
}
</style>
