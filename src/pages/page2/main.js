import Vue from 'vue'
import App from './App'
// import jquery from 'jquery'
Vue.config.productionTip = false
// 全局引入
// Vue.prototype.$ = jquery
// 引入全局样式表
import '../../common/normalize.css'
new Vue({
  render: h => h(App)
}).$mount('#app')
