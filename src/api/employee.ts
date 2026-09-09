import request from '@/utils/request'

const api = "/emp/employee"

export function getEmployeeList(queryParams: any) {
  return request({
    url: api + "/list",
    method: "get",
    params: queryParams
  })
}

export function addEmployee(data: any) {
  return request({
    url: api + "/add",
    method: "post",
    data: data
  })
}

export function updateEmployee(data: any) {
  return request({
    url: api + "/update",
    method: "put",
    data: data
  })
}

export function deleteEmployee(id: number) {
  return request({
    url: api + "/delete/" + id,
    method: "delete"
  })
}

/**
 * Excel 导入
 */
export function importEmployeeExcel(file: File) {

  const formData = new FormData()

  formData.append("file", file)

  return request({
    url: api + "/import",
    method: "post",
    data: formData
  })
}

/**
 * Excel 导出
 */
export function exportEmployeeExcel(params?: any) {
  return request({
    url: api + "/export",
    method: "get",
    params: params,
    responseType: "blob"
  })
}