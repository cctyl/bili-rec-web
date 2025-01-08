

import ajax from "./ajax";


export default {


    /**
     * 根据手机号获取用户头像
     * @param phoneNum
     * @returns {Promise<unknown>}
     */
    getAvatarByPhone(phoneNum) {
        return ajax(`/uc/user/avatar/${phoneNum}`)

    },

}
