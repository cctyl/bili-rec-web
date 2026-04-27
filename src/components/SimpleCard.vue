<template>
  <div class="bg-surface-container p-5 rounded-xl elevation-1 hover:elevation-2 transition-all duration-200">
    <!-- 任务头部 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
          <i :class="img" class="text-2xl text-on-secondary-container"></i>
        </div>
        <div>
          <h3 class="text-base font-medium text-on-surface">{{ title }}</h3>
          <p class="text-xs text-on-surface-variant line-clamp-1">{{ desc }}</p>
        </div>
      </div>
      <span v-if="status && status !== '无状态'" :class="statusClass()" class="px-3 py-1 text-xs font-medium rounded-full">
        {{ getStatus() }}
      </span>
    </div>

    <!-- 内容区域 -->
    <div class="mb-4">
      <slot></slot>
    </div>

    <!-- 触发按钮 -->
    <button @click="trigger"
            :disabled="status === 'RUNNING' || status === 'WAITING'"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            :class="status === 'STOPPED' || !status || status === '无状态'
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'">
      <i class="fas" :class="status === 'RUNNING' || status === 'WAITING' ? 'fa-spinner fa-spin' : 'fa-play'"></i>
      <span>{{ getButtonText() }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "simple-card-component",
  props: {
    img: String,
    title: String,
    desc: String,
    trigger: Function,
    status: String,
  },
  methods: {
    statusClass() {
      switch (this.status) {
        case 'RUNNING':
          return 'bg-primary-container text-on-primary-container';
        case 'STOPPED':
          return 'bg-surface-container-highest text-on-surface-variant';
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
    },
    getButtonText() {
      switch (this.status) {
        case "RUNNING":
          return '执行中...';
        case "WAITING":
          return '排队中...';
        default:
          return '执行';
      }
    }
  }
};
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.elevation-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
}
</style>
