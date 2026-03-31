<template>
  <div
    id="systemToast"
    class="system-hint-toast"
    :class="{ show: !!store.toastMsg }"
    :style="{ backgroundColor: store.toastBgColor }"
  >
    <span>{{ store.toastMsg }}</span>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
const store = useGameStore();
</script>

<style scoped>
.system-hint-toast {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 92%;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  background: #07c160;
  padding: 12px 16px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  text-align: center;
  z-index: 999999;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.3s ease,
    bottom 0.3s ease;
}
.system-hint-toast.show {
  opacity: 1;
  bottom: 85px;
}
</style>
