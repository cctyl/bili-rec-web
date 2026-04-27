<template>
  <transition name="dialog-fade">
    <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
      <div class="dialog-container" :class="type" @click.stop>
        <!-- 图标区域 -->
        <div class="dialog-icon">
          <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <!-- 标题 -->
        <h3 v-if="title" class="dialog-title">{{ title }}</h3>
        
        <!-- 内容 -->
        <p class="dialog-content">{{ message }}</p>
        
        <!-- 按钮区域 -->
        <div class="dialog-actions">
          <button v-if="showCancel" class="dialog-btn dialog-btn-cancel" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button class="dialog-btn dialog-btn-confirm" :class="type" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Dialog-component',
  data() {
    return {
      visible: false,
      title: '',
      message: '',
      type: 'info', // info, success, warning, error
      confirmText: '确定',
      cancelText: '取消',
      showCancel: false,
      closeOnOverlay: true,
      resolve: null,
      reject: null
    };
  },
  methods: {
    show(options) {
      if (typeof options === 'string') {
        this.message = options;
        this.title = '';
        this.type = 'info';
        this.showCancel = false;
        this.confirmText = '确定';
      } else {
        this.message = options.message || '';
        this.title = options.title || '';
        this.type = options.type || 'info';
        this.confirmText = options.confirmText || '确定';
        this.cancelText = options.cancelText || '取消';
        this.showCancel = options.showCancel || false;
        this.closeOnOverlay = options.closeOnOverlay !== false;
      }
      
      this.visible = true;
      
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    handleConfirm() {
      this.visible = false;
      if (this.resolve) this.resolve(true);
    },
    handleCancel() {
      this.visible = false;
      if (this.resolve) this.resolve(false);
    },
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.handleCancel();
      }
    }
  }
};
</script>

<style scoped>
/* 遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

/* 对话框容器 - Material Design 3 */
.dialog-container {
  background: #2D2A32;
  border-radius: 28px;
  padding: 32px 24px;
  min-width: 280px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 图标区域 */
.dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
}

.dialog-icon svg {
  width: 40px;
  height: 40px;
}

/* 不同类型图标背景 */
.dialog-container.success .dialog-icon {
  background: rgba(74, 222, 128, 0.15);
  color: #4ADE80;
}

.dialog-container.error .dialog-icon {
  background: rgba(248, 113, 113, 0.15);
  color: #F87171;
}

.dialog-container.warning .dialog-icon {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.dialog-container.info .dialog-icon {
  background: rgba(208, 188, 255, 0.15);
  color: #D0BCFF;
}

/* 标题 */
.dialog-title {
  font-size: 20px;
  font-weight: 500;
  color: #E6E1E5;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

/* 内容 */
.dialog-content {
  font-size: 14px;
  color: #CAC4D0;
  margin: 0 0 24px 0;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 按钮区域 */
.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 按钮基础样式 */
.dialog-btn {
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  min-width: 100px;
}

.dialog-btn:hover {
  transform: translateY(-1px);
}

.dialog-btn:active {
  transform: translateY(0);
}

/* 取消按钮 */
.dialog-btn-cancel {
  background: transparent;
  color: #D0BCFF;
  border: 1px solid rgba(208, 188, 255, 0.5);
}

.dialog-btn-cancel:hover {
  background: rgba(208, 188, 255, 0.1);
}

/* 确认按钮 - 默认 */
.dialog-btn-confirm {
  background: #D0BCFF;
  color: #381E72;
}

.dialog-btn-confirm:hover {
  background: #E8DEF8;
}

/* 确认按钮 - 不同类型 */
.dialog-btn-confirm.success {
  background: #4ADE80;
  color: #00391A;
}

.dialog-btn-confirm.success:hover {
  background: #5AE890;
}

.dialog-btn-confirm.error {
  background: #F87171;
  color: #450A0A;
}

.dialog-btn-confirm.error:hover {
  background: #FCA5A5;
}

.dialog-btn-confirm.warning {
  background: #FBBF24;
  color: #451A03;
}

.dialog-btn-confirm.warning:hover {
  background: #FCD34D;
}

/* 淡入淡出动画 */
.dialog-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.dialog-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.dialog-fade-enter {
  opacity: 0;
}

.dialog-fade-enter .dialog-container {
  transform: scale(0.9);
  opacity: 0;
}

.dialog-fade-enter-active .dialog-container {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.dialog-fade-leave-active .dialog-container {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
  transform: scale(0.95);
  opacity: 0;
}

.dialog-fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .dialog-container {
    padding: 24px 20px;
    border-radius: 24px;
  }
  
  .dialog-icon {
    width: 56px;
    height: 56px;
  }
  
  .dialog-icon svg {
    width: 32px;
    height: 32px;
  }
  
  .dialog-title {
    font-size: 18px;
  }
  
  .dialog-btn {
    padding: 10px 20px;
    min-width: 80px;
  }
}
</style>
