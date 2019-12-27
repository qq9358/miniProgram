import Vue from 'vue'
import App from './App'
import "./assets/index.scss"
import "./assets/iconfont.css"
import store from "./store/index"
import mpvueRouterPath from "mpvue-router-patch"
import mpvueToastRegistry from 'mptoast/src/registry'
mpvueToastRegistry(Vue)

// import locales from "./locale/locales"
// import T from './locale/i18n';


// T.registerLocale(locales)
// try{
//   let value = wx.getStorageSync('language')
//   if(value){
//     T.setLocale(value)
//   }else{
//     T.setLocale('zh-CN')
//   }
// }catch(ex){
//   T.setLocale('zh-CN')
// }
// wx.T = T

// import axios from 'axios'
// import qs from 'qs'

// const baseUrl = 'https://xm.sz-egoal.cn'

// axios.defaults.timeout = 30000
// axios.defaults.baseURL = baseUrl
// axios.defaults.headers = {}
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.adapter = function (config) {
//   return new Promise((resolve, reject) => {
//     let data = config.method === 'get' ? config.params : qs.stringify(config.data)
//     // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
//     wx.request({
//       url: config.url,
//       method: config.method,
//       data: data,
//       success: (res) => {
//         return resolve(res)
//       },
//       fail: (err) => {
//         return reject(err)
//       }
//     })
//   })
// }

// // 请求拦截器
// axios.interceptors.request.use(function (request) {
//   return request
// }, function (error) {
//   return Promise.reject(error)
// })

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   return response
// }, function (error) {
//   return Promise.reject(error)
// })
Vue.use(mpvueRouterPath)
// Vue.prototype.$axios = axios

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'
new Vue({
  store,
  components: {App}
}).$mount('#app');
