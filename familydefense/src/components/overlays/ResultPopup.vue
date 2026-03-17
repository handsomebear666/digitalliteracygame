<template>
  <div class="system-overlay glass-popup" style="z-index: 100000">
    <div class="glass-box">
      <div v-if="resultData.type === 'fail'" style="font-size: 40px; margin-bottom: 10px; animation: pulseIcon 1.5s infinite;">⚠️</div>
      <h1 class="game-title-light" :style="{ color: resultData.type === 'fail' ? '#ff453a' : '#333' }">
        {{ resultData.title }}
      </h1>
      <div class="warning-text-light" id="settlementText" style="margin-bottom: 25px; text-align: left; line-height: 1.8;">
        {{ resultData.text }}
      </div>
      <button class="start-btn-light" @click="$emit('action')" :style="resultData.type === 'fail' ? 'background: #ff453a; box-shadow: 0 6px 16px rgba(255, 69, 58, 0.3);' : ''">
        {{ resultData.type === 'fail' ? '重新选择' : '我学会了 (重新开始)' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resultData: { type: Object, required: true }
});
defineEmits(['action']);
</script>