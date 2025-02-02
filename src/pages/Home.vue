<template>
  <main class="flex-1 p-6 overflow-auto custom-scrollbar">
    <header class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">总览</h1>
        <p class="text-gray-400 mt-1">欢迎回来，管理员。这里是您的系统概览。</p>
      </div>
      <div class="flex items-center">

        <button
            @click="fetchOverviewData"
            class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2 !rounded-button whitespace-nowrap">
          <i class="fas fa-sync-alt mr-2"></i>刷新数据
        </button>

      </div>
    </header>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg">当前运行任务数</h3>
          <i class="fas fa-tasks text-2xl text-primary"></i>
        </div>
        <p class="text-3xl font-bold text-primary mb-1">{{ overview.runningTaskCount }}</p>
        <p class="text-sm text-gray-400">活跃任务总数</p>
      </div>

      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg">黑名单规则数</h3>
          <i class="fas fa-ban text-2xl text-red-400"></i>
        </div>
        <p class="text-3xl font-bold text-red-400 mb-1">{{ overview.blackRuleCount }}</p>
        <p class="text-sm text-gray-400">已设置的判断规则字典数（总计）</p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg">待筛选的黑名单关键词数</h3>
          <i class="fas fa-ban text-2xl text-orange-300"></i>
        </div>
        <p class="text-3xl font-bold text-orange-300 mb-1">{{ overview.blackCacheCount }}</p>
        <p class="text-sm text-gray-400">需要用户在黑名单管理页面底部去筛选的关键词</p>
      </div>


      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">白名单规则数</h3>
          <i class="fas fa-check-circle text-2xl text-green-400"></i>
        </div>
        <p class="text-3xl font-bold text-green-400">{{ overview.whiteRuleCount }}</p>
        <p class="text-sm text-gray-400">已设置的判断规则字典数（总计）</p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">搜索关键词数</h3>
          <i class="fas fa-search text-2xl text-pink-400"></i>
        </div>
        <p class="text-3xl font-bold text-pink-400">{{ overview.searchKeywordCount }}</p>
        <p class="text-sm text-gray-400 mt-2">用于搜索的关键词</p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">已运行天数</h3>
          <i class="fas fa-calendar text-2xl text-yellow-400"></i>
        </div>
        <p class="text-3xl font-bold text-yellow-400">{{ overview.runDays }}</p>
        <p class="text-sm text-gray-400 mt-2">稳定运行中</p>
      </div>

      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">历史点赞数</h3>
          <i class="fas fa-thumbs-up text-2xl text-blue-400"></i>
        </div>
        <p class="text-3xl font-bold text-blue-400">{{ overview.likeVideoCount }}</p>
        <p class="text-sm text-gray-400 mt-2">历史点赞的视频总数</p>
      </div>

      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg">历史点踩数</h3>
          <i class="fas fa-thumbs-down text-2xl text-purple-400"></i>
        </div>
        <p class="text-3xl font-bold text-purple-400">{{ overview.hateVideoCount }}</p>
        <p class="text-sm text-gray-400 mt-2">历史点踩的视频总数</p>
      </div>
    </div>

    <!-- 待处理数据卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- 待二次处理数据卡片 -->
      <div class="bg-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">待二次处理(审核)</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="mt-4">
          <div class="flex items-baseline">
            <span class="text-3xl font-bold">{{ overview.secondHandleCount }}</span>
            <span class="ml-2 text-sm text-gray-400">条</span>
          </div>
          <p class="mt-2 text-sm text-gray-400">等待二次处理的数据，即左侧的视频审核菜单</p>
        </div>
      </div>

      <!-- 待三次处理数据卡片 -->
      <div class="bg-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">待三次处理</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="mt-4">
          <div class="flex items-baseline">
            <span class="text-3xl font-bold">{{ overview.thirdHandleCount }}</span>
            <span class="ml-2 text-sm text-gray-400">条</span>
          </div>
          <p class="mt-2 text-sm text-gray-400">等待三次处理的数据</p>
        </div>
      </div>
      <!-- ...其他卡片... -->
    </div>
    <!-- 历史数据图表 -->
    <div class="grid grid-cols-1 gap-6 mb-6">
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 class="text-lg mb-4">历史处理数据统计</h3>
        <div class="relative">
          <select
              @change="handleYearChange"
              v-model="selectedYear"
              class="bg-gray-700 text-white px-4 py-2 rounded-md appearance-none cursor-pointer pr-8"
          >
            <option v-for="year in range(2020,2050)" :key="year" :value="year">
              {{ year }}年
            </option>
          </select>
        </div>
        <div ref="chartContainer" style="height: 400px;"></div>
      </div>
    </div>


    <!-- 任务信息卡片 -->
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">任务信息</h2>

      <!-- 任务列表为空时的提示 -->
      <div v-if="!overview.taskList || overview.taskList.length === 0"
           class="flex flex-col items-center justify-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-12 w-12 text-gray-500 mb-4"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-400 text-lg">暂无任务信息</p>
        <p class="text-gray-500 text-sm mt-2">当前没有正在运行或等待的任务</p>
      </div>

      <!-- 任务列表内容 -->
      <div v-else class="space-y-4">
        <div v-for="(task, index) in overview.taskList"
             :key="task.id"
             class="bg-gray-700 p-4 rounded-lg"
             :class="{
            'border-l-4 border-green-500 bg-gray-600': task.currentRunStatus === 'RUNNING',
            'border-l-4 border-yellow-400': task.currentRunStatus === 'WAITING'
        }">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <span class="font-semibold">{{ task.taskName }}</span>
              <span v-if="task.currentRunStatus === 'RUNNING'"
                    class="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded">运行中</span>
              <span v-if="index === 1"
                    class="ml-2 px-2 py-1 text-xs bg-yellow-400 text-black rounded">下一个</span>
            </div>
            <span class="text-sm text-gray-400">上次运行: {{ task.lastRunTime }}</span>
          </div>

          <p class="text-sm text-gray-400 mb-2">{{ task.description }}</p>

          <div class="flex flex-wrap gap-4 text-sm text-gray-300">
            <span>状态: {{getStatus(task.currentRunStatus)}}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import * as echarts from 'echarts'
