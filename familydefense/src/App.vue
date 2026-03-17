<template>
  <div id="app-container">
    <LoadingScreen v-if="store.state.activeOverlay === 'loading'" />
    <MissionIntro v-if="store.state.activeOverlay === 'intro'" @start="startGame" />
    <ResultPopup
        v-if="store.state.activeOverlay === 'result'"
        :resultData="store.state.resultData"
        @action="handleResultAction"
    />

    <WechatHeader :show="store.state.activeOverlay !== 'intro' && store.state.activeOverlay !== 'loading'" />

    <div class="chat-container" ref="chatBox" v-show="store.state.activeOverlay !== 'intro' && store.state.activeOverlay !== 'loading'">
      <ChatMessage
          v-for="msg in store.state.messages"
          :key="msg.id"
          :message="msg"
          @image-click="handleImageClick"
          @link-click="handleLinkClick"
      />
    </div>

    <ActionDrawer :title="drawerConfig.title" :options="drawerConfig.options" @select="handleChoice" />
    <WechatBottom :show="store.state.activeOverlay !== 'intro' && store.state.activeOverlay !== 'loading'" />
    <SystemToast />

    <ImageInspector :imgSrc="currentInspectImage" @completed="handleLevelCompleted(1)" />
    <FakeTaobao @completed="handleLevelCompleted(2)" />
    <FakeFaceTime @completed="handleLevelCompleted(3)" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { gameStore as store } from './store/gameStore.js';
import { GAME_STORY } from './config/story.js';
import { LEVEL_QUESTIONS } from './config/questions.js';

// 组件导入
import LoadingScreen from './components/overlays/LoadingScreen.vue';
import MissionIntro from './components/overlays/MissionIntro.vue';
import ResultPopup from './components/overlays/ResultPopup.vue';
import SystemToast from './components/overlays/SystemToast.vue';
import WechatHeader from './components/chat/WechatHeader.vue';
import WechatBottom from './components/chat/WechatBottom.vue';
import ChatMessage from './components/chat/ChatMessage.vue';
import ActionDrawer from './components/chat/ActionDrawer.vue';
import ImageInspector from './components/minigames/ImageInspector.vue';
import FakeTaobao from './components/minigames/FakeTaobao.vue';
import FakeFaceTime from './components/minigames/FakeFaceTime.vue';

import { useStoryHandler } from './composables/useStoryHandler.js';

const { handleChoice } = useStoryHandler();

const chatBox = ref(null);
const currentInspectImage = ref('');
const drawerConfig = ref({ title: '', options: [] });

watch(() => store.state.messages.length, () => {
  nextTick(() => { if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight; });
});

onMounted(async () => {
  // 1. 此时界面显示的是 LoadingScreen 动画
  
  // 2. 挂起等待，直到所有图片和音频从服务器下载完毕
  await store.preloadAssets(); 
  
  // 3. 资源准备就绪，撤掉加载界面，露出开场白弹窗！
  store.state.activeOverlay = 'intro'; 
});

// 暴露全局函数供聊天消息中的 onclick 调用
const openTaobao = () => {
  handleLinkClick('taobao');
};

const openFaceTime = () => {
  handleLinkClick('facetime');
};

// 将函数挂载到全局 window 对象，供 HTML 中的 onclick 使用
window.openTaobao = openTaobao;
window.openFaceTime = openFaceTime;

// ================= 游戏启动 =================
const startGame = () => {
  store.playSound('click');
  store.playSound('bgm');
  store.state.activeOverlay = 'none';
  store.state.currentLevel = 1;
  store.pushMessage({ type: 'time', text: '刚刚' });

  const script = [...GAME_STORY.openingimage, ...GAME_STORY.openingtext];
  store.playScript(script, () => {
    store.triggerHint("点击二大爷发的图片，放大看看吧~", 2000);
    store.state.flaws.inspector.isOpen = true;
  });
};

// ================= 交互拦截 =================
const handleImageClick = (src) => {
  currentInspectImage.value = src;
  store.state.activeOverlay = 'inspector';

  const f = store.state.flaws.inspector;
  // 核心修复：只有锁开着，且 3 个破绽没有被全部找齐时，才弹提示
  if (f.isOpen && !(f.mountain && f.billboard && f.ai)) {
    setTimeout(() => store.triggerHint("⚠️ 这张图片怎么怪怪的？请找出3个不合理的地方！", 2000), 300);
  }
};

const handleLinkClick = (type) => {
  store.playSound('click');

  if (type === 'taobao') {
    store.state.activeOverlay = 'taobao';
    const f = store.state.flaws.taobao;
    if (f.isOpen && !(f.url && f.countdown && f.password)) {
      setTimeout(() => store.triggerHint("⚠️ 检测到高风险链接！请在网页中找出 3 处诈骗破绽。", 2000), 300);
    }
  } else if (type === 'facetime') {
    store.state.activeOverlay = 'facetime';
    const f = store.state.flaws.facetime;
    if (f.isOpen && !(f.channel && f.transfer && f.screenshare)) {
      setTimeout(() => store.triggerHint("⚠️ 完美伪装的高级定制诈骗：请找出3个逻辑破绽！", 2000), 300);
    }
  }
};

// ================= 动态关卡结算 =================
const handleLevelCompleted = (level) => {
  const levelData = LEVEL_QUESTIONS[level];
  if (!levelData) return;

  store.triggerHint(levelData.hint, 1500);

  setTimeout(() => {
    drawerConfig.value = {
      title: levelData.drawerTitle,
      options: levelData.options
    };
    store.state.showDrawer = true;
  }, 1500);
};

// ================= 重试/重开逻辑 =================
const handleResultAction = () => {
  store.playSound('click');
  if (store.state.resultData.type === 'fail') {
    store.state.messages = store.state.messages.filter(m => !m.extraClass || !m.extraClass.includes('bad-msg'));
    store.state.activeOverlay = 'none';
    store.state.showDrawer = true;
  } else {
    location.reload();
  }
};
</script>