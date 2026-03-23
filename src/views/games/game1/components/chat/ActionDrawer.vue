<template>
  <div>
    <div class="drawer-overlay" :class="{ show: store.state.showDrawer }"></div>
    <div class="game-action-area" v-if="store.state.showDrawer">
      <div class="options-panel">
        <div class="question-title">{{ title }}</div>
        <button
            v-for="(opt, index) in options"
            :key="index"
            class="action-btn"
            :class="index === 0 ? 'outline' : 'solid'"
            @click="selectOption(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameStore as store } from '../../store/gameStore.js';

defineProps({
  title: String,
  options: Array
});

const emit = defineEmits(['select']);

const selectOption = (val) => {
  store.playSound('click');
  store.state.showDrawer = false;
  emit('select', val);
};
</script>