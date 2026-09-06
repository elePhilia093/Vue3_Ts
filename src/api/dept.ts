import request from "@/utils/request";



export const getDeptListAPI = (params: any) => {
  return request({
    url: "/sys/dept/list",
    method: "get",
    params,
  });
}

export const addDeptAPI = (data: any) => {
  return request({
    url: "/sys/dept/add",
    method: "post",
    data,
  });
}

export const updateDeptAPI = (data: any) => {
  return request({
    url: "/sys/dept/update",
    method: "put",
    data,
  });
}

export const deleteDeptAPI = (id: number) => {
  return request({
    url: "/sys/dept/delete/" + id,
    method: "delete",
  });
}
