<template>

  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">

    <!--  搜索的关键词 -->
    <KeywordListComponent
        hint="添加新关键词"
        title="搜索关键词"
        :keyword-list-prop="arrData"
        type="OTHER,SEARCH_KEYWORD"
        desc="搜索任务的数据源,  下列关键词将会被搜索任务使用.  也就是说这部分关键词会被拿去搜索视频,  被搜索的视频会根据规则决定点踩或点赞"
        :add="addKeyword"
        :remove="removeKeyword"
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
      arrData: {
        'OTHER,SEARCH_KEYWORD': [],

      },
    };
  },
  mounted() {

    for (let key in this.arrData) {
      this.fetchData(key);
    }

  },
  computed: {
  },
  methods: {
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
    async fetchData(type) {
      try {
        const [accessType, dictType] = type.split(',');
        const response = await api.getDictList(accessType, dictType);
        this.arrData[type] = response.data.list;
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
