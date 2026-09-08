import request from '@/utils/request'


/**
 * 公告分页查询
 */
export function getAnnouncementList(params:any){
  return request({
    url: "/system/announcement/list",
    method: "get",

  })
}



/**
 * 新增公告
 */
export function addAnnouncement(data:any){
  return request({
    url: "/system/announcement/add",
    method: "post",
    data
  })
}

/**
 * 修改公告
 */
export function updateAnnouncement(data:any){
  return request({
    url: "/system/announcement/update",
    method: "put",
    data
  })
}


/**
 * 删除公告
 */
export function deleteAnnouncement(id:number){
  return request({
    url: `/system/announcement/delete/${id}`,
    method: "delete"
  })
}