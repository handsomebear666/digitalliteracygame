<template>
  <div id="app-container" class="game1-root">
    <LoadingScreen v-if="store.state.activeOverlay === 'loading'" />
    <ResultPopup
      v-if="store.state.activeOverlay === 'result'"
      :resultData="store.state.resultData"
      @action="handleResultAction"
    />

    <WechatHeader
      :show="
        store.state.activeOverlay !== 'intro' &&
        store.state.activeOverlay !== 'loading'
      "
      :groupName="store.state.groupName"
    />

    <div
      class="chat-container"
      ref="chatBox"
      v-show="
        store.state.activeOverlay !== 'intro' &&
        store.state.activeOverlay !== 'loading'
      "
    >
      <ChatMessage
        v-for="msg in store.state.messages"
        :key="msg.id"
        :message="msg"
        @image-click="handleImageClick"
        @link-click="handleLinkClick"
      />
    </div>

    <ActionDrawer
      :title="drawerConfig.title"
      :options="drawerConfig.options"
      @select="handleChoice"
    />
    <WechatBottom
      :show="
        store.state.activeOverlay !== 'intro' &&
        store.state.activeOverlay !== 'loading'
      "
    />
    <SystemToast />

    <ImageInspector
      :imgSrc="currentInspectImage"
      :showHotspots="currentInspectImage === monsterImg"
      @completed="handleLevelCompleted(1)"
    />
    <FakeTaobao @completed="handleLevelCompleted(2)" />
    <FakeFaceTime @completed="handleLevelCompleted(3)" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { gameStore as store } from "./store/gameStore.js";
import { GAME_STORY } from "./config/story.js";
import { LEVEL_QUESTIONS } from "./config/questions.js";
import { ASSETS } from "./config/story.js";
import game1Style from "./assets/css/style.css?inline";

// 组件导入
import LoadingScreen from "./components/overlays/LoadingScreen.vue";
import ResultPopup from "./components/overlays/ResultPopup.vue";
import SystemToast from "./components/overlays/SystemToast.vue";
import WechatHeader from "./components/chat/WechatHeader.vue";
import WechatBottom from "./components/chat/WechatBottom.vue";
import ChatMessage from "./components/chat/ChatMessage.vue";
import ActionDrawer from "./components/chat/ActionDrawer.vue";
import ImageInspector from "./components/minigames/ImageInspector.vue";
import FakeTaobao from "./components/minigames/FakeTaobao.vue";
import FakeFaceTime from "./components/minigames/FakeFaceTime.vue";

import { useStoryHandler } from "./composables/useStoryHandler.js";
// 💥 核心引入：全局进度管理
import { useGameProgress } from "@/composables/useGameProgress";

const router = useRouter();
const monsterImg = ASSETS.IMAGES.monster;
const { handleChoice } = useStoryHandler();
const { completeLevel } = useGameProgress(); // 拿到登记通关的方法

const chatBox = ref(null);
const currentInspectImage = ref("");
const drawerConfig = ref({ title: "", options: [] });
let styleElement = null;

watch(
  () => store.state.messages.length,
  () => {
    nextTick(() => {
      if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
    });
  },
);

onMounted(() => {
  const fromHome = sessionStorage.getItem("fromHome");
  if (!fromHome) {
    router.push("/");
    return;
  }
  sessionStorage.removeItem("fromHome");

  styleElement = document.createElement("style");
  styleElement.textContent = game1Style;
  document.head.appendChild(styleElement);

  startGame();
});

onUnmounted(() => {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
  store.stopAllAudio();
  store.resetGame();
});

const openTaobao = () => handleLinkClick("taobao");
const openFaceTime = () => handleLinkClick("facetime");
window.openTaobao = openTaobao;
window.openFaceTime = openFaceTime;

const startGame = () => {
  store.resetGame();
  store.playSound("click");
  store.playSound("bgm");
  store.state.activeOverlay = "none";
  store.state.currentLevel = 1;
  store.pushMessage({ type: "time", text: "刚刚" });

  const script = [...GAME_STORY.openingimage, ...GAME_STORY.openingtext];
  store.playScript(script, () => {
    store.triggerHint("点击二大爷发的图片，放大看看吧~", 2000);
    store.state.flaws.inspector.isOpen = true;
  });
};

const handleImageClick = (src) => {
  currentInspectImage.value = src;
  store.state.activeOverlay = "inspector";

  const f = store.state.flaws.inspector;
  if (f.isOpen && !(f.mountain && f.billboard && f.ai)) {
    store.setGameTimeout(() => {
      store.triggerHint("⚠️ 这张图片怎么怪怪的？请找出3个不合理的地方！", 2000);
    }, 300);
  }
};

const handleLinkClick = (type) => {
  store.playSound("click");
  if (type === "taobao") {
    store.state.activeOverlay = "taobao";
    const f = store.state.flaws.taobao;
    if (f.isOpen && !(f.url && f.countdown && f.password)) {
      store.setGameTimeout(() => {
        store.triggerHint(
          "⚠️ 检测到高风险链接！请在网页中找出 3 处诈骗破绽。",
          2000,
        );
      }, 300);
    }
  } else if (type === "facetime") {
    store.state.activeOverlay = "facetime";
    const f = store.state.flaws.facetime;
    if (f.isOpen && !(f.channel && f.transfer && f.screenshare)) {
      store.setGameTimeout(() => {
        store.triggerHint(
          "⚠️ 完美伪装的高级定制诈骗：请找出3个逻辑破绽！",
          2000,
        );
      }, 300);
    }
  }
};

const handleLevelCompleted = (level) => {
  const levelData = LEVEL_QUESTIONS[level];
  if (!levelData) return;

  store.triggerHint(levelData.hint, 1500);
  store.setGameTimeout(() => {
    drawerConfig.value = {
      title: levelData.drawerTitle,
      options: levelData.options,
    };
    store.state.showDrawer = true;
  }, 1500);
};

// 弹窗按钮处理
const handleResultAction = (action) => {
  store.playSound("click");

  // 💥 关键修复：只要不是失败，就向全局登记第一关(0)已经通关！
  if (store.state.resultData.type !== "fail") {
    completeLevel(0);
  }

  if (action === "replay") {
    if (store.state.resultData.type === "fail") {
      store.clearAllTimers();
      store.state.messages = store.state.messages.filter(
        (m) => !m.extraClass || !m.extraClass.includes("bad-msg"),
      );
      store.state.activeOverlay = "none";
      store.state.showDrawer = true;
      store.state.groupName = "相亲相爱一家人 (27)";
    } else {
      sessionStorage.setItem("fromHome", "true");
      location.reload();
    }
  } else if (action === "home") {
    store.stopAllAudio();
    router.push("/");
  } else if (action === "cards") {
    // 💥 接收点击“收集知识卡片”按钮后的跳转动作
    store.stopAllAudio();
    store.state.activeOverlay = "none";
    router.push("/game/game1/cards");
  }
};
</script>
