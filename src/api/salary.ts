import request from "@/utils/request";

/**
 * 分页查询
 */

export function getSalaryList(params: any){
  return request({
    url: "/emp/salary/list",
    method: "get",
    params,
  })
}

/**
 * 新增薪资
 */
export function addSalary(data: any) {
  return request({
    url: "/emp/salary/add",
    method: "post",
    data,
  })
}

/**
 * 修改薪资
 */
export function updateSalary(data: any) {
  return request({
    url: "/emp/salary/update",
    method: "put",
    data,
  })
}

/**
 * 删除薪资
 */
export function deleteSalary(id: number) {
  return request({
    url: `/emp/salary/delete/${id}`,
    method: "delete",
  })
}
