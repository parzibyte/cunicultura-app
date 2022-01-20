import Vue from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import "./filtros";
import router from "./router"
Vue.use(Buefy);
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
