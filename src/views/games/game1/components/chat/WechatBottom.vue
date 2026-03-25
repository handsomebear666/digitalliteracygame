<template>
  <div class="wechat-bottom" v-show="show">
    <img :src="voiceIcon" class="bottom-icon" />
    <div class="input-wrapper">
      <input type="text" class="input-box" disabled placeholder=" " />
    </div>
    <img :src="emojiIcon" class="bottom-icon" />
    <img :src="plusIcon" class="bottom-icon" />
  </div>
</template>

<script setup>
import voiceIcon from "@/views/games/game1/assets/img/voice-icon.svg";
import emojiIcon from "@/views/games/game1/assets/img/emoji-icon.svg";
import plusIcon from "@/views/games/game1/assets/img/plus-icon.svg";

defineProps({
  show: { type: Boolean, required: true },
});
</script>
<style scoped>
.wechat-bottom {
  height: 60px;
  background-color: #f7f7f7;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
  z-index: 20;
}
.bottom-icon {
  width: 28px;
  height: 28px;
}
.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.input-box {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: none;
  padding: 0 10px;
  padding-right: 70px;
  font-size: 16px;
  outline: none;
  background-color: #fff;
}
</style>
