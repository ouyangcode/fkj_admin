import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import { Loading, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入字体图标
import '@/assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.timeout = 8000
// axios.defaults.baseURL = 'http://124.70.128.152:8080'
axios.defaults.baseURL = 'https://www.hd-bit.com:444'


//开始加载动画
let loading;
function startLoading() {
    loading  = Loading.service({
      lock:true, //是否锁定
      text:'拼命加载中...',//加载中需要显示的文字
      background:'rgba(0,0,0,.7)',//背景颜色
    });
}
//结束加载动画
function endLoading() {
    loading.close();
}
//请求拦截
axios.interceptors.request.use(config=>{
  //请求时的加载动画
  startLoading();
  //加载动画的时候把config return 回去
  return config;
},error => {
  Message.error('请求超时')
  return Promise.resolve(err)
})
//响应拦截
axios.interceptors.response.use(response=>{
  //结束加载动画
  endLoading();
  //结束时把response return回去
  return response;
},error => {
  //错误提醒
  //如果错误也结束动画
  endLoading()
  // 对响应错误做点什么
  Message.error('响应失败')
  return Promise.reject(error)
})

// 格式化时间的过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
