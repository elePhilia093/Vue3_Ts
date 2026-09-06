import request from '../utils/request'


const roleApi = '/sys/role';

export const fetchRoleListAPI = (params: {}) => {
  return request({
    url: roleApi + '/list',
    method: 'get',
    params,
  })
}

export function roleListAllAPI() {
  return request({
    url: '/sys/role/all',
    method: 'get'
  })
}

export const addRole = (data: {}) => {
  return request({
    url: roleApi + '/add',
    method: 'post',
    data,
  })
}

export const updateRole = (data: {}) => {
  return request({
    url: roleApi + '/update',
    method: 'put',
    data,
  })
}

export const deleteRole = (id: number) => {
  return request({
    url: roleApi + '/delete/' + id,
    method: 'delete',
  })
}

// 查询角色已有菜单

