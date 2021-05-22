import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/api/order',
    method: 'get',
    params: params
  })
}


export function updateOrder(id, data) {
  return request({
    url: '/api/order/' + id,
    method: 'put',
    data: data
  })
}


export function addOrder(data) {
  return request({
    url: '/api/order',
    method: 'post',
    data: data
  })
}


export function deleteOrder(id) {
  return request({
    url: '/api/order/' + id,
    method: 'delete'
  })
}

