<template>
  <div
      class="collapsible-card rounded-lg mb-6 overflow-hidden border"
      :class="[
      disabled ? 'bg-gray-700 border-gray-600 opacity-75' : 'bg-gray-800 border-gray-700'
    ]"
  >
    <!-- 卡片头部 -->
    <div
        @click="handleToggle"
        class="card-header flex items-center justify-between p-4 transition-colors duration-200"
        :class="[
        disabled
          ? 'cursor-not-allowed bg-gray-700'
          : 'cursor-pointer hover:bg-gray-750'
      ]"
    >
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <i :class="[
            'fas transition-transform duration-200 mr-3',
            disabled
              ? 'fa-ban text-gray-500'
              : (collapsed ? 'fa-chevron-right' : 'fa-chevron-down')
          ]"></i>
          {{ title }}
          <!-- 禁用提示标签 -->
          <span v-if="disabled" class="ml-2 text-xs text-gray-400 bg-gray-600 px-2 py-0.5 rounded">
            已禁用
          </span>
        </h3>
        <p class="text-gray-400 text-sm mt-1 ml-8">{{ desc }}</p>
      </div>
      <div class="flex items-center">
        <span class="text-xs mr-2" :class="disabled ? 'text-gray-500' : 'text-gray-400'">
          {{ getActionText }}
        </span>
        <i :class="[
          'fas transition-transform duration-200',
          disabled
            ? 'fa-ban text-gray-500'
            : (collapsed ? 'fa-chevron-right' : 'fa-chevron-down text-gray-500')
        ]"></i>
      </div>
    </div>

    <!-- 禁用提示条（可选，更明显的提示） -->
    <div v-if="disabled" class="bg-gray-600 bg-opacity-50 px-4 py-2 border-t border-gray-600">
      <p class="text-xs text-gray-300 flex items-center">
        <i class="fas fa-info-circle mr-2"></i>
        {{ disabledTip }}
      </p>
    </div>

    <div v-show="!collapsed && !disabled" class="card-content p-4 border-t border-gray-700">
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-header {
  user-select: none;
}

/* 非禁用状态下的 hover 效果 */
.card-header:not(.cursor-not-allowed):hover {
  background-color: rgba(59, 130, 246, 0.1);
}

/* 折叠动画 */
.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
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