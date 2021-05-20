import request from '@/utils/request'

export function getUser(params) {
  return request({
    url: '/api/user',
    method: 'get',
    params: params
  })
}
