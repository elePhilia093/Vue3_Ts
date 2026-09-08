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
    url: api + "/" + id,
    method: "delete"
  })
}


export function importEmployeeExcel(data: any){
  return request({
    url: "/employee/import",
    method: "post",
    data: data
  })
}

export function exportEmployeeExcel(params?: any){
  return request({
    url: "/employee/export",
    method: "get",
    params: params,
    responseType: "blob"
  })
}
