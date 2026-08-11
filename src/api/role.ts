import request from './index'


const roleApi = '/sys/role';

export const fetchRoleList = (data: {}) => {
  return request({
    url: roleApi + '/page',
    method: 'post',
    data,
  })
}
