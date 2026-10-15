import request from "@/utils/request";

export function getLeaveList(params: any) {
  return request({
    url: "/emp/leave/list",
    method: "get",
    params,
  })
}

export function addLeave(data: any) {
  return request({
    url: "/emp/leave/add",
    method: "post",
    data,
  })
}

export function auditLeave(data: any) {
  return request({
    url: "/emp/leave/audit",
    method: "put",
    data,
  })
}

/**
 * Excel 导出
 */
export function exportLeaveExcel(params?: any) {
  return request({
    url: '/emp/leave/export',
    method: 'get',
    params: params,
    responseType: "blob"
  })
}
