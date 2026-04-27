import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/pages/Home.vue";
// 其他页面组件的导入
import Tasks from "@/pages/Tasks.vue";
import RuleList from "@/pages/RuleList.vue";
import Settings from "@/pages/Settings.vue";
import OtherSetting from "@/pages/OtherSetting.vue";
// import Analytics from "@/pages/Analytics.vue";
// import Security from "@/pages/Security.vue";
// import Logout from "@/pages/Logout.vue";
import VideoManage from "@/pages/VideoManage.vue"
import WatchUploaderList from  "@/pages/WatchUploaderList.vue"

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
            component: RuleList,
            props:{
                accessType: 'WHITE',
            }
        },
        {
            path: '/blacklist',
            component: RuleList,
            props:{
                accessType: 'BLACK',
            }
        },
        {
            path: '/settings',
            component: Settings,
        },
        {
            path: '/other-setting',
            component: OtherSetting,
        },
        {
            path: '/review',
            component: VideoManage,
            props: {
                mode: 'review'
            }
        },
        {
            path: '/history-video',
            component: VideoManage,
            props: {
                mode: 'history'
            }
        }, {
            path: '/watch-uploader-list',
            component: WatchUploaderList,
        },

        //
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
    // console.log("下一站：" + to.path)
    next()
})

export default router