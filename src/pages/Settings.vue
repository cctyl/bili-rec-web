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
      <button @click="relogin"
              class="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
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
          <div v-if="config.type === 'switch'"
               class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'toggle-' + index" v-model="config.value"
                   class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label :for="'toggle-' + index"
                   class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>

          <div v-else-if="config.type === 'text'" class="flex items-center">
            <input :id="'input-' + index" v-model="config.value" :disabled="!config.editable"
                   class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
            <button @click="toggleEdit(index)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>
          <div v-else-if="config.type === 'textpassword'" class="flex items-center">
            <input :id="'input-' + index" v-model="config.value" :type="config.editable?'text':'password'"
                   :disabled="!config.editable"
                   class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
            <button @click="toggleEdit(index)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>

          <select v-else-if="config.type === 'select'" v-model="config.value"
                  class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in config.options" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>
    </div>

    <h2 class="text-2xl font-bold mb-8 ">配置开关列表</h2>
    <!-- 配置开关列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div v-for="(config, index) in configSwitches" :key="index" class="bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-lg">{{ config.name }}</span>
          <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'toggle-' + index" v-model="config.value"
                   class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label :for="'toggle-' + index"
                   class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
        <p class="text-sm text-gray-400 mt-2">{{ config.description }}</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold mb-8 ">Cookie 列表</h2>
    <!-- Cookie 列表 -->
    <table class="min-w-full bg-gray-800 rounded-lg">
      <thead>
      <tr>
        <th class="px-4 py-2">ID</th>
        <th class="px-4 py-2">URL(空表示通用)</th>
        <th class="px-4 py-2">Key</th>
        <th class="px-4 py-2">Value</th>
        <th class="px-4 py-2">分类</th>
        <th class="px-4 py-2">用途</th>
        <th class="px-4 py-2">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(cookie, index) in cookieList" :key="cookie.id" class="border-t border-gray-700">
        <td class="px-4 py-2">{{ cookie.id }}</td>
        <td class="px-4 py-2">
          <input v-model="cookie.url" :disabled="!cookie.editable"
                 class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
        </td>
        <td class="px-4 py-2">
          <input v-model="cookie.ckey" :disabled="!cookie.editable"
                 class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
        </td>
        <td class="px-4 py-2">
          <input v-model="cookie.cvalue" :disabled="!cookie.editable" :type="cookie.editable?'text':'password'"
                 class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
        </td>
        <td class="px-4 py-2">
          <select v-model="cookie.classify" :disabled="!cookie.editable"
                  class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
            <option v-for="option in classifyOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </td>
        <td class="px-4 py-2">
          <select v-model="cookie.mediaType" :disabled="!cookie.editable"
                  class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
            <option v-for="option in mediaTypeOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </td>
        <td class="px-4 py-2">
          <button @click="toggleCookieEdit(index)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ cookie.editable ? '保存' : '编辑' }}
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 模态框 -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white p-8 rounded-lg shadow-lg z-10 " style="display:flex; flex-direction:column; align-items: center">
        <h2 class="text-xl font-bold mb-4 text-center " style="color: #000;" >请使用哔哩哔哩客户端扫码登陆</h2>
        <img :src="qrCodeDataUrl" alt="QR Code" class="w-64 h-64 mb-4">
        <div style="width:100%; display:flex; flex-direction:row; align-items: stretch">
          <button @click="checkScanResult" style="flex: 1"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-green-500 ">
            我已扫码
          </button>
          <button @click="showModal = false" style="flex: 1;margin-left: 10px"
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-red-500">
            关闭
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js';
import QRCode from 'qrcode';

