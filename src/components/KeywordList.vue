<template>
  <div class="mb-6">
    <!-- 标题区域 -->
    <div class="flex justify-between items-center mb-4" v-if="title">
      <h3 class="text-title-medium font-medium text-white">{{ title }}</h3>
    </div>
    
    <!-- 描述文本 -->
    <div class="flex justify-between items-center mb-4" v-if="desc">
      <p class="text-body-medium text-gray-400">
        {{ desc }}
      </p>
    </div>

    <!-- 卡片容器 -->
    <div class="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <!-- 输入区域 -->
      <div class="flex flex-col sm:flex-row gap-3 mb-5">
        <div class="relative flex-grow">
          <input 
            v-model="newKeyword" 
            :placeholder="hint + '，输入后可以搜索哦'"
            class="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 text-body-medium placeholder-gray-500"
          >
        </div>
        <div class="flex gap-2">
          <slot>
          </slot>
          <button 
            @click="addKeyword"
            class="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full font-medium text-label-large hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 elevation-1 hover:elevation-2 min-h-10 whitespace-nowrap"
          >
            <i class="fas fa-plus text-sm"></i>
            <span>添加</span>
          </button>
        </div>
      </div>

      <!-- 关键词标签列表 -->
      <div class="flex flex-wrap gap-2" style="max-height: 200px; overflow: auto">
        <div 
          v-for="keywordItem in keywordListFilter" 
          :key="keywordItem.id"
          class="group bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-blue-500/50 hover:bg-gray-650 transition-all duration-200 flex items-center gap-2"
        >
          <div class="flex flex-col">
            <span class="text-body-medium font-medium">{{ keywordItem.value }}</span>
            <span v-if="keywordItem.desc" class="text-body-small text-gray-400">{{ keywordItem.desc }}</span>
          </div>
          <button 
            @click="removeKeyword(keywordItem)" 
            class="ml-1 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-all duration-150"
          >
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>
        
        <!-- 空状态 -->
        <div v-if="keywordListFilter.length === 0" class="w-full py-8 text-center">
          <i class="fas fa-tags text-gray-600 text-3xl mb-3"></i>
          <p class="text-body-medium text-gray-400">暂无关键词，请添加</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "keyword-list-component",
  data() {
    return {
      newKeyword: "",
      newDesc: "",
      keywordList: [],
    }
  },
  computed: {
    keywordListFilter() {
      if (!this.newKeyword) {
        return this.keywordList
      } else {
        return this.keywordList.filter(k => k.value.includes(this.newKeyword) || (k.desc != null && k.desc.includes(this.newKeyword)))
      }
    },
  },

  mounted() {
    this.keywordList = this.keywordListProp[this.dictType]?.[this.status] || [];
  },
  props: {
    keywordListProp: Object,
    title: String,
    hint: String,
    onSubmit: Function,
    accessType: String,
    dictType: String,
    status: String,
    desc: String,
    add: Function,
    remove: Function,
  },
  methods: {
    getNewKeyWord() {
      return this.newKeyword;
    },
    setNewKeyWord(value) {
      this.newKeyword = value;
    },
    setNewDesc(value) {
      this.newDesc = value;
    },

    addKeyword() {
      if (this.newKeyword && !this.keywordList.find(k => k.value === this.newKeyword)) {
        let newItem = {value: this.newKeyword, desc: this.newDesc, dict_type: this.dict_type, access_type: this.access_type, status: this.status};
        this.newKeyword = '';
        this.newDesc = '';
        this.$message('添加成功', 'success');
        this.add(this.accessType, this.dictType, this.status, newItem);
      } else {
        this.$message('关键词已存在', 'warning');
      }
    },
    removeKeyword(keywordItem) {
      this.remove(this.accessType, this.dictType, this.status, keywordItem);
    },
    submit() {
      this.onSubmit(this.type, this.keywordList)
    },
  },
  watch: {
    keywordListProp: {
      deep: true,
      handler() {
        this.keywordList = this.keywordListProp[this.dictType]?.[this.status] || [];
      }
    },
  }
}
</script>

<style scoped>
/* Material Typography - Title Medium */
.text-title-medium {
  font-size: 1rem;
  line-height: 1.5rem;
  letter-spacing: 0.015rem;
}

/* Material Typography - Body Medium */
.text-body-medium {
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.025rem;
}

/* Material Typography - Body Small */
.text-body-small {
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.025rem;
}

/* Material Typography - Label Large */
.text-label-large {
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.006rem;
  font-weight: 500;
}

/* Elevation */
.elevation-1 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.elevation-2 {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
