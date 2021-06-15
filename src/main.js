// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 自定义格式化日期
import { formatDate } from './common/utils/FormatDate'
// 滚动条插件
import { HappyScroll } from 'vue-happy-scroll'
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'
// 自定义组件名
Vue.component('happy-scroll', HappyScroll)

// 设置反向代理，前端请求默认发送到 http://后端服务器ip:端口号/api
const axios = require('axios')
// 实验室
// axios.defaults.baseURL = 'http://223.2.50.241:8300/api'
// 寝室
// axios.defaults.baseURL = 'http://172.27.7.20:8443/api'
// 部署
axios.defaults.baseURL = 'http://222.192.6.51:8300/api'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(ElementUI)

// 自定义格式化日期的过滤器
Vue.filter('mdFormatDate', (time) => {
  let date = new Date(time)
  return formatDate(date, 'MM-dd')
})
Vue.filter('formatDate', (time) => {
  let date = new Date(time)
  return formatDate(date, 'yyyy-MM-dd')
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user !== null) {
      if (to.meta.userType === 'admin') {
        // 如果页面需要管理员权限
        if (store.state.user.isManager === 1) {
          next()
        } else {
          next({
            path: 'borrow'
          })
        }
      } else if (to.meta.userType === 'normal') {
        if (store.state.user.isManager < 3) {
          next()
        } else {
          next({
            path: 'borrow'
          })
        }
      } else if (to.meta.userType === 'all') {
        next()
      }
    } else {
      next({
        path: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
