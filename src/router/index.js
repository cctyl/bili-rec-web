//该文件用于创建整个应用的路由器
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter) //vue-router本身是一个插件，需要注册



const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },

    ]
})
//初始化时调用一次
//然后，在每一次切换路由之前，执行一次这个方法
//全局前置路由守卫
router.beforeEach((to, from, next) => {
    //接收三个参数
    //to 去哪，下一个路由的路径，名字，参数等等
    //from 从哪来
    //next 下一步


    next()
})


export default router
