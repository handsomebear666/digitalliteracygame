<template>
  <div class="taobao-overlay" v-show="store.state.activeOverlay === 'taobao'">
    <div class="taobao-header">
      <div class="taobao-close" @click="close">✕ 关闭</div>
      <div
        class="fake-url"
        :class="{ 'taobao-flaw-revealed': flaws.url }"
        @click="
          reveal(
            'url',
            '✅ 找到破绽：正规官方网站绝不会包含 free、xyz 等奇怪后缀！',
          )
        "
      >
        🔒 www.taoobaoo-vip-free.xyz
      </div>
      <div style="width: 40px"></div>
    </div>

    <div class="taobao-content">
      <img :src="yurongfuImg" style="width: 100%; display: block" />

      <div
        class="countdown-box"
        :class="{ 'taobao-flaw-revealed': flaws.countdown }"
        @click="
          reveal(
            'countdown',
            '✅ 找到破绽：利用虚假倒计时制造焦虑，逼迫受害者失去理智。',
          )
        "
      >
        🔥 距离活动结束仅剩：<span
          style="color: #ffeb3b; font-weight: bold; font-size: 18px"
          >02:14</span
        ><br />
        <span style="font-size: 12px; opacity: 0.9"
          >已有 98,241 人成功领取</span
        >
      </div>

      <div class="fake-form">
        <div style="font-weight: bold; margin-bottom: 10px; color: #333">
          邮寄信息 (仅需支付 19.9 元邮费)
        </div>
        <input
          type="text"
          class="form-input"
          placeholder="收件人姓名"
          disabled
        />

        <div
          class="danger-input-wrapper"
          :class="{ 'taobao-flaw-revealed': flaws.password }"
          @click="
            reveal(
              'password',
              '✅ 找到破绽：正规平台绝不会在网页直接索要银行卡密码！',
            )
          "
        >
          <input
            type="password"
            class="form-input danger-input"
            placeholder="请输入银行卡取款密码以验证身份"
            disabled
          />
        </div>
        <button class="fake-submit-btn">立即支付邮费并领取</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { gameStore as store } from "../../store/gameStore.js";
import yurongfuImg from "@/views/games/game1/assets/img/yurongfu.png";
const emit = defineEmits(["completed"]);
const flaws = computed(() => store.state.flaws.taobao);
const isOpen = computed(() => store.state.flaws.taobao.isOpen);

const reveal = (key, hint) => {
  if (!isOpen.value || flaws.value[key]) return;
  store.playSound("click");
  flaws.value[key] = true;
  store.triggerHint(hint, 1500);

  const foundCount = ["url", "countdown", "password"].filter(
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
    if (store.state.activeOverlay !== "taobao") return;
    const hidden = messages.some(
      (msg) =>
        msg.text &&
        msg.text.includes("www.taoobaoo-vip-free.xyz") &&
        msg.hidden === true,
    );
    if (hidden) {
      close();
    }
  },
  { deep: true },
);
</script>

<style scoped>
.taobao-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
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

.taobao-header {
  height: 50px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #ddd;
}

.taobao-close {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.fake-url {
  font-size: 13px;
  color: #888;
  background: #f0f0f0;
  padding: 6px 15px;
  border-radius: 15px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.taobao-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 30px;
}

.product-info {
  background: #fff;
  padding: 15px;
}
.price-tag {
  color: #ff5000;
  font-size: 24px;
  font-weight: bold;
}

.countdown-box {
  background: linear-gradient(90deg, #ff5000, #ff8c00);
  color: white;
  text-align: center;
  padding: 12px;
  margin: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.fake-form {
  background: #fff;
  margin: 10px;
  padding: 15px;
  border-radius: 8px;
}
.form-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 0 10px;
  background: #f9f9f9;
  font-size: 14px;
  box-sizing: border-box;
}

.danger-input-wrapper {
  position: relative;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
  margin-bottom: 0 !important;
}
.danger-input {
  border-color: #ffcccc;
  color: #ff4444;
  pointer-events: none;
}
.danger-input::placeholder {
  color: #ff9999;
}

.fake-submit-btn {
  width: 100%;
  background: #ff5000;
  color: white;
  border: none;
  height: 45px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.taobao-flaw-revealed {
  border: 2px solid #ff4444 !important;
  background-color: rgba(255, 68, 68, 0.1) !important;
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
