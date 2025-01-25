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
            withCredentials:true
        }).then(response => {
            response = response.data;
            if (!response.success) {
                vm.$message(response.message,'error');
            }
            resolve(response)
        }).catch(reason => {
            reject(reason)
            vm.$message(reason,'error');
        })


    })
}
