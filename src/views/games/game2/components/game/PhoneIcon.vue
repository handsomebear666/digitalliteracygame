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
import { useGameStore } from "@game2/store/useGameStore";
import phoneIcon from "@game2/assets/img/phone_icon.svg";

const store = useGameStore();

const isHighlighted = computed(() => {
  return [2, 3, 4].includes(store.gameLevel);
});
</script>
