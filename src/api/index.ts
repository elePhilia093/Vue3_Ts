import axios from 'axios'
import { ElMessage } from 'element-plus';
import type {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

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
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
    return res.data 
  },
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request<any, T>(config);
};
export default request