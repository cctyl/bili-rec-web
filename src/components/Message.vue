<template>
    <transition name="fade">
      <div v-if="visible" class="message" :class="type">
        {{ message }}
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
      show(message, type = 'info',time=2000) {
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
  
  <style>
  .message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 4px;
    color: #fff;
    z-index: 1000;
  }
  .message.info {
    background-color: #909399;
  }
  .message.success {
    background-color: #67c23a;
  }
  .message.warning {
    background-color: #e6a23c;
  }
  .message.error {
    background-color: #f56c6c;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>