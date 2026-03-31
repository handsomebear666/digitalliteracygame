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
          <span class="profile-tag">(朋友)</span>
        </div>
        <div class="profile-sub">昵称：张大姐</div>
        <div class="profile-sub">微信号：zhang_dj888</div>
        <div class="profile-sub">地区：山东</div>
      </div>
    </div>

    <div
      class="profile-memo-card profile-row-card"
      @click="store.navigatePhone('memo_details')"
    >
      <span class="row-label">朋友资料</span>
      <div class="row-value-with-arrow">
        <span class="memo-key">备注</span>
        <span class="memo-value">张大姐</span>
        <span class="row-arrow">></span>
      </div>
    </div>

    <div
      class="profile-row-card moment-card"
      @click="store.navigatePhone('moment')"
    >
      <span class="row-label">朋友圈</span><span class="row-arrow">></span>
    </div>

    <div class="profile-btn-card">
      <div class="profile-btn btn-message">
        <i class="far fa-comment-dots btn-icon"></i>发消息
      </div>
      <div class="profile-btn btn-call">
        <i class="fas fa-video btn-icon"></i>音视频通话
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
// 建议：如果你有新的张大姐清晰头像，请替换此导入
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
  background: #f7f7f7; /* 微信联系人页面背景色 */
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部样式调整 */
.wechat-header {
  height: 50px;
  background: #ffffff; /* 微信联系人头部背景色 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: none; /* 移除底部边框 */
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

/* 顶部卡片样式调整 */
.profile-top-card {
  background: #ffffff;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  position: relative; /* 为破绽动画做准备 */
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 4px; /* 微信头像是微圆角矩形 */
  margin-right: 15px;
  object-fit: cover;
  background: #e5e5e5; /* 占位符颜色 */
}
.profile-info {
  flex: 1;
}
.profile-name {
  font-size: 20px;
  font-weight: bold;
  color: #191919;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}
.gender-icon-pink {
  font-size: 14px;
  color: #ff4d4f; /* 女性性别图标颜色 */
  margin-left: 6px;
}
.profile-tag {
  font-size: 12px;
  color: #576b95; /* (朋友) 标签颜色 */
  margin-left: 6px;
}
.profile-sub {
  font-size: 14px;
  color: #8c8c8c; /* 副文字颜色 */
  margin-bottom: 3px;
}

/* 朋友资料和朋友圈卡片样式调整 */
.profile-row-card {
  background: #ffffff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}
.row-label {
  font-size: 16px;
  color: #191919;
  width: 80px;
}
.row-value-with-arrow {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.memo-key {
  font-size: 14px;
  color: #8c8c8c;
  margin-right: 15px;
}
.memo-value {
  font-size: 16px;
  color: #191919;
}
.row-arrow {
  color: #b3b3b3; /* 箭头颜色 */
  font-size: 18px;
  margin-left: 10px;
}
/* 朋友圈卡片 */
.moment-card {
  border-bottom: none; /* 朋友圈底部不加边框 */
  margin-bottom: 8px; /* 朋友圈下方加间距 */
}

/* 底部按钮卡片样式重新设计 */
.profile-btn-card {
  background: #ffffff;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px; /* 按钮之间的间距 */
}
.profile-btn {
  background: #ffffff; /* 按钮背景色 */
  color: #191919;
  font-size: 16px;
  font-weight: bold;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #e5e5e5; /* 按钮边框颜色 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-message {
  border-bottom: 1px solid #e5e5e5; /* 发消息底部加边框 */
}
.btn-icon {
  font-size: 18px;
  color: #576b95; /* 图标颜色 */
  margin-right: 10px;
}

/* 破绽动画逻辑重新应用到顶部卡片 */
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
