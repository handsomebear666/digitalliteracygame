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
