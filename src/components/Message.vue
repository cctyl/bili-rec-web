<template>
  <transition name="slide-fade">
    <div v-if="visible" class="message" :class="type">
      <!-- 图标 -->
      <div class="message-icon">
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
      </div>
      <!-- 消息内容 -->
      <span class="message-text">{{ message }}</span>
      <!-- 关闭按钮 -->
      <button class="message-close" @click="visible = false">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Message-component',
  data() {
    return {
      visible: false,
      message: '',
      type: ''
    };
  },
  methods: {
    show(message, type = 'info', time = 3000) {
      this.message = message;
      this.type = type;
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, time);
    }
  }
};
</script>

<style scoped>
/* Material Design 3 Snackbar/Toast 样式 */
.message {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  color: #fff;
  z-index: 9999;
  min-width: 280px;
  max-width: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  backdrop-filter: blur(10px);
}

/* 图标容器 */
.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

/* 消息文本 */
.message-text {
  flex: 1;
  font-weight: 400;
  letter-spacing: 0.25px;
}

/* 关闭按钮 */
.message-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.message-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

/* Material Design 3 配色方案 - 深色主题 */
.message.info {
  background: linear-gradient(135deg, #4A4458 0%, #3D3847 100%);
  border: 1px solid rgba(208, 188, 255, 0.3);
  color: #E6E1E5;
}

.message.success {
  background: linear-gradient(135deg, #2D4A3E 0%, #1F3A2F 100%);
  border: 1px solid rgba(76, 175, 80, 0.4);
  color: #D1F5D3;
}

.message.warning {
  background: linear-gradient(135deg, #5A4A2A 0%, #4A3A1A 100%);
  border: 1px solid rgba(255, 193, 7, 0.4);
  color: #FFE082;
}

.message.error {
  background: linear-gradient(135deg, #5A2A2A 0%, #4A1A1A 100%);
  border: 1px solid rgba(244, 67, 54, 0.4);
  color: #FFCDD2;
}

/* 成功图标颜色 */
.message.success .message-icon {
  color: #4ADE80;
}

/* 错误图标颜色 */
.message.error .message-icon {
  color: #F87171;
}

/* 警告图标颜色 */
.message.warning .message-icon {
  color: #FBBF24;
}

/* 信息图标颜色 */
.message.info .message-icon {
  color: #D0BCFF;
}

/* 滑入滑出动画 */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .message {
    left: 16px;
    right: 16px;
    transform: none;
    min-width: auto;
    max-width: none;
  }
  
  .slide-fade-enter {
    transform: translateY(-20px);
  }
  
  .slide-fade-leave-to {
    transform: translateY(-10px);
  }
}
</style>
