<template>
  <div
    class="facetime-overlay"
    v-show="store.state.activeOverlay === 'facetime'"
  >
    <div
      class="facetime-header"
      :class="{ 'ft-flaw-revealed': flaws.channel }"
      @click="
        reveal(
          'channel',
          '✅ 找到破绽：官方客服绝不会使用外部会议软件或视频电话联系你！',
        )
      "
    >
      <span style="color: #28c445">📞 腾腾会议 视频通话</span>
      <div class="facetime-close" @click="close">结束</div>
    </div>

    <div class="facetime-content">
      <div class="video-placeholder">
        <img
          :src="kefuImg"
          style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7"
        />
        <div class="agent-badge">工号：9527 (微信支付安全中心)</div>
      </div>

      <div class="meeting-chat">
        <div class="chat-msg system">系统提示：通话已加密</div>

        <div
          class="chat-msg agent"
          :class="{ 'ft-flaw-revealed': flaws.transfer }"
          @click="
            reveal(
              'transfer',
              '✅ 找到破绽：官方没有所谓的安全账户，要求转账验资100%是诈骗！',
            )
          "
        >
          <span style="color: #007aff; font-weight: bold">客服代表：</span
          ><br />
          为验证本人操作并拦截扣款，请将名下所有资金暂时转入指定的【银联安全保护账户】进行验资，完成后原路退回。
        </div>

        <div
          class="screen-share-alert"
          :class="{ 'ft-flaw-revealed': flaws.screenshare }"
          @click="
            reveal(
              'screenshare',
              '✅ 找到破绽：一旦开启屏幕共享，你的密码和验证码将对骗子完全透明！',
            )
          "
        >
          <div
            style="
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 8px;
              color: #333;
            "
          >
            屏幕共享请求
          </div>
          <div style="font-size: 13px; color: #666; margin-bottom: 15px">
            “微信支付客服”请求与您共享屏幕，以便指导您取消“百万保障”服务。
          </div>
          <button class="accept-btn">同意共享</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { gameStore as store } from "../../store/gameStore.js";
import kefuImg from "@/views/games/game1/assets/img/kefu.png";
const emit = defineEmits(["completed"]);
const flaws = computed(() => store.state.flaws.facetime);
const isOpen = computed(() => store.state.flaws.facetime.isOpen);

const reveal = (key, hint) => {
  if (!isOpen.value || flaws.value[key]) return;
  store.playSound("click");
  flaws.value[key] = true;
  store.triggerHint(hint, 1500);

  const foundCount = ["channel", "transfer", "screenshare"].filter(
    (k) => flaws.value[k] === true,
  ).length;
  if (foundCount === 3) {
    store.setGameTimeout(() => {
      store.state.activeOverlay = "none";
      emit("completed");
    }, 2500);
  }
};
const close = () => {
  store.playSound("click");
  store.state.activeOverlay = "none";
};

watch(
  () => store.state.messages,
  (messages) => {
    if (store.state.activeOverlay !== "facetime") return;
    const hidden = messages.some(
      (msg) => msg.text && msg.text.includes("视频会议") && msg.hidden === true,
    );
    if (hidden) {
      close();
    }
  },
  { deep: true },
);
</script>

<style scoped>
.facetime-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1c1c1e;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  animation: slideUpFull 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

@keyframes slideUpFull {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.facetime-header {
  height: 50px;
  background: #2c2c2e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #38383a;
  font-size: 15px;
  font-weight: bold;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.facetime-close {
  color: #ff453a;
  cursor: pointer;
  background: rgba(255, 69, 58, 0.15);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
}

.facetime-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.video-placeholder {
  width: 100%;
  height: 40%;
  background: #000;
  position: relative;
  border-bottom: 2px solid #333;
}
.agent-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.meeting-chat {
  flex: 1;
  background: #f2f2f7;
  padding: 15px;
  /* 留出底部空白，并适配手机底部横条的安全距离 */
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  box-sizing: border-box; /* 确保 padding 不会撑破宽度 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
/* 💥 修复 2：共享请求卡片加上 border-box */
.screen-share-alert {
  width: 100%;
  margin-top: auto;
  box-sizing: border-box; /* 💥 核心修复：防止内边距撑破100%的宽度 */
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}
.chat-msg {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px;
  border-radius: 8px;
}
.chat-msg.system {
  text-align: center;
  color: #8e8e93;
  font-size: 12px;
  padding: 0;
}
.chat-msg.agent {
  background: #fff;
  color: #333;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.screen-share-alert {
  width: 100%;
  margin-top: auto;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.accept-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 15px;
  width: 80%;
}

.ft-flaw-revealed {
  border: 2px solid #ff453a !important;
  background-color: rgba(255, 69, 58, 0.1) !important;
  animation: pulseBorder 1.5s infinite;
}

@keyframes pulseBorder {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
  }
}
</style>
