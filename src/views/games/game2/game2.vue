<template>
  <div class="game2-fullscreen-wrapper">
    <div class="game-container" :class="{ 'shake-screen': store.isShaking }">
      <!-- 左侧/上部：角色与背景层 -->
      <div class="character-col">
        <Character
          v-show="!store.showPhoneSystem"
          :background="currentBackground"
          :character="currentCharacter"
        />
        <PhoneIcon v-if="!store.showPhoneSystem" />
      </div>

      <!-- 右侧/下部：对话框区域 -->
      <div class="dialogue-col">
        <DialogueUI v-show="!store.showPhoneSystem" />
      </div>

      <!-- 辅助 UI -->
      <HintButton v-show="store.showHintBtn" />
      <Toast />
      <SmsPopup v-if="store.showSmsPopup" />

      <!-- 微信模拟器（覆盖层） -->
      <transition name="fade">
        <div v-if="store.showPhoneSystem" class="wechat-system-wrapper">
          <WechatChat v-show="store.activePhonePage === 'chat'" />
          <OfficialAccount v-show="store.activePhonePage.startsWith('oa-')" />
          <PhishingForm v-show="store.activePhonePage === 'welfare'" />
          <ProfileFake v-show="store.activePhonePage === 'fake-profile'" />
          <ProfileReal v-show="store.activePhonePage === 'real-profile'" />
          <FakeMoments v-show="store.activePhonePage === 'fake-moments'" />
          <GroupSearch v-show="store.activePhonePage === 'search'" />
        </div>
      </transition>

      <!-- 底部操作菜单 -->
      <ActionMenu v-if="store.showActionSheet" />

      <!-- 结果弹窗 -->
      <ResultPopup
        v-if="showResultPopup"
        :resultData="resultData"
        @action="handleResultAction"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import { GAME_STORY, ASSETS } from "@/views/games/game2/data/story";
import ResultPopup from "@/views/games/game2/components/overlays/ResultPopup.vue";

// 组件导入
import Character from "@/views/games/game2/components/game/Character.vue";
import PhoneIcon from "@/views/games/game2/components/game/PhoneIcon.vue";
import DialogueUI from "@/views/games/game2/components/game/DialogueUI.vue";
import HintButton from "@/views/games/game2/components/common/HintButton.vue";
import Toast from "@/views/games/game2/components/common/Toast.vue";
import SmsPopup from "@/views/games/game2/components/common/SmsPopup.vue";
import WechatChat from "@/views/games/game2/components/phone/WechatChat.vue";
import OfficialAccount from "@/views/games/game2/components/phone/OfficialAccount.vue";
import PhishingForm from "@/views/games/game2/components/phone/PhishingForm.vue";
import ProfileFake from "@/views/games/game2/components/phone/ProfileFake.vue";
import ProfileReal from "@/views/games/game2/components/phone/ProfileReal.vue";
import FakeMoments from "@/views/games/game2/components/phone/FakeMoments.vue";
import GroupSearch from "@/views/games/game2/components/phone/GroupSearch.vue";
import ActionMenu from "@/views/games/game2/components/phone/ActionMenu.vue";

const store = useGameStore();
const router = useRouter();

// 弹窗控制
const showResultPopup = ref(false);
const resultData = ref({ type: "", title: "", text: "" });

// 显示胜利弹窗
const showVictoryPopup = () => {
  resultData.value = {
    type: "success",
    title: "🎉 成功通关！🎉",
    text: "你成功识破了骗局，帮助家人避免了损失！",
  };
  showResultPopup.value = true;
};

// 显示失败弹窗
const showFailPopup = (message) => {
  resultData.value = {
    type: "fail",
    title: "⚠️ 防骗失败",
    text: message || "很遗憾，家人还是被骗了，下次一定要更谨慎哦！",
  };
  showResultPopup.value = true;
};

// 处理弹窗按钮事件
const handleResultAction = (action) => {
  showResultPopup.value = false;
  if (action === "replay") {
    // 重置游戏并刷新页面（简单粗暴但可靠）
    location.reload();
  } else if (action === "home") {
    store.stopAllAudio();
    router.push("/");
  } else if (action === "cards") {
    store.stopAllAudio();
    // 跳转知识卡片页面（game2 的卡片页面路径，可根据实际调整）
    router.push(`/game/game2/cards`);
  }
};

// 监听游戏结果
watch(
  () => store.gameResult,
  (newVal) => {
    if (newVal === "win") {
      showVictoryPopup();
    } else if (newVal === "lose") {
      showFailPopup(store.gameResultMessage);
    }
  },
);

// ========== 原有生命周期和计算属性 ==========
const reloadGame = () => location.reload();

onMounted(() => {
  const fromHome = sessionStorage.getItem("fromHome");
  if (!fromHome) {
    router.push("/");
    return;
  }
  sessionStorage.removeItem("fromHome");
  store.tryPlayBGM();
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  store.stopAllAudio();
  store.clearAllTimers();
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

const handleBeforeUnload = () => {
  store.stopAllAudio();
  store.clearAllTimers();
};

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
/* 全局重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

/* 全屏隔离层（固定定位，覆盖父项目） */
.game2-fullscreen-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 游戏主容器（模拟手机尺寸） */
.game-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 480px;
  background-color: #f7ede2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

/* 角色区域（手机端占据全部高度） */
.character-col {
  flex: 1;
  position: relative;
  min-height: 0;
}

/* 对话框区域（手机端使用绝对定位悬浮在底部） */
.dialogue-col {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: auto;
}

/* 电脑端（宽屏）改为左右并排布局 */
@media screen and (min-width: 1025px) {
  .game2-fullscreen-wrapper {
    background-color: #333;
  }
  .game-container {
    max-width: none;
    width: 100vw;
    height: 100vh;
    flex-direction: row;
    border-radius: 0;
    box-shadow: none;
  }
  .character-col {
    flex: 3;
    height: 100%;
  }
  .dialogue-col {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: auto;
  }
}

/* 微信模拟器覆盖层 */
.wechat-system-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ededed;
  z-index: 100;
  overflow: hidden;
}

/* 震动动画 */
.shake-screen {
  animation: shake-hard 0.4s ease-in-out;
}
@keyframes shake-hard {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}

/* 渐隐渐显过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
