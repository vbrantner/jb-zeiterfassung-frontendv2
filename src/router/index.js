import Vue from "vue";
import VueRouter from "vue-router";
import { authGuard } from "../auth/authGuard";

// Import components
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: authGuard,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/mitarbeiterverwaltung",
    name: "Mitarbeiterverwaltung",
    component: () => import("../views/AdminEmployee.vue"),
  },
  {
    path: "/stempeluhr",
    name: "Stempeluhr",
    component: () => import("../views/TimeClock.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
