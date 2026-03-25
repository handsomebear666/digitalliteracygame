<template>
  <div class="character-layer">
    <div
      class="background"
      :style="{ backgroundImage: `url(${background})` }"
    ></div>
    <div
      class="character"
      :style="{ backgroundImage: `url(${character})` }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  background: { type: String, required: true },
  character: { type: String, required: true },
});
</script>

<style scoped>
.character-layer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: bottom center;
  background-repeat: no-repeat;
  z-index: 2;
}
@media screen and (min-width: 1025px) {
  .character {
    background-size: cover;
    background-position: center bottom;
  }
}
</style>
