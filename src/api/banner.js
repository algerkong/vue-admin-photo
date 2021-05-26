import request from '@/utils/request'

export function getBannerList(params) {
  return request({
    url: '/api/banner',
    method: 'get',
    params: params
  })
}

export function addBanner(data) {
  return request({
    url: '/api/banner',
    method: 'post',
    data: data
  })
}


export function deleteBanner(id) {
  return request({
    url: '/api/banner/' + id,
    method: 'delete'
  })
}

