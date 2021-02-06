import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    // 同一个refresh_token，该接口只能使用一次！！！否者会报错
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // console.log('come in interceptors', config)
  // 我们就可以在这里通过改写config配置信息来实现业务功能的统一处理

  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回config，否则请求就发不出去
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false // 刷新token状态
let requests: any [] = []// 刷新token状态期间被挂起的请求

request.interceptors.response.use(function (response) { // 当状态码为2xx，都会进去这里
  // console.log('请求响应成功', response)
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async function (error) { // 超出2xx，都执行这里
  // 若使用的HTTP错误，则错误处理写到这里
  // console.log('请求响应失败', error)
  if (error.response) { // 请求发出去,收到响应了，但是状态码超出了2范围
    const { status } = error.response
    // 400
    // 401
    // 403
    // 404
    // 500
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // Token无效（Token过期，或者未提供Token）
      // 如果有refresh_token，则尝试使用refresh_token更新access_token
      if (!store.state.user) {
        console.log('come in store.state.user redirectLogin')
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        // 尝试刷新新的cookie
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 token 失败')
          }
          store.commit('setUser', res.data.content)

          // 刷新 toekn 成功， 就讲所有挂起的请求执行掉
          requests.forEach(cb => cb())
          // 将执行过的 请求数组 清空
          requests = []

          return request(error.config)
        }).catch(err => {
          console.log(err)
          // 把当前登录用户状态清除
          store.commit('setUser', null)
          // 失败了=> 跳转登录页重新登录获取新的token
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false
        })
      }
      // 刷新状态下，把请求挂起，放到requests数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
      // Message.error('')
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去了，但是未收到响应
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了错误
    // Something happened in setting up the request that triggered an Error
    Message.error(`请求失败:${error.message}`)
  }

  // 把请求失败的错误对象继续抛出，扔给下一个上一个调用者
  return Promise.reject(error)
})

export default request
