<template>

    <div class="partition-dialog">
      <input v-model="searchQuery" placeholder="搜索分区"
             class="search-box bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <div class="partition-list">
        <ul>
          <li v-for="item in filteredPartitions" :key="item.id" class="partition-item">
            <label>
              <input type="checkbox" :value="item.tid" v-model="item.checked" class="custom-checkbox"
                     @click="handlePartition(item)"
              />
              {{ item.name }}
            </label>
          </li>
        </ul>
      </div>
    </div>


</template>
<script>


export default {
  name: 'region-component',
  data() {
    return {
      searchQuery: '',
      selectedPartitions: [],

    }

  },
  computed: {
    filteredPartitions() {
      return this.partitions.filter(partition =>
          partition.name.includes(this.searchQuery)
      );
    },
  },

  props: {
    partitions:Array,
    handlePartition:Function,
  },
  watch: {




  },
  mounted() {


  },
  methods: {


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