
export default {
    install(Vue) {


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
            }else {
                return null;
            }
        };


    }
};