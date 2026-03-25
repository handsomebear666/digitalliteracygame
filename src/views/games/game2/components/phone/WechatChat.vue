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
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import { GAME_STORY, ASSETS } from "@/views/games/game2/data/story";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
import iconDots from "@/views/games/game2/assets/img/icon_dots.svg";
import oaIcon from "@/views/games/game2/assets/img/oa_icon.png";
import iconVoice from "@/views/games/game2/assets/img/icon_voice.svg";
import iconEmoji from "@/views/games/game2/assets/img/icon_emoji.svg";
import iconPlus from "@/views/games/game2/assets/img/icon_plus.svg";

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
.wechat-header-title {
  flex: 1;
  text-align: center;
  font-weight: 500;
  font-size: 17px;
  color: #000;
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
.chat-container {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}
.time-divider {
  text-align: center;
  margin: 10px 0 20px 0;
}
.time-divider span {
  display: inline-block;
  font-size: 12px;
  color: #ffffff;
  background-color: #dadada;
  padding: 4px 8px;
  border-radius: 4px;
}
.message-item {
  display: flex;
  margin-bottom: 20px;
}
.message-item .avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  margin-right: 12px;
  background-color: #ccc;
  object-fit: cover;
}
.content-area {
  max-width: 72%;
}
.sender-name {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.text-bubble {
  background: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  word-break: break-all;
  color: #000;
  position: relative;
}
.text-bubble::before {
  content: "";
  position: absolute;
  top: 14px;
  left: -6px;
  border-width: 6px 6px 6px 0;
  border-style: solid;
  border-color: transparent white transparent transparent;
}
.fake-oa-card {
  background: #ffffff;
  padding: 0;
  border-radius: 8px;
  width: 240px;
  cursor: pointer;
  position: relative;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}
.fake-oa-card::before {
  content: "";
  position: absolute;
  top: 14px;
  left: -6px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 6px solid #ffffff;
}
.oa-card-body {
  display: flex;
  align-items: center;
  padding: 12px 14px;
}
.oa-card-logo {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
}
.oa-card-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.oa-card-name {
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.oa-card-footer {
  font-size: 12px;
  color: #999999;
  padding: 8px 14px;
  border-top: 1px solid #f2f2f2;
  font-weight: 400;
}
.wechat-bottom-bar {
  height: 56px;
  background: #f7f7f7;
  border-top: 1px solid #ececec;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0;
}
.bottom-icon {
  width: 28px;
  height: 28px;
  margin: 0 8px;
  cursor: pointer;
}
.wechat-input-box {
  flex: 1;
  height: 36px;
  background: #fff;
  border-radius: 4px;
  border: none;
  margin: 0 5px;
}
</style>
