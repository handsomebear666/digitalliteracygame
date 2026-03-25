<template>
  <div
    class="phone-btn"
    :class="{ 'pulse-highlight': isHighlighted }"
    @click="store.togglePhone()"
  >
    <img :src="phoneIcon" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import phoneIcon from "@/views/games/game2/assets/img/phone_icon.svg";

const store = useGameStore();

const isHighlighted = computed(() => {
  return [2, 3, 4].includes(store.gameLevel);
});
</script>

<style scoped>
.phone-btn {
  position: absolute;
  top: 25px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: floating-btn 2.5s infinite ease-in-out;
  transition: transform 0.2s;
}
.phone-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.phone-btn:active {
  transform: scale(0.9);
}
@keyframes floating-btn {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.pulse-highlight {
  animation: pulse-shadow 1.5s infinite;
}
@keyframes pulse-shadow {
  0% {
    box-shadow: 0 0 0 0 rgba(7, 193, 96, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(7, 193, 96, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(7, 193, 96, 0);
  }
}
</style>
