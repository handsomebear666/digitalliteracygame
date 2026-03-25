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
  {
    path: "/game/game2",
    name: "Game2",
    component: () => import("@/views/games/game2/game2.vue"),
  },
  {
    path: "/game/:id/cards",
    name: "KnowledgeCards",
    component: () => import("@/views/KnowledgeCardsView.vue"),
  },
];

const router = createRouter({
  // 2. 这里也要跟着改！
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
