import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home/index.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/detail",
      name: "detail",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "detail" */ "./views/Detail/index.vue")
    },
    {
      path: "/shopCart",
      name: "shopCart",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "shopCart" */ "./views/ShopCart/index.vue")
    }
  ]
});
