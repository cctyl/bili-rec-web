import ajax from "./ajax";

export default {

    /**
     * 检查访问密钥
     * @returns {Promise<unknown>}
     */
    checkAccessKey() {
        return ajax('/config/check-accesskey');
    },

    /**
     * 检查扫码结果
     * @returns {Promise<unknown>}
     */
    checkScanResult() {
        return ajax('/config/web-scan-result');
    },

    /**
     * 申请网页二维码
     * @returns {Promise | Promise<unknown> | *}
     */
    getWebQrCode() {
        return ajax('/config/web-qr-code');
    },

    /**
     * 申请tv二维码
     * @returns {Promise | Promise<unknown> | *}
     */
    getTvQrCode() {
        return ajax('/config/tv-qr-code');
    },
    /**
     * 检查tv扫码结果
     * @returns {Promise<unknown>}
     */
    checkTvScanResult() {
        return ajax('/config/tv-scan-result');
    },


    /**
     * 获取Cookie列表
     * @param {number} page 页码
     * @param {number} limit 每页数量
     * @returns {Promise<unknown>}
     */
    getCookieList(page, limit) {
        return ajax(`/cookie-header-data/list/${page}/${limit}`);
    },
    /**
     * 新增Cookie数据
     * @param {Object} cookieData
     * @returns {Promise<unknown>}
     */
    addCookie(cookieData) {
        return ajax('/cookie-header-data', cookieData, 'POST');
    },

    /**
     * 修改Cookie数据
     * @param {Object} cookieData
     * @returns {Promise<unknown>}
     */
    updateCookie(cookieData) {
        return ajax('/cookie-header-data', cookieData, 'PUT');
    },
    /**
     * 删除Cookie数据
     * @param {Object} cookieData
     * @returns {Promise<unknown>}
     */
    deleteCookie(cookieData) {
        return ajax('/cookie-header-data', cookieData, 'DELETE');
    },


    /**
     * 获取config列表
     * @param {number} page 页码
     * @param {number} limit 每页数量
     * @returns {Promise<unknown>}
     */
    getConfigList() {
        return ajax(`/config/standard`);
    },


    /**
     * 修改Config数据
     * @param {Object} configData
     * @returns {Promise<unknown>}
     */
    addOrUpdateConfig(configData) {
        return ajax('/config/standard', configData, 'POST');
    },

    /**
     * 获取字典列表
     * @returns {Promise | Promise<unknown> | *}
     * @param accessType String
     * @param dictType String
     */
    getDictList(accessType, dictType) {
        return ajax(`/dict/list?dictType=${dictType}&accessType=${accessType}`);
    },


    /**
     * 获取训练好的结果
     * @param type
     * @returns {Promise | Promise<unknown> | *}
     */
    getCacheTrainResult(type) {
        return ajax('/black-rule/cache-train-result/' + type);
    },

    /**
     * 获取训练好的结果
     * @param type String
     * @param arr Array
     * @returns {Promise | Promise<unknown> | *}
     */
    submitSelectTrainResult(type, arr) {
        return ajax('/black-rule/cache-train-result/' + type, arr, 'PUT');
    },

    /**
     * 获得黑名单关键词列表
     * @returns {Promise | Promise<unknown> | *}
     */
    getBlackKeyWordList() {
        return ajax("/black-rule/keyword");
    },
    getBlackTidList() {
        return ajax("/black-rule/tid")
    },
    getBlackUserIdList() {
        return ajax("/black-rule/user-id")
    },
    getBlackTagList() {
        return ajax("/black-rule/tag")
    },
    getIgnoreKeyWordList() {
        return ajax("/black-rule/ignore")
    },
    getIgnoreTagList() {
        return ajax("/black-rule/ignoreTag")
    },


    /**
     * 根据mid获取用户名
     * @param mid
     * @returns {Promise | Promise<unknown> | *}
     */
    getUserNameByMid(mid) {
        return ajax(`/dict/getUserNameByMid/${mid}`);
    },

    /**
     * 获取分区列表
     * @returns {Promise | Promise<unknown> | *}
     */
    getRegionList() {
        return ajax(`/region/list`);
    },
    /**
     * 添加关键词
     * @returns {Promise | Promise<unknown> | *}
     */
    addDict(keywordItem) {
        return ajax(`/dict`, keywordItem, 'POST');
    },

    delDictById(id) {
        return ajax(`/dict/${id}`, null, 'DELETE');
    },
    /**
     * 查询白名单列表
     * @param pageNo
     * @param pageSize
     */
    getWhiteRuleList(pageNo, pageSize) {

        return ajax(`/white-rule/list/${pageNo}/${pageSize}`);
    },
    addOrUpdateWhiteRule(newItem) {
        return ajax(`/white-rule`, newItem, 'POST')
    },
    /**
     * 删除白名单
     * @param id
     * @returns {Promise | Promise<unknown> | *}
     */
    delWhiteRuleById(id) {
        return ajax(`/white-rule/${id}`, null, 'DELETE')
    },
    /**
     * 批量删除再新增字典
     * @param accessType
     * @param dictType
     * @param dictArr
     * @returns {Promise | Promise<unknown> | *}
     */
    batchRemoveAndUpdate(accessType, dictType, dictArr) {
        return ajax(`/dict/batchRemoveAndUpdate?accessType=${accessType}&dictType=${dictType}`, dictArr, 'POST')
    },
    /**
     * 查询任务列表
     * @returns {Promise<unknown> | *}
     */
    getTaskList() {
        return ajax(`/task/task-list`);
    },
    /**
     * 更新任务
     * @param task
     * @returns {Promise | Promise<unknown> | *}
     */
    updateTaskEnabled(task) {
        return ajax(`/task`, task, 'PUT');
    },
    /**
     * 触发任务
     * @param classAndMethodName
     * @param paramArr
     * @returns {Promise | Promise<unknown> | *}
     */
    triggerTask(classAndMethodName, paramArr = []) {

        const result = paramArr.join(',');
        return ajax(`/task/common-trigger-task?classAndMethodName=${classAndMethodName}&paramArr=${result}`);
    },

    /**
     * 保存视频评论
     * @param bvid
     * @returns {Promise | Promise<unknown> | *}
     */
    saveVideoComment(bvid) {
        return ajax(`/reply/save-reply?bvid=${bvid}`, null, 'POST');
    },
    /**
     * 对指定分区的 排行榜、热门视频进行点踩
     * @param tidArr
     */
    disklikeByTid(tidArr) {
        return ajax(`/black-rule/disklike-by-tid`, tidArr, 'POST');
    },
    /**
     * 判断是否是黑名单
     * @param bvid
     * @returns {Promise | Promise<unknown> | *}
     */
    isBlack(bvid) {
        return ajax(`/black-rule/check-video?bvid=${bvid}`);
    },

    /**
     * 判断是否是白名单
     * @param bvid
     * @returns {Promise | Promise<unknown> | *}
     */
    isWhite(bvid) {
        return ajax(`/white-rule/check-video?bvid=${bvid}`);
    },

    /**
     * 对用户的投稿视频进行点赞
     * @param mid
     */
    thumbUpUserVideo(mid){
        return ajax(`/white-rule/thumb-up-all/${mid}`,null, 'POST');
    },


    /**
     * 对用户的投稿视频进行点踩
     * @param mid
     * @param train Boolean
     */
    dislikeUserVideo(mid,train){
        return ajax(`/black-rule/disklike-by-uid?train=${train}`,[mid], 'POST');
    },

    /**
     * 训练白名单
     * @param param
     * @returns {Promise | Promise<unknown> | *}
     */
    trainWhiteRule(param){
        return ajax(`/white-rule/train?id=${param.id?param.id:''}&mid=${param.mid?param.mid:''}`,param.trainedBvidList, 'POST');
    },
    /**
     * 获取总览数据
     * @returns {Promise | Promise<unknown> | *}
     */
    getOverviewData(selectedYear) {
        return ajax(`/overview?year=${selectedYear}`);
    },

    /**
     * 获取待处理的视频列表
     * @param {Object} params 查询参数
     * @param {number} params.page 页码
     * @param {number} params.size 每页数量
     * @param {string} params.sort 排序
     * @param {string} params.handleType 处理类型 (THUMB_UP/DISLIKE/OTHER)
     * @returns {Promise<unknown>}
     */
    getReady2HandleVideo(params) {
        return ajax(`/task/ready2handle?page=${params.page}&size=${params.size}&sort=${params.sort || ''}&handleType=${params.handleType}`);
    },

    /**
     * 获取历史处理过的视频列表
     * @param {Object} params 查询参数
     * @param {number} params.page 页码
     * @param {number} params.size 每页数量
     * @param {string} params.sort 排序
     * @param {string} params.handleType 处理类型 (THUMB_UP/DISLIKE/OTHER)
     * @returns {Promise<unknown>}
     */
    getAlreadyHandleVideo(params) {
        return ajax(`/task/already-handle?page=${params.page}&size=${params.size}&sort=${params.sort || ''}&handleType=${params.handleType}&search=${params.search}`);
    },


    /**
     * 处理单条视频数据
     * @param {string} id - 视频ID
     * @param {string} handleType - 处理类型(THUMB_UP/DISLIKE/OTHER)
     * @param {string} [reason] - 修改原因
     * @param reHandle 是否重复处理
     * @returns {Promise<unknown>}
     */
    processVideo(id, handleType, reason,reHandle=false) {
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('handleType', handleType);
        params.append('reHandle', reHandle);
        if (reason) {
            params.append('reason', reason);
        }
        return ajax(`/task/process?${params.toString()}`, null, 'PUT');
    },

    /**
     * 记录观看视频
     * @param aid
     * @returns {Promise | Promise<unknown> | *}
     */
    watchVideo(aid){
        return ajax(`/video-detail/watch/${aid}`,null, 'POST');
    },
};