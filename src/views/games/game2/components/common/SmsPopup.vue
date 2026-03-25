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

<style scoped>
.sms-popup {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 94%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 14px 18px;
  z-index: 2000;
  transition: top 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.sms-popup.show {
  top: 20px;
}
.sms-header {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}
.sms-body {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}
.sms-expand-btn {
  color: #576b95;
  cursor: pointer;
  font-weight: 500;
}
.sms-clickable {
  cursor: pointer;
  transition: 0.2s;
  border-bottom: 1px dashed #ccc;
}
.sms-keyword-danger {
  color: #ff0000 !important;
  font-weight: bold;
  background: #ffebee;
  padding: 2px 4px;
  border-bottom: none;
  border-radius: 4px;
}
</style>
