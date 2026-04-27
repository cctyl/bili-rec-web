<template>
  <div
      class="collapsible-card rounded-xl mb-6 overflow-hidden"
      :class="[
      disabled 
        ? 'bg-surface-container/50 opacity-70' 
        : 'bg-surface-container elevation-1 hover:elevation-2 transition-all duration-200'
    ]"
  >
    <!-- 卡片头部 -->
    <div
        @click="handleToggle"
        class="card-header flex items-center justify-between p-5 cursor-pointer hover:bg-surface-container-high transition-all duration-200"
        :class="{ 'cursor-not-allowed': disabled }"
    >
      <div class="flex-1">
        <h3 class="text-base font-medium text-on-surface flex items-center">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-200"
            :class="disabled ? 'bg-surface-container-highest' : 'bg-primary-container'">
            <i :class="[
              'fas text-lg transition-transform duration-200',
              disabled
                ? 'fa-ban text-on-surface-variant'
                : (collapsed ? 'fa-chevron-right text-on-primary-container' : 'fa-chevron-down text-on-primary-container')
            ]"></i>
          </div>
          {{ title }}
          <!-- 禁用提示标签 -->
          <span v-if="disabled" class="ml-3 text-xs text-on-surface-variant bg-surface-container-highest px-2.5 py-1 rounded-full">
            已禁用
          </span>
        </h3>
        <p class="text-sm text-on-surface-variant mt-2 ml-13">{{ desc }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs" :class="disabled ? 'text-on-surface-variant/50' : 'text-on-surface-variant'">
          {{ getActionText }}
        </span>
        <i :class="[
          'fas transition-transform duration-200 text-on-surface-variant',
          disabled
            ? 'fa-ban'
            : (collapsed ? 'fa-chevron-right' : 'fa-chevron-down')
        ]"></i>
      </div>
    </div>

    <!-- 禁用提示条 -->
    <div v-if="disabled" class="bg-error-container/30 px-5 py-3 border-t border-outline-variant">
      <p class="text-sm text-on-surface-variant flex items-center">
        <i class="fas fa-info-circle mr-2 text-error"></i>
        {{ disabledTip }}
      </p>
    </div>

    <div v-show="!collapsed && !disabled" class="card-content p-5 border-t border-outline-variant">
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
        this.$emit('disabled-click');
        return;
      }
      this.$emit('toggle');
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

.ml-13 {
  margin-left: 3.25rem;
}

.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.elevation-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
}
</style>
