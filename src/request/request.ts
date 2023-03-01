import axios from 'axios'
import {baseURL} from  "./baseConfig";

// 创建axios实例
export function requestService(config: any) {
    const service = axios.create({
        // axios中请求配置有baseURL选项，表示请求URL公共部分
        baseURL: baseURL,
        // 超时
        timeout: 10000,
    })
    // request拦截器
    service.interceptors.request.use((config: any)=> {
        config.headers.common["token"] = localStorage.getItem('token');
        
        return config
    }, error => {
        console.log(error)
        Promise.reject(error)
    })

    // 响应拦截器
    service.interceptors.response.use(res => {
	        
            return Promise.resolve(res)
        },
        error => {
            return Promise.reject(error)
        }
    )
    return service(config)
}