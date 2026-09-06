import request from '../utils/request'



const menuApi = '/sys/menu';

export const fetchMenuListAPI = (params: {}) => {
  return request({
    url: menuApi + '/tree',
    method: 'get',
    params
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

export const deleteMenuAPI = (id: number) => {
  return request({
    url: `${menuApi}/delete/${id}`,
    method: 'delete',
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
