import axios from "axios";
const BASE_URL=process.env.VUE_APP_URL;
import vm from '@/main';
export default function ajax(url, data = {}, type = "GET") {
    return new Promise(function (resolve, reject) {


        axios({
            method: type,
            url: url,
            baseURL:BASE_URL,
            data:data,
            withCredentials:false
        }).then(response => {
            response = response.data;
            if (response.code!==200) {
                // 对于非200响应，显示后端返回的message
                vm.$message(response.message || '请求失败','error');
            }
            resolve(response)
        }).catch(reason => {
            // 处理错误响应
            let errorMessage = '请求失败';

            // 尝试从响应中提取错误信息
            if (reason.response && reason.response.data) {
                const errorData = reason.response.data;
                // 优先使用后端返回的message
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
                // 如果有data字段且包含错误详情，也可以使用
                else if (errorData.data) {
                    errorMessage = errorData.data;
                }
            } else if (reason.message) {
                // 网络错误等其他情况
                errorMessage = reason.message;
            }

            vm.$message(errorMessage,'error');
            reject(reason);
        })


    })
}
