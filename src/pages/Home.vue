<template>
  <main class="flex-1 p-6 overflow-auto custom-scrollbar">
    <!-- Header Section -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-medium text-on-surface">总览</h1>
        <p class="text-sm text-on-surface-variant mt-2">欢迎回来，管理员。这里是您的系统概览。</p>
      </div>
      <div class="flex items-center">
        <button
            @click="fetchOverviewData"
            class="bg-primary text-on-primary px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all duration-200 elevation-1 hover:elevation-2 mr-2 !rounded-button whitespace-nowrap flex items-center gap-2">
          <i class="fas fa-sync-alt"></i>
          <span>刷新数据</span>
        </button>
      </div>
    </header>

    <!-- 系统状态卡片 - Material 3 Filled Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- CPU 使用率 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">CPU 占用</h3>
          <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <i class="fas fa-microchip text-lg text-on-primary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-on-surface mb-1">{{ overview.cpu_usage_percent != null ? overview.cpu_usage_percent + '%' : '--' }}</p>
        <p class="text-xs text-on-surface-variant">本程序占用的 CPU</p>
      </div>

      <!-- 内存占用 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">内存占用</h3>
          <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <i class="fas fa-memory text-lg text-on-secondary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-on-surface mb-1">{{ overview.memory_usage_mb != null ? overview.memory_usage_mb + ' MB' : '--' }}</p>
        <p class="text-xs text-on-surface-variant">本程序占用的内存</p>
      </div>

      <!-- 运行时间 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">运行时间</h3>
          <div class="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
            <i class="fas fa-clock text-lg text-on-tertiary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-on-surface mb-1">{{ formatUptime(overview.uptime_secs) }}</p>
        <p class="text-xs text-on-surface-variant">程序已持续运行</p>
      </div>
    </div>

    <!-- 数据概览卡片 - Material 3 Filled Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- 当前运行任务数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">当前运行任务数</h3>
          <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <i class="fas fa-tasks text-lg text-on-primary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-on-surface mb-1">{{ overview.running_task_count }}</p>
        <p class="text-xs text-on-surface-variant">活跃任务总数</p>
      </div>

      <!-- 黑名单规则数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">黑名单规则数</h3>
          <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
            <i class="fas fa-ban text-lg text-on-error-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-error mb-1">{{ overview.black_rule_count }}</p>
        <p class="text-xs text-on-surface-variant">已设置的判断规则字典数（总计）</p>
      </div>

      <!-- 待筛选的黑名单关键词数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">待筛选关键词数</h3>
          <div class="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
            <i class="fas fa-filter text-lg text-on-tertiary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-tertiary mb-1">{{ overview.black_cache_count }}</p>
        <p class="text-xs text-on-surface-variant">需在黑名单管理页面筛选</p>
      </div>

      <!-- 白名单规则数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">白名单规则数</h3>
          <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <i class="fas fa-check-circle text-lg text-on-secondary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-secondary mb-1">{{ overview.white_rule_count }}</p>
        <p class="text-xs text-on-surface-variant">已设置的判断规则字典数（总计）</p>
      </div>

      <!-- 搜索关键词数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">搜索关键词数</h3>
          <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <i class="fas fa-search text-lg text-on-primary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-primary mb-1">{{ overview.search_keyword_count }}</p>
        <p class="text-xs text-on-surface-variant">用于搜索的关键词</p>
      </div>

      <!-- 已运行天数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">已运行天数</h3>
          <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <i class="fas fa-calendar text-lg text-on-secondary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-secondary mb-1">{{ overview.run_days }}</p>
        <p class="text-xs text-on-surface-variant">稳定运行中</p>
      </div>

      <!-- 历史点赞数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">历史点赞数</h3>
          <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <i class="fas fa-thumbs-up text-lg text-on-primary-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-primary mb-1">{{ overview.like_video_count }}</p>
        <p class="text-xs text-on-surface-variant">历史点赞的视频总数</p>
      </div>

      <!-- 历史点踩数 -->
      <div class="bg-surface-container p-5 rounded-xl elevation-1">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-sm font-medium text-on-surface-variant">历史点踩数</h3>
          <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
            <i class="fas fa-thumbs-down text-lg text-on-error-container"></i>
          </div>
        </div>
        <p class="text-4xl font-medium text-error mb-1">{{ overview.hate_video_count }}</p>
        <p class="text-xs text-on-surface-variant">历史点踩的视频总数</p>
      </div>
    </div>

    <!-- 待处理数据卡片 - Material 3 Outlined Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- 待二次处理数据卡片 -->
      <div class="bg-surface-container-low p-5 rounded-xl border border-outline-variant">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
              <i class="fas fa-clipboard-check text-xl text-on-primary-container"></i>
            </div>
            <div>
              <h3 class="text-base font-medium text-on-surface">待二次处理(审核)</h3>
              <p class="text-xs text-on-surface-variant">等待二次处理的数据</p>
            </div>
          </div>
          <span class="text-3xl font-medium text-primary">{{ overview.second_handle_count }}</span>
        </div>
        <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full" :style="{ width: Math.min(100, (overview.second_handle_count / 100) * 100) + '%' }"></div>
        </div>
      </div>

      <!-- 待三次处理数据卡片 -->
      <div class="bg-surface-container-low p-5 rounded-xl border border-outline-variant">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
              <i class="fas fa-layer-group text-xl text-on-tertiary-container"></i>
            </div>
            <div>
              <h3 class="text-base font-medium text-on-surface">待三次处理</h3>
              <p class="text-xs text-on-surface-variant">等待三次处理的数据</p>
            </div>
          </div>
          <span class="text-3xl font-medium text-tertiary">{{ overview.third_handle_count }}</span>
        </div>
        <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full bg-tertiary rounded-full" :style="{ width: Math.min(100, (overview.third_handle_count / 100) * 100) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 历史数据图表 - Material 3 Elevated Card -->
    <div class="bg-surface-container p-5 rounded-xl elevation-1 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-on-surface">历史处理数据统计</h3>
        <div class="relative">
          <select
              @change="handleYearChange"
              v-model="selectedYear"
              class="bg-surface-container-highest text-on-surface px-4 py-2 pr-10 rounded-lg appearance-none cursor-pointer border border-outline-variant text-sm focus:outline-none focus:border-primary"
          >
            <option v-for="year in range(2020,2050)" :key="year" :value="year">
              {{ year }}年
            </option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none"></i>
        </div>
      </div>
      <div ref="chartContainer" style="height: 400px;"></div>
    </div>

    <!-- 任务信息卡片 - Material 3 Elevated Card -->
    <div class="bg-surface-container p-5 rounded-xl elevation-1">
      <h2 class="text-xl font-medium text-on-surface mb-5">任务信息</h2>

      <!-- 任务列表为空时的提示 -->
      <div v-if="!overview.task_list || overview.task_list.length === 0"
           class="flex flex-col items-center justify-center py-12 bg-surface-container-low rounded-xl">
        <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
          <i class="fas fa-clipboard-list text-2xl text-on-surface-variant"></i>
        </div>
        <p class="text-on-surface-variant text-base font-medium">暂无任务信息</p>
        <p class="text-on-surface-variant/70 text-sm mt-1">当前没有正在运行或等待的任务</p>
      </div>

      <!-- 任务列表内容 -->
      <div v-else class="space-y-3">
        <div v-for="(task, index) in overview.task_list"
             :key="task.id"
             class="bg-surface-container-high p-4 rounded-xl border-l-4 transition-all duration-200 hover:elevation-1"
             :class="{
            'border-primary': task.current_run_status === 'RUNNING',
            'border-tertiary': task.current_run_status === 'WAITING',
            'border-outline-variant': task.current_run_status !== 'RUNNING' && task.current_run_status !== 'WAITING'
        }">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="font-medium text-on-surface">{{ task.task_name }}</span>
              <span v-if="task.current_run_status === 'RUNNING'"
                    class="px-2.5 py-0.5 text-xs font-medium bg-primary text-on-primary rounded-full">运行中</span>
              <span v-if="task.current_run_status === 'WAITING'"
                    class="px-2.5 py-0.5 text-xs font-medium bg-tertiary text-on-tertiary rounded-full">排队中</span>
              <span v-if="index === 1 && task.current_run_status !== 'RUNNING'"
                    class="px-2.5 py-0.5 text-xs font-medium bg-secondary text-on-secondary rounded-full">下一个</span>
            </div>
            <span class="text-xs text-on-surface-variant">上次运行: {{ formatTime(task.last_run_time) }}</span>
          </div>

          <p class="text-sm text-on-surface-variant mb-3">{{ task.class_method_name }}</p>

          <div class="flex flex-wrap gap-4 text-xs text-on-surface-variant">
            <span class="flex items-center gap-1">
              <i class="fas fa-circle text-[8px]" :class="getStatusColor(task.current_run_status)"></i>
              {{ getStatus(task.current_run_status) }}
            </span>
            <span class="flex items-center gap-1">
              <i class="fas fa-redo text-[10px]"></i>
              总运行: {{ task.total_run_count }}次
            </span>
            <span class="flex items-center gap-1">
              <i class="fas fa-clock text-[10px]"></i>
              上次时长: {{ formatDuration(task.last_run_duration) }}
            </span>
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
        "running_task_count": 0,
        "black_rule_count": 0,
        "white_rule_count": 0,
        "run_days": 0,
        "white_history": [],
        "black_history": [],
        "other_history": [],
        "second_handle_count": 0,
        "third_handle_count": 0,
        "search_keyword_count": 0,
        "black_cache_count": 0,
        "like_video_count": 0,
        "hate_video_count": 0,
        "task_list": []
      },
      selectedYear: new Date().getFullYear(),
    }
  },
  methods: {
    range(start,end){
      return Array.from({length: end - start + 1}, (_, i) => start + i);
    },
    handleYearChange(){
      this.fetchOverviewData();
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer)
      const processData = (data) => {
        return data.reduce((acc, item) => {
          acc.dates.push(item.date)
          acc.values.push(item.count)
          return acc
        }, {dates: [], values: []})
      }
      const whiteData = processData(this.overview.white_history)
      const blackData = processData(this.overview.black_history)
      const otherData = processData(this.overview.other_history)

      const createValueMap = (dates, values) => {
        const map = {}
        dates.forEach((date, index) => {
          map[date] = values[index]
        })
        return map
      }

      const whiteValueMap = createValueMap(whiteData.dates, whiteData.values)
      const blackValueMap = createValueMap(blackData.dates, blackData.values)
      const otherValueMap = createValueMap(otherData.dates, otherData.values)

      const allDatesSorted = [...new Set([...whiteData.dates, ...blackData.dates, ...otherData.dates])].sort()

      const getValues = (valueMap, sortedDates) => {
        return sortedDates.map(date => valueMap[date] || 0)
      }

      const whiteValues = getValues(whiteValueMap, allDatesSorted)
      const blackValues = getValues(blackValueMap, allDatesSorted)
      const otherValues = getValues(otherValueMap, allDatesSorted)

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(28, 27, 31, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          textStyle: {
            color: '#E6E1E5'
          },
          formatter: function(params) {
            let result = `<div style="font-weight: 500; margin-bottom: 8px;">${params[0].axisValue}</div>`
            let total = 0
            params.forEach(item => {
              total += item.value
              result += `<div style="display: flex; align-items: center; margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${item.color}; border-radius: 2px; margin-right: 8px;"></span>
                <span style="flex: 1;">${item.seriesName}:</span>
                <span style="font-weight: 600; margin-left: 12px;">${item.value}</span>
              </div>`
            })
            result += `<div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between;">
              <span>总计:</span>
              <span style="font-weight: 600;">${total}</span>
            </div>`
            return result
          }
        },
        legend: {
          data: ['点赞', '点踩', '其他'],
          textStyle: {
            color: '#9CA3AF',
            fontSize: 12
          },
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 20,
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '15%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'inside',
            start: Math.max(0, 100 - (30 / allDatesSorted.length * 100)),
            end: 100,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true
          },
          {
            type: 'slider',
            start: Math.max(0, 100 - (30 / allDatesSorted.length * 100)),
            end: 100,
            height: 24,
            bottom: 10,
            borderColor: 'transparent',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            fillerColor: 'rgba(59, 130, 246, 0.3)',
            handleStyle: {
              color: '#3B82F6',
              borderColor: '#3B82F6'
            },
            textStyle: {
              color: '#9CA3AF'
            },
            brushSelect: false
          }
        ],
        xAxis: {
          type: 'category',
          data: allDatesSorted,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          axisLabel: {
            color: '#9CA3AF',
            interval: 'auto',
            rotate: 45,
            fontSize: 11
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#9CA3AF',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.05)',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '点赞',
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            data: whiteValues,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#34D399' },
                { offset: 1, color: '#10B981' }
              ]),
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#6EE7B7' },
                  { offset: 1, color: '#34D399' }
                ])
              }
            },
            animationDelay: function(idx) {
              return idx * 10
            }
          },
          {
            name: '点踩',
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            data: blackValues,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F87171' },
                { offset: 1, color: '#EF4444' }
              ]),
              borderRadius: [0, 0, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FCA5A5' },
                  { offset: 1, color: '#F87171' }
                ])
              }
            },
            animationDelay: function(idx) {
              return idx * 10 + 100
            }
          },
          {
            name: '其他',
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            data: otherValues,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FBBF24' },
                { offset: 1, color: '#F59E0B' }
              ]),
              borderRadius: [0, 0, 4, 4]
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FCD34D' },
                  { offset: 1, color: '#FBBF24' }
                ])
              }
            },
            animationDelay: function(idx) {
              return idx * 10 + 200
            }
          }
        ],
        animationEasing: 'cubicOut',
        animationDuration: 800
      }

      this.chart.setOption(option)
    },

    async fetchOverviewData() {
      try {
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
    getStatusColor(str) {
      switch (str) {
        case "RUNNING":
          return 'text-primary';
        case "STOPPED":
          return 'text-on-surface-variant';
        case "WAITING":
          return 'text-tertiary';
        default:
          return 'text-on-surface-variant';
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return '无';
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN');
    },
    formatDuration(secs) {
      if (!secs) return '无';
      const totalSeconds = Math.floor(secs);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) {
        return `${hours}时${minutes}分${seconds}秒`;
      }
      if (minutes > 0) {
        return `${minutes}分${seconds}秒`;
      }
      return `${seconds}秒`;
    },
    formatUptime(secs) {
      if (secs == null) return '--';
      const totalSeconds = Math.floor(secs);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) {
        return `${hours}时${minutes}分${seconds}秒`;
      }
      if (minutes > 0) {
        return `${minutes}分${seconds}秒`;
      }
      return `${seconds}秒`;
    }
  },
  mounted() {
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
