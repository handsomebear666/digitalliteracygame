<template>
  <div class="wechat-page" style="background: #ffffff; z-index: 105">
    <div
      class="wechat-header"
      style="
        background: transparent;
        position: absolute;
        border: none;
        z-index: 106;
      "
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
      <div
        class="post-group flaw-row"
        :class="{ 'flaw-exposed': store.foundFlawsL3.includes('moments') }"
        @click="store.triggerL3Debunk('moments')"
      >
        <div class="post-date">
          <span class="day">7</span>
          <span class="month">23日</span>
        </div>

        <div class="post-card">
          <div class="post-text-content">
            <div class="post-title">
              建馆 30 周年大回馈，点击链接免费领 50 元话费 + 纸巾！👉
              <span class="highlight-link"
                >http://fake-welfare-phishing.com</span
              >
            </div>
            <div class="p-time">昨天</div>

            <div class="comment-placeholder"></div>
          </div>
        </div>
      </div>

      <h2 class="year">2022年</h2>

      <div class="post-group">
        <div class="post-date">
          <span class="day">8</span>
          <span class="month">15日</span>
        </div>

        <div class="post-card">
          <div class="post-text-content">
            <div class="post-title">
              夏日狂欢节，好礼送不停！点击参与活动 >>>
              <span class="highlight-link">公众号：每日福利君</span>
            </div>
            <div class="p-time">前天</div>
            <div class="comment-placeholder"></div>
          </div>
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
.header-icon {
  vertical-align: middle;
  cursor: pointer;
}
.icon-back {
  width: 15px;
  height: 20px;
  filter: brightness(0) invert(1); /* 变白 */
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
  object-fit: cover;
  border: none; /* 移除白边 */
}
.moments-body {
  padding: 0; /* 移除内边距，使帖子顶格 */
}
.year {
  padding: 20px 15px 10px;
  font-size: 20px;
  color: #1a1a1a;
  font-weight: bold;
  letter-spacing: 1px;
}
.post-group {
  display: flex;
  padding: 20px 15px;
}
.post-date {
  width: 60px;
  text-align: right;
  margin-right: 15px;
  padding-top: 5px;
}
.post-date .day {
  font-size: 24px;
  color: #1a1a1a;
  font-weight: bold;
}
.post-date .month {
  font-size: 14px;
  color: #1a1a1a;
}
.post-card {
  flex: 1;
  background: #f7f7f7;
  border-radius: 4px;
  display: flex;
  padding: 10px;
  align-items: center;
}
.post-text-content {
  flex: 1;
}
.post-title {
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 5px;
}
.highlight-link {
  color: #576b95; /* 微信蓝链接颜色 */
  word-break: break-all;
}
.p-time {
  font-size: 13px;
  color: #999;
  margin-top: 5px;
}
.comment-placeholder {
  height: 10px; /* 创建评论区占位符高度 */
}

/* 破绽动画逻辑保持不变 */
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
