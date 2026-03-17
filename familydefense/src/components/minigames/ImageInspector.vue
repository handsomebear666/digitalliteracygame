<template>
  <div class="inspector-overlay" v-show="store.state.activeOverlay === 'inspector'">
    <div class="inspector-close" @click="close">返回聊天</div>
    <div class="inspector-img-box">
      <img :src="imgSrc" />

      <div
          v-for="(hotspot, key) in hotspots"
          :key="key"
          class="flaw-hotspot"
          :class="{ revealed: flaws[key] }"
          :style="hotspot.style"
          @click="reveal(key, hotspot.hint)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { gameStore as store } from '../../store/gameStore.js';

const props = defineProps({ imgSrc: String });
const emit = defineEmits(['completed']);

const flaws = computed(() => store.state.flaws.inspector);
const isOpen = computed(() => store.state.flaws.inspector.isOpen);

const hotspots = {
  mountain: { style: "top: 1%; left: 10%; width: 40%; height: 25%", hint: "✅ 发现破绽：这个季节桂林根本没有雪山！" },
  billboard: { style: "top: 35%; left: 1%; width: 40%; height: 40%", hint: "✅ 发现破绽：广告牌文字扭曲，AI生图常见问题！" },
  ai: { style: "top: 90%; left: 87%; width: 13%; height: 10%", hint: "✅ 发现破绽：这里还留着AI创作水印！" }
};

const reveal = (key, hint) => {
  if (!isOpen.value || flaws.value[key]) return;
  store.playSound('click');
  flaws.value[key] = true;
  store.triggerHint(hint, 1500);

  // 只计算 3 个破绽字段（不包括 isOpen）
  const foundCount = ['mountain', 'billboard', 'ai'].filter(k => flaws.value[k] === true).length;
  if (foundCount === 3) {
    setTimeout(() => {
      store.state.activeOverlay = 'none';
      emit('completed');
    }, 2500);
  }
};

const close = () => { store.state.activeOverlay = 'none'; };
</script>