<template>
    <transition name="dialog-fade">
      <div v-if="visible" class="dialog-overlay" @click.self="close">
        <div class="dialog">
          <div class="dialog-header">
            <span class="dialog-title">{{ title }}</span>
            <button class="dialog-close" @click="close">×</button>
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
          <div class="dialog-footer">
            <slot name="footer" >


            </slot>
            <button @click="close" class="ml-4">关闭</button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'dialog-component',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      onClose:Function,

    },
    mounted() {
      console.log("Dialog", this.visible)
    },
    watch: {
      visible(val) {
        console.log('DIALOG','visible change', val)
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
        if (this.onClose) {
          this.onClose();
        }

      }
    }
  };
  </script>
  
  <style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .dialog {
    background: #1F2937; /* 深灰色背景 */
    border-radius: 8px;
    width: 500px;
    max-width: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    color: #F9FAFB; /* 白色文字 */
  }
  .dialog-header {
    padding: 15px;
    border-bottom: 1px solid #4B5563; /* 边框颜色 */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dialog-title {
    font-size: 18px;
    font-weight: 500;
  }
  .dialog-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #F9FAFB; /* 白色文字 */
  }
  .dialog-body {
    padding: 20px;
  }
  .dialog-footer {
    padding: 10px 15px;
    border-top: 1px solid #4B5563; /* 边框颜色 */
    text-align: right;
  }
  .dialog-fade-enter-active, .dialog-fade-leave-active {
    transition: opacity 0.3s;
  }
  .dialog-fade-enter, .dialog-fade-leave-to /* .dialog-fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>