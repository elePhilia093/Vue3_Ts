import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus';
import type {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'


const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['token'] = localStorage.getItem('token') || ''
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
   if (response.config.responseType === 'blob') {
      return response
    }
    const result = response.data

    // 后端业务处理失败
    if (result.code !== 200) {
      return Promise.reject(result)
    }

    return result
  },
  (error) => {
    if (error.response && error.response.status) {
      const status = error.response.status
      if (status === 403) {
        ElMessage.error('登录过期，请重新登录')
        // to re-login
        const fullPath = router.currentRoute.value.fullPath
        localStorage.clear()
        router.push({
          path: '/login',
          query: {
            redirect: fullPath
          }
        })
      } else if(status === 400){
        ElMessage.error(error.response.data.message || '请求失败')
      }
    }
    
    return Promise.reject(error)
  }
)

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request<any, T>(config);
};
export default request