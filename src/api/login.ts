import request from "./index.ts"

// 登录
export const loginAPI = (data: {}) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
