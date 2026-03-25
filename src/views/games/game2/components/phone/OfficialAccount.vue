<template>
  <div class="wechat-page" style="background: #f7f7f7">
    <div
      v-if="store.activePhonePage === 'oa-profile'"
      style="height: 100%; display: flex; flex-direction: column"
    >
      <div
        class="wechat-header"
        style="background: #ffffff; border-bottom: none"
      >
        <div class="wechat-header-left" @click="store.navigatePhone('chat')">
          <img
            :src="iconBack"
            class="header-icon icon-back"
            style="filter: brightness(0)"
          />
        </div>
        <div class="wechat-header-right">
          <img
            :src="iconDots"
            class="header-icon icon-dots"
            style="filter: brightness(0)"
          />
        </div>
      </div>

      <div class="oa-profile-content">
        <div class="oa-top-section">
          <div class="oa-basic-info">
            <img :src="oaIcon" class="oa-round-logo" />
            <div
              class="oa-titles flaw-row"
              :class="{ 'flaw-exposed': store.foundFlawsL1.includes('typo') }"
              @click="store.triggerL1Debunk('typo')"
            >
              <div class="oa-name">XX市图书管活动中心</div>
              <div class="oa-sub">山东</div>
            </div>
          </div>

          <div class="oa-share-row" @click="store.navigatePhone('oa-about')">
            <span>您好，XX市图书馆欢迎您的关注~</span
            ><span class="oa-arrow">></span>
          </div>

          <div class="oa-actions">
            <button class="oa-btn">已关注公众号</button>
            <button class="oa-btn">私信</button>
          </div>

          <div class="oa-tabs">
            <span class="active">全部</span>
            <span>贴图</span>
            <span>视频</span>
            <span>服务</span>
          </div>
        </div>

        <div class="oa-posts-container">
          <div
            class="oa-post-card flaw-row"
            :class="{ 'flaw-exposed': store.foundFlawsL1.includes('history') }"
            @click="store.triggerL1Debunk('history')"
          >
            <div class="post-date">今天</div>
            <div class="post-content-row">
              <div class="post-text-col">
                <div class="post-title">
                  【官方认证】建馆 30 周年，50 元话费与好礼限时领！
                </div>
                <div class="post-meta">阅读 269 &nbsp; 赞 11</div>
              </div>
              <div class="post-img-col">
                <img :src="postCover" onerror="this.src = ''" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="store.activePhonePage === 'oa-about'"
      style="height: 100%; display: flex; flex-direction: column"
    >
      <div class="wechat-header" style="background: #ffffff">
        <div
          class="wechat-header-left"
          @click="store.navigatePhone('oa-profile')"
        >
          <img
            :src="iconClose"
            class="header-icon icon-close"
            style="filter: brightness(0)"
          />
        </div>
        <div class="wechat-header-title"></div>
        <div class="wechat-header-right"></div>
      </div>
      <div class="oa-about-content">
        <div class="about-section">
          <div class="about-title">公众号简介</div>
          <div class="about-text">您好，XX市图书馆欢迎您的关注~</div>
        </div>
        <div class="about-section">
          <div class="about-title">基础信息</div>
          <div class="about-row">
            <span>微信号</span><span class="val">tsg_hd_888</span>
          </div>
          <div
            class="about-row flaw-row"
            :class="{ 'flaw-exposed': store.foundFlawsL1.includes('subject') }"
            @click="store.triggerL1Debunk('subject')"
          >
            <span>主体类型</span
            ><span class="val" style="color: #333; font-weight: bold"
              >个人</span
            >
          </div>
          <div class="about-row">
            <span>IP 属地</span
            ><span class="val" style="color: #999">山东</span>
          </div>
        </div>
        <div class="about-section">
          <div class="about-title">名称记录</div>
          <div
            class="about-text"
            style="color: #666; font-size: 14px; margin-top: 10px"
          >
            2026 年 03 月 01 日“爱分享的小张”改名“XX市市图书管活动中心”
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import oaIcon from "@/views/games/game2/assets/img/oa_icon.png";
import postCover from "@/views/games/game2/assets/img/post_cover.png";
import iconClose from "@/views/games/game2/assets/img/icon_close.svg";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
import iconDots from "@/views/games/game2/assets/img/icon_dots.svg";
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
.icon-dots {
  width: 35px;
  height: 28px;
}
.icon-close {
  width: 28px;
  height: 28px;
}
/* 公众号主页样式 */
.oa-profile-content {
  overflow-y: auto;
  height: calc(100% - 50px);
  background: #f7f7f7;
}
.oa-top-section {
  background: #ffffff;
  padding: 15px 20px 0;
}
.oa-basic-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.oa-round-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  background: #eee;
  object-fit: cover;
}
.oa-titles {
  flex: 1;
  cursor: pointer;
}
.oa-name {
  font-size: 19px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}
.oa-sub {
  font-size: 14px;
  color: #999;
}
.oa-share-row {
  font-size: 13px;
  color: #555;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: fit-content;
}
.oa-arrow {
  margin-left: 8px;
  color: #ccc;
  font-family: consolas;
  font-size: 22px;
  font-weight: bold;
  line-height: 1;
}
.oa-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}
.oa-btn {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  background: #f2f2f2;
  color: #1a1a1a;
  cursor: pointer;
}
.oa-tabs {
  display: flex;
  gap: 24px;
  padding-bottom: 12px;
  align-items: flex-end;
}
.oa-tabs span {
  font-size: 14px;
  color: #999;
  position: relative;
  padding-bottom: 6px;
}
.oa-tabs span.active {
  color: #1a1a1a;
  font-weight: bold;
  font-size: 15px;
}
.oa-tabs span.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  background: #07c160;
  border-radius: 2px;
}
.oa-posts-container {
  padding: 12px 16px;
}
.oa-post-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
.post-date {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}
.post-content-row {
  display: flex;
  justify-content: space-between;
}
.post-text-col {
  flex: 1;
  padding-right: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.post-title {
  font-size: 16px;
  color: #1a1a1a;
  font-weight: normal;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-meta {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
.post-img-col {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.post-img-col img {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
  display: block;
}
/* 关于公众号页面 */
.oa-about-content {
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 50px);
}
.about-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
}
.about-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}
.about-text {
  font-size: 15px;
  color: #333;
}
.about-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-bottom: 15px;
}
.about-row:last-child {
  margin-bottom: 0;
}
.about-row span {
  color: #666;
}
.about-row .val {
  color: #333;
  text-align: right;
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
