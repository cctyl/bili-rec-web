<template>
  <div class="mb-8">
    <h3 class="text-xl font-bold mb-4">{{title}}</h3>


    <!-- 提示语和提交按钮 -->
    <div class="flex justify-between items-center mb-4">
      <p class="text-gray-400">
        {{desc}}
      </p>
      <button @click="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        提交选择
      </button>
    </div>

    <div class="keyword-lists keyword-selection bg-gray-800 rounded-lg p-4">

      <div class="keyword-list selected-keywords">
        <h3>采纳</h3>
        <ul>
          <li v-for="keywordItem in selectedKeywords" :key="keywordItem.id">
            {{ keywordItem.value }}
            <div class="buttons">
              <button @click="moveToAvailable(keywordItem)">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="keyword-list available-keywords">
        <div style="display: flex;flex-direction: row;justify-content: space-around;align-items: center;
        align-content: center;
        text-align: center">
          <button @click="selectAll">
            <i class="fas fa-arrow-left"></i>
            全部采纳
          </button>
          <h3 class="pt-3">可选的关键词</h3>
          <button @click="discardAll">
            全不采纳
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <ul v-if="availableKeywords.length>0" class="mt-4">
          <li v-for="keywordItem in availableKeywords" :key="keywordItem.id">

            <div class="buttons">
              <button @click="moveToSelected(keywordItem)">
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>
            <span>{{ keywordItem.value }}</span>
            <div class="buttons">

              <button @click="moveToDiscarded(keywordItem)">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>

          </li>
        </ul>
        <div v-else class="text-center mt-4">
          看起来暂时没有需要你确认的关键词~
        </div>
      </div>
      <div class="keyword-list discarded-keywords">
        <h3>不采纳</h3>
        <ul>
          <li v-for="keywordItem in discardedKeywords" :key="keywordItem.id">
            {{ keywordItem.value }}
            <div class="buttons">
              <button @click="moveToAvailable(keywordItem)">
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>
<script>
export default {
  name:'select-component',
  props: {
    availableKeywordsProp: Object,
    title: String,
    desc: String,
    submitKeywordSelection: Function,
    type:String,
  },
  data() {
    return {

      selectedKeywords: [],
      availableKeywords: [],
      discardedKeywords: [],
    };
  },
  mounted() {
    this.availableKeywords = this.availableKeywordsProp[this.type];
  },
  watch:{
    availableKeywordsProp: {
      deep:true,
      handler() {
        this.availableKeywords = this.availableKeywordsProp[this.type];
      }
    }
  },
  computed:{

  },
  methods:{
    moveToSelected(keyword) {
      this.availableKeywords = this.availableKeywords.filter(k => k !== keyword);
      this.discardedKeywords = this.discardedKeywords.filter(k => k !== keyword);
      this.selectedKeywords.push(keyword);
    },
    moveToAvailable(keyword) {
      this.selectedKeywords = this.selectedKeywords.filter(k => k !== keyword);
      this.discardedKeywords = this.discardedKeywords.filter(k => k !== keyword);
      this.availableKeywords.push(keyword);
    },
    moveToDiscarded(keyword) {
      this.selectedKeywords = this.selectedKeywords.filter(k => k !== keyword);
      this.availableKeywords = this.availableKeywords.filter(k => k !== keyword);
      this.discardedKeywords.push(keyword);
    },
    submit() {
      this.submitKeywordSelection(this.type,this.selectedKeywords, this.discardedKeywords);
      this.selectedKeywords = [];
      this.discardedKeywords = [];
    },

    selectAll(){
      this.selectedKeywords = this.availableKeywords;
      this.availableKeywords = [];
    },
    discardAll(){
      this.discardedKeywords = this.availableKeywords;
      this.availableKeywords = [];
    }
  }

}
</script>
<style scoped>
.keyword-selection {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #4B5563;
  border-radius: 8px;
  background-color: #1F2937;
  color: #F9FAFB;
}

.keyword-lists {
  display: flex;
  justify-content: space-between;
}

.keyword-list {
  width: 30%;
  padding: 10px;
  border: 1px solid #4B5563;
  border-radius: 8px;
  background-color: #374151;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 300px;
  /* 固定高度 */
  overflow-y: auto;
  /* 超出长度时滚动 */
}

.keyword-list h3 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 18px;
  color: #F9FAFB;
}

.keyword-list ul {
  list-style-type: none;
  padding: 0;
}

.keyword-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #4B5563;
  border-radius: 4px;
}

.selected-keywords li {
  background-color: #10B981;
  /* 积极的颜色 */
}

.selected-keywords li:hover {
  background-color: #059669;
}

.discarded-keywords li {
  background-color: #EF4444;
  /* 消极的颜色 */
}

.discarded-keywords li:hover {
  background-color: #DC2626;
}

.available-keywords li {
  background-color: #4B5563;
}

.available-keywords li:hover {
  background-color: #6B7280;
}

.buttons {
  display: flex;
  gap: 5px;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3B82F6;
  color: #F9FAFB;
}

button:hover {
  background-color: #2563EB;
}
</style>