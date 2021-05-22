import request from '@/utils/request'

export function addDynamic(data) {
  return request({
    url: '/api/dynamic',
    method: 'post',
    data: data
  })
}

export function getDynamic(params) {
  return request({
    url: '/api/dynamic',
    method: 'get',
    params: params
  })
}

export function deleteDynamic(id) {
  return request({
    url: '/api/dynamic/' + id,
    method: 'delete'
  })
}


export function updateDynamic(id, data) {
  return request({
    url: '/api/dynamic/' + id,
    method: 'put',
    data: data
  })
}
