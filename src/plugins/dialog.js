import Vue from 'vue';
import DialogComponent from '@/components/Dialog.vue';

const DialogConstructor = Vue.extend(DialogComponent);

// 单例模式，确保只有一个对话框实例
let instance = null;

function getInstance() {
  if (!instance) {
    instance = new DialogConstructor();
    instance.$mount(document.createElement('div'));
    document.body.appendChild(instance.$el);
  }
  return instance;
}

/**
 * 显示对话框
 * @param {string|object} options - 消息字符串或配置对象
 * @returns {Promise} - 返回Promise，用户点击确定返回true，取消返回false
 */
function showDialog(options) {
  const dialog = getInstance();
  return dialog.show(options);
}

/**
 * 显示成功对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题（可选）
 * @returns {Promise}
 */
function showSuccess(message, title = '') {
  return showDialog({
    message,
    title,
    type: 'success',
    confirmText: '确定'
  });
}

/**
 * 显示错误对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题（可选）
 * @returns {Promise}
 */
function showError(message, title = '') {
  return showDialog({
    message,
    title,
    type: 'error',
    confirmText: '确定'
  });
}

/**
 * 显示警告对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题（可选）
 * @returns {Promise}
 */
function showWarning(message, title = '') {
  return showDialog({
    message,
    title,
    type: 'warning',
    confirmText: '确定'
  });
}

/**
 * 显示信息对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题（可选）
 * @returns {Promise}
 */
function showInfo(message, title = '') {
  return showDialog({
    message,
    title,
    type: 'info',
    confirmText: '确定'
  });
}

/**
 * 显示确认对话框（带取消按钮）
 * @param {string} message - 消息内容
 * @param {string} title - 标题（可选）
 * @param {string} confirmText - 确认按钮文字
 * @param {string} cancelText - 取消按钮文字
 * @returns {Promise} - 点击确定返回true，取消返回false
 */
function showConfirm(message, title = '', confirmText = '确定', cancelText = '取消') {
  return showDialog({
    message,
    title,
    type: 'warning',
    showCancel: true,
    confirmText,
    cancelText
  });
}

const DialogPlugin = {
  install(Vue) {
    // 挂载到 Vue 原型
    Vue.prototype.$dialog = showDialog;
    Vue.prototype.$alert = showDialog; // 别名，兼容 alert 用法
    Vue.prototype.$success = showSuccess;
    Vue.prototype.$error = showError;
    Vue.prototype.$warning = showWarning;
    Vue.prototype.$info = showInfo;
    Vue.prototype.$confirm = showConfirm;
  }
};

export default DialogPlugin;