import api from "@/api";

export default {
  name: 'home-page',
  data() {
    return {
      chart: null,
      overview: {
        "runningTaskCount": 0,
        "blackRuleCount": 0,
        "whiteRuleCount": 0,
        "runDays": 0,
        "whiteHistory": [
        ],
        "blackHistory": [
        ],
        "otherHistory": [
        ],
        "secondHandleCount": 0,
        "thirdHandleCount": 0,
        taskList: [
        ]
      },
      selectedYear: new Date().getFullYear(), // 默认当前年份

    }
  },
  methods: {
    range(start,end){

      //生成start 到 end 这两个值中间的数组
      return Array.from({length: end - start + 1}, (_, i) => start + i);

    },
    handleYearChange(){
      this.fetchOverviewData();
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer)
      const processData = (data) => {
        return data.reduce((acc, item) => {
          const [[date, value]] = Object.entries(item)
          acc.dates.push(date)
          acc.values.push(value)
          return acc
        }, {dates: [], values: []})
      }
      const whiteData = processData(this.overview.whiteHistory)
      const blackData = processData(this.overview.blackHistory)
      const otherData = processData(this.overview.otherHistory)

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['点赞', '点踩', '其他'],
          textStyle: {
            color: '#9CA3AF'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [...new Set([...whiteData.dates, ...blackData.dates, ...otherData.dates])].sort(),
          axisLine: {
            lineStyle: {
              color: '#4B5563'
            }
          },
          axisLabel: {
            color: '#9CA3AF',
            interval: 0,
            rotate: 45
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#4B5563'
            }
          },
          axisLabel: {
            color: '#9CA3AF'
          },
          splitLine: {
            lineStyle: {
              color: '#374151',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '点赞',
            type: 'bar',
            barWidth: '20%',
            data: whiteData.values,
            itemStyle: {
              color: '#10B981',
              borderRadius: [4, 4, 0, 0]
            }
          },
          {
            name: '点踩',
            type: 'bar',
            barWidth: '20%',
            data: blackData.values,
            itemStyle: {
              color: '#EF4444',
              borderRadius: [4, 4, 0, 0]
            }
          },
          {
            name: '其他',
            type: 'bar',
            barWidth: '20%',
            data: otherData.values,
            itemStyle: {
              color: '#F59E0B',
              borderRadius: [4, 4, 0, 0]
            }
          }
        ]
      }

      this.chart.setOption(option)
    },

    async fetchOverviewData() {
      try {
        // 这里替换为实际的API调用
        const response = await api.getOverviewData(this.selectedYear);
        this.overview = response.data
        this.initChart()
      } catch (error) {
        console.error('获取历史数据失败:', error)
      }
    },

    handleResize() {
      this.chart && this.chart.resize()
    },
    getStatus(str) {
      switch (str) {
        case "RUNNING":
          return '运行中';
        case "STOPPED":
          return '未启动';
        case "WAITING":
          return '排队中';
        default:
          return str;
      }
    },
  },
  mounted() {
    // this. initChart()
    this.fetchOverviewData();

    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.chart && this.chart.dispose()
  }
}
</script>

<style scoped>

</style>