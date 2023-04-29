// import VueRouter from "vue-router";
import Home from "./Home.vue";
import Password from "./Password.vue";
import Primary from "./Primary.vue";
import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/primary",
    component: Primary,
  },
  {
    path: "/password",
    component: Password,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
