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
import { useGameStore } from "@game2/store/useGameStore";
import auntZhangImg from "@game2/assets/img/aunt_zhang.png";
import iconBack from "@game2/assets/img/icon_back.svg";
const store = useGameStore();
</script>
