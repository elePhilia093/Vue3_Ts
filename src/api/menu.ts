import request from './index'



const menuApi = '/sys/menu';

export const fetchMenuListAPI = (data: {}) => {
  return request({
    url: menuApi + '/list',
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


export const getMenuTreeByRoleIdAPI = (params: { roleId: number }) => {
  return request({
    url: '/sysRoleMenu/menus',
    method: 'get',
    params
  })
}


export const assignMenuAPI = (data: {}) => {
  return request({
    url: '/sysRoleMenu/assign',
    method: 'post',
    data
  })
}
