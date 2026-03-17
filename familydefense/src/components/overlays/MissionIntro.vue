<template>
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
    <button class="start-btn-light" @click="$emit('start')">我准备好了！</button>
  </div>
</template>

<script setup>
import { GAME_STORY } from '../../config/story.js';
defineEmits(['start']);
</script>