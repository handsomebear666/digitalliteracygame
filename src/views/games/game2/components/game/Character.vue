<template>
  <div class="character-layer">
    <div
      class="background"
      :style="{ backgroundImage: `url(${background})` }"
    ></div>
    <img class="character" :src="character" alt="角色立绘" />
  </div>
</template>

<script setup>
defineProps({
  background: {
    type: String,
    required: true,
  },
  character: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.character-layer {
  position: absolute; /* 【修改】：用绝对定位锁住，防止撑开容器 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* 【修改】：从 100vh 改为 100%，完美贴合手机外壳 */
  overflow: hidden;
  z-index: 1;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 1;
}
.character {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 80%;
  z-index: 2;
  transition: opacity 0.3s ease;
}
</style>
