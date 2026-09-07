import request from "@/utils/request";

export function getAttendanceList(params: any) {
  return request({
    url: '/emp/attendance/list',
    method: 'get',
    params
  })
}

export function checkIn() {
  return request({
    url: '/emp/attendance/check-in',
    method: 'post'
  })
}

export function checkOut() {
  return request({
    url: '/emp/attendance/check-out',
    method: 'post'
  })
}