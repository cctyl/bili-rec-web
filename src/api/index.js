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
  }
};