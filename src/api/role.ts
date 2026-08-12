import request from './index'


const roleApi = '/sys/role';

export const fetchRoleList = (data: {}) => {
  return request({
    url: roleApi + '/page',
    method: 'post',
    data,
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
