<template>
  <div class="sms-popup show">
    <div class="sms-header">
      <span class="sms-app-name">💬 信息 · 刚刚</span>
    </div>

    <div v-if="!isExpanded" class="sms-body">
      【支付安全】您的验证码为 882931，您正在尝...
      <span class="sms-expand-btn" @click="expandSms">查看全文</span>
    </div>

    <div v-else class="sms-body">
      【支付安全】您的验证码为 882931，您正在尝试通过手机号
      <span
        class="sms-clickable"
        :class="{ 'sms-keyword-danger': store.level2Solved }"
        @click="store.catchSMSFlaw()"
        >重置支付宝登录密码</span
      >，请勿泄露。
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGameStore } from "@/views/games/game2/store/useGameStore";

const store = useGameStore();
const isExpanded = ref(false);

const expandSms = () => {
  store.playClickAudio();
  isExpanded.value = true;
};
</script>
