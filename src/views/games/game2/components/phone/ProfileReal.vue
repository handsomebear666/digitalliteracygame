<template>
  <div class="wechat-page" style="background: #ededed; z-index: 105">
    <div class="wechat-header" style="background: #ffffff; border-bottom: none">
      <div class="wechat-header-left" @click="store.navigatePhone('search')">
        <img
          :src="iconBack"
          class="header-icon icon-back"
          style="filter: brightness(0)"
        />
      </div>
    </div>
    <div class="profile-top-card">
      <img :src="auntZhangImg" class="profile-avatar" />
      <div class="profile-info">
        <div class="profile-name">
          张大姐 <span style="font-size: 12px; color: #576b95">(朋友)</span>
        </div>
        <div class="profile-sub">微信号：zhang_dj888</div>
        <div class="profile-sub">地区：山东</div>
      </div>
    </div>
    <div class="profile-row-card">
      <span class="row-label">朋友圈</span><span class="row-arrow">></span>
    </div>
    <div class="profile-btn-card">
      <div class="profile-btn-blue">发消息</div>
      <div class="profile-btn-white">音视频通话</div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
import auntZhangImg from "@/views/games/game2/assets/img/aunt_zhang.png";
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
.header-icon {
  vertical-align: middle;
  cursor: pointer;
}
.icon-back {
  width: 23px;
  height: 20px;
}
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
.profile-btn-blue {
  background: #576b95;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
}
.profile-btn-white {
  background: #f2f2f2;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: bold;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
