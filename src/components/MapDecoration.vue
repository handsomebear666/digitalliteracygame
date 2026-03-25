<template>
  <div class="map-decoration">
    <div class="roadmap-path"></div>

    <div class="bubble-group">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
    </div>
  </div>
</template>

<style scoped>
.map-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.roadmap-path {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% - 100px);
  border-left: 4px dashed #81d4fa;
}

/* 💥 关键修改：fixed 让气泡固定在手机屏幕，无视网页长度 */
.bubble-group {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0; /* 垫在最下面 */
  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 20% 20%,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(77, 182, 172, 0.1) 100%
  );
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.2);
  /* 💥 统一从屏幕最下方开始漂浮 */
  bottom: -150px;
}

@keyframes floatBubble {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-60vh) translateX(20px);
  }
  100% {
    transform: translateY(-120vh) translateX(-10px);
  }
}

/* 💥 调整气泡动画：速度变慢（20s+），出场延迟拉大（相隔 7s 以上） */
.bubble-1 {
  width: 120px;
  height: 120px;
  left: 15%;
  animation: floatBubble 25s infinite linear 0s;
}
.bubble-2 {
  width: 80px;
  height: 80px;
  right: 20%;
  animation: floatBubble 28s infinite linear 8s;
  opacity: 0.5;
}
.bubble-3 {
  width: 100px;
  height: 100px;
  left: 45%;
  animation: floatBubble 22s infinite linear 16s;
}
.bubble-4 {
  width: 90px;
  height: 90px;
  right: 35%;
  animation: floatBubble 30s infinite linear 24s;
  opacity: 0.7;
}
</style>
