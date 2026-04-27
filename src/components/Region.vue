<template>
  <div class="partition-dialog">
    <!-- 搜索框 - Material Outlined Text Field -->
    <div class="relative">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
        <i class="fas fa-search text-sm"></i>
      </div>
      <input 
        v-model="searchQuery" 
        placeholder="搜索分区"
        class="w-full bg-surface-container-highest text-on-surface pl-11 pr-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-body-medium transition-all duration-200"
      />
    </div>

    <!-- 分区列表 - Material List -->
    <div class="partition-list bg-surface-container rounded-xl border border-outline-variant">
      <ul class="py-2">
        <li 
          v-for="item in filteredPartitions" 
          :key="item.id" 
          class="partition-item"
        >
          <label class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high cursor-pointer transition-colors duration-150">
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
                <i class="fas fa-check text-xs text-on-primary"></i>
              </div>
            </div>
            <span class="text-body-medium text-on-surface select-none">{{ item.name }}</span>
          </label>
        </li>
      </ul>
      <!-- 空状态 -->
      <div v-if="filteredPartitions.length === 0" class="px-4 py-8 text-center">
        <i class="fas fa-inbox text-on-surface-variant/50 text-2xl mb-2"></i>
        <p class="text-body-small text-on-surface-variant">未找到匹配的分区</p>
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
  background: var(--md-outline-variant, #c4c7c5);
  border-radius: 3px;
}

.partition-list::-webkit-scrollbar-thumb:hover {
  background: var(--md-outline, #747775);
}

/* Material Checkbox - 20dp touch target */
.custom-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--md-outline, #747775);
  border-radius: 2px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.custom-checkbox:hover {
  border-color: var(--md-on-surface, #1f1f1f);
}

.custom-checkbox:checked {
  background-color: var(--md-primary, #6750a4);
  border-color: var(--md-primary, #6750a4);
}

.custom-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--md-primary-container, #eaddff);
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

/* Color variables fallback for Tailwind classes */
.bg-surface-container {
  background-color: #f3edf7;
}

.bg-surface-container-high {
  background-color: #ece6f0;
}

.bg-surface-container-highest {
  background-color: #e6e0e9;
}

.border-outline-variant {
  border-color: #c4c7c5;
}

.text-on-surface {
  color: #1d1b20;
}

.text-on-surface-variant {
  color: #49454f;
}
</style>
