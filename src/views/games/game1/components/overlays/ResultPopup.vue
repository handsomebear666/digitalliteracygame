<template>
  <div class="result-popup-overlay">
    <div class="result-popup-card">
      <div class="popup-inner">
        <template v-if="resultData.type === 'fail'">
          <div class="fail-header">
            <div class="fail-icon">⚠️</div>
            <h2>{{ resultData.title }}</h2>
          </div>
          <div class="popup-divider-fail"></div>

          <div class="fail-text">
            {{ resultData.text }}
          </div>

          <div class="controls-group">
            <button
              class="ctrl-btn retry-fail-btn"
              @click="$emit('action', 'replay')"
            >
              🔄 重新选择
            </button>
            <button
              class="ctrl-btn home-fail-btn"
              @click="$emit('action', 'home')"
            >
              ⬅ 返回主页地图
            </button>
          </div>
        </template>

        <template v-else>
          <div class="success-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
              />
            </svg>
            <h2>🎉成功通关！🎉</h2>
          </div>
          <div class="popup-divider"></div>

          <div class="controls-group">
            <button class="ctrl-btn card-btn" @click="$emit('action', 'cards')">
              🎴 查看知识卡片
            </button>
            <button class="ctrl-btn retry-btn" @click="$emit('action', 'home')">
              ⬅ 返回主页地图
            </button>
          </div>
        </template>
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
.result-popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.result-popup-card {
  width: 85%;
  max-width: 320px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f4f3 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 35px 20px 30px;
}

.success-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.success-header h2 {
  margin: 0 0 10px 0;
  color: #00796b;
  font-size: 24px;
  font-weight: bold;
}
.success-header svg {
  fill: #4caf50;
  margin-bottom: 10px;
}
.popup-divider {
  width: 40px;
  height: 4px;
  background: #4db6ac;
  border-radius: 2px;
  margin-bottom: 30px;
}

.fail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.fail-icon {
  font-size: 45px;
  margin-bottom: 10px;
  animation: pulseIcon 1.5s infinite;
}
.fail-header h2 {
  margin: 0;
  color: #ff453a;
  font-size: 22px;
  font-weight: bold;
}
.popup-divider-fail {
  width: 40px;
  height: 4px;
  background: #ff453a;
  border-radius: 2px;
  margin-bottom: 20px;
}
.fail-text {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  text-align: justify;
  margin-bottom: 25px;
  max-height: 35vh;
  overflow-y: auto;
  padding: 0 5px;
}

@keyframes pulseIcon {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.controls-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}
.ctrl-btn {
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.card-btn {
  background-color: #ffb300;
  box-shadow: 0 4px 10px rgba(255, 179, 0, 0.3);
}
.card-btn:hover {
  background-color: #ff8f00;
  transform: translateY(-2px);
}
.retry-btn {
  background-color: #4caf50;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}
.retry-btn:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
}

.retry-fail-btn {
  background-color: #ff453a;
  box-shadow: 0 4px 10px rgba(255, 69, 58, 0.3);
}
.retry-fail-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}
.home-fail-btn {
  background-color: #8e8e93;
  box-shadow: 0 4px 10px rgba(142, 142, 147, 0.3);
}
.home-fail-btn:hover {
  background-color: #636366;
  transform: translateY(-2px);
}
</style>
