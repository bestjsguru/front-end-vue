import Vue from 'vue'
import App from './components/App.vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})
