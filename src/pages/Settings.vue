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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M4 20l16-16"/>
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
      <div v-for="config in filteredSystemConfigs" :key="config.key" class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">{{ config.name }}</h3>
        <span class="block my-2 text-gray-400 text-sm">{{ config.description }}</span>
        <div class="flex items-center justify-between">
          <div v-if="config.type === 'switch'"
               class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" :id="'toggle-' + config.key" v-model="config.value"
                   @change="handleAiConfigChange(config)"
                   class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label :for="'toggle-' + config.key"
                   class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>

          <div v-else-if="config.type === 'text'" class="flex items-center">
            <input :id="'input-' + config.key" v-model="config.value" :disabled="!config.editable"
                   class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
            <button @click="toggleEdit(config.key)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>
          <div v-else-if="config.type === 'textpassword'" class="flex items-center">
            <input :id="'input-' + config.key" v-model="config.value" :type="config.editable ? 'text' : 'password'"
                   :disabled="!config.editable"
                   class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
            <button @click="toggleEdit(config.key)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>

          <select v-else-if="config.type === 'select'" v-model="config.value" @change="sysConfigUpdate = true"
                  class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in config.options" :key="option" :value="option">{{ option }}</option>
          </select>

          <div v-else-if="config.type === 'textarea'" class="w-full">
            <textarea v-model="config.value" :disabled="!config.editable"
                      @input="sysConfigUpdate = true"
                      class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-20 mb-2 resize-none">
            </textarea>
            <button @click="toggleEdit(config.key)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 配置区域 -->
    <div v-if="showAiSection" class="border-t border-gray-700 pt-8 mb-12">
      <div class="flex justify-between items-center mb-6">
        <span class="text-2xl font-bold">AI 配置</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div v-for="config in filteredAiConfigs" :key="config.key" class="bg-gray-800 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">{{ config.name }}</h3>
          <span class="block my-2 text-gray-400 text-sm">{{ config.description }}</span>
          <div class="flex items-center justify-between">
            <div v-if="config.type === 'switch'"
                 class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" :id="'ai-toggle-' + config.key" v-model="config.value"
                     @change="sysConfigUpdate = true"
                     class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label :for="'ai-toggle-' + config.key"
                     class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>

            <div v-else-if="config.type === 'text'" class="flex items-center">
              <input :id="'ai-input-' + config.key" v-model="config.value" :disabled="!config.editable"
                     class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
              <button @click="toggleEdit(config.key)"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
                {{ config.editable ? '保存' : '编辑' }}
              </button>
            </div>
            <div v-else-if="config.type === 'textpassword'" class="flex items-center">
              <input :id="'ai-input-' + config.key" v-model="config.value" :type="config.editable ? 'text' : 'password'"
                     :disabled="!config.editable"
                     class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
              <button @click="toggleEdit(config.key)"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
                {{ config.editable ? '保存' : '编辑' }}
              </button>
            </div>

            <div v-else-if="config.type === 'textarea'" class="w-full">
              <textarea v-model="config.value" :disabled="!config.editable"
                        @input="sysConfigUpdate = true"
                        class="bg-gray-700 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-20 mb-2 resize-none">
              </textarea>
              <button @click="toggleEdit(config.key)"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap">
                {{ config.editable ? '保存' : '编辑' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI 连接测试按钮 -->
      <div class="flex justify-center">
        <button @click="toggleTestPanel"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
          {{ showTestPanel ? '▼ 收起测试面板' : '▶ 测试AI连接' }}
        </button>
      </div>

      <!-- AI 测试面板 -->
      <div v-if="showTestPanel" class="mt-6 bg-gray-800 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">AI 连接测试</h3>
          <div class="flex items-center space-x-4 text-sm">
            <!-- 配置状态指示 -->
            <span :class="aiConfigComplete.apiKey ? 'text-green-500' : 'text-red-500'">
              {{ aiConfigComplete.apiKey ? '✓' : '✗' }} API密钥
            </span>
            <span :class="aiConfigComplete.baseUrl ? 'text-green-500' : 'text-red-500'">
              {{ aiConfigComplete.baseUrl ? '✓' : '✗' }} 服务地址
            </span>
            <span :class="aiConfigComplete.model ? 'text-green-500' : 'text-red-500'">
              {{ aiConfigComplete.model ? '✓' : '✗' }} 模型
            </span>
          </div>
        </div>

        <!-- 快捷测试按钮 -->
        <div class="mb-4">
          <span class="text-sm text-gray-400 mr-2">快捷测试:</span>
          <button v-for="test in quickTests" :key="test.label"
                  @click="test.action === 'clear' ? clearTestChat() : sendQuickTest(test.message)"
                  :disabled="isTesting || !aiConfigComplete.allComplete"
                  :class="test.action === 'clear' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-700'"
                  class="text-white px-3 py-1 rounded mr-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ test.label }}
          </button>
        </div>

        <!-- 消息展示区 -->
        <div class="bg-gray-900 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
          <div v-if="testMessages.length === 0" class="text-gray-500 text-center py-8">
            暂无对话记录，请发送测试消息
          </div>
          <div v-else class="space-y-3">
            <div v-for="(msg, index) in testMessages" :key="index"
                 :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
              <div :class="msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'"
                   class="max-w-[80%] rounded-lg px-4 py-2">
                <div class="flex items-center mb-1">
                  <span class="text-xs font-semibold mr-2">
                    {{ msg.role === 'user' ? '👤 你' : '🤖 AI' }}
                  </span>
                  <span v-if="msg.role === 'assistant' && msg.responseTime" class="text-xs text-gray-400">
                    {{ msg.responseTime }}ms
                  </span>
                </div>
                <div class="text-sm whitespace-pre-wrap">{{ msg.content }}</div>
              </div>
            </div>
            <!-- 加载中提示 -->
            <div v-if="isTesting" class="flex justify-start">
              <div class="bg-gray-700 rounded-lg px-4 py-2">
                <div class="flex items-center">
                  <span class="text-xs font-semibold mr-2">🤖 AI</span>
                  <span class="text-sm text-gray-400">正在思考</span>
                  <span class="ml-2 flex space-x-1">
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="flex space-x-2">
          <input v-model="testInput"
                 @keyup.enter="sendTestMessage"
                 :disabled="isTesting || !aiConfigComplete.allComplete"
                 placeholder="输入测试问题..."
                 class="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <button @click="sendTestMessage"
                  :disabled="isTesting || !testInput.trim() || !aiConfigComplete.allComplete"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
            {{ isTesting ? '发送中...' : '发送' }}
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="testError" class="mt-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4">
          <div class="flex items-start">
            <span class="text-red-500 mr-2">⚠️</span>
            <div class="flex-1">
              <div class="font-semibold text-red-400">测试失败</div>
              <div class="text-sm text-red-300 mt-1">{{ testError }}</div>
            </div>
            <button @click="testError = ''" class="text-red-400 hover:text-red-300">
              ✕
            </button>
          </div>
        </div>

        <!-- 配置不完整提示 -->
        <div v-if="!aiConfigComplete.allComplete"
             class="mt-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4">
          <div class="flex items-start">
            <span class="text-yellow-500 mr-2">⚠️</span>
            <div class="text-sm text-yellow-300">
              配置不完整，请先完成AI配置后再进行测试
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Cookie 列表 -->

    <!-- 新增按钮 -->
    <div class="flex justify-between mb-4 border-t border-gray-700 pt-8 mb-12">
      <span class="text-2xl font-bold ">Cookie 和 请求头 列表</span>

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
          <select v-model="cookie.media_type" :disabled="!cookie.editable"
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
          <select id="newCookieMediaType" v-model="newCookie.media_type"
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
          name: '哔哩哔哩ack',
          key: 'bili:access_key',
          value: '',
          type: 'textpassword',
          description: '哔哩哔哩登陆后的认证，登陆成功后存在',
          editable: false
        },
        {
          id: null,
          name: 'AI匹配',
          key: 'ai_chat_enable',
          value: false,
          type: 'switch',
          description: '将视频交给ai进行判断',
          editable: false
        },
        {
          id: null,
          name: '单一包含匹配',
          key: 'single_match',
          value: true,
          type: 'switch',
          description: '根据单一包含规则进行判断',
          editable: false
        },
        {
          id: null,
          name: '复合规则匹配',
          key: 'complex_match',
          value: false,
          type: 'switch',
          description: '根据复合规则进行判断',
          editable: false
        },
        {
          id: null,
          name: 'AI API密钥',
          key: 'ai_api_key',
          value: '',
          type: 'textpassword',
          description: 'AI服务的API密钥',
          editable: false
        },
        {
          id: null,
          name: 'AI服务地址',
          key: 'ai_base_url',
          value: '',
          type: 'text',
          description: 'AI服务的基础URL',
          editable: false
        },
        {
          id: null,
          name: 'AI模型',
          key: 'ai_model',
          value: '',
          type: 'text',
          description: '使用的AI模型名称，比如glm-4-flash,kimi-xxx',
          editable: false
        },
        {
          id: null,
          name: 'AI温度参数',
          key: 'ai_temperature',
          value: '0.7',
          type: 'text',
          description: 'AI生成内容的随机性 (0-2)，默认即可',
          editable: false
        },
        {
          id: null,
          name: 'AI最大Token数',
          key: 'ai_max_tokens',
          value: '4096',
          type: 'text',
          description: 'AI回复的最大Token数量，默认即可',
          editable: false
        },
        {
          id: null,
          name: 'AI系统提示语',
          key: 'ai_system_prompt',
          value: '根据用户发送到视频相关信息，结合用户提供的判断依据，判断该视频是否符合黑/白名单规则',
          type: 'textarea',
          description: 'AI的初始提示词',
          editable: false
        },

      ],
      showAddCookieModal: false,
      newCookie: {
        url: null,
        ckey: '',
        cvalue: '',
        classify: '',
        media_type: ''
      },
      cookieList: [
        {
          id: '1',
          url: 'https://example.com',
          ckey: 'session_id',
          cvalue: 'abc123',
          classify: 'COOKIE',
          media_type: 'GENERAL',
          editable: false
        },
        {
          id: '2',
          url: 'https://example.com',
          ckey: 'auth_token',
          cvalue: 'xyz789',
          classify: 'REQUEST_HEADER',
          media_type: 'URL_MATCHING',
          editable: false
        },
        {
          id: '3',
          url: 'https://example.com',
          ckey: 'user_pref',
          cvalue: 'dark_mode',
          classify: 'RESPONSE_HEADER',
          media_type: 'TIMELY_UPDATE',
          editable: false
        },
      ],
      classifyOptions: ['COOKIE', 'REQUEST_HEADER', 'RESPONSE_HEADER'],
      mediaTypeOptions: ['GENERAL', 'URL_MATCHING', 'TIMELY_UPDATE'],
      currentPage: 1,
      totalPages: 1,
      pageSize: 5,
      sysConfigUpdate: false,
      // AI 测试相关
      showTestPanel: false,
      testMessages: [],
      testInput: '',
      isTesting: false,
      testError: '',
      quickTests: [
        {label: '👋 打招呼', message: '你好，请用一句话介绍你自己'},
        {label: '🧮 数学测试', message: '1+1等于几？'},
        {label: '📝 写作测试', message: '用一句话描述人工智能'},
        {label: '🗑️ 清空对话', action: 'clear'}
      ]
    };
  },

  computed: {
    showAiSection() {
      const aiChatEnabled = this.systemConfigs.find(config => config.key === 'ai_chat_enable');
      return aiChatEnabled && aiChatEnabled.value === true;
    },
    filteredSystemConfigs() {
      // 过滤掉 AI 相关的配置，但保留 ai_chat_enable 开关
      return this.systemConfigs.filter(config => {
        const isAiConfig = config.key.startsWith('ai_');
        return !isAiConfig || config.key === 'ai_chat_enable';
      });
    },
    filteredAiConfigs() {
      // 只显示 AI 相关的配置
      return this.systemConfigs.filter(config => {
        const isAiConfig = config.key.startsWith('ai_');
        return isAiConfig && config.key !== 'ai_chat_enable';
      });
    },
    aiConfigComplete() {
      const apiKey = this.systemConfigs.find(c => c.key === 'ai_api_key')?.value;
      const baseUrl = this.systemConfigs.find(c => c.key === 'ai_base_url')?.value;
      const model = this.systemConfigs.find(c => c.key === 'ai_model')?.value;

      return {
        apiKey: !!apiKey,
        baseUrl: !!baseUrl,
        model: !!model,
        allComplete: !!apiKey && !!baseUrl && !!model
      };
    }
  },

  methods: {

    /**
     * 检查是否至少开启了一个匹配模式
     */
    checkMatchRule() {
      const targetKeys = ['single_match', 'ai_chat_enable', 'complex_match'];

// 收集目标字段的值
      const targetValues = this.systemConfigs
          .filter(item => targetKeys.includes(item.key))
          .map(item => item.value);

// 检查是否找到了所有目标字段，并且所有值都为 false
      const allFalse = targetValues.length === targetKeys.length &&
          targetValues.every(value => value === false);

      console.log("检查结果", allFalse, targetValues)
      return !allFalse;
    },

    handleAiConfigChange(config) {
      this.sysConfigUpdate = true;
      // 如果是 ai_chat_enable 开关被改变，强制更新页面
      if (config.key === 'ai_chat_enable') {
        this.$forceUpdate();
      }
    },
    async relogin() {
      // 实现重新登录的逻辑
      console.log('重新登录');
      const response = await api.getTvQrCode()
      if (response.code === 200) {
        this.qrCodeUrl = response.data;
        console.log(this.qrCodeUrl);
        await this.generateQRCode();
        this.showModal = true;
      } else {
        this.$message('二维码链接获取失败：', 'error');
      }

    },
    toggleEdit(configKey) {
      this.sysConfigUpdate = true;
      const config = this.systemConfigs.find(c => c.key === configKey);
      if (config) {
        if (config.editable) {
          // 保存逻辑
          console.log('保存配置:', config.name, config.value);
          config.editable = false;
        } else {
          config.editable = true;
        }
      }
    },
    async addCookie() {
      try {

        const response = await api.addCookie(this.newCookie);
        if (response.code === 200) {
          this.newCookie.id = response.data.id;
          this.cookieList.push({...this.newCookie, editable: false});
          this.showAddCookieModal = false;
          this.newCookie = {url: null, ckey: '', cvalue: '', classify: '', media_type: ''};
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
        if (response.code === 200) {
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
        const response = await api.deleteCookie(cookie.id);
        if (response.code === 200) {
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
      if (this.isFetching) {
        return;
      }
      this.isFetching = true;
      try {


        const response = await this.$checkLogin();

        if (response != null) {
          console.log("resp = ", response)
          if (response.code === 200) {
            const data = response.data.data;
            this.userName = data.name;
            this.userLevel = data.level;
            this.userCoins = data.coins;
            this.userAvatar = process.env.VUE_APP_URL + "/config/getPic?url=" + data.face;

            this.$message('刷新用户信息成功', 'success');
          }
        } else {
          console.log("登陆失效，请重新登陆");
          this.relogin();
        }


      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setTimeout(() => {
          this.isFetching = false;
        }, 300);

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
        if (response.code === 200 && response.data.indexOf("登陆成功") !== -1) {
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
        if (response.code === 200) {
          const data = response.data;
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
        if (response.code === 200) {
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

          this.saveConfig();

        }
      } catch (error) {
        console.error('获取配置列表失败:', error);
      }
    },

    /**
     * 持久化配置
     */
    saveConfig() {
      let standardConfig = {};
      this.systemConfigs.forEach(config => {
        standardConfig[config.key] = config.value;
      });
      localStorage.setItem("standardConfig", JSON.stringify(standardConfig))
    },

    /**
     * 提交配置修改
     * @returns {Promise<void>}
     */
    async updateConfigData() {


      if (!this.checkMatchRule()) {

        this.$message('三种匹配规则至少要开启一种，否则无法正常工作', 'error');
        return;
      }


      try {

        this.saveConfig();

        const data = this.systemConfigs.map(config => ({
          id: config.id,
          name: config.key,
          value: config.value.toString() // 将所有值转换为字符串
        }));
        const response = await api.addOrUpdateConfig(data);
        if (!(response.code === 200)) {
          throw new Error('配置保存失败');
        } else {
          this.sysConfigUpdate = false;
        }
      } catch (error) {
        console.error('修改Cookie失败:', error);
        throw error; // 重新抛出错误，让调用方能够捕获
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
    },
    // AI 测试相关方法
    async toggleTestPanel() {
      // 如果当前测试面板是关闭的，且存在未保存的配置，先保存配置
      if (!this.showTestPanel && this.sysConfigUpdate) {
        try {
          await this.updateConfigData();
          this.$message('配置已保存', 'success');
        } catch (error) {
          this.$message('配置保存失败，无法打开测试面板', 'error');
          return;
        }
      }
      this.showTestPanel = !this.showTestPanel;
    },
    clearTestChat() {
      this.testMessages = [];
      this.testError = '';
      this.$message('对话已清空', 'success');
    },
    async sendQuickTest(message) {
      this.testInput = message;
      await this.sendTestMessage();
    },
    async sendTestMessage() {
      const message = this.testInput.trim();
      if (!message) return;

      // 清除之前的错误
      this.testError = '';

      // 添加用户消息
      this.testMessages.push({
        role: 'user',
        content: message
      });

      // 清空输入框
      this.testInput = '';

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      // 开始测试
      this.isTesting = true;

      try {
        const startTime = Date.now();

        // 获取系统提示语
        const systemPrompt = this.systemConfigs.find(c => c.key === 'ai_system_prompt')?.value || '你是一个专业、友好、有帮助的AI助手。';

        // 构建消息列表：system + 历史对话
        const messages = [
          {
            role: 'system',
            content: systemPrompt
          }
        ];

        // 添加历史对话（排除当前正在发送的消息）
        this.testMessages
            .slice(0, -1)
            .forEach(msg => {
              // role 已经是标准格式：user, assistant
              messages.push({
                role: msg.role,
                content: msg.content
              });
            });

        // 添加当前用户消息
        messages.push({
          role: 'user',
          content: message
        });

        const response = await api.testAiChat({
          messages: messages
        });

        const responseTime = Date.now() - startTime;

        if (response.code === 200) {
          // 添加AI响应（data 直接是字符串）
          this.testMessages.push({
            role: 'assistant',
            content: response.data,
            responseTime: responseTime
          });

          this.$message('测试成功', 'success');
        } else {
          // 处理错误
          this.testError = response.message || '测试失败，请检查配置';

          // 移除用户消息（因为发送失败了）
          this.testMessages.pop();
        }
      } catch (error) {
        console.error('AI测试失败:', error);
        this.testError = error.message || '网络错误，请检查网络连接';

        // 移除用户消息（因为发送失败了）
        this.testMessages.pop();
      } finally {
        this.isTesting = false;

        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const messageContainer = this.$el.querySelector('.overflow-y-auto');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
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

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}

/* 添加转圈动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 2s linear infinite;
}
</style>