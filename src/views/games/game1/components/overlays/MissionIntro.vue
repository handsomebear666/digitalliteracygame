<template>
  <div
    class="system-overlay fullscreen-light"
    style="background: yellow !important"
  ></div>
  <div class="system-overlay fullscreen-light">
    <div class="start-header-light">
      <div class="wechat-logo-placeholder">🔍</div>
      <h1 class="game-title-light">真相放大镜</h1>
      <div class="sub-title-light">—— 家庭群聊防骗保卫战 ——</div>
    </div>
    <div class="intro-card-light">
      <div class="intro-tabs-light">
        <span class="tab-light active">剧情介绍</span>
      </div>
      <div class="warning-text-light">{{ GAME_STORY.warningText }}</div>
    </div>
    <button class="start-btn-light" @click="$emit('start')">
      我准备好了！
    </button>
  </div>
</template>

<script setup>
import { GAME_STORY } from "../../config/story.js";
defineEmits(["start"]);
</script>

<style scoped>
.system-overlay.fullscreen-light {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f4f3 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 确保内部卡片可见 */
.intro-card-light {
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 80%;
  max-width: 300px;
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(7, 193, 96, 0.12);
  border: 1px solid rgba(7, 193, 96, 0.1);
}

.warning-text-light {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.start-btn-light {
  background: #07c160;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>
