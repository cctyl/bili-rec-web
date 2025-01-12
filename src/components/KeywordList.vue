<template>
  <div class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <button @click="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        提交
      </button>
    </div>
    <div class="flex justify-between items-center mb-4" v-if="desc">
      <p class="text-gray-400">
        {{ desc }}
      </p>
    </div>

    <div class="bg-gray-800 rounded-lg p-4">
      <div class="flex mb-4">
        <input v-model="newKeyword" :placeholder="hint+',   输入后可以搜索哦'"
          class="flex-grow mr-4 bg-gray-700 text-white px-4 py-2 rounded-l-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button @click="addKeyword"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
          <i class="fas fa-plus mr-2"></i>添加
        </button>
      </div>
      <div class="flex flex-wrap" style="max-height: 200px;overflow: auto">
        <div v-for="keywordItem in keywordListFilter" :key="keywordItem.id"
             class="bg-gray-700 text-white px-3 py-1 rounded-full !rounded-button mr-2 mb-2 flex items-center">
          <div class="flex flex-col">
            <span>{{ keywordItem.value }}</span>
            <span class="text-gray-400 text-sm">{{ keywordItem.desc }}</span>
          </div>
          <button @click="removeKeyword(keywordItem)" class="ml-2 text-red-400 hover:text-red-300 focus:outline-none">
            <i class="fas fa-times"></i>
          </button>
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
      keywordList: [],
    }
  },
  computed:{
    keywordListFilter(){
      if (!this.newKeyword){
        return this.keywordList
      }else {
        return this.keywordList.filter(k => k.value.includes(this.newKeyword)  || (k.desc!=null && k.desc.includes(this.newKeyword)))
      }
    }
  },
  mounted() {
    this.keywordList = this.keywordListProp[this.type] || [];
  },
  props: {
    keywordListProp: Object,
    title: String,
    hint: String,
    onSubmit: Function,
    type:String,
    desc:String,
    add:Function,
    remove:Function,
  },
  methods: {
    addKeyword() {
      if (this.newKeyword && !this.keywordList.find(k => k.value === this.newKeyword)) {
        this.keywordList.push({value: this.newKeyword}); // 添加默认描述

        this.add(this.type,this.newKeyword);

        this.newKeyword = '';
      }
    },
    removeKeyword(keywordItem) {
      this.keywordList = this.keywordList.filter(k => k !== keywordItem);
      this.remove(this.type,keywordItem.id);
    },
    submit(){
      this.onSubmit(this.type,this.keywordList)
    },
  },
  watch: {
    keywordListProp: {
      deep: true,
      handler(){
        this.keywordList = this.keywordListProp[this.type] || [];
      }
    }
  }
}
</script>

<style scoped></style>