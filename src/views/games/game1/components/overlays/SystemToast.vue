<template>
  <div id="systemToast" class="system-hint-toast" :class="{ show: store.state.showToast }">
    <span>{{ store.state.toastText }}</span>
  </div>
</template>

<script setup>
import { gameStore as store } from '../../store/gameStore.js';
</script>