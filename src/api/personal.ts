import request from "@/utils/request";


export function getPersonalInfo() {
  return request({
    url: "/personal/info",
    method: "get"
  })
}

export function updatePersonalInfo(data){
  return request({
    url: "/personal/info",
    method: "put",
    data
  })
}


export function updatePassword(data){
  return request({
    url: "/personal/password",
    method: "put",
    data
  })
}


