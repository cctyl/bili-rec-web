
export default {
    install(Vue) {
        
        
        // 添加全局函数
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
    }
};