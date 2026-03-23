<template>
  <div class="game-container" :class="{ 'shake-screen': store.isShaking }">
    <transition name="fade">
      <StartScreen v-if="!store.hasStarted" />
    </transition>

    <div
      v-show="store.hasStarted"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
    >
      <Character
        v-show="!store.showPhoneSystem"
        :background="currentBackground"
        :character="currentCharacter"
      />
      <PhoneIcon v-if="!store.showPhoneSystem" />
      <DialogueUI v-show="!store.showPhoneSystem" />
    </div>

    <HintButton v-show="store.showHintBtn" />
    <Toast />
    <SmsPopup v-if="store.showSmsPopup" />

    <transition name="fade">
      <div
        v-if="store.showPhoneSystem"
        class="wechat-system-wrapper"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 50;
        "
      >
        <WechatChat v-show="store.activePhonePage === 'chat'" />
        <OfficialAccount v-show="store.activePhonePage.startsWith('oa-')" />
        <PhishingForm v-show="store.activePhonePage === 'welfare'" />
        <ProfileFake v-show="store.activePhonePage === 'fake-profile'" />
        <ProfileReal v-show="store.activePhonePage === 'real-profile'" />
        <FakeMoments v-show="store.activePhonePage === 'fake-moments'" />
        <GroupSearch v-show="store.activePhonePage === 'search'" />
      </div>
    </transition>

    <ActionMenu v-if="store.showActionSheet" />
    <div v-if="store.showEndScreen" class="end-screen">
      <div class="end-card">
        <h1>🏆 防骗大师</h1>
        <p>
          你用一套行云流水的反诈军体拳，粉碎了危机！<br />你的数字素养已击败全国
          99% 的玩家！
        </p>
        <button @click="reloadGame">再玩一次</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useGameStore } from "@game2/store/useGameStore";
import { GAME_STORY, ASSETS } from "@game2/data/story";

import Character from "@game2/components/game/Character.vue";
import PhoneIcon from "@game2/components/game/PhoneIcon.vue";
import DialogueUI from "@game2/components/game/DialogueUI.vue";
import HintButton from "@game2/components/common/HintButton.vue";
import Toast from "@game2/components/common/Toast.vue";
import SmsPopup from "@game2/components/common/SmsPopup.vue";
import WechatChat from "@game2/components/phone/WechatChat.vue";
import OfficialAccount from "@game2/components/phone/OfficialAccount.vue";
import PhishingForm from "@game2/components/phone/PhishingForm.vue";
import ProfileFake from "@game2/components/phone/ProfileFake.vue";
import ProfileReal from "@game2/components/phone/ProfileReal.vue";
import FakeMoments from "@game2/components/phone/FakeMoments.vue";
import GroupSearch from "@game2/components/phone/GroupSearch.vue";
import ActionMenu from "@game2/components/phone/ActionMenu.vue";
import StartScreen from "@game2/components/game/StartScreen.vue";

const store = useGameStore();
const reloadGame = () => location.reload();

const currentLine = computed(() =>
  GAME_STORY.scriptLines.find((l) => l.id === store.currentLineId),
);

const currentCharacter = computed(() => {
  const line = currentLine.value;
  return line?.emotion ? ASSETS.AVATARS[`mom_${line.emotion}`] : "";
});

const currentBackground = computed(() => {
  const line = currentLine.value;
  return line?.background
    ? ASSETS.BACKGROUNDS[line.background]
    : ASSETS.BACKGROUNDS?.default || "";
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.end-screen {
  position: absolute;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.end-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  border: 4px solid #07c160;
  margin: 20px;
}
.end-card h1 {
  color: #07c160;
  margin-bottom: 15px;
}
.end-card button {
  background: #07c160;
  color: #fff;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
</style>
