<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">

    <!--  搜索的关键词 -->
<!--    <KeywordListComponent-->
<!--        hint="添加新关键词"-->
<!--        title="搜索关键词"-->
<!--        :keyword-list-prop="searchKeyword"-->
<!--        type="OTHER,SEARCH_KEYWORD"-->
<!--        desc="搜索任务的数据源,  下列关键词将会被搜索任务使用.  也就是说这部分关键词会被拿去搜索视频,  被搜索的视频会根据规则决定点踩或点赞"-->
<!--        :add="addKeyword"-->
<!--        :remove="removeKeyword"-->
<!--    >-->


      <KeywordListComponent
          hint="添加新关键词" title="" :keyword-list-prop="keywordListPropObj"

          access-type="OTHER"
          status="NORMAL"
          dict-type="SEARCH_KEYWORD"
          desc=""
          :add="addKeyword" :remove="removeKeyword" ref="SEARCH_KEYWORDComponent"
      >

    </KeywordListComponent>


  </div>


</template>

<script>
import KeywordListComponent from "@/components/KeywordList.vue";
import api from "@/api";

export default {
  name: "other-setting-view",
  components: {KeywordListComponent},
  data() {
    return {
      // dictTypeEnum: [
      //   'TITLE',
      //   'MID',
      //   'TAG',
      //   'TID',
      //   'DESC',
      //   'COVER',
      // ],
      // dictStatus: ['NORMAL'],
      // dictTypeDesc: {
      //   TAG: '视频标签',
      //   DESC: '视频简介',
      //   TITLE: '标题',
      //   COVER: '封面',
      //   MID: 'up主id',
      //   TID: '分区id',
      //   SEARCH_KEYWORD: '搜索词',
      //   KEYWORD: '通用关键词',
      //   STOP_WORDS: '停顿词',
      //   AI_JUDGMENT_PROMPT: 'AI判断提示词'
      // },
      keywordListPropObj:{
        SEARCH_KEYWORD: {
          NORMAL:[]
        },
      }

    };
  },
  mounted() {

      this.getSearchKeyword();

  },
  computed: {
  },
  methods: {
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
    },

    /**
     * 获取搜索关键词
     * @returns {Promise<void>}
     */
    async getSearchKeyword() {
      try {
        const response = await api.getDictList('OTHER', 'SEARCH_KEYWORD','NORMAL');
        this.keywordListPropObj .SEARCH_KEYWORD.NORMAL = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
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
