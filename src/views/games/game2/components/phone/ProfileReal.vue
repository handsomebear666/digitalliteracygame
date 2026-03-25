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
