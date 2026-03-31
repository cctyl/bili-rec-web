<template>
  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <h2 class="text-2xl font-bold mb-8">{{ accessTypeName }}管理</h2>

    <!-- 信息提示 -->
    <div v-if="accessType==='BLACK'" class="bg-red-600 text-white p-4 rounded-lg mb-6">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      黑名单规则用于自动点踩符合条件的内容。请谨慎设置以避免误判。
      以下三中规则同时生效，任意一个匹配则视频被判定为{{ accessTypeName }}
    </div>

    <!-- 信息提示 -->
    <div v-else class="bg-blue-600 text-white p-4 rounded-lg mb-6">
      <i class="fas fa-info-circle mr-2"></i>
      白名单规则用于自动通过符合条件的内容。请谨慎设置以确保内容质量。
      以下三中规则同时生效，任意一个匹配则视频被判定为{{ accessTypeName }}
    </div>

    <!-- ==================== 新增测试组件区域 ==================== -->
    <!-- 测试组件区域 -->
    <div class="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
        <i class="fas fa-vial mr-2 text-blue-400"></i>
        规则测试工具
      </h3>
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
          <input
              v-model="testVideoUrl"
              type="text"
              placeholder="输入视频地址进行测试，例如：https://www.bilibili.com/video/BV1xx411c7mD"
              class="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <button
              @click="testAiRule"
              :disabled="!testVideoUrl || aiTesting"
              class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <i class="fas fa-robot mr-2"></i>
            {{ aiTesting ? '测试中...' : '测试AI规则' }}
          </button>
          <button
              @click="testSingleMatch"
              :disabled="!testVideoUrl || singleTesting"
              class="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <i class="fas fa-check-circle mr-2"></i>
            {{ singleTesting ? '测试中...' : '测试单一包含匹配' }}
          </button>
          <button
              @click="testComplexMatch"
              :disabled="!testVideoUrl || complexTesting"
              class="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <i class="fas fa-layer-group mr-2"></i>
            {{ complexTesting ? '测试中...' : '测试复合包含匹配' }}
          </button>
        </div>

        <!-- 测试结果展示区 -->
        <div v-if="testResults.ai || testResults.single || testResults.complex"
             class="mt-4 border-t border-gray-700 pt-4">
          <h4 class="text-md font-medium text-gray-300 mb-3 flex items-center">
            <i class="fas fa-chalkboard-user mr-2 text-blue-400"></i>
            测试结果
          </h4>

          <!-- AI 匹配结果 -->
          <div v-if="testResults.ai" class="bg-gray-700 rounded-lg p-4 mb-3">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <i class="fas fa-robot mr-2 text-purple-400"></i>
                <span class="text-md font-medium text-white">AI 匹配</span>
              </div>
              <span :class="getMatchTypeClass(testResults.ai.match_type)"
                    class="text-xs px-3 py-1 rounded-full text-white font-medium">
            {{ getMatchTypeText(testResults.ai.match_type) }}
          </span>
            </div>

            <div v-if="testResults.ai.reason" class="bg-gray-800 rounded p-3">
              <span class="text-gray-400 text-sm">判断理由：</span>
              <p class="text-gray-200 mt-1 text-sm leading-relaxed">{{ testResults.ai.reason }}</p>
            </div>
          </div>

          <!-- 单一匹配结果 -->
          <div v-if="testResults.single" class="bg-gray-700 rounded-lg p-4 mb-3">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <i class="fas fa-check-circle mr-2 text-green-400"></i>
                <span class="text-md font-medium text-white">单一包含匹配</span>
              </div>
              <span :class="getMatchTypeClass(testResults.single.match_type)"
                    class="text-xs px-3 py-1 rounded-full text-white font-medium">
            {{ getMatchTypeText(testResults.single.match_type) }}
          </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div v-if="testResults.single.tag && testResults.single.tag.length">
                <span class="text-gray-400">标签匹配：</span>
                <span class="text-blue-300">{{ testResults.single.tag.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.title && testResults.single.title.length">
                <span class="text-gray-400">标题匹配：</span>
                <span class="text-blue-300">{{ testResults.single.title.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.desc && testResults.single.desc.length">
                <span class="text-gray-400">简介匹配：</span>
                <span class="text-blue-300">{{ testResults.single.desc.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.cover && testResults.single.cover.length">
                <span class="text-gray-400">封面匹配：</span>
                <span class="text-blue-300">{{ testResults.single.cover.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.mid && testResults.single.mid.length">
                <span class="text-gray-400">UP主ID匹配：</span>
                <span class="text-blue-300">{{ testResults.single.mid.join(', ') }}</span>
              </div>
              <div v-if="testResults.single.tid && testResults.single.tid.length">
                <span class="text-gray-400">分区ID匹配：</span>
                <span class="text-blue-300">{{ testResults.single.tid.join(', ') }}</span>
              </div>
            </div>

            <div v-if="testResults.single.match_count" class="mt-3 pt-2 border-t border-gray-600">
              <span class="text-gray-400 text-sm">匹配总数：</span>
              <span class="text-yellow-300 font-medium">{{ testResults.single.match_count }}</span>
            </div>
          </div>

          <!-- 复合匹配结果 -->
          <div v-if="testResults.complex" class="bg-gray-700 rounded-lg p-4 mb-3">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <i class="fas fa-layer-group mr-2 text-orange-400"></i>
                <span class="text-md font-medium text-white">复合包含匹配</span>
              </div>
              <span :class="getMatchTypeClass(testResults.complex.match_type)"
                    class="text-xs px-3 py-1 rounded-full text-white font-medium">
            {{ getMatchTypeText(testResults.complex.match_type) }}
          </span>
            </div>

            <div v-if="testResults.complex.rule_name" class="mb-2">
              <span class="text-gray-400 text-sm">匹配规则：</span>
              <span class="text-purple-300">{{ testResults.complex.rule_name }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div v-if="testResults.complex.tag && testResults.complex.tag.length">
                <span class="text-gray-400">标签匹配：</span>
                <span class="text-blue-300">{{ testResults.complex.tag.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.title && testResults.complex.title.length">
                <span class="text-gray-400">标题匹配：</span>
                <span class="text-blue-300">{{ testResults.complex.title.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.desc && testResults.complex.desc.length">
                <span class="text-gray-400">简介匹配：</span>
                <span class="text-blue-300">{{ testResults.complex.desc.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.cover && testResults.complex.cover.length">
                <span class="text-gray-400">封面匹配：</span>
                <span class="text-blue-300">{{ testResults.complex.cover.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.mid && testResults.complex.mid.length">
                <span class="text-gray-400">UP主ID匹配：</span>
                <span class="text-blue-300">{{ testResults.complex.mid.join(', ') }}</span>
              </div>
              <div v-if="testResults.complex.tid && testResults.complex.tid.length">
                <span class="text-gray-400">分区ID匹配：</span>
                <span class="text-blue-300">{{ testResults.complex.tid.join(', ') }}</span>
              </div>
            </div>

            <div v-if="testResults.complex.match_count" class="mt-3 pt-2 border-t border-gray-600">
              <span class="text-gray-400 text-sm">匹配总数：</span>
              <span class="text-yellow-300 font-medium">{{ testResults.complex.match_count }}</span>
            </div>
          </div>

          <!-- 用户处理原因 -->
          <div v-if="userHandleReason" class="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-3">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle mr-2 text-yellow-500"></i>
              <span class="text-gray-300 text-sm">{{ userHandleReason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ==================== 测试组件结束 ==================== -->

    <!-- AI 提示词模块 -->
    <CollapsibleCard
        title="AI 匹配"
        :desc="  '用自然语言，向 ai 描述视频的特征，比如：' + (accessType==='BLACK'?'不':'') +'喜欢王者荣耀。匹配优先级最低'  "
        :collapsed="collapsibleStates.aiPrompt"
        @toggle="collapsibleStates.aiPrompt = !collapsibleStates.aiPrompt"
        :disabled="!standardConfig.ai_chat_enable"
        disabled-tip="请到系统配置中开启AI匹配"
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
        title="单一包含匹配"
        :desc="'任意维度关键词匹配，打为'+accessTypeName+'。匹配优先级最高'"
        :collapsed="collapsibleStates.oneMatch"
        @toggle="collapsibleStates.oneMatch = !collapsibleStates.oneMatch"
        :disabled="!standardConfig.single_match"
        disabled-tip="请到系统配置中开启单一包含匹配"
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
        desc="复合规则内，三个以上规则匹配，则匹配成功。匹配优先级第二"
        :collapsed="collapsibleStates.allMatch"
        @toggle="collapsibleStates.allMatch = !collapsibleStates.allMatch"
        :disabled="!standardConfig.complex_match"
        disabled-tip="请到系统配置中开启复合规则匹配"
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
        :access-type="accessType"
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

      //系统配置
      standardConfig: {},
      //用于测试的视频地址
      // 测试结果数据

      // 测试加载状态

      // 测试相关
      testVideoUrl: '',
      aiTesting: false,
      singleTesting: false,
      complexTesting: false,
      testResults: {
        ai: null,      // 存储 AiMatch 对象
        single: null,  // 存储 SingleMatch 对象
        complex: null  // 存储 ComplexMatch 对象
      },
      userHandleReason: null  // 存储用户处理原因
    };
  },
  created() {

    this.dataInit();

    this.standardConfig = JSON.parse(localStorage.getItem("standardConfig"));
  },

  watch: {

    $route: {
      immediate: true,
      handler() {
        this.dataInit();
      }
    },
    // 当输入框变化时清空测试结果
    testVideoUrl() {
      this.clearTestResults();
    },

    // 切换黑白名单时清空测试结果
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
  mounted() {
  },
  methods: {
    /**
     * 测试AI规则
     */
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
        // 调用AI测试接口
        const response = await api.testRule({
          bvid: videoId,
          ai_chat_enable: true,
          single_match_enable: false,
          complex_match_enable: false,
        });

        console.log(response)
        if (response.code === 200 && response.data) {
          // 响应数据就是 MatchResult 格式
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

    /**
     * 测试单一包含匹配
     */
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
        // 调用AI测试接口
        const response = await api.testRule({
          bvid: videoId,
          ai_chat_enable: false,
          single_match_enable: true,
          complex_match_enable: false,
        });

        console.log(response)
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

    /**
     * 测试复合包含匹配
     */
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
        // 调用AI测试接口
        const response = await api.testRule({
          bvid: videoId,
          ai_chat_enable: false,
          single_match_enable: false,
          complex_match_enable: true,
        });

        console.log(response)
        if (response.code === 200 && response.data) {
          if (response.data.complex_match ) {
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
    /**
     * 获取匹配类型的样式类
     */
    getMatchTypeClass(matchType) {
      if (!matchType) return 'bg-gray-500';
      switch (matchType) {
        case 'BLACK':
          return 'bg-red-500';
        case 'WHITE':
          return 'bg-green-500';
        default:
          return 'bg-gray-500';
      }
    },

    /**
     * 获取匹配类型的显示文本
     */
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

    /**
     * 清空测试结果
     */
    clearTestResults() {
      this.testResults = {
        ai: null,
        single: null,
        complex: null
      };
      this.userHandleReason = null;
    },



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
      this.clearTestResults();
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
        //console.log("初始化" + dictType)
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
          access_type: this.accessType,
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
        if (!response.code === 200) {
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
    async addKeyword(accessType, dictType, status, keywordItem) {
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

          this.keywordListPropObj[dictType][status].push(keywordItem)
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
    async removeKeyword(accessType, dictType, status, keywordItem) {
      try {
        this.keywordListPropObj[dictType][status] = this.keywordListPropObj[dictType][status].filter(k => k !== keywordItem)

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