<template>
  <div class="app-wrapper">
    <TheHeader />

    <div class="map-container">
      <MapDecoration />

      <IslandNode
        v-for="(game, index) in games"
        :key="game.id"
        :game="game"
        :index="index"
        @play-game="handleGameStart"
        @show-cards="handleShowCards"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import MapDecoration from "@/components/MapDecoration.vue";
import IslandNode from "@/components/IslandNode.vue";
import { useGameProgress } from "@/composables/useGameProgress";

const router = useRouter();
const { games } = useGameProgress();

const handleGameStart = (index) => {
  const currentGame = games.value[index];
  if (currentGame.status === "active" || currentGame.status === "completed") {
    sessionStorage.setItem("fromHome", "true");
    router.push(`/game/${currentGame.id}`);
  }
};

const handleShowCards = (index) => {
  const currentGame = games.value[index];
  if (currentGame.status !== "locked") {
    router.push(`/game/${currentGame.id}/cards`);
  }
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  font-family:
    "PingFang SC", "Microsoft YaHei", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: #e0f7fa;
  color: #333;
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}
.map-container {
  max-width: 1000px;
  margin: 20px auto 60px auto;
  padding: 20px;
  position: relative;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="rgba(0,121,107,0.5)" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'),
    auto;
}
</style>
