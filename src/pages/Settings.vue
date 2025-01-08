<template>
  <!-- 主内容区 -->
  <div class="flex-1 p-8 overflow-y-auto">
    <div class="relative flex flex-col items-center mb-8">
      <img :src="userAvatar" alt="User Avatar" class="w-20 h-20 rounded-full mb-4">
      <h2 class="text-2xl font-bold mb-2">{{ userName }}</h2>
      <div class="flex items-center mb-2">
        <span class="text-red-500 font-bold">lv{{ userLevel }}</span>
      </div>
      <div class="flex items-center">
        <span class="mr-4">硬币数: {{ userCoins }}</span>
      </div>
      <button @click="relogin" class="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
        重新登录
      </button>
    </div>
    <h2 class="text-2xl font-bold mb-8">配置模块</h2>
    <!-- 系统配置列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div v-for="(config, index) in systemConfigs" :key="index" class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">{{ config.name }}</h3>
        <div class="flex items-center justify-between">
          <span>{{ config.description }}</span>

          <div v-if="config.type === 'switch'" class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'sys-toggle-' + index" v-model="config.value"
                   class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label :for="'sys-toggle-' + index" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>

          <div v-else-if="config.type === 'text'" class="flex items-center">
            <input :id="'input-' + index" v-model="config.value" :disabled="!config.editable" class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
            <button @click="toggleEdit(index)" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>

          <select v-else-if="config.type === 'select'"
                  v-model="config.value" class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in config.options" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>
    </div>
    <h2 class="text-2xl font-bold mb-8">配置开关列表</h2>
    <!-- 配置开关列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(config, index) in configSwitches" :key="index" class="bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-lg">{{ config.name }}</span>
          <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'toggle-' + index" v-model="config.value"
                   class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label :for="'toggle-' + index" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
        <p class="text-sm text-gray-400 mt-2">{{ config.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"setting-view",
  data() {
    return {
      userAvatar: 'https://i1.hdslb.com/bfs/face/13703d9b4b25e46a06f8928cd2cced5c315638a7.jpg',
      userName: '张明',
      userLevel: 6,
      userCoins: 100,
      systemConfigs: [
        { name: 'API Token', value: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'text', description: 'API访问令牌', editable: false },
        { name: 'Cookie', value: 'session=abcdef1234567890', type: 'text', description: '会话Cookie', editable: false },
        { name: '审核级别', value: '严格', type: 'select', description: '内容审核严格程度', options: ['宽松', '适中', '严格'] },
        { name: '自动审核', value: true, type: 'switch', description: '开启自动审核功能' },
      ],
      configSwitches: [
        { name: '关键词过滤', value: true, description: '开启关键词过滤功能' },
        { name: '图像识别', value: true, description: '开启图像内容识别功能' },
        { name: '异常警报', value: true, description: '开启异常内容警报通知' },
        { name: '实时监控', value: false, description: '开启内容实时监控功能' },
        { name: '用户反馈', value: true, description: '允许用户提交内容反馈' },
        { name: 'AI辅助审核', value: true, description: '使用AI技术辅助内容审核' },
        { name: '多语言支持', value: false, description: '启用多语言内容审核支持' },
        { name: '敏感信息检测', value: true, description: '检测并过滤敏感个人信息' },
      ]
    };
  },
  methods: {
    relogin() {
      // 实现重新登录的逻辑
      console.log('重新登录');
    },
    toggleEdit(index) {
      const config = this.systemConfigs[index];
      if (config.editable) {
        // 保存逻辑
        console.log('保存配置:', config.name, config.value);
        config.editable = false;
      } else {
        config.editable = true;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
body {
  font-family: 'Roboto', sans-serif;
}
/* 移除number input的默认箭头 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #2d3748;
}
::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
/* 开关样式 */
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>