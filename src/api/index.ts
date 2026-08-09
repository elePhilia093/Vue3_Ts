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
    if(response instanceof Blob){
      return response
    }
    
    const res = response.data
    
    if(res.code !== 200){
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(res)
    }

    if(res.code == 200 && res.message && !res.data){
      ElMessage.success(res.message)
    }
    
    return res.data 
  },
  (error) => {
    if (error.response && error.response.status) {
      const status = error.response.status
      if (status === 401) {

        ElMessage.error('登录过期，请重新登录')
        // to re-login
        router.push('/login')
      }
    }
    
    return Promise.reject(error)
  }
)

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request<any, T>(config);
};
export default request