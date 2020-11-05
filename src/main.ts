import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
