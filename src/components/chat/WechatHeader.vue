<template>
  <div class="wechat-header" v-show="show">
    <div class="back-btn"><img src="/assets/img/back.svg" class="icon-img" /></div>
    <div id="groupName">{{ groupName }}</div>
    <div class="more-btn"><img src="/assets/img/more.svg" class="icon-img" /></div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  groupName: { type: String, default: '相亲相爱一家人 (27)' }
});
</script>