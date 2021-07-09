import Vue from 'vue'
import App from './App'
import router from './router/router'
import $ from 'jquery'
Vue.config.productionTip = false

// // 全局引入
Vue.prototype.$ = $
// 引入全局样式表
import './common/normalize.css'
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

