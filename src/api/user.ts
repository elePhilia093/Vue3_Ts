import request from './index'

import type {UserList} from '@/types/user'

export const fetchUserListAPI = (params: {}) => {
  return request<UserList>({
    url: '/user/page',
    method: 'get',
    params,
  })
}