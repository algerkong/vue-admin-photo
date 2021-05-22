import request from '@/utils/request'

// export function addImg(data) {
//   return request({
//     url: '/api/upload',
//     method: 'post',
//     data: data
//   })
// }

export function getImgList(params, data = null) {
  return request({
    url: '/api/img',
    method: 'post',
    params: params,
    data: data
  })
}

export function deleteImg(id) {
  return request({
    url: '/api/img/' + id,
    method: 'delete'
  })
}


export function updateTag(id, data) {
  return request({
    url: '/api/tag/' + id,
    method: 'put',
    data: data
  })
}