export default {
  name: "setting-view",
  data() {
    return {
      userAvatar: '',
      userName: '',
      userLevel: 0,
      userCoins: 0,
      showModal: false,
      qrCodeUrl: 'https://account.bilibili.com/h5/account-h5/auth/scan-web?navhide=1&callback=close&qrcode_key=c60e9ca645691ccd0e974d55d43092ac&from=', // 替换为实际的二维码URL
      qrCodeDataUrl: '',
      systemConfigs: [
        {
          name: '最短播放时长',
          key: 'minPlaySecond',
          value: '50',
          type: 'text',
          description: '对视频点赞时模拟播放的最短时长',
          editable: false
        },
        {
          name: '百度ack',
          key: 'baidu_accesskey',
          value: '',
          type: 'textpassword',
          description: '百度图像识别的密钥',
          editable: false
        },
        {
          name: '百度client_id',
          key: 'baidu_client_id',
          value: '',
          type: 'textpassword',
          description: '百度图像识别的client_id',
          editable: false
        },
        {
          name: '百度client_secret',
          key: 'baidu_client_secret',
          value: '',
          type: 'textpassword',
          description: '百度图像识别的client_secret',
          editable: false
        },
        {
          name: '哔哩哔哩ack',
          key: 'bili:access_key',
          value: '',
          type: 'textpassword',
          description: '哔哩哔哩登陆后的认证，登陆成功后存在',
          editable: false
        },
      ],
      configSwitches: [
        {
          name: '定时任务',
          key: 'cron',
          value: true,
          description: '开启首页推荐任务，热门排行榜任务，关键词任务等三个定时任务'
        },
      ],
      cookieList: [
        {
          id: '1',
          url: 'https://example.com',
          ckey: 'session_id',
          cvalue: 'abc123',
          classify: 'COOKIE',
          mediaType: 'GENERAL',
          editable: false
        },
        {
          id: '2',
          url: 'https://example.com',
          ckey: 'auth_token',
          cvalue: 'xyz789',
          classify: 'REQUEST_HEADER',
          mediaType: 'URL_MATCHING',
          editable: false
        },
        {
          id: '3',
          url: 'https://example.com',
          ckey: 'user_pref',
          cvalue: 'dark_mode',
          classify: 'RESPONSE_HEADER',
          mediaType: 'TIMELY_UPDATE',
          editable: false
        },
      ],
      classifyOptions: ['COOKIE', 'REQUEST_HEADER', 'RESPONSE_HEADER'],
      mediaTypeOptions: ['GENERAL', 'URL_MATCHING', 'TIMELY_UPDATE']
    };
  },
  methods: {
    async relogin() {
      // 实现重新登录的逻辑
      console.log('重新登录');
      const response = await api.getWebQrCode()
      if (response.success && response.code === 20000) {
        this.qrCodeUrl = response.data;
        console.log(this.qrCodeUrl);
      }
      await this.generateQRCode();
      this.showModal = true;
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
    },
    toggleCookieEdit(index) {
      const cookie = this.cookieList[index];
      if (cookie.editable) {
        // 保存逻辑
        console.log('保存Cookie:', cookie.id, cookie.url, cookie.ckey, cookie.cvalue, cookie.classify, cookie.mediaType);
        cookie.editable = false;
      } else {
        cookie.editable = true;
      }
    },
    async fetchUserData() {
      try {
        const response = await api.checkAccessKey();
        if (response.success && response.code === 20000) {
          const data = response.data.data;
          this.userName = data.name;
          this.userLevel = data.level;
          this.userCoins = data.coins;
          this.userAvatar = process.env.VUE_APP_URL + "/config/getPic?url=" + data.face;
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
      }
    },
    async generateQRCode() {
      try {
        this.qrCodeDataUrl = await QRCode.toDataURL(this.qrCodeUrl);
      } catch (error) {
        console.error('生成二维码失败:', error);
      }
    },
    async checkScanResult() {
      try {
        const response = await api.checkScanResult();
        console.log(response);
        if (response.success && response.code === 20000 && response.data.indexOf("登陆成功") !== -1) {
          alert('登录成功');
          this.showModal = false;
          this.fetchUserData();
        } else {
          alert('登录失败，请重试');
        }
      } catch (error) {
        console.error('检查扫码结果失败:', error);
        alert('检查扫码结果失败，请重试');
      }
    }
  },

  mounted() {
    this.fetchUserData();
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