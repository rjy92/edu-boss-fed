import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器实现了数据共享，在组件总共享方便，但是没有持久化的功能
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
    // user: null // 当前登录用户状态
  },
  mutations: {
    // 修改容器数据必须使用mutations函数
    setUser (state, payload) {
      state.user = JSON.parse(payload)

      // 1为了防止页面刷新，数据丢失，需要把数据持久化
      // 2本地存储只能存储字符串
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
