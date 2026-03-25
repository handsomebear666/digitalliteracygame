<template>
  <div>
    <div class="drawer-overlay" :class="{ show: store.state.showDrawer }"></div>
    <div class="game-action-area" v-if="store.state.showDrawer">
      <div class="options-panel">
        <div class="question-title">{{ title }}</div>
        <button
          v-for="(opt, index) in options"
          :key="index"
          class="action-btn"
          :class="index === 0 ? 'outline' : 'solid'"
          @click="selectOption(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameStore as store } from "../../store/gameStore.js";

defineProps({
  title: String,
  options: Array,
});

const emit = defineEmits(["select"]);

const selectOption = (val) => {
  store.playSound("click");
  store.state.showDrawer = false;
  emit("select", val);
};
</script>
<style scoped>
.drawer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 15;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.drawer-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

.game-action-area {
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.options-panel {
  background: #f7f7f7;
  padding: 20px 20px 25px;
  margin: 0;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: slideUpDrawer 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}
.question-title {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
  line-height: 1.5;
}
.action-btn {
  white-space: normal;
  line-height: 1.4;
  padding: 12px 15px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn.outline {
  background-color: #ffffff;
  color: #07c160;
  border: 1px solid #07c160;
}
.action-btn.solid {
  background-color: #07c160;
  color: #ffffff;
  border: 1px solid #07c160;
}
.action-btn.outline:active {
  background-color: #f0f0f0;
}
.action-btn.solid:active {
  background-color: #06ad56;
}
</style>
