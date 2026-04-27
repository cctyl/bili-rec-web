<template>
  <div class="mb-6">
    <!-- 标题区域 -->
    <div class="flex justify-between items-center mb-4" v-if="title">
      <h3 class="text-base font-medium text-on-surface">{{ title }}</h3>
    </div>
    
    <!-- 描述文本 -->
    <div class="flex justify-between items-center mb-4" v-if="desc">
      <p class="text-sm text-on-surface-variant">
        {{ desc }}
      </p>
    </div>

    <!-- 卡片容器 -->
    <div class="bg-surface-container-high rounded-xl p-5">
      <!-- 输入区域 -->
      <div class="flex flex-col sm:flex-row gap-3 mb-5">
        <div class="relative flex-grow">
          <input 
            v-model="newKeyword" 
            :placeholder="hint + '，输入后可以搜索哦'"
            class="w-full bg-surface-container-highest text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary transition-all duration-200 text-sm"
          >
        </div>
        <div class="flex gap-2">
          <slot>
          </slot>
          <button 
            @click="addKeyword"
            class="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-200 elevation-1"
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
          class="group bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg border border-outline-variant hover:border-primary/50 transition-all duration-200 flex items-center gap-2"
        >
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ keywordItem.value }}</span>
            <span v-if="keywordItem.desc" class="text-xs text-on-surface-variant">{{ keywordItem.desc }}</span>
          </div>
          <button 
            @click="removeKeyword(keywordItem)" 
            class="ml-1 w-6 h-6 flex items-center justify-center rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all duration-150"
          >
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>
        
        <!-- 空状态 -->
        <div v-if="keywordListFilter.length === 0" class="w-full py-8 text-center">
          <i class="fas fa-tags text-on-surface-variant/30 text-3xl mb-3"></i>
          <p class="text-sm text-on-surface-variant">暂无关键词，请添加</p>
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
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--md-outline-variant, #c4c7c5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--md-outline, #747775);
}
</style>
