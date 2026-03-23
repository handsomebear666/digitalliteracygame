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
