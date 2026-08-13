import request from './index'



const menuApi = '/sys/menu';

export const fetchMenuListAPI = (data: {}) => {
  return request({
    url: menuApi + '/page',
    method: 'post',
    data
  })
}

export const addMenuAPI = (data: {}) => {
  return request({
    url: menuApi + '/add',
    method: 'post',
    data
  })
}

export const updateMenuAPI = (data: {}) => {
  return request({
    url: menuApi + '/update',
    method: 'put',
    data
  })
}

export const deleteMenuAPI = (params: { id: number }) => {
  return request({
    url: menuApi + '/delete',
    method: 'delete',
    params
  })
}