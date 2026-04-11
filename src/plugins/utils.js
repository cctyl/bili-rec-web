import api from "@/api";

export default {
    install(Vue) {


        Vue.prototype.$checkLogin = async function () {


            try {
                const response = await api.checkAccessKey();
                if (response.message.indexOf("未登录/登录失效") !== -1
                    ||
                    response.message.indexOf("登录已过期") !== -1

                ) {
                    this.$message(response.message, 'error');
                    return null;
                }

                return response;
            } catch (error) {
                console.error('获取用户数据失败:', error);
                return null;
            }

        };


        /**
         * 获取视频BV号
         * @param url
         * @returns {*|null}
         */
        Vue.prototype.$getBvid = function (url) {
            const bvPattern = /BV[a-zA-Z0-9]{10}/; // BV 号通常是 12 位字符（BV + 10 位字母数字）
            const match = url.match(bvPattern);
            if (match) {
                const bvId = match[0]; // 提取匹配的 BV 号
                return bvId;
            } else {
                return null;
            }
        };

        /**
         * 获取用户mid
         * @param url
         * @returns {*|null}
         */
        Vue.prototype.$getMid = function (url) {
            const prefix = "https://space.bilibili.com/";
            if (url.startsWith(prefix)) {
                // 创建一个新的URL对象
                let mid = new URL(url).pathname.split('/').pop();
                return mid;
            } else {
                return null;
            }
        };
        /**
         * 跨域获取图片资源
         * @param url
         * @returns {string}
         */
        Vue.prototype.$getPic = function (url) {
            return process.env.VUE_APP_URL + "/config/getPic?url=" + url;
        };


        /**
         *  格式化 iso8601 格式，转为 yyyy-MM-dd HH:mm:ss 格式
         * @param dateString
         * @returns {`${number}-${string}-${string} ${string}:${string}:${string}`}
         */
        Vue.prototype.$parseIsoDateStr = function (dateString) {
            // 方法1：直接传给 Date 构造函数（会自动处理，但会截断多余精度）
            const date = new Date(dateString);

            // 检查是否有效
            if (isNaN(date.getTime())) {
                throw new Error('无效的时间格式');
            }

            // 格式化为 yyyy-MM-dd HH:mm:ss
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

    }
};