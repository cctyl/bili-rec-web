<template>
  <div
      class="break-inside-avoid rounded-2xl p-6 bg-surface-container-low elevation-1 hover:elevation-2 transition-all duration-300 ease-emphasized">
    <!-- 卡片头部 -->
    <div class="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl">
      <div class="flex items-center justify-center mb-5">
        <div class="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center">
          <i :class="img" class="text-3xl text-on-secondary-container"></i>
        </div>
      </div>
      <h3 class="text-title-medium font-medium text-center mb-2 text-on-surface">{{ title }}</h3>
      <p class="text-body-medium text-on-surface-variant text-center mb-5" v-html="desc">
      </p>
    </div>

    <!-- 状态标签 -->
    <div class="task-details">
      <div class="flex justify-center mb-4">
        <span :class="statusClass()" class="px-4 py-1.5 text-label-medium font-medium rounded-full" v-if="status!='无状态'">
          {{ getStatus() }}
        </span>
      </div>
    </div>

    <!-- 执行按钮 - Material Filled Button -->
    <div class="mt-4 flex justify-center">
      <button
          @click="trigger"
          class="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full text-label-large font-medium elevation-1 hover:elevation-2 hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:elevation-0 min-h-10">
        <i class="fas fa-play text-sm"></i>
        <span>执行</span>
      </button>
    </div>

    <!-- 插槽内容区域 -->
    <div class="mt-5 flex justify-center">
      <slot>
      </slot>
    </div>

    <!-- 其他插槽内容 -->
    <div class="mt-4 pr-1" style="max-height: 350px; overflow: auto">
      <slot name="other">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "simple-card-component",
  data() {
    return {};
  },
  props: {
    img: String,
    title: String,
    desc: String,
    trigger: Function,
    status: String,
  },
  mounted() {
  },
  methods: {
    statusClass() {
      switch (this.status) {
        case 'RUNNING':
          return 'bg-primary-container text-on-primary-container';
        case 'STOPPED':
          return 'bg-secondary-container text-on-secondary-container';
        case 'WAITING':
          return 'bg-tertiary-container text-on-tertiary-container';
        default:
          return 'bg-surface-container-highest text-on-surface-variant';
      }
    },
    getStatus() {
      switch (this.status) {
        case "RUNNING":
          return '运行中';
        case "STOPPED":
          return '未启动';
        case "WAITING":
          return '排队中';
        default:
          return this.status;
      }
    }
  }
};
</script>

<style scoped>
/* Material Design 3 Easing */
.ease-emphasized {
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
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

/* Material Typography - Label Large */
.text-label-large {
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.006rem;
}

/* Material Typography - Label Medium */
.text-label-medium {
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.031rem;
}

/* Material Shape - Large rounded corners for cards */
.rounded-2xl {
  border-radius: 0.75rem;
}

/* Elevation system */
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.elevation-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
}
</style>
