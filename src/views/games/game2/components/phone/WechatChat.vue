<template>
  <div class="wechat-page">
    <div class="wechat-header">
      <div class="wechat-header-left" @click="store.returnToDialogue()">
        <img :src="iconBack" class="header-icon icon-back" />
      </div>
      <div class="wechat-header-title">幸福家园业主群 (492)</div>
      <div class="wechat-header-right" @click="openGroupSearch">
        <img :src="iconDots" class="header-icon icon-dots" />
      </div>
    </div>

    <div class="chat-container">
      <div class="time-divider"><span>半小时前</span></div>

      <div
        v-for="(msg, idx) in GAME_STORY.ownerGroupMessages"
        :key="idx"
        class="message-item"
      >
        <img
          :src="ASSETS.AVATARS[msg.avatar]"
          class="avatar"
          @click="handleAvatarClick"
        />
        <div class="content-area">
          <div class="sender-name">{{ msg.sender }}</div>

          <div
            v-if="msg.type === 'oa_card'"
            class="fake-oa-card"
            @click="openOAProfile"
          >
            <div class="oa-card-body">
              <div class="oa-card-logo">
                <img :src="oaIcon" />
              </div>
              <div class="oa-card-name">{{ msg.oaName }}</div>
            </div>
            <div class="oa-card-footer">{{ msg.oaDesc }}</div>
          </div>

          <div v-else class="text-bubble">{{ msg.content }}</div>
        </div>
      </div>
    </div>

    <div class="wechat-bottom-bar">
      <img :src="iconVoice" class="bottom-icon" />
      <div class="wechat-input-box"></div>
      <img :src="iconEmoji" class="bottom-icon" />
      <img :src="iconPlus" class="bottom-icon" />
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@game2/store/useGameStore";
import { GAME_STORY, ASSETS } from "@game2/data/story";
import iconBack from "@game2/assets/img/icon_back.svg";
import iconDots from "@game2/assets/img/icon_dots.svg";
import oaIcon from "@game2/assets/img/oa_icon.png";
import iconVoice from "@game2/assets/img/icon_voice.svg";
import iconEmoji from "@game2/assets/img/icon_emoji.svg";
import iconPlus from "@game2/assets/img/icon_plus.svg";

const store = useGameStore();

const handleAvatarClick = () => {
  if (store.gameLevel >= 3) {
    store.navigatePhone("fake-profile");
  } else {
    store.showToast("现在还不需要查看她的资料哦~");
  }
};

const openOAProfile = () => store.navigatePhone("oa-profile");
const openGroupSearch = () => {
  if (store.gameLevel >= 3) {
    store.navigatePhone("search");
    store.showToast("搜索‘张大姐’，看看群里有几个张大姐？");
  }
};
</script>
