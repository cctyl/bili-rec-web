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
      <button @click="fetchUserData" :class="{ 'animate-spin': isFetching }"
              class="absolute top-0 left-0 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M4 20l16-16" />
        </svg>
      </button>
    </div>

    <div class="config-module flex justify-between items-center mb-8 p-4">
      <!-- 标题 -->
      <span class="text-2xl font-bold">配置模块</span>
      <!-- 提交按钮 -->
      <button @click="updateConfigData" :disabled="!sysConfigUpdate"
        :class="{ 'bg-green-500 hover:bg-green-600': sysConfigUpdate, 'bg-gray-400 cursor-not-allowed': !sysConfigUpdate }"
        class="text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-green-500">
        提交配置修改
      </button>
    </div>
    <!-- 系统配置列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div v-for="(config, index) in systemConfigs" :key="index" class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">{{ config.name }}</h3>
        <div class="flex items-center justify-between">
          <div v-if="config.type === 'switch'"
            class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'toggle-' + index" v-model="config.value" @click="sysConfigUpdate = true"
              class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
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
            <input :id="'input-' + index" v-model="config.value" :type="config.editable ? 'text' : 'password'"
              :disabled="!config.editable"
              class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
            <button @click="toggleEdit(index)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>

          <select v-else-if="config.type === 'select'" v-model="config.value" @change="sysConfigUpdate = true"
            class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in config.options" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>
    </div>


    <!-- Cookie 列表 -->

    <!-- 新增按钮 -->
    <div class="flex justify-between mb-4">
      <span class="text-2xl font-bold ">Cookie 列表</span>

      <button @click="showAddCookieModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        新增Cookie
      </button>
    </div>

    <!-- Cookie 列表 -->
    <table class="min-w-full bg-gray-800 rounded-lg">
      <thead>
        <tr>
          <th class="px-2 py-2 w-1/6">URL(空表示通用)</th>
          <th class="px-4 py-2">Key</th>
          <th class="px-4 py-2">Value</th>
          <th class="px-4 py-2">分类</th>
          <th class="px-4 py-2">用途</th>
          <th class="px-4 py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cookie, index) in cookieList" :key="cookie.id" class="border-t border-gray-700">
          <td class="px-2 py-2">
            <input v-model="cookie.url" :disabled="!cookie.editable"
              class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
          </td>
          <td class="px-4 py-2">
            <input v-model="cookie.ckey" :disabled="!cookie.editable"
              class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
          </td>
          <td class="px-4 py-2">
            <input v-model="cookie.cvalue" :disabled="!cookie.editable" :type="cookie.editable ? 'text' : 'password'"
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
          <td class="px-4 py-2 flex space-x-2">
            <button @click="toggleCookieEdit(index)"
              class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
              {{ cookie.editable ? '保存' : '编辑' }}
            </button>
            <button @click="deleteCookie(index)"
              class="text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-red-500">
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页条 -->
    <div class="flex justify-between items-center mt-4">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="bg-gray-700 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        上一页
      </button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="bg-gray-700 text-white px-4 py-2 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        下一页
      </button>
    </div>
    <!-- 新增Cookie模态框 -->
    <div v-if="showAddCookieModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg w-1/2">
        <h3 class="text-xl font-bold mb-4">新增Cookie</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="newCookieUrl">URL</label>
          <input type="text" id="newCookieUrl" v-model="newCookie.url"
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="newCookieKey">Key</label>
          <input type="text" id="newCookieKey" v-model="newCookie.ckey"
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="newCookieValue">Value</label>
          <input type="text" id="newCookieValue" v-model="newCookie.cvalue"
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="newCookieClassify">分类</label>
          <select id="newCookieClassify" v-model="newCookie.classify"
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in classifyOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="newCookieMediaType">用途</label>
          <select id="newCookieMediaType" v-model="newCookie.mediaType"
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in mediaTypeOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="showAddCookieModal = false"
            class="px-4 py-2 bg-gray-600 text-white rounded-md !rounded-button hover:bg-gray-500 whitespace-nowrap">
            取消
          </button>
          <button @click="addCookie"
            class="px-4 py-2 bg-blue-500 text-white rounded-md !rounded-button hover:bg-blue-600 whitespace-nowrap">
            添加
          </button>
        </div>
      </div>
    </div>
    <!-- 模态框 -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white p-8 rounded-lg shadow-lg z-10 "
        style="display:flex; flex-direction:column; align-items: center">
        <h2 class="text-xl font-bold mb-4 text-center " style="color: #000;">请使用哔哩哔哩客户端扫码登陆</h2>
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
      isFetching: false,
      systemConfigs: [
        {
          id: null,
          name: '最短播放时长',
          key: 'minPlaySecond',
          value: '50',
          type: 'text',
          description: '对视频点赞时模拟播放的最短时长',
          editable: false
        },
        {
          id: null,
          name: '百度ack',
          key: 'baidu_accesskey',
          value: '',
          type: 'textpassword',
          description: '百度图像识别的密钥',
          editable: false
        },
        {
          id: null,
          name: '百度client_id',
          key: 'baidu_client_id',
          value: '',
          type: 'textpassword',
          description: '百度图像识别的client_id',
          editable: false
        },
        {
          id: null,
          name: '百度client_secret',
          key: 'baidu_client_secret',
          value: '',
          type: 'textpassword',
          description: '百度图像识别的client_secret',
          editable: false
        },
        {
          id: null,
          name: '哔哩哔哩ack',
          key: 'bili:access_key',
          value: '',
          type: 'textpassword',
          description: '哔哩哔哩登陆后的认证，登陆成功后存在',
          editable: false
        },
        {
          id: null,
          name: '定时任务',
          key: 'cron',
          value: false,
          type: 'switch',
          description: '开启首页推荐任务，热门排行榜任务，关键词任务等三个定时任务'
        },
      ],
      showAddCookieModal: false,
      newCookie: {
        url: null,
        ckey: '',
        cvalue: '',
        classify: '',
        mediaType: ''
      },
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
      mediaTypeOptions: ['GENERAL', 'URL_MATCHING', 'TIMELY_UPDATE'],
      currentPage: 1,
      totalPages: 1,
      pageSize: 5,
      sysConfigUpdate: false,
    };
  },

  methods: {
    async relogin() {
      // 实现重新登录的逻辑
      console.log('重新登录');
      const response = await api.getTvQrCode()
      if (response.success && response.code === 20000) {
        this.qrCodeUrl = response.data;
        console.log(this.qrCodeUrl);
      }
      await this.generateQRCode();
      this.showModal = true;
    },
    toggleEdit(index) {
      this.sysConfigUpdate = true;
      const config = this.systemConfigs[index];
      if (config.editable) {
        // 保存逻辑
        console.log('保存配置:', config.name, config.value);
        config.editable = false;
      } else {
        config.editable = true;
      }
    },
    async addCookie() {
      try {
        if (this.newCookie.url) {
          this.newCookie.url = null;
        }
        const response = await api.addCookie(this.newCookie);
        if (response.success && response.code === 20000) {
          this.cookieList.push({ ...this.newCookie, editable: false });
          this.showAddCookieModal = false;
          this.newCookie = { url: null, ckey: '', cvalue: '', classify: '', mediaType: '' };
        } else {
          alert('新增Cookie失败，请重试');
        }
      } catch (error) {
        console.error('新增Cookie失败:', error);
        alert('新增Cookie失败，请重试');
      }
    },
    async updateCookie(index) {
      const cookie = this.cookieList[index];
      try {
        const response = await api.updateCookie(cookie);
        if (response.success && response.code === 20000) {
          cookie.editable = false;
        } else {
          alert('修改Cookie失败，请重试');
        }
      } catch (error) {
        console.error('修改Cookie失败:', error);
        alert('修改Cookie失败，请重试');
      }
    },
    async deleteCookie(index) {
      const cookie = this.cookieList[index];
      try {
        const response = await api.deleteCookie({ id: cookie.id });
        if (response.success && response.code === 20000) {
          this.cookieList.splice(index, 1);
        } else {
          alert('删除Cookie失败，请重试');
        }
      } catch (error) {
        console.error('删除Cookie失败:', error);
        alert('删除Cookie失败，请重试');
      }
    },
    toggleCookieEdit(index) {
      const cookie = this.cookieList[index];
      if (cookie.editable) {
        this.updateCookie(index);
      } else {
        cookie.editable = true;
      }
    },
    async fetchUserData() {
      if (this.isFetching){
        return;
      }
      this.isFetching = true;
      try {
        const response = await api.checkAccessKey();
        if (response.success && response.code === 20000) {
          const data = response.data.data;
          this.userName = data.name;
          this.userLevel = data.level;
          this.userCoins = data.coins;
          this.userAvatar = process.env.VUE_APP_URL + "/config/getPic?url=" + data.face;
        }else if(response.message.indexOf("未登录/登录失效")!==-1){
            console.log("登陆失效，请重新登陆");
            this.relogin();
        }


      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setTimeout(()=>{
          this.isFetching = false;
        },300);

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
        const response = await api.checkTvScanResult();
        console.log(response);
        if (response.success && response.code === 20000 && response.data.indexOf("登陆成功") !== -1) {
          alert('登录成功');
          this.showModal = false;
          this.fetchUserData();
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('检查扫码结果失败:', error);
        alert('检查扫码结果失败，请重试');
      }
    },
    async fetchCookieList(page, limit) {
      try {
        const response = await api.getCookieList(page, limit);
        if (response.success && response.code === 20000) {
          const data = response.data.page;
          this.cookieList = data.records.map(record => ({
            ...record,
            editable: false
          }));
          this.totalPages = data.pages;
          this.currentPage = data.current;
        }
      } catch (error) {
        console.error('获取Cookie列表失败:', error);
      }
    },
    async fetchConfigData() {
      try {
        const response = await api.getConfigList();
        if (response.success && response.code === 20000) {
          const data = response.data;
          //遍历systemConfigs，取出key，根据这个key到data中查找name=该key的对象，然后取出data中对象的value，设置到systemConfigs对象中的value
          this.systemConfigs.forEach(config => {
            const key = config.key;
            const target = data.find(item => item.name === key);
            if (target) {

              config.value = target.value;
              config.id = target.id;

            }

            if (config.type === 'switch') {
              config.value = config.value === 'true';
            }

          });

        }
      } catch (error) {
        console.error('获取配置列表失败:', error);
      }
    },
    async updateConfigData() {

      try {

        const data = this.systemConfigs.map(config => ({
          id: config.id,
          name: config.key,
          value: config.value
        }));
        const response = await api.addOrUpdateConfig(data);
        if (!(response.success && response.code === 20000)) {
          alert('修改Cookie失败，请重试');
        } else {
          this.sysConfigUpdate = false;
        }
      } catch (error) {
        console.error('修改Cookie失败:', error);
        alert('修改Cookie失败，请重试');
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchCookieList(this.currentPage, this.pageSize);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchCookieList(this.currentPage, this.pageSize);
      }
    }
  },

  mounted() {
    this.fetchUserData();
    this.fetchCookieList(this.currentPage, this.pageSize);
    this.fetchConfigData();
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

.toggle-checkbox:checked+.toggle-label {
  background-color: #68D391;
}

/* 添加转圈动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 2s linear infinite;
}
</style>