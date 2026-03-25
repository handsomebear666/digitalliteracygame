<template>
  <div
    class="inspector-overlay"
    v-show="store.state.activeOverlay === 'inspector'"
  >
    <div class="inspector-close" @click="close">返回聊天</div>
    <div class="inspector-img-box">
      <img :src="imgSrc" />
      <div v-if="showHotspots">
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
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { gameStore as store } from "../../store/gameStore.js";

const props = defineProps({
  imgSrc: String,
  showHotspots: { type: Boolean, default: false },
});
const emit = defineEmits(["completed"]);

const flaws = computed(() => store.state.flaws.inspector);
const isOpen = computed(() => store.state.flaws.inspector.isOpen);

const hotspots = {
  mountain: {
    style: "top: 1%; left: 10%; width: 40%; height: 25%",
    hint: "✅ 发现破绽：这个季节桂林根本没有雪山！",
  },
  billboard: {
    style: "top: 35%; left: 1%; width: 40%; height: 40%",
    hint: "✅ 发现破绽：广告牌文字扭曲，AI生图常见问题！",
  },
  ai: {
    style: "top: 90%; left: 87%; width: 13%; height: 10%",
    hint: "✅ 发现破绽：这里还留着AI创作水印！",
  },
};

const reveal = (key, hint) => {
  if (!isOpen.value || flaws.value[key]) return;
  store.playSound("click");
  flaws.value[key] = true;
  store.triggerHint(hint, 1500);

  const foundCount = ["mountain", "billboard", "ai"].filter(
    (k) => flaws.value[k] === true,
  ).length;
  if (foundCount === 3) {
    store.setGameTimeout(() => {
      store.state.activeOverlay = "none";
      emit("completed");
    }, 2500);
  }
};

const close = () => {
  store.state.activeOverlay = "none";
};

watch(
  () => store.state.messages,
  (messages) => {
    if (store.state.activeOverlay !== "inspector") return;
    const currentImgSrc = props.imgSrc;
    const isHidden = messages.some(
      (msg) =>
        msg.type === "image" &&
        msg.image === currentImgSrc &&
        msg.hidden === true,
    );
    if (isHidden) {
      close();
    }
  },
  { deep: true },
);
</script>

<style scoped>
.inspector-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.inspector-close {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  font-size: 15px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.inspector-img-box {
  position: relative;
  max-width: 100%;
  max-height: 80vh;
}

.inspector-img-box img {
  width: 100%;
  height: auto;
  display: block;
}

.flaw-hotspot {
  position: absolute;
  border: 2px solid transparent;
  cursor: pointer;
}

.flaw-hotspot.revealed {
  border: 3px solid #ff4444;
  background: rgba(255, 68, 68, 0.2);
  animation: pulseBorder 1.5s infinite;
}

@keyframes pulseBorder {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
  }
}
</style>
