import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/pages/Home.vue";
// 其他页面组件的导入
import Tasks from "@/pages/Tasks.vue";
import Whitelist from "@/pages/Whitelist.vue";
import Blacklist from "@/pages/Blacklist.vue";
import Settings from "@/pages/Settings.vue";
// import Analytics from "@/pages/Analytics.vue";
// import Security from "@/pages/Security.vue";
// import Logout from "@/pages/Logout.vue";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home,
        },
        // 其他路由配置
        {
            path: '/tasks',
            component: Tasks,
        },
        {
            path: '/whitelist',
            component: Whitelist,
        },
        {
            path: '/blacklist',
            component: Blacklist,
        },
        {
            path: '/settings',
            component: Settings,
        },
        // {
        //     path: '/analytics',
        //     component: Analytics,
        // },
        // {
        //     path: '/security',
        //     component: Security,
        // },
        // {
        //     path: '/logout',
        //     component: Logout,
        // },
    ]
})

router.beforeEach((to, from, next) => {
    console.log("下一站：" + to.path)
    next()
})

export default router