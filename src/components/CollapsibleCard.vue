<template>
  <div
      class="collapsible-card rounded-xl mb-6 overflow-hidden border"
      :class="[
      disabled 
        ? 'bg-gray-800 border-gray-600 opacity-70' 
        : 'bg-gray-800 border-gray-700 elevation-1'
    ]"
  >
    <!-- 卡片头部 -->
    <div
        @click="handleToggle"
        class="card-header flex items-center justify-between p-5 transition-all duration-200"
        :class="[
        disabled
          ? 'cursor-not-allowed'
          : 'cursor-pointer hover:bg-gray-750'
      ]"
    >
      <div class="flex-1">
        <h3 class="text-title-medium font-medium text-white flex items-center">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
            :class="disabled ? 'bg-gray-700' : 'bg-blue-600'">
            <i :class="[
              'fas text-sm transition-transform duration-200',
              disabled
                ? 'fa-ban text-gray-400'
                : (collapsed ? 'fa-chevron-right text-white' : 'fa-chevron-down text-white')
            ]"></i>
          </div>
          {{ title }}
          <!-- 禁用提示标签 -->
          <span v-if="disabled" class="ml-3 text-label-small text-gray-400 bg-gray-700 px-2.5 py-1 rounded-full">
            已禁用
          </span>
        </h3>
        <p class="text-body-medium text-gray-400 mt-2 ml-11">{{ desc }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-label-medium" :class="disabled ? 'text-gray-500' : 'text-gray-400'">
          {{ getActionText }}
        </span>
        <i :class="[
          'fas transition-transform duration-200 text-gray-400',
          disabled
            ? 'fa-ban'
            : (collapsed ? 'fa-chevron-right' : 'fa-chevron-down')
        ]"></i>
      </div>
    </div>

    <!-- 禁用提示条（可选，更明显的提示） -->
    <div v-if="disabled" class="bg-red-900/30 px-5 py-3 border-t border-gray-600">
      <p class="text-body-small text-gray-300 flex items-center">
        <i class="fas fa-info-circle mr-2 text-red-400"></i>
        {{ disabledTip }}
      </p>
    </div>

    <div v-show="!collapsed && !disabled" class="card-content p-5 border-t border-gray-700">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsibleCard',
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      default: ''
    },
    collapsed: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledTip: {
      type: String,
      default: '该面板已被禁用，无法展开'
    }
  },
  computed: {
    getActionText() {
      if (this.disabled) return '已禁用';
      return this.collapsed ? '点击展开' : '点击折叠';
    }
  },
  methods: {
    handleToggle() {
      if (this.disabled) {
        // 发出禁用点击事件，父组件可以监听并做进一步处理（如显示 toast）
        this.$emit('disabled-click');
        return;
      }
      this.$emit('toggle');
    },
    startTransition(el) {
      el.style.height = '0';
      el.style.overflow = 'hidden';
    },
    endTransition(el) {
      el.style.height = '';
      el.style.overflow = '';
    }
  }
};
</script>

<style scoped>
.collapsible-card {
  transition: box-shadow 0.2s ease, opacity 0.2s ease;
}

.card-header {
  user-select: none;
}

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

/* Material Typography - Label Small */
.text-label-small {
  font-size: 0.688rem;
  line-height: 1rem;
  letter-spacing: 0.031rem;
  font-weight: 500;
}

/* Material Typography - Label Medium */
.text-label-medium {
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.031rem;
  font-weight: 500;
}

/* Elevation */
.elevation-1 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 折叠动画 */
.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s cubic-bezier(0.2, 0, 0, 1);
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  height: auto;
  opacity: 1;
}
</style>
