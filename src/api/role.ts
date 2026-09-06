import request from '../utils/request'


const roleApi = '/sys/role';

export const fetchRoleList = (params: {}) => {
  return request({
    url: roleApi + '/list',
    method: 'get',
    params,
  })
}

export const fetchRoleListAll = () => {
  return request({
    url: roleApi + '/list',
    method: 'get',
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
