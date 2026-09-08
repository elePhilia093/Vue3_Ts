import request from '@/utils/request'

export interface LoginDTO {
  username: string
  password: string
}

export interface LoginVO {
  token: string
  userId: number
  username: string
}


export function loginAPI(data: LoginDTO) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export interface UserInfo {
  userId: number | null
  username: string | null
  role: Array<string>
}
export function userInfoAPI(){
  return request({
    url: '/auth/info',
    method: 'get',
  })
}