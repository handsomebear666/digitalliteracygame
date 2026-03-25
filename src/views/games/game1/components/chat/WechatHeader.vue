<template>
  <div class="wechat-header" v-show="show">
    <div class="back-btn"><img :src="backIcon" class="icon-img" /></div>
    <div id="groupName">{{ groupName }}</div>
    <div class="more-btn"><img :src="moreIcon" class="icon-img" /></div>
  </div>
</template>
<script setup>
import backIcon from "@/views/games/game1/assets/img/back.svg";
import moreIcon from "@/views/games/game1/assets/img/more.svg";
defineProps({ show: Boolean, groupName: String });
</script>
<style scoped>
.wechat-header {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #dcdcdc;
  font-size: 15px;
  font-weight: bold;
}
.back-btn,
.more-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.back-btn img,
.more-btn img,
.back-btn svg,
.more-btn svg {
  height: 20px;
  width: auto;
  object-fit: contain;
  display: block;
}
.more-btn img,
.more-btn svg {
  height: 28px;
}
.back-btn svg path,
.more-btn svg path {
  fill: #333;
}
</style>
