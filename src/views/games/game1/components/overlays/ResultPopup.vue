<template>
  <div class="system-overlay glass-popup" style="z-index: 100000">
    <div class="glass-box">
      <div
        v-if="resultData.type === 'fail'"
        style="
          font-size: 40px;
          margin-bottom: 10px;
          animation: pulseIcon 1.5s infinite;
        "
      >
        ⚠️
      </div>
      <h1
        class="game-title-light"
        :style="{ color: resultData.type === 'fail' ? '#ff453a' : '#333' }"
      >
        {{ resultData.title }}
      </h1>
      <div
        class="warning-text-light"
        id="settlementText"
        style="margin-bottom: 25px; text-align: left; line-height: 1.8"
      >
        {{ resultData.text }}
      </div>
      <div class="button-group">
        <button
          class="start-btn-light"
          @click="$emit('action', 'replay')"
          :style="
            resultData.type === 'fail'
              ? 'background: #ff453a; box-shadow: 0 6px 16px rgba(255, 69, 58, 0.3);'
              : ''
          "
        >
          {{ resultData.type === "fail" ? "重新选择" : "再玩一次" }}
        </button>
        <button
          class="start-btn-light home-btn"
          @click="$emit('action', 'home')"
        >
          返回主页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resultData: { type: Object, required: true },
});
defineEmits(["action"]);
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  width: 100%;
}
.start-btn-light {
  flex: 1;
  max-width: 180px;
  background: #07c160;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.start-btn-light:active {
  transform: scale(0.96);
}
.home-btn {
  background: #4a90e2;
}
</style>
