<template>
  <header>
    <div class="logo-title">
      <img src="@/assets/game_title.png" alt="真相放大镜" class="title-img" />
    </div>

    <div class="slogan-card">
      <p>在这个信息爆炸的数字时代，</p>
      <p>让我们用真相放大镜</p>
      <p><strong>看清网络世界的每一个角落。</strong></p>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: transparent;
  padding: 40px 20px 20px 20px;
  text-align: center;
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-title h1 {
  margin: 0;
  font-size: 36px;
  color: #00796b;
  font-weight: 900;
}

.logo-title span.icon {
  margin-right: 12px;
  font-size: 36px;
}

/* 💥 新增的标语卡片精美样式 */
.slogan-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 15px 25px;
  box-shadow: 0 8px 24px rgba(0, 121, 107, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  max-width: 400px;
}

.slogan-card p {
  margin: 6px 0;
  font-size: 15px;
  color: #00695c;
  line-height: 1.5;
}

.slogan-card strong {
  color: #ff8f00;
  font-size: 16px;
  font-weight: bold;
}
.title-img {
  height: auto; /* 可根据实际图片比例调整 */
  width: 90%;
  vertical-align: middle;
}
</style>
