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
        type="BLACK,KEYWORD"
        desc="当 视频标题 或 视频简介 中包含以下关键词时，将自动点踩"

    >


    </KeywordListComponent>

    <!-- 黑名单分区ID列表 -->
    <KeywordListComponent
        hint="添加新分区 ID"
        title="黑名单分区 ID"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,TID"
        desc="当 视频分区 ID 为以下 ID 时，将自动点踩"
    ></KeywordListComponent>

    <!-- 黑名单 UP 主 ID 列表 -->
    <KeywordListComponent
        hint="添加新 UP 主 ID"
        title="黑名单 UP 主 ID"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,MID"
        desc="当 视频 UP 主 ID 为以下 ID 时，将自动点踩"
        ref="BLACKMIDKeywordListComponent"
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
        type="BLACK,TAG"
        desc="当 视频标签 中包含以下任意标签时，将自动点踩"
    ></KeywordListComponent>

    <!-- 忽略的黑名单关键词列表 -->
    <KeywordListComponent
        hint="添加关键词 "
        title="忽略的黑名单关键词"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,IGNORE_KEYWORD"
        desc="即你认为这些关键词是通用的,不应当作为黑名单判断的依据,以下关键词不会进入关键词筛选(不会自动加入黑名单)"
    ></KeywordListComponent>

    <!-- 忽略的黑名单关键词列表 -->
    <KeywordListComponent
        hint="添加新标签 "
        title="忽略的黑名单标签"
        :keyword-list-prop="arrData"
        :on-submit="submitKeyword"
        type="BLACK,IGNORE_TAG"
        desc="即你认为这些标签是通用的,不应当作为黑名单判断的依据,以下标签不会进入标签筛选(不会自动加入黑名单)"
    ></KeywordListComponent>

    <!-- 关键词筛选界面 -->
    <Select :available-keywords-prop="arrData"
            type="BLACK_CACHE,KEYWORD"
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
            type="BLACK_CACHE,TAG"
            :submit-keyword-selection="submitKeywordSelection"
            title="标签筛选" desc="以下是根据你之前点踩的视频生成的黑名单标签，请选择保留或抛弃;
            如果你选择采纳,它会出现在上方的[黑名单标签]中,
            如果你选择抛弃,它会出现在上方的[忽略的黑名单标签]中
            选择的结果会在下次任务中生效">

    </Select>
  </div>
</template>

<script>
import api from '@/api/index.js';
import Select from "@/components/Select.vue";
import KeywordListComponent from "@/components/KeywordList.vue";

export default {
  name: "black-list-view",
  components: {KeywordListComponent, Select},
  data() {
    return {
      BLACK_KEYWORD: ['暴力', '色情', '赌博', '诈骗', '违法'],
      blackTidList: [1001, 1002, 1003],
      blackUserIdList: [12345, 67890, 24680],
      blackTagList: [12345, 67890, 24680],
      ignoreKeyWordList: [12345, 67890, 24680],
      ignoreTagList: [12345, 67890, 24680],
      newKeyword: '',
      newSectionId: '',
      newUploaderId: '',
      availableKeywords: ['关键词1', '关键词2', '关键词3'],
      availableTagwords: ['标签1', '标签2', '标签3'],
      arrData: {
        'BLACK,KEYWORD': [],
        'BLACK,TAG': [],
        'BLACK,TID': [],
        'BLACK,MID': [],
        'BLACK_CACHE,KEYWORD': [],
        'BLACK_CACHE,TAG': []
      },

    };
  },

  mounted() {


    this.fetchData('BLACK,IGNORE_KEYWORD');
    this.fetchData('BLACK,IGNORE_TAG');
    this.fetchData('BLACK,KEYWORD');
    this.fetchData('BLACK,TAG');
    this.fetchData('BLACK,TID');
    this.fetchData('BLACK,MID');
    this.fetchData('BLACK_CACHE,KEYWORD');
    this.fetchData('BLACK_CACHE,TAG');
  },
  methods: {

    urlAddMid() {
      const prefix = "https://space.bilibili.com/";
      let url = this.$refs.BLACKMIDKeywordListComponent.getNewKeyWord();
      if (url.startsWith(prefix)) {
        // 创建一个新的URL对象
        let xxxPart = new URL(url).pathname.split('/').pop();
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
        const [accessType, dictType] = type.split(',');
        const response = await api.getDictList(accessType, dictType);
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


    async fetchKeywords() {
      try {
        const response = await api.getCacheTrainResult('KEYWORD');
        this.availableKeywords = response.data;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },
    async fetchTagwords() {
      try {
        const response = await api.getCacheTrainResult('TAG');
        this.availableTagwords = response.data;
      } catch (error) {
        console.error('Failed to fetch tagwords:', error);
      }
    },
    async fetchBlackKeyWordList() {
      try {
        const response = await api.getBlackKeyWordList();
        this.blacklistKeywords = response.data;
      } catch (error) {
        console.error('Failed to fetch black key word list:', error);
      }
    },
    async fetchBlackTidList() {
      try {
        const response = await api.getBlackTidList();
        this.blackTidList = response.data;
      } catch (error) {
        console.error('Failed to fetch black key word list:', error);
      }
    },
    async fetchBlackUserIdList() {
      try {
        const response = await api.getBlackUserIdList();
        this.blackUserIdList = response.data;
      } catch (error) {
        console.error('Failed to fetch black key word list:', error);
      }
    },
    async fetchBlackTagList() {
      try {
        const response = await api.getBlackTagList();
        this.blackTagList = response.data;
      } catch (error) {
        console.error('Failed to fetch black key word list:', error);
      }
    },
    async fetchIgnoreKeyWordList() {
      try {
        const response = await api.getIgnoreKeyWordList();
        this.ignoreKeyWordList = response.data;
      } catch (error) {
        console.error('Failed to fetch black key word list:', error);
      }
    },
    async fetchIgnoreTagList() {
      try {
        const response = await api.getIgnoreTagList();
        this.ignoreTagList = response.data;
      } catch (error) {
        console.error('Failed to fetch black key word list:', error);
      }
    },
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
