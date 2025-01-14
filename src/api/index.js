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
  getDictList(accessType,dictType) {
    return ajax(`/dict/list?dictType=${dictType}&accessType=${accessType}`);
  },


  /**
   * 获取训练好的结果
   * @param type
   * @returns {Promise | Promise<unknown> | *}
   */
  getCacheTrainResult(type) {
    return ajax('/black-rule/cache-train-result/'+type);
  },

  /**
   * 获取训练好的结果
   * @param type String
   * @param arr Array
   * @returns {Promise | Promise<unknown> | *}
   */
  submitSelectTrainResult(type,arr) {
    return ajax('/black-rule/cache-train-result/'+type,arr,'PUT');
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
  getUserNameByMid(mid)
  {
    return ajax(`/dict/getUserNameByMid/${mid}`);
  },

  /**
   * 获取分区列表
   * @returns {Promise | Promise<unknown> | *}
   */
  getRegionList(){
    return ajax(`/region/list`);
  },
  /**
   * 添加关键词
   * @returns {Promise | Promise<unknown> | *}
   */
  addDict(keywordItem){
    return ajax(`/dict`,keywordItem,'POST');
  },

  delDictById(id){
    return ajax(`/dict/${id}`,null,'DELETE');
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
    return ajax(`/white-rule`,newItem,'POST')
  }
};