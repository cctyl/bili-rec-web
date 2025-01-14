import Vue from 'vue';
import MessageComponent from '@/components/Message.vue';

const MessageConstructor = Vue.extend(MessageComponent);

function showMessage(message, type) {
  const instance = new MessageConstructor();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  instance.show(message, type);
}

const MessagePlugin = {
  install(Vue) {
    Vue.prototype.$message = showMessage;
  }
};

export default MessagePlugin;