import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Game1 from "@/views/games/game1/game1.vue";
import Game2 from "@/views/games/game2/game2.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/game/game1",
    name: "Game1",
    component: () => import("@/views/games/game1/game1.vue"),
  },
  // game2 同理
];

const router = createRouter({
  // 2. 这里也要跟着改！
  history: createWebHashHistory(),
  routes,
});

export default router;
