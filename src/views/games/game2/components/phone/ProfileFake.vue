<template>
  <div class="wechat-page" style="background: #ededed; z-index: 100">
    <div class="wechat-header" style="background: #ffffff; border-bottom: none">
      <div class="wechat-header-left" @click="store.navigatePhone('chat')">
        <img
          :src="iconBack"
          class="header-icon icon-back"
          style="filter: brightness(0)"
        />
      </div>
      <div class="wechat-header-right" @click="openFakeMoreMenu">
        <img
          :src="iconDots"
          class="header-icon icon-dots"
          style="filter: brightness(0)"
        />
      </div>
    </div>

    <div
      class="profile-top-card flaw-row"
      :class="{ 'flaw-exposed': store.foundFlawsL3.includes('info') }"
      @click="store.triggerL3Debunk('info')"
    >
      <img :src="auntZhangImg" class="profile-avatar" />
      <div class="profile-info">
        <div class="profile-name">张大姐</div>
        <div class="profile-sub">微信号：wxid_987654321</div>
        <div class="profile-sub">地区：安道尔</div>
      </div>
    </div>

    <div
      class="profile-row-card flaw-row"
      @click="store.navigatePhone('fake-moments')"
    >
      <span class="row-label">朋友圈</span>
      <span class="row-content" style="color: #999; font-size: 13px"
        >[广告] 惊天福利...</span
      >
      <span class="row-arrow">></span>
    </div>

    <div class="profile-row-card">
      <span class="row-label">更多信息</span><span class="row-arrow">></span>
    </div>

    <div
      class="profile-btn-card flaw-row"
      :class="{ 'flaw-exposed': store.foundFlawsL3.includes('add') }"
      @click="store.triggerL3Debunk('add')"
    >
      <div class="profile-btn-green">添加到通讯录</div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import auntZhangImg from "@/views/games/game2/assets/img/aunt_zhang.png";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
import iconDots from "@/views/games/game2/assets/img/icon_dots.svg";

const store = useGameStore();

const openFakeMoreMenu = () => {
  if (store.gameLevel === 4) {
    store.showActionSheet = true;
  }
};
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
.icon-dots {
  width: 35px;
  height: 28px;
}
/* 个人资料页样式 */
.profile-top-card {
  background: #fff;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
  background: #ccc;
}
.profile-info {
  flex: 1;
}
.profile-name {
  font-size: 20px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 4px;
}
.profile-sub {
  font-size: 14px;
  color: #888;
  margin-bottom: 2px;
}
.profile-row-card {
  background: #fff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.row-label {
  font-size: 16px;
  color: #1a1a1a;
  width: 80px;
}
.row-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row-arrow {
  color: #ccc;
  font-family: consolas;
  font-size: 18px;
  font-weight: bold;
}
.profile-btn-card {
  background: #fff;
  padding: 20px;
  margin-top: 8px;
  text-align: center;
}
.profile-btn-green {
  background: #07c160;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
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
