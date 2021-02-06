/**
 * 资源分类相关请求模块
 */

import request from '@/utils/request'

export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

export const deleteCategory = (id: any) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}
export const createOrUpdateCategory = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data: data
  })
}
