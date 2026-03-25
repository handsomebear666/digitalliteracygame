<template>
  <div class="loading-overlay">
    <div class="spinner"></div>
    <div class="loading-text">正在拼命加载资源...</div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease;
}

.spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #07c160;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 15px;
  color: #888888;
  font-weight: bold;
  letter-spacing: 1px;
  animation: pulseText 1.5s infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulseText {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
