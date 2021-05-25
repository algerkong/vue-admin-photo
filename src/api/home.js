import request from '@/utils/request'

export function getUserListCount() {
  return request({
    url: '/api/dynamic/count',
    method: 'get'
  })
}

export function getHomeCount() {
  return request({
    url: '/api/home/count',
    method: 'get'
  })
}

export function getNewUser() {
  return request({
    url: '/api/home/newuser',
    method: 'get'
  })
}

