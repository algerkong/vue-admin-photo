import request from '@/utils/request'

export function addTag(data) {
  return request({
    url: '/api/tag',
    method: 'post',
    data: data
  })
}

export function getTagList(params) {
  return request({
    url: '/api/tag',
    method: 'get',
    params: params
  })
}

export function deleteTag(id) {
  return request({
    url: '/api/tag/' + id,
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
