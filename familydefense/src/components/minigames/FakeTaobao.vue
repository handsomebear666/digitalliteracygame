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
      <img src="/assets/img/yurongfu.png" style="width: 100%; display: block" />

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
import { computed } from "vue";
import { gameStore as store } from "../../store/gameStore.js";
const emit = defineEmits(["completed"]);
const flaws = computed(() => store.state.flaws.taobao);
const isOpen = computed(() => store.state.flaws.taobao.isOpen);

const reveal = (key, hint) => {
  if (!isOpen.value || flaws.value[key]) return;
  store.playSound("click");
  flaws.value[key] = true;
  store.triggerHint(hint, 1500);

  // 只计算 3 个破绽字段（不包括 isOpen）
  const foundCount = ["url", "countdown", "password"].filter(
    (k) => flaws.value[k] === true,
  ).length;

  if (foundCount === 3) {
    setTimeout(() => {
      store.state.activeOverlay = "none";
      emit("completed");
    }, 2500);
  }
};
const close = () => {
  store.playSound("click");
  store.state.activeOverlay = "none";
};
</script>
