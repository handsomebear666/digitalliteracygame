<template>
  <div class="wechat-bottom" v-show="show">
    <img src="/assets/img/voice-icon.svg" class="bottom-icon" />
    <div class="input-wrapper">
      <input type="text" class="input-box" disabled placeholder=" " />
    </div>
    <img src="/assets/img/emoji-icon.svg" class="bottom-icon" />
    <img src="/assets/img/plus-icon.svg" class="bottom-icon" />
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true }
});
</script>