<template>
  <!-- 主内容区 -->
  <div class="flex-1 p-6 overflow-y-auto bg-[#1C1B1F]">
    <!-- 用户信息卡片 - Material Design 3 Elevated Card -->
    <div class="bg-[#2D2A32] rounded-2xl p-6 mb-6 shadow-lg shadow-black/20">
      <div class="relative flex flex-col items-center">
        <!-- 刷新按钮 - Material Design 3 Icon Button -->
        <button @click="fetchUserData" :class="{ 'animate-spin': isFetching }"
                class="absolute top-0 left-0 w-10 h-10 rounded-full bg-[#4A4458] hover:bg-[#5A5468] transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#E6E1E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M4 20l16-16"/>
          </svg>
        </button>
        
        <!-- 重新登录按钮 - Material Design 3 Filled Button -->
        <button @click="relogin"
                class="absolute top-0 right-0 bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] focus:ring-offset-2 focus:ring-offset-[#2D2A32]">
          重新登录
        </button>
        
        <!-- 用户头像 - 带边框 -->
        <div class="relative mb-4">
          <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#D0BCFF] to-[#9A82DB]">
            <img :src="userAvatar" alt="User Avatar" class="w-full h-full rounded-full object-cover bg-[#1C1B1F]">
          </div>
          <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#D0BCFF] rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-[#381E72]">lv{{ userLevel }}</span>
          </div>
        </div>
        
        <!-- 用户名 -->
        <h2 class="text-2xl font-medium text-[#E6E1E5] mb-1">{{ userName }}</h2>
        
        <!-- 硬币数 -->
        <div class="flex items-center gap-2 text-[#CAC4D0]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#FFD700]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <span class="text-sm">硬币数: {{ userCoins }}</span>
        </div>
      </div>
    </div>

    <!-- 配置模块标题栏 - Material Design 3 -->
    <div class="flex justify-between items-center mb-6 px-2">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#D0BCFF] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <span class="text-xl font-medium text-[#E6E1E5]">配置模块</span>
      </div>
      
      <!-- 提交按钮 - Material Design 3 Filled Button -->
      <button @click="updateConfigData" :disabled="!sysConfigUpdate"
              :class="{ 
                'bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72]': sysConfigUpdate, 
                'bg-[#49454F] text-[#938F99] cursor-not-allowed': !sysConfigUpdate 
              }"
              class="px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] focus:ring-offset-2 focus:ring-offset-[#1C1B1F] disabled:opacity-60">
        提交配置修改
      </button>
    </div>

    <!-- 系统配置列表 - Material Design 3 Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div v-for="config in filteredSystemConfigs" :key="config.key" 
           class="bg-[#2D2A32] rounded-2xl p-5 border border-[#49454F]/30 transition-all duration-200 hover:border-[#D0BCFF]/30">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-base font-medium text-[#E6E1E5]">{{ config.name }}</h3>
          <!-- Switch 开关 - Material Design 3 样式 -->
          <div v-if="config.type === 'switch'" class="relative inline-flex items-center">
            <input type="checkbox" :id="'toggle-' + config.key" v-model="config.value"
                   @change="handleAiConfigChange(config)"
                   class="peer sr-only"/>
            <label :for="'toggle-' + config.key"
                   class="w-14 h-8 bg-[#49454F] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D0BCFF] rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#D0BCFF] cursor-pointer">
            </label>
          </div>
        </div>
        
        <p class="text-sm text-[#938F99] mb-4 leading-relaxed">{{ config.description }}</p>
        
        <!-- 文本输入 - Material Design 3 Outlined Text Field -->
        <div v-if="config.type === 'text' || config.type === 'textpassword'" class="flex items-center gap-2">
          <div class="flex-1 relative">
            <input :id="'input-' + config.key" v-model="config.value" :disabled="!config.editable"
                   :type="config.type === 'textpassword' && !config.editable ? 'password' : 'text'"
                   class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm">
          </div>
          <button @click="toggleEdit(config.key)"
                  class="bg-transparent hover:bg-[#D0BCFF]/10 text-[#D0BCFF] px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] border border-[#D0BCFF]/50">
            {{ config.editable ? '保存' : '编辑' }}
          </button>
        </div>
        
        <!-- 下拉选择 - Material Design 3 -->
        <select v-else-if="config.type === 'select'" v-model="config.value" @change="sysConfigUpdate = true"
                class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 text-sm appearance-none cursor-pointer">
          <option v-for="option in config.options" :key="option" :value="option">{{ option }}</option>
        </select>
        
        <!-- 文本域 - Material Design 3 -->
        <div v-else-if="config.type === 'textarea'" class="space-y-3">
          <textarea v-model="config.value" :disabled="!config.editable"
                    @input="sysConfigUpdate = true"
                    class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm resize-none leading-relaxed"
                    rows="4">
          </textarea>
          <button @click="toggleEdit(config.key)"
                  class="bg-transparent hover:bg-[#D0BCFF]/10 text-[#D0BCFF] px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] border border-[#D0BCFF]/50">
            {{ config.editable ? '保存' : '编辑' }}
          </button>
        </div>
      </div>
    </div>

    <!-- AI 配置区域 - Material Design 3 -->
    <div v-if="showAiSection" class="mb-8">
      <!-- AI 配置标题栏 -->
      <div class="flex items-center gap-3 mb-6 px-2">
        <div class="w-10 h-10 rounded-xl bg-[#B69DF8] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <span class="text-xl font-medium text-[#E6E1E5]">AI 配置</span>
      </div>
      
      <!-- AI 配置卡片列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div v-for="config in filteredAiConfigs" :key="config.key" 
             class="bg-[#2D2A32] rounded-2xl p-5 border border-[#49454F]/30 transition-all duration-200 hover:border-[#B69DF8]/30">
          <h3 class="text-base font-medium text-[#E6E1E5] mb-2">{{ config.name }}</h3>
          <p class="text-sm text-[#938F99] mb-4 leading-relaxed">{{ config.description }}</p>
          
          <!-- Switch 开关 -->
          <div v-if="config.type === 'switch'" class="relative inline-flex items-center">
            <input type="checkbox" :id="'ai-toggle-' + config.key" v-model="config.value"
                   @change="sysConfigUpdate = true"
                   class="peer sr-only"/>
            <label :for="'ai-toggle-' + config.key"
                   class="w-14 h-8 bg-[#49454F] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B69DF8] rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#B69DF8] cursor-pointer">
            </label>
          </div>
          
          <!-- 文本输入 -->
          <div v-else-if="config.type === 'text' || config.type === 'textpassword'" class="flex items-center gap-2">
            <div class="flex-1 relative">
              <input :id="'ai-input-' + config.key" v-model="config.value" :disabled="!config.editable"
                     :type="config.type === 'textpassword' && !config.editable ? 'password' : 'text'"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#B69DF8] focus:outline-none focus:ring-1 focus:ring-[#B69DF8] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm">
            </div>
            <button @click="toggleEdit(config.key)"
                    class="bg-transparent hover:bg-[#B69DF8]/10 text-[#B69DF8] px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B69DF8] border border-[#B69DF8]/50">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>
          
          <!-- 文本域 -->
          <div v-else-if="config.type === 'textarea'" class="space-y-3">
            <textarea v-model="config.value" :disabled="!config.editable"
                      @input="sysConfigUpdate = true"
                      class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#B69DF8] focus:outline-none focus:ring-1 focus:ring-[#B69DF8] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm resize-none leading-relaxed"
                      rows="4">
            </textarea>
            <button @click="toggleEdit(config.key)"
                    class="bg-transparent hover:bg-[#B69DF8]/10 text-[#B69DF8] px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B69DF8] border border-[#B69DF8]/50">
              {{ config.editable ? '保存' : '编辑' }}
            </button>
          </div>
        </div>
      </div>

      <!-- AI 连接测试按钮 - Material Design 3 Tonal Button -->
      <div class="flex justify-center mb-6">
        <button @click="toggleTestPanel"
                class="bg-[#4A4458] hover:bg-[#5A5468] text-[#E8DEF8] px-6 py-3 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B69DF8] flex items-center gap-2">
          <svg v-if="!showTestPanel" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
          {{ showTestPanel ? '收起测试面板' : '测试AI连接' }}
        </button>
      </div>

      <!-- AI 测试面板 - Material Design 3 Card -->
      <div v-if="showTestPanel" class="bg-[#2D2A32] rounded-2xl p-6 border border-[#49454F]/30">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-lg font-medium text-[#E6E1E5]">AI 连接测试</h3>
          <div class="flex items-center gap-4 text-sm">
            <!-- 配置状态指示 - Material Design 3 Chips -->
            <span :class="aiConfigComplete.apiKey ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#EF4444]/20 text-[#EF4444]'"
                  class="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg v-if="aiConfigComplete.apiKey" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              API密钥
            </span>
            <span :class="aiConfigComplete.baseUrl ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#EF4444]/20 text-[#EF4444]'"
                  class="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg v-if="aiConfigComplete.baseUrl" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              服务地址
            </span>
            <span :class="aiConfigComplete.model ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#EF4444]/20 text-[#EF4444]'"
                  class="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg v-if="aiConfigComplete.model" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              模型
            </span>
          </div>
        </div>

        <!-- 快捷测试按钮 - Material Design 3 Chips -->
        <div class="mb-5">
          <span class="text-sm text-[#938F99] mr-3">快捷测试:</span>
          <button v-for="test in quickTests" :key="test.label"
                  @click="test.action === 'clear' ? clearTestChat() : sendQuickTest(test.message)"
                  :disabled="isTesting || !aiConfigComplete.allComplete"
                  :class="test.action === 'clear' 
                    ? 'bg-[#49454F] hover:bg-[#5A5468] text-[#CAC4D0]' 
                    : 'bg-[#4A4458] hover:bg-[#5A5468] text-[#E8DEF8]'"
                  class="px-4 py-2 rounded-full mr-2 mb-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B69DF8] disabled:opacity-50 disabled:cursor-not-allowed">
            {{ test.label }}
          </button>
        </div>

        <!-- 消息展示区 - Material Design 3 聊天样式 -->
        <div class="bg-[#1C1B1F] rounded-2xl p-4 mb-4 h-64 overflow-y-auto border border-[#49454F]/30">
          <div v-if="testMessages.length === 0" class="text-[#938F99] text-center py-8 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            暂无对话记录，请发送测试消息
          </div>
          <div v-else class="space-y-3">
            <div v-for="(msg, index) in testMessages" :key="index"
                 :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
              <div :class="msg.role === 'user' 
                ? 'bg-[#D0BCFF] text-[#381E72]' 
                : 'bg-[#4A4458] text-[#E6E1E5]'"
                   class="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium">
                    {{ msg.role === 'user' ? '你' : 'AI' }}
                  </span>
                  <span v-if="msg.role === 'assistant' && msg.responseTime" class="text-xs opacity-60">
                    {{ msg.responseTime }}ms
                  </span>
                </div>
                <div class="text-sm whitespace-pre-wrap leading-relaxed">{{ msg.content }}</div>
              </div>
            </div>
            <!-- 加载中提示 -->
            <div v-if="isTesting" class="flex justify-start">
              <div class="bg-[#4A4458] rounded-2xl rounded-bl-sm px-4 py-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-[#E6E1E5]">AI</span>
                  <span class="flex gap-1">
                    <span class="w-2 h-2 bg-[#D0BCFF] rounded-full animate-bounce" style="animation-delay: 0s"></span>
                    <span class="w-2 h-2 bg-[#D0BCFF] rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                    <span class="w-2 h-2 bg-[#D0BCFF] rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 - Material Design 3 -->
        <div class="flex gap-3">
          <input v-model="testInput"
                 @keyup.enter="sendTestMessage"
                 :disabled="isTesting || !aiConfigComplete.allComplete"
                 placeholder="输入测试问题..."
                 class="flex-1 bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#B69DF8] focus:outline-none focus:ring-1 focus:ring-[#B69DF8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm placeholder-[#938F99]">
          <button @click="sendTestMessage"
                  :disabled="isTesting || !testInput.trim() || !aiConfigComplete.allComplete"
                  class="bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isTesting ? '发送中...' : '发送' }}
          </button>
        </div>

        <!-- 错误提示 - Material Design 3 Alert -->
        <div v-if="testError" class="mt-4 bg-[#B3261E]/20 border border-[#B3261E]/50 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#F2B8B5] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1">
              <div class="font-medium text-[#F2B8B5] text-sm">测试失败</div>
              <div class="text-sm text-[#F2B8B5]/80 mt-1">{{ testError }}</div>
            </div>
            <button @click="testError = ''" class="text-[#F2B8B5] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 配置不完整提示 - Material Design 3 Warning -->
        <div v-if="!aiConfigComplete.allComplete"
             class="mt-4 bg-[#F9D71C]/10 border border-[#F9D71C]/30 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#F9D71C] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="text-sm text-[#F9D71C]/90">
              配置不完整，请先完成AI配置后再进行测试
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cookie 列表标题栏 - Material Design 3 -->
    <div class="flex justify-between items-center mb-6 px-2 pt-6 border-t border-[#49454F]/30">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#4ADE80]/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <span class="text-xl font-medium text-[#E6E1E5]">Cookie 和 请求头 列表</span>
      </div>
      
      <button @click="showAddCookieModal = true"
              class="bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] focus:ring-offset-2 focus:ring-offset-[#1C1B1F] flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        新增Cookie
      </button>
    </div>

    <!-- Cookie 列表 - Material Design 3 Data Table -->
    <div class="bg-[#2D2A32] rounded-2xl overflow-hidden border border-[#49454F]/30">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-[#49454F]/50">
            <th class="px-4 py-4 text-left text-sm font-medium text-[#CAC4D0]">URL(空表示通用)</th>
            <th class="px-4 py-4 text-left text-sm font-medium text-[#CAC4D0]">Key</th>
            <th class="px-4 py-4 text-left text-sm font-medium text-[#CAC4D0]">Value</th>
            <th class="px-4 py-4 text-left text-sm font-medium text-[#CAC4D0]">分类</th>
            <th class="px-4 py-4 text-left text-sm font-medium text-[#CAC4D0]">用途</th>
            <th class="px-4 py-4 text-left text-sm font-medium text-[#CAC4D0]">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cookie, index) in cookieList" :key="cookie.id" class="border-b border-[#49454F]/30 last:border-0 hover:bg-[#49454F]/10 transition-colors">
            <td class="px-4 py-3">
              <input v-model="cookie.url" :disabled="!cookie.editable"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-3 py-2 rounded-xl border border-transparent focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:bg-transparent disabled:px-0 text-sm">
            </td>
            <td class="px-4 py-3">
              <input v-model="cookie.ckey" :disabled="!cookie.editable"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-3 py-2 rounded-xl border border-transparent focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:bg-transparent disabled:px-0 text-sm">
            </td>
            <td class="px-4 py-3">
              <input v-model="cookie.cvalue" :disabled="!cookie.editable" :type="cookie.editable ? 'text' : 'password'"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-3 py-2 rounded-xl border border-transparent focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:bg-transparent disabled:px-0 text-sm">
            </td>
            <td class="px-4 py-3">
              <select v-model="cookie.classify" :disabled="!cookie.editable"
                      class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-3 py-2 rounded-xl border border-transparent focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:bg-transparent disabled:appearance-none disabled:px-0 text-sm cursor-pointer">
                <option v-for="option in classifyOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </td>
            <td class="px-4 py-3">
              <select v-model="cookie.media_type" :disabled="!cookie.editable"
                      class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-3 py-2 rounded-xl border border-transparent focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 disabled:bg-transparent disabled:appearance-none disabled:px-0 text-sm cursor-pointer">
                <option v-for="option in mediaTypeOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="toggleCookieEdit(index)"
                        class="bg-transparent hover:bg-[#D0BCFF]/10 text-[#D0BCFF] px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]">
                  {{ cookie.editable ? '保存' : '编辑' }}
                </button>
                <button @click="deleteCookie(index)"
                        class="bg-transparent hover:bg-[#B3261E]/10 text-[#F2B8B5] px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B3261E]">
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页条 - Material Design 3 -->
    <div class="flex justify-between items-center mt-6 px-2">
      <button @click="prevPage" :disabled="currentPage === 1"
              class="bg-[#4A4458] hover:bg-[#5A5468] disabled:bg-[#49454F]/50 disabled:text-[#938F99] disabled:cursor-not-allowed text-[#E6E1E5] px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        上一页
      </button>
      <span class="text-sm text-[#CAC4D0]">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
              class="bg-[#4A4458] hover:bg-[#5A5468] disabled:bg-[#49454F]/50 disabled:text-[#938F99] disabled:cursor-not-allowed text-[#E6E1E5] px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] flex items-center gap-2">
        下一页
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <!-- 新增Cookie模态框 - Material Design 3 Dialog -->
    <div v-if="showAddCookieModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-[#2D2A32] rounded-3xl w-full max-w-lg mx-4 shadow-2xl border border-[#49454F]/30">
        <div class="p-6">
          <h3 class="text-xl font-medium text-[#E6E1E5] mb-6">新增Cookie</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#CAC4D0] mb-2" for="newCookieUrl">URL</label>
              <input type="text" id="newCookieUrl" v-model="newCookie.url"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 text-sm placeholder-[#938F99]"
                     placeholder="输入URL">
            </div>
            <div>
              <label class="block text-sm font-medium text-[#CAC4D0] mb-2" for="newCookieKey">Key</label>
              <input type="text" id="newCookieKey" v-model="newCookie.ckey"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 text-sm placeholder-[#938F99]"
                     placeholder="输入Key">
            </div>
            <div>
              <label class="block text-sm font-medium text-[#CAC4D0] mb-2" for="newCookieValue">Value</label>
              <input type="text" id="newCookieValue" v-model="newCookie.cvalue"
                     class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 text-sm placeholder-[#938F99]"
                     placeholder="输入Value">
            </div>
            <div>
              <label class="block text-sm font-medium text-[#CAC4D0] mb-2" for="newCookieClassify">分类</label>
              <select id="newCookieClassify" v-model="newCookie.classify"
                      class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 text-sm cursor-pointer">
                <option v-for="option in classifyOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#CAC4D0] mb-2" for="newCookieMediaType">用途</label>
              <select id="newCookieMediaType" v-model="newCookie.media_type"
                      class="w-full bg-[#49454F]/30 text-[#E6E1E5] px-4 py-3 rounded-xl border border-[#49454F] focus:border-[#D0BCFF] focus:outline-none focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200 text-sm cursor-pointer">
                <option v-for="option in mediaTypeOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 p-6 pt-0">
          <button @click="showAddCookieModal = false"
                  class="px-5 py-2.5 bg-transparent text-[#D0BCFF] rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] hover:bg-[#D0BCFF]/10">
            取消
          </button>
          <button @click="addCookie"
                  class="px-5 py-2.5 bg-[#D0BCFF] text-[#381E72] rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] hover:bg-[#E8DEF8]">
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- 登录模态框 - Material Design 3 Dialog -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-[#2D2A32] rounded-3xl p-8 shadow-2xl border border-[#49454F]/30 max-w-sm mx-4">
        <h2 class="text-xl font-medium text-[#E6E1E5] text-center mb-6">请使用哔哩哔哩客户端扫码登陆</h2>
        <div class="bg-white rounded-2xl p-4 mb-6">
          <img :src="qrCodeDataUrl" alt="QR Code" class="w-56 h-56 mx-auto">
        </div>
        <div class="flex gap-3">
          <button @click="checkScanResult"
                  class="flex-1 bg-[#4ADE80] hover:bg-[#5AE890] text-[#00391A] px-5 py-3 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ADE80]">
            我已扫码
          </button>
          <button @click="showModal = false"
                  class="flex-1 bg-[#B3261E] hover:bg-[#C53228] text-white px-5 py-3 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B3261E]">
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
      qrCodeUrl: 'https://account.bilibili.com/h5/account-h5/auth/scan-web?navhide=1&callback=close&qrcode_key=c60e9ca645691ccd0e974d55d43092ac&from=',
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
          value: 'https://open.bigmodel.cn/api/paas/v4',
          type: 'text',
          description: 'AI服务的 BaseUrl',
          editable: false
        },
        {
          id: null,
          name: 'AI模型',
          key: 'ai_model',
          value: 'glm-4-flash',
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
          value: '**角色定义**  \n' +
              '你是一个严格的视频内容审核助手。你的任务是根据用户提供的视频信息（如标题、描述等）以及预设的审核规则（黑名单、白名单），\n' +
              '结合你自身的知识库，判断该视频属于"黑名单""白名单"还是"其他"。\n' +
              '\n' +
              '**审核规则**  \n' +
              '用户将提供以下两类规则：  \n' +
              '1. **黑名单规则**：包含禁止出现的内容、关键词、主题、敏感领域等。一旦视频涉及其中任何一项，应判定为"黑名单"。  \n' +
              '2. **白名单规则**：包含允许或优先通过的内容、关键词、主题等。仅当视频符合白名单规则且未触发任何黑名单规则时，判定为"白名单"。\n' +
              '\n' +
              '**判断原则**  \n' +
              '- 严格遵循用户提供的规则，不得自行放宽或添加条件。  \n' +
              '- 若用户规则与你的知识库存在冲突，以用户规则为最优先。  \n' +
              '- 若视频信息不足以明确判定，或同时触发黑白名单规则（需按黑名单优先原则），应判定为"待定/其他"，并简要说明原因。  \n' +
              '- 结合你的知识库对视频内容进行理解，尤其当标题、描述存在隐喻、隐晦表达或行业术语时，需识别其真实含义以判断是否命中规则。',
          type: 'textarea',
          description: '全局微调ai的提示词，可以调整ai的判断倾向',
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
      return this.systemConfigs.filter(config => {
        const isAiConfig = config.key.startsWith('ai_');
        return !isAiConfig || config.key === 'ai_chat_enable';
      });
    },
    filteredAiConfigs() {
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
    checkMatchRule() {
      const targetKeys = ['single_match', 'ai_chat_enable', 'complex_match'];
      const targetValues = this.systemConfigs
          .filter(item => targetKeys.includes(item.key))
          .map(item => item.value);
      const allFalse = targetValues.length === targetKeys.length &&
          targetValues.every(value => value === false);
      console.log("检查结果", allFalse, targetValues)
      return !allFalse;
    },

    handleAiConfigChange(config) {
      this.sysConfigUpdate = true;
      if (config.key === 'ai_chat_enable') {
        this.$forceUpdate();
      }
    },
    async relogin() {
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
          this.$error('新增Cookie失败，请重试');
        }
      } catch (error) {
        console.error('新增Cookie失败:', error);
        this.$error('新增Cookie失败，请重试');
      }
    },
    async updateCookie(index) {
      const cookie = this.cookieList[index];
      try {
        const response = await api.updateCookie(cookie);
        if (response.code === 200) {
          cookie.editable = false;
        } else {
          this.$error('修改Cookie失败，请重试');
        }
      } catch (error) {
        console.error('修改Cookie失败:', error);
        this.$error('修改Cookie失败，请重试');
      }
    },
    async deleteCookie(index) {
      const cookie = this.cookieList[index];
      try {
        const response = await api.deleteCookie(cookie.id);
        if (response.code === 200) {
          this.cookieList.splice(index, 1);
        } else {
          this.$error('删除Cookie失败，请重试');
        }
      } catch (error) {
        console.error('删除Cookie失败:', error);
        this.$error('删除Cookie失败，请重试');
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
          this.$success('登录成功');
          this.showModal = false;
          this.fetchUserData();
        } else {
          this.$info(response.data);
        }
      } catch (error) {
        console.error('检查扫码结果失败:', error);
        this.$error('检查扫码结果失败，请重试');
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
    saveConfig() {
      let standardConfig = {};
      this.systemConfigs.forEach(config => {
        standardConfig[config.key] = config.value;
      });
      localStorage.setItem("standardConfig", JSON.stringify(standardConfig))
    },
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
          value: config.value.toString()
        }));
        const response = await api.addOrUpdateConfig(data);
        if (!(response.code === 200)) {
          throw new Error('配置保存失败');
        } else {
          this.sysConfigUpdate = false;
        }
      } catch (error) {
        console.error('修改Cookie失败:', error);
        throw error;
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
    async toggleTestPanel() {
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
      this.testError = '';
      this.testMessages.push({
        role: 'user',
        content: message
      });
      this.testInput = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      this.isTesting = true;
      try {
        const startTime = Date.now();
        const systemPrompt = this.systemConfigs.find(c => c.key === 'ai_system_prompt')?.value || '你是一个专业、友好、有帮助的AI助手。';
        const messages = [
          {
            role: 'system',
            content: systemPrompt
          }
        ];
        this.testMessages
            .slice(0, -1)
            .forEach(msg => {
              messages.push({
                role: msg.role,
                content: msg.content
              });
            });
        messages.push({
          role: 'user',
          content: message
        });
        const response = await api.testAiChat({
          messages: messages
        });
        const responseTime = Date.now() - startTime;
        if (response.code === 200) {
          this.testMessages.push({
            role: 'assistant',
            content: response.data,
            responseTime: responseTime
          });
          this.$message('测试成功', 'success');
        } else {
          this.testError = response.message || '测试失败，请检查配置';
          this.testMessages.pop();
        }
      } catch (error) {
        console.error('AI测试失败:', error);
        this.testError = error.message || '网络错误，请检查网络连接';
        this.testMessages.pop();
      } finally {
        this.isTesting = false;
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
@import url('~@/assets/fonts/roboto.css');

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

/* 自定义滚动条样式 - Material Design 3 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1C1B1F;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #49454F;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5A5468;
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

/* 输入框placeholder颜色 */
::placeholder {
  color: #938F99;
}

/* Select下拉箭头自定义 */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23CAC4D0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 40px;
}

select:disabled {
  background-image: none;
}
</style>
