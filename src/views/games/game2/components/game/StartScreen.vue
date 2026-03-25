<template>
  <div class="start-screen">
    <div class="title-container">
      <img
        :src="titleLogo"
        class="title-image"
        alt="游戏标题"
        onerror="this.src = ''"
      />
    </div>

    <div class="intro-card">
      <div class="intro-title">
        <span>剧情介绍</span>
      </div>
      <div class="intro-text">
        今天是周末，你正准备睡个懒觉，<br /><br />
        突然手机狂震，家族群里消息像连珠炮一样弹出来——<br /><br />
        家族成员的认知和钱包正在遭受“数字病毒”的全面入侵！<br /><br />
        你必须在他们受骗前，逐一击破这些陷阱。
      </div>
    </div>

    <button class="start-btn" @click="handleStart">我准备好了！</button>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import titleLogo from "@/views/games/game2/assets/img/title_logo.png";
const store = useGameStore();

const handleStart = () => {
  store.playClickAudio();
  store.startGame();
};
</script>

<style scoped>
.start-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f7ede2;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}
.title-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
  min-height: 120px;
}
.title-image {
  width: 80%;
  max-width: 300px;
  object-fit: contain;
}
.intro-card {
  background: #ffffff;
  width: 100%;
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 8px 24px rgba(90, 70, 52, 0.08);
  margin-bottom: 40px;
  position: relative;
}
.intro-title {
  text-align: center;
  margin-bottom: 25px;
}
.intro-title span {
  font-size: 18px;
  font-weight: bold;
  color: #ff9f43;
  position: relative;
  padding-bottom: 8px;
}
.intro-title span::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background-color: #ff9f43;
  border-radius: 2px;
}
.intro-text {
  font-size: 15px;
  color: #5a4634;
  line-height: 1.6;
  text-align: center;
}
.start-btn {
  background: linear-gradient(135deg, #ffca61 0%, #ff9f43 100%);
  color: #ffffff;
  width: 80%;
  height: 50px;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 6px 16px rgba(255, 159, 67, 0.4);
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}
.start-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 8px rgba(255, 159, 67, 0.3);
}
</style>
