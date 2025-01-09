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
};