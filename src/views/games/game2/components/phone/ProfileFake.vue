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
