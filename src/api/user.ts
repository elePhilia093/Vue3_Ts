import request from './index'

import type {UserPageResult} from '@/types/user'

export const fetchUserListAPI = (data: {}) => {
  return request<UserPageResult>({
    url: '/user/page',
    method: 'post',
    data,
  })
}