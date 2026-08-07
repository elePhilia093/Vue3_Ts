import request from './index'

import type {UserPageResult} from '@/types/user'

export const fetchUserListAPI = (data: {}) => {
  return request<UserPageResult>({
    url: '/user/page',
    method: 'post',
    data,
  })
}

// 新增用户
export const addUserAPI = (data: {}) => {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

// 更新用户
export const updateUserAPI = (data: {}) => {
  return request({
    url: '/user/update',
    method: 'put',
    data,
  })
}

// 删除用户
export const deleteUserAPI = (id: number) => {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete',
  })
}
