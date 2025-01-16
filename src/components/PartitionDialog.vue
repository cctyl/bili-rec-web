<template>
  <Dialog :visible.sync="showTidModal" title="分区选择">
    <div class="partition-dialog">
      <input v-model="searchQuery" placeholder="搜索分区"
             class="search-box bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <div class="partition-list">
        <ul>
          <li v-for="item in filteredPartitions" :key="item.id" class="partition-item">
            <label>
              <input type="checkbox" :value="item.tid" v-model="item.checked" class="custom-checkbox"
                     @click="handlePartition(item)"/>
              {{ item.name }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <template v-slot:footer>
      <button @click="handleRegionConfirm"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        确认
      </button>
    </template>
  </Dialog>

</template>
<script>
import Dialog from "@/components/Dialog.vue";
import api from "@/api";

export default {
  name: 'partition-dialog',
  data() {
    return {
      partitions: [
        {
          tid: 1,
          code: 'douga',
          name: '动画(主分区)',
          desc: '',
          router: '/v/douga',
          pid: null,
        },
      ],
      searchQuery: '',
      selectedPartitions: [],
      showTidModal: false,
    }

  },
  computed: {
    filteredPartitions() {
      return this.partitions.filter(partition =>
          partition.name.includes(this.searchQuery)
      );
    },
  },
  components: {
    Dialog
  },
  props: {
    showTidModalProp: Boolean,
    dictArr: Array,
    add: Function,
    remove: Function,
    confirm:Function,
  },
  watch: {
    showTidModalProp(newValue) {
      console.log("showTidModalProp change",newValue)
      this.showTidModal = newValue;

      if (this.showTidModal===true){
        this.handleRegionSelect();
      }
    },

    showTidModal(newValue) {
      console.log('showTidModal change',newValue)
      this.$emit('update:showTidModalProp', newValue);
    }

  },
  mounted() {
    this.showTidModal = this.showTidModalProp;
    console.log('showTidModalProp', this.showTidModalProp)

    if (this.showTidModal===true){
      this.handleRegionSelect();
    }
  },
  methods: {
    handlePartition(item) {
      console.log(item)
      //点击时如果是true,说明点击后变成了false, 实际就是false
      if (!item.checked) {
        //新增
        this.add({
          value: item.tid,
          desc: item.name,
          dictType:'TID',
        });
      } else {
        //删除
        this.remove(item);
      }

    },
    /**
     * 确认添加分区
     */
    handleRegionConfirm() {
      this.showTidModal = false;
      this.searchQuery = '';
      this.confirm();
    },

    async handleRegionSelect() {

      await this.fetchRegionList();
      const regionIdArr = this.partitions.map(item => item.tid);
      const notExistsTid = this.dictArr
          .filter(item => {
                return !regionIdArr.includes(item.value)
              }
          );
      if (notExistsTid.length > 0) {
        notExistsTid.forEach(item => {
          this.partitions.push({
            tid: item.value,
            name: item.desc
          })
        })
      }
      let existArr = this.dictArr.map(item => item.value);
      this.partitions = this.partitions.map(item => {
        item.checked = existArr.includes(item.tid + '');
        return item;
      })
    },

    async fetchRegionList() {
      try {
        const response = await api.getRegionList();
        this.partitions = response.data;
      } catch (error) {
        console.error('Failed to  fetchRegionList:', error);
      }
    },
  }
}
</script>
<style scoped>

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