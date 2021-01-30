/* 用户相关请求模块 */
import request from '@/utils/request'

import qs from 'qs'
// import store from '@/store'

interface User{
  phone: string;
  password: string;
}
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果 data是普通对象，则 content-type  是application/json
    // 如果 data 是 qs.stringify()转换之后的数据 key=value，则content-type 会被设置为application/x-www-form-urlencoded，则不需要手动设置headers
    // 如果data是FormData对象，则 content-type 是multipart/form-data对象
    data: qs.stringify(data) // axios发送请求，默认发送的是application/json格式的数据，但我们需要的是x-www-form-urlencoded
  })
}
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}
