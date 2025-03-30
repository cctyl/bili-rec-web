<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
    <div class=" bg-gray-800" style="width: 100%">
        <div class=" mx-auto px-4 py-6">
            <!-- 顶部导航 -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-white">哔哩哔哩 UP主数据监控</h1>
                </div>
                <div class="relative">
                    <input type="text" v-model="searchQuery" placeholder="搜索 UP 主..."
                        class="w-64 px-4 py-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-none text-sm shadow-md shadow-gray-900/30" />
                    <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
            </div>
            <!-- UP主列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(upUser, index) in filteredUpUsers" :key="index"
                    class="bg-gray-700 rounded-lg p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg shadow-md hover:shadow-gray-600/50 shadow-gray-900/30">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <img :src="upUser.avatar" :alt="upUser.name" class="w-16 h-16 rounded-full object-cover" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-2">
                                <h3 class="text-xl font-bold text-white">{{ upUser.name }}</h3>
                                <span class="text-gray-300">
                                    <i
                                        :class="upUser.gender === '男' ? 'fas fa-mars text-blue-400' : 'fas fa-venus text-pink-400'"></i>
                                </span>
                                <span class="px-2 py-1 text-xs rounded-full bg-pink-500 text-white">
                                    Lv.{{ upUser.level }}
                                </span>
                            </div>
                            <!-- 数据网格 -->
                            <div class="grid grid-cols-3 gap-4 mt-4">
                                <div v-for="(stat, key) in upUser.stats" :key="key"
                                    class="text-center p-2 rounded-lg bg-gray-800/50 shadow-sm">
                                    <div class="text-lg font-bold text-white">{{ stat.value }}</div>
                                    <div class="text-sm text-gray-400">{{ stat.label }}</div>
                                    <div :class="['text-sm mt-1', stat.change > 0 ? 'text-green-400' : 'text-red-400']">
                                        <i :class="stat.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                                        {{ Math.abs(stat.change) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchQuery: '',
            upUsers: [
                {
                    name: '林深时见鹿',
                    gender: '女',
                    level: 6,
                    avatar: 'https://ai-public.mastergo.com/ai/img_res/e0325fe3daf00b49d2075fb892c7de3a.jpg',
                    stats: {
                        dynamics: { label: '动态数', value: '1,234', change: 12 },
                        fans: { label: '粉丝数', value: '89,432', change: 156 },
                        videos: { label: '视频数', value: '324', change: 5 },
                        following: { label: '关注数', value: '521', change: -3 },
                        likes: { label: '获赞数', value: '230,891', change: 1243 }
                    }
                },
                {
                    name: '科技探索者',
                    gender: '男',
                    level: 5,
                    avatar: 'https://ai-public.mastergo.com/ai/img_res/8d92d472bcac02c1cd693aa058b05e1b.jpg',
                    stats: {
                        dynamics: { label: '动态数', value: '856', change: 8 },
                        fans: { label: '粉丝数', value: '45,678', change: 89 },
                        videos: { label: '视频数', value: '156', change: 2 },
                        following: { label: '关注数', value: '234', change: 5 },
                        likes: { label: '获赞数', value: '156,789', change: 567 }
                    }
                },
                {
                    name: '美食达人小厨',
                    gender: '女',
                    level: 6,
                    avatar: 'https://ai-public.mastergo.com/ai/img_res/ff7afcdb151f40233fe48586501c1df0.jpg',
                    stats: {
                        dynamics: { label: '动态数', value: '2,345', change: 15 },
                        fans: { label: '粉丝数', value: '123,456', change: 234 },
                        videos: { label: '视频数', value: '567', change: 7 },
                        following: { label: '关注数', value: '345', change: -2 },
                        likes: { label: '获赞数', value: '789,012', change: 1890 }
                    }
                },
                {
                    name: '游戏解说大师',
                    gender: '男',
                    level: 5,
                    avatar: 'https://ai-public.mastergo.com/ai/img_res/a6cfd3715e80d5980e156d9f8118410f.jpg',
                    stats: {
                        dynamics: { label: '动态数', value: '1,567', change: 23 },
                        fans: { label: '粉丝数', value: '234,567', change: 678 },
                        videos: { label: '视频数', value: '890', change: 12 },
                        following: { label: '关注数', value: '456', change: 8 },
                        likes: { label: '获赞数', value: '567,890', change: 2345 }
                    }
                }
            ]
        };
    },
    computed: {
        filteredUpUsers() {
            const query = this.searchQuery.toLowerCase();
            return this.upUsers.filter(user =>
                user.name.toLowerCase().includes(query)
            );
        }
    }
};
</script>
<style scoped>
.hover\:scale-102:hover {
    transform: scale(1.02);
}
</style>