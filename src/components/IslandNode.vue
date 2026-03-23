<template>
  <div class="island-node" :class="game.status">
    <div class="island-card">
      <div class="island-number">{{ index + 1 }}</div>
      <div class="island-icon">{{ game.icon }}</div>
      <h3>{{ game.title }}</h3>
      <p class="meta">⏱️ 约 {{ game.time }} | 🎯 {{ game.target }}</p>
      <p class="desc">{{ game.desc }}</p>

      <button
        class="start-btn"
        :disabled="game.status === 'locked'"
        @click="handleAction"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  game: { type: Object, required: true },
  index: { type: Number, required: true },
});

const emit = defineEmits(["play-game"]);

const buttonText = computed(() => {
  if (props.game.status === "locked") return "尚未解锁";
  if (props.game.status === "completed") return "再次挑战";
  return "进入调查";
});

const handleAction = () => {
  if (props.game.status !== "locked") {
    emit("play-game", props.index);
  }
};
</script>

<style scoped>
.island-node {
  display: flex;
  align-items: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.island-node:nth-child(even) {
  flex-direction: row-reverse;
}

.island-card {
  background-color: #fff;
  padding: 25px;
  border-radius: 20px;
  width: 350px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s ease;
  border: 4px solid #fff;
}

.island-number {
  position: absolute;
  top: -20px;
  background-color: #ffd54f;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.island-node:nth-child(odd) .island-number {
  left: -20px;
}
.island-node:nth-child(even) .island-number {
  right: -20px;
}

.island-icon {
  font-size: 40px;
  margin-bottom: 15px;
  text-align: center;
}

.island-card h3 {
  margin: 0 0 10px 0;
  color: #00796b;
  font-size: 20px;
}

.island-card p.meta {
  font-size: 12px;
  color: #888;
  margin: 0 0 10px 0;
}

.island-card p.desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.start-btn {
  background-color: #4db6ac;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}
.start-btn:hover {
  background-color: #00897b;
}

/* 状态样式 */
.active .island-card {
  border-color: #4db6ac;
}
.active .island-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 121, 107, 0.15);
}

.locked {
  filter: grayscale(100%);
}
.locked .island-card {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
}
.locked .start-btn {
  background-color: #b0bec5;
  cursor: not-allowed;
}

.completed .island-card::after {
  content: "✅ 真相大白";
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(76, 175, 80, 0.9);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(-15deg);
}
</style>
