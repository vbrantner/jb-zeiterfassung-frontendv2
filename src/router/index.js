import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  },
  {
    path: "/mitarbeiterverwaltung",
    name: "Mitarbeiterverwaltung",
    component: () => import("../views/AdminEmployee.vue")
  },
  {
    path: "/stempeluhr",
    name: "Stempeluhr",
    component: () => import("../views/TimeClock.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
