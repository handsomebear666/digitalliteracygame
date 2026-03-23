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
