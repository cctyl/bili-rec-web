<template>
  <div class="partition-dialog">
    <!-- 搜索框 - Material Outlined Text Field -->
    <div class="relative">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <i class="fas fa-search text-sm"></i>
      </div>
      <input 
        v-model="searchQuery" 
        placeholder="搜索分区"
        class="w-full bg-gray-700 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-body-medium transition-all duration-200 placeholder-gray-500"
      />
    </div>

    <!-- 分区列表 - Material List -->
    <div class="partition-list bg-gray-800 rounded-xl border border-gray-700">
      <ul class="py-2">
        <li 
          v-for="item in filteredPartitions" 
          :key="item.id" 
          class="partition-item"
        >
          <label class="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150">
            <!-- Material Checkbox -->
            <div class="relative flex items-center">
              <input 
                type="checkbox" 
                :value="item.tid" 
                v-model="item.checked" 
                class="custom-checkbox peer"
                @click="handlePartition(item)"
              />
              <div class="checkbox-indicator absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150">
                <i class="fas fa-check text-xs text-white"></i>
              </div>
            </div>
            <span class="text-body-medium text-white select-none">{{ item.name }}</span>
          </label>
        </li>
      </ul>
      <!-- 空状态 -->
      <div v-if="filteredPartitions.length === 0" class="px-4 py-8 text-center">
        <i class="fas fa-inbox text-gray-600 text-2xl mb-2"></i>
        <p class="text-body-small text-gray-400">未找到匹配的分区</p>
      </div>
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
    partitions: Array,
    handlePartition: Function,
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
  gap: 12px;
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

/* Partition List Container */
.partition-list {
  max-height: 280px;
  overflow-y: auto;
}

/* Custom Scrollbar */
.partition-list::-webkit-scrollbar {
  width: 6px;
}

.partition-list::-webkit-scrollbar-track {
  background: transparent;
}

.partition-list::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.partition-list::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Material Checkbox - 20dp touch target */
.custom-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #6b7280;
  border-radius: 2px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.custom-checkbox:hover {
  border-color: #9ca3af;
}

.custom-checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.custom-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.checkbox-indicator {
  width: 18px;
  height: 18px;
}

/* Partition Item */
.partition-item {
  position: relative;
}

.partition-item:first-child label {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.partition-item:last-child label {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>
