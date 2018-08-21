import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import Toasted from 'vue-toasted';
import "./registerServiceWorker";

// Vue.use(Toasted, {
//   position: 'top-center',
//   duration: 1000
// });
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
