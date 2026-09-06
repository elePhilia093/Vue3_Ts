import request from "@/utils/request";

/**
 * 用户分页查询
 */
export function userListAPI(params: {}) {
  return request({
    url: "/sys/user/list",
    method: "get",
    params,
  });
}

/**
 * 新增用户
 */
export function userAddAPI(data: {}) {
  return request({
    url: "/sys/user/add",
    method: "post",
    data,
  });
}

/**
 * 修改用户
 */
export function userUpdateAPI(data: {}) {
  return request({
    url: "/sys/user/update",
    method: "put",
    data,
  });
}

/**
 * 删除用户
 */
export function userDeleteAPI(id: number) {
  return request({
    url: `/sys/user/${id}`,
    method: "delete",
  });
}
