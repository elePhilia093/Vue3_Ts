import request from "@/api/index";



export const getDeptListAPI = (params: any) => {
  return request({
    url: "/sys/dept/list",
    method: "get",
    params,
  });
}
