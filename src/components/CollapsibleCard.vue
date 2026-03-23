<template>
  <div class="collapsible-card bg-gray-800 rounded-lg mb-6 overflow-hidden border border-gray-700">
    <!-- 卡片头部 -->
    <div
      @click="$emit('toggle')"
      class="card-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors duration-200"
    >
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <i :class="['fas transition-transform duration-200 mr-3', collapsed ? 'fa-chevron-right' : 'fa-chevron-down']"></i>
          {{ title }}
        </h3>
        <p class="text-gray-400 text-sm mt-1 ml-8">{{ desc }}</p>
      </div>
      <div class="flex items-center">
        <span class="text-xs text-gray-500 mr-2">
          {{ collapsed ? '点击展开' : '点击折叠' }}
        </span>
        <i :class="['fas text-gray-500 transition-transform duration-200', collapsed ? 'fa-chevron-right' : 'fa-chevron-down']"></i>
      </div>
    </div>


      <div v-show="!collapsed" class="card-content p-4 border-t border-gray-700">
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
    }
  },
  watch:{
    // collapsed(newValue){
    //   console.log("组件内，collapsed变化："+newValue)
    // }
  },
  methods: {
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

.card-header:hover {
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
