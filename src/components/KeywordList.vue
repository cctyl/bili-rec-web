<template>
  <div class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <!--      <button @click="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              提交
            </button>-->
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
        <slot>
        </slot>
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
      newDesc: "",
      keywordList: [],
      accessType: "",
      dictType: ""
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
    this.splitType();
    this.keywordList = this.keywordListProp[this.type] || [];
  },
  props: {
    keywordListProp: Object,
    title: String,
    hint: String,
    onSubmit: Function,
    type: String,
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
        let newItem = {value: this.newKeyword, desc: this.newDesc, dictType: this.dictType, accessType: this.accessType};
        this.keywordList.push(newItem); // 添加默认描述

        this.newKeyword = '';
        this.newDesc = '';
        this.$message('添加成功', 'success');
        this.add(this.accessType,this.dictType, newItem);
      } else {
        this.$message('关键词已存在', 'warning');
      }
    },
    removeKeyword(keywordItem) {
      this.keywordList = this.keywordList.filter(k => k !== keywordItem);
      this.remove(this.accessType,this.dictType, keywordItem);
    },
    submit() {
      this.onSubmit(this.type, this.keywordList)
    },

    splitType() {
      let [accessType, dictType] = this.type.split(",")

      this.accessType = accessType;
      this.dictType = dictType;

      // console.log(accessType, dictType)
    },
  },
  watch: {
    keywordListProp: {
      deep: true,
      handler() {
        this.keywordList = this.keywordListProp[this.type] || [];
      }
    },

    type() {
      this.splitType();
    },

  }
}
</script>

<style scoped></style>