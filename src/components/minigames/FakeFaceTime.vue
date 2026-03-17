<template>
  <div class="facetime-overlay" v-show="store.state.activeOverlay === 'facetime'">
    <div class="facetime-header" :class="{ 'ft-flaw-revealed': flaws.channel }" @click="reveal('channel', '✅ 找到破绽：官方客服绝不会使用外部会议软件或视频电话联系你！')">
      <span style="color: #28c445">📞 腾腾会议 视频通话</span>
      <div class="facetime-close" @click="close">结束</div>
    </div>

    <div class="facetime-content">
      <div class="video-placeholder">
        <img src="/assets/img/kefu.png" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7" />
        <div class="agent-badge">工号：9527 (微信支付安全中心)</div>
      </div>

      <div class="meeting-chat">
        <div class="chat-msg system">系统提示：通话已加密</div>

        <div class="chat-msg agent" :class="{ 'ft-flaw-revealed': flaws.transfer }" @click="reveal('transfer', '✅ 找到破绽：官方没有所谓的安全账户，要求转账验资100%是诈骗！')">
          <span style="color: #007aff; font-weight: bold">客服代表：</span><br />
          为验证本人操作并拦截扣款，请将名下所有资金暂时转入指定的【银联安全保护账户】进行验资，完成后原路退回。
        </div>

        <div class="screen-share-alert" :class="{ 'ft-flaw-revealed': flaws.screenshare }" @click="reveal('screenshare', '✅ 找到破绽：一旦开启屏幕共享，你的密码和验证码将对骗子完全透明！')">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">屏幕共享请求</div>
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
import { computed } from 'vue';
import { gameStore as store } from '../../store/gameStore.js';
const emit = defineEmits(['completed']);
const flaws = computed(() => store.state.flaws.facetime);
const isOpen = computed(() => store.state.flaws.facetime.isOpen);

const reveal = (key, hint) => {
  if (!isOpen.value || flaws.value[key]) return;
  store.playSound('click');
  flaws.value[key] = true;
  store.triggerHint(hint, 1500);

  // 只计算 3 个破绽字段（不包括 isOpen）
  const foundCount = ['channel', 'transfer', 'screenshare'].filter(k => flaws.value[k] === true).length;
  if (foundCount === 3) {
    setTimeout(() => {
      store.state.activeOverlay = 'none';
      emit('completed');
    }, 2500);
  }
};
const close = () => { store.playSound('click'); store.state.activeOverlay = 'none'; };
</script>
