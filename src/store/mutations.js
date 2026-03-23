/*
    直接操作state的地方
 */
export default {


    /**
     * 设置用户信息
     * @param state
     * @param value
     * @constructor
     */
    SET_USER_INFO(state,value){

        //修改state
        state.userInfo=value
    },


    /**
     * 设置系统配置信息
     */
    SET_STANDARD_CONFIG(state,value){
        state.standardConfig = value;
    }


}
