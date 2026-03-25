<template>
  <div class="island-node" :class="game.status">
    <div class="island-card">
      <div class="island-number">{{ index + 1 }}</div>
      <div class="island-icon">{{ game.icon }}</div>

      <h3>{{ game.title }}</h3>
      <p class="meta" v-if="game.time">⏱️ {{ game.time }}</p>

      <div
        v-if="game.status !== 'locked' && game.tags && game.tags.length > 0"
        class="tag-group"
      >
        <span
          v-for="(tag, tagIndex) in game.tags"
          :key="tagIndex"
          class="tag"
          :class="'tag-color-' + ((tagIndex % 4) + 1)"
        >
          {{ tag }}
        </span>
      </div>

      <p class="desc">{{ game.desc }}</p>

      <div class="button-group">
        <button
          class="start-btn"
          :disabled="game.status === 'locked'"
          @click="handleAction"
        >
          {{ buttonText }}
        </button>

        <button
          class="card-btn"
          :disabled="game.status === 'locked'"
          @click="$emit('show-cards', index)"
        >
          🎴 卡片知识
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  game: { type: Object, required: true },
  index: { type: Number, required: true },
});

const emit = defineEmits(["play-game", "show-cards"]);

// 动态计算开始按钮文本 (修复通关后不显示“再次挑战”的问题)
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
/* 基础岛屿样式 */
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
  text-align: center;
}
.island-card p.meta {
  font-size: 12px;
  color: #888;
  margin: 0 0 15px 0;
  text-align: center;
}
.island-card p.desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

/* 💥 找回丢失的彩色气泡标签样式 */
.tag-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
.tag {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
}
.tag-color-1 {
  background-color: #e1f5fe;
  color: #0277bd;
}
.tag-color-2 {
  background-color: #f1f8e9;
  color: #558b2f;
}
.tag-color-3 {
  background-color: #fffde7;
  color: #f9a825;
}
.tag-color-4 {
  background-color: #fce4ec;
  color: #c2185b;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 10px;
  width: 100%;
}
.start-btn,
.card-btn {
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
  text-align: center;
  box-sizing: border-box;
}
.start-btn {
  background-color: #4db6ac;
}
.start-btn:hover {
  background-color: #00897b;
}
.card-btn {
  background-color: #ffb300;
}
.card-btn:hover {
  background-color: #ff8f00;
}

/* 状态样式 */
.island-node.active .island-card {
  border-color: #4db6ac;
  cursor: pointer;
}
.island-node.active .island-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 121, 107, 0.15);
}
.island-node.locked {
  filter: grayscale(100%);
  pointer-events: none;
}
.island-node.locked .island-card {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
}
.island-node.locked .start-btn,
.island-node.locked .card-btn {
  background-color: #b0bec5;
}

/* 已通关状态 ✅真相大白盖章 */
.island-node.completed .island-card::after {
  content: "✅ 真相大白";
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(76, 175, 80, 0.9);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(-15deg);
  pointer-events: none;
  z-index: 5;
}
</style>
