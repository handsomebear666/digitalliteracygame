<template>
  <div class="wechat-page">
    <div class="wechat-header">
      <div class="wechat-header-left" @click="store.navigatePhone('search')">
        <img :src="iconBack" class="header-icon icon-back" />
      </div>
      <div class="wechat-header-right">
        <i class="fas fa-ellipsis-h header-icon icon-menu"></i>
      </div>
    </div>

    <div
      class="profile-top-card flaw-row"
      :class="{
        'flaw-exposed': store.foundFlawsL3.includes('auntZhangProfile'),
      }"
      @click="store.triggerL3Debunk('auntZhangProfile')"
    >
      <img :src="auntZhangImg" class="profile-avatar" />
      <div class="profile-info">
        <div class="profile-name">
          张大姐
          <i class="fas fa-female gender-icon-pink"></i>
        </div>
        <div class="profile-sub">昵称：张大姐</div>
        <div class="profile-sub">微信号：zhang_dj888</div>
        <div class="profile-sub">地区：山东</div>
      </div>
    </div>

    <div class="profile-memo-card" @click="store.navigatePhone('memo_details')">
      <div class="memo-title-row">
        <span class="row-label">朋友资料</span>
        <span class="row-arrow">></span>
      </div>
      <div class="memo-desc-row">
        添加朋友的备注名、电话、标签、备忘、照片等，并设置朋友权限。
      </div>
    </div>

    <div
      class="profile-row-card moment-card"
      @click="store.navigatePhone('moment')"
    >
      <span class="row-label">朋友圈</span>
      <span class="row-arrow">></span>
    </div>

    <div class="action-card">
      <div class="action-btn border-bottom">
        <img
          src="@/views/games/game2/assets/img/icon_message.png"
          class="action-icon"
          alt=""
        />
        发消息
      </div>
      <div class="action-btn">
        <img
          src="@/views/games/game2/assets/img/icon_video_call.png"
          class="action-icon"
          alt=""
        />
        音视频通话
      </div>
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
  background: #ededed; /* 微信联系人页面更偏向这种浅灰 */
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部样式调整 */
.wechat-header {
  height: 50px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: none;
  flex-shrink: 0;
}
.wechat-header-left,
.wechat-header-right {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.wechat-header-left {
  justify-content: flex-start;
}
.header-icon {
  font-size: 20px;
  color: #191919;
}
.icon-back {
  width: 23px;
  height: 20px;
}
.icon-menu {
  color: #191919;
}

/* 顶部卡片样式 */
.profile-top-card {
  background: #ffffff;
  padding: 15px 20px 25px 20px;
  display: flex;
  align-items: flex-start; /* 头像与文字顶部对齐 */
  margin-bottom: 8px;
  position: relative;
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 6px; /* 微信头像是微圆角矩形 */
  margin-right: 15px;
  object-fit: cover;
  background: #e5e5e5;
}
.profile-info {
  flex: 1;
}
.profile-name {
  font-size: 22px; /* 名字字号加大 */
  font-weight: 500;
  color: #191919;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}
.gender-icon-pink {
  font-size: 14px;
  color: #ff4d4f;
  margin-left: 8px;
}
.profile-sub {
  font-size: 15px;
  color: #888888; /* 调整为更柔和的灰色 */
  margin-bottom: 4px;
}

/* 朋友资料卡片样式 */
.profile-memo-card {
  background: #ffffff;
  padding: 16px 20px;
  margin-bottom: 8px;
  cursor: pointer;
}
.memo-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.memo-desc-row {
  font-size: 13px;
  color: #b2b2b2;
  margin-top: 8px;
  line-height: 1.4;
  padding-right: 20px; /* 右侧留白防止文字贴紧边缘 */
}

/* 朋友圈卡片样式 (单行带箭头) */
.profile-row-card {
  background: #ffffff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.row-label {
  font-size: 16px;
  color: #191919;
}
.row-arrow {
  color: #b3b3b3;
  font-size: 18px;
}

/* --- 底部操作按钮样式重构 --- */
.action-card {
  background: #ffffff;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
}
.action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px; /* 设定固定高度，增加点击区域 */
  font-size: 17px;
  font-weight: 500;
  color: #576b95; /* 微信专用蓝 */
  cursor: pointer;
  background: #ffffff;
}
/* 点击反馈效果 */
.action-btn:active {
  background: #ececec;
}
.border-bottom {
  border-bottom: 0.5px solid #e5e5e5;
}
.action-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px; /* 图标与文字之间的间距 */
  object-fit: contain;
}

/* 破绽动画逻辑 */
.flaw-row {
  cursor: pointer;
}
.flaw-exposed::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border: 2.5px solid #ff4d4f;
  border-radius: 8px;
  pointer-events: none;
  z-index: 100;
  animation: pop-flaw 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}
@keyframes pop-flaw {
  0% {
    transform: scale(1.05);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
