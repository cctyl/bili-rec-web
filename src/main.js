import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MessagePlugin from './plugins/message'
import './assets/styles.css'
Vue.use(MessagePlugin);
Vue.config.productionTip = false;


//全局日志代理
(function() {
  const originalConsoleLog = console.log;

  console.log = function(...args) {
    // 获取调用堆栈信息
    const stack = new Error().stack.split('\n');
    // 解析堆栈信息以获取文件名和行号
    const callerLine = stack[2]; // stack[0] 是 Error 对象本身，stack[1] 是当前函数，stack[2] 是调用者信息
    const callerInfo = callerLine.match(/at\s+(?:.*\s+)?\((.*):(\d+):(\d+)\)/);

    if (callerInfo) {
      const [, file, line, column] = callerInfo;
      let fileN = file.substring(file.indexOf("src"));
      // 将文件名和行号信息附加到日志参数中
      args.push(`(File: ${fileN}, Line: ${line}, Column: ${column})`);
    }

    // 调用原始的 console.log 方法
    originalConsoleLog.apply(console, args);
  };
})();


const vm = new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


export default vm;