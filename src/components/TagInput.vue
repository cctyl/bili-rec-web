<template>
  <div class="mb-4">
    <label class="block text-sm font-medium mb-2">{{ label }}</label>
    <div
        class="tag-input-container w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
      <div class="tags">
        <span v-for="(tag, index) in tags" :key="index"
              class="bg-gray-600 text-white px-3 py-1 rounded-full !rounded-button mr-2 mb-2 flex items-center">
          {{ tag.value }}
          <span class="close ml-2 text-red-400 hover:text-red-300 focus:outline-none" @click="removeDict(index,tag.id)">x</span>
        </span>
      </div>
      <input type="text" v-model="tagInput" @keydown.enter.prevent="addDict"
             placeholder="按下回车添加" class="tag-input bg-gray-700 text-white">
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagInput',
  props: {
    label: String,
    tags: Array,
    onAdd: Function,
    onRemove: Function,
    dictType:String,
  },

  mounted() {
  },
  data() {
    return {
      tagInput: ''
    };
  },
  methods: {
    addDict() {
      console.log(this.tagInput);
      if (this.tagInput.trim() !== '') {
        this.onAdd(this.dictType,this.tagInput.trim())
        this.tagInput = '';
      }
    },
    removeDict(index, id) {
      this.onRemove(this.dictType,index, id);
    }
  }
};
</script>

<style scoped>
.tag-input-container {
  display: flex;
  flex-direction: column;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

.tag-input {
  margin-top: 0.5rem;
}

.tag-input-container {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  border-radius: 5px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 3px;
  padding: 5px;
  margin: 2px;
}

.tag .close {
  margin-left: 5px;
  cursor: pointer;
}

.tag-input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 5px;
  background-color: transparent;
  color: white;
}
</style>