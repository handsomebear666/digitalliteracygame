<template>
  <div class="wechat-page" style="background: #ffffff; z-index: 105">
    <div
      class="wechat-header"
      style="background: transparent; position: absolute; border: none"
    >
      <div
        class="wechat-header-left"
        @click="store.navigatePhone('fake-profile')"
      >
        <img :src="iconBack" class="header-icon icon-back" />
      </div>
    </div>
    <div class="moments-cover" style="background: #333"></div>
    <div class="moments-user">
      <span class="m-name">张大姐</span>
      <img :src="auntZhangImg" class="m-avatar" />
    </div>
    <div class="moments-body">
      <div class="moments-tip">朋友仅展示最近三天的朋友圈</div>

      <div
        class="moments-post flaw-row"
        :class="{ 'flaw-exposed': store.foundFlawsL3.includes('moments') }"
        @click="store.triggerL3Debunk('moments')"
      >
        <img :src="auntZhangImg" class="post-avatar" />
        <div class="post-content">
          <div class="p-name">张大姐</div>
          <div class="p-text">
            建馆 30 周年大回馈，点击链接免费领 50 元话费 + 纸巾！👉
            http://fake-welfare-phishing.com
          </div>
          <div class="p-time">昨天</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import auntZhangImg from "@/views/games/game2/assets/img/aunt_zhang.png";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
const store = useGameStore();
</script>

<style scoped>
.wechat-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ededed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.wechat-header {
  height: 50px;
  background: #ededed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}
.wechat-header-left {
  width: 40px;
  font-size: 22px;
  cursor: pointer;
  color: #333;
}
.wechat-header-right {
  width: 40px;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #333;
  cursor: pointer;
}
.header-icon {
  vertical-align: middle;
  cursor: pointer;
}
.icon-back {
  width: 23px;
  height: 20px;
}
/* 朋友圈样式 */
.moments-cover {
  height: 300px;
  width: 100%;
  background: linear-gradient(#4a4a4a, #2b2b2b);
}
.moments-user {
  position: absolute;
  top: 260px;
  right: 15px;
  display: flex;
  align-items: center;
}
.m-name {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.m-avatar {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 2px solid #fff;
}
.moments-body {
  padding: 50px 15px 20px;
}
.moments-tip {
  text-align: center;
  color: #ccc;
  font-size: 12px;
  margin-bottom: 30px;
  letter-spacing: 1px;
}
.moments-post {
  display: flex;
  margin-bottom: 20px;
}
.post-avatar {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  margin-right: 10px;
}
.post-content {
  flex: 1;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
.p-name {
  color: #576b95;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}
.p-text {
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 10px;
}
.p-time {
  font-size: 12px;
  color: #999;
}
.flaw-row {
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}
.flaw-exposed::after {
  content: "";
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2.5px solid #ff4d4f;
  border-radius: 8px;
  pointer-events: none;
  z-index: 100;
  animation: pop-flaw 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}
@keyframes pop-flaw {
  0% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
