<template>
  <div class="dialogue-system-wrapper">
    <div class="full-screen-clicker" @click="handleContainerClick"></div>

    <div class="ui-layer">
      <div class="options-container" :class="{ active: showOptions }">
        <button
          v-for="(opt, index) in currentLine?.options"
          :key="index"
          class="option-button"
          @click.stop="selectOption(opt)"
        >
          {{ opt.text }}
        </button>
      </div>

      <div
        class="dialogue-bubble"
        :class="{ 'thought-style': isThought }"
        @click.stop="handleContainerClick"
      >
        <div v-if="!isThought" class="name-tag">{{ currentLine?.name }}</div>

        <div class="dialogue-text" ref="textEl" v-html="displayedText"></div>

        <div
          v-if="
            !isTyping && !showOptions && currentPageIdx === textPages.length - 1
          "
          class="next-indicator"
          :style="{
            display: 'block',
            color: isThought ? '#718096' : 'var(--color-accent, #ff9f43)',
          }"
        >
          ▼
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import { GAME_STORY } from "@/views/games/game2/data/story";
import { onUnmounted } from "vue";

const store = useGameStore();
const textEl = ref(null);

const displayedText = ref("");
const isTyping = ref(false);
const textPages = ref([]);
const currentPageIdx = ref(0);
let typingTimer = null;

const currentLine = computed(() =>
  GAME_STORY.scriptLines.find((l) => l.id === store.currentLineId),
);
const isThought = computed(
  () => !currentLine.value?.name || currentLine.value.name === "系统",
);

const showOptions = computed(() => {
  return (
    !isTyping.value &&
    currentPageIdx.value === textPages.value.length - 1 &&
    !!currentLine.value?.options
  );
});

onUnmounted(() => {
  if (typingTimer) clearInterval(typingTimer);
});

// 智能分词
const splitTextDynamically = async (text) => {
  await nextTick();
  const el = textEl.value;
  if (!el) return [text];

  const originalHeight = el.style.height;
  el.style.height = "auto";

  el.innerHTML = "测<br>试";
  const maxHeight = el.offsetHeight + 2;
  el.innerHTML = "";

  const tokens = [];
  let i = 0;
  const isAlNum = (c) => /^[a-zA-Z0-9]+$/.test(c);
  const isPunct = (c) =>
    /^[.,!?;:'"()\[\]{}<>\-—…、，。！？；：“”‘’（）《》【】]+$/.test(c);

  while (i < text.length) {
    let char = text[i];
    let word = char;

    if (isAlNum(char)) {
      i++;
      while (i < text.length && isAlNum(text[i])) {
        word += text[i];
        i++;
      }
    } else {
      i++;
    }

    while (i < text.length && isPunct(text[i])) {
      word += text[i];
      i++;
    }
    tokens.push(word);
  }

  const pages = [];
  let currentPage = "";

  for (let token of tokens) {
    el.innerHTML = currentPage + token;
    if (el.offsetHeight > maxHeight) {
      if (currentPage === "") {
        pages.push(token);
        currentPage = "";
      } else {
        pages.push(currentPage);
        currentPage = token;
      }
    } else {
      currentPage += token;
    }
  }

  if (currentPage !== "") pages.push(currentPage);

  el.style.height = originalHeight;
  el.innerHTML = "";

  return pages.length > 0 ? pages : [text];
};

const playPage = () => {
  clearInterval(typingTimer);
  isTyping.value = true;
  let i = 0;
  const currentText = textPages.value[currentPageIdx.value] || "";

  typingTimer = setInterval(() => {
    if (i < currentText.length) {
      i++;
      const visiblePart = currentText.substring(0, i);
      const hiddenPart = currentText.substring(i);
      displayedText.value = `<span>${visiblePart}<span style="opacity: 0;">${hiddenPart}</span></span>`;
    } else {
      clearInterval(typingTimer);
      isTyping.value = false;
    }
  }, 30);
};

const startLine = async () => {
  if (!currentLine.value) return;
  clearInterval(typingTimer);
  displayedText.value = "";

  const cleanText = currentLine.value.text.trim();
  textPages.value = await splitTextDynamically(cleanText);
  currentPageIdx.value = 0;
  playPage();
};

watch(
  () => [store.currentLineId, store.hasStarted],
  ([newId, hasStarted]) => {
    if (hasStarted) {
      startLine();
    }
  },
  { immediate: true },
);

const handleContainerClick = () => {
  if (store.isGameOver) return; // 游戏结束，禁止交互

  store.tryPlayBGM();

  if (isTyping.value) {
    clearInterval(typingTimer);
    displayedText.value = `<span>${textPages.value[currentPageIdx.value]}</span>`;
    isTyping.value = false;
    return;
  }

  if (currentPageIdx.value < textPages.value.length - 1) {
    currentPageIdx.value++;
    playPage();
    return;
  }

  if (!showOptions.value && currentLine.value?.nextId !== undefined) {
    store.playClickAudio();
    store.nextLine(currentLine.value.nextId);
  }
};

const selectOption = (opt) => {
  store.playClickAudio();
  store.setGameTimeout(() => store.nextLine(opt.nextId), 150);
};
</script>

<style scoped>
.full-screen-clicker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  cursor: pointer;
  pointer-events: auto;
}

.dialogue-system-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ui-layer {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 15px;
  z-index: 30;
  pointer-events: none;
  box-sizing: border-box;
}

.dialogue-bubble,
.options-container {
  pointer-events: auto;
}

.options-container {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  pointer-events: none;
  transition: 0.3s;
}
.options-container.active {
  opacity: 1;
  pointer-events: auto;
}
.option-button {
  background: white;
  border: 3px solid #f7d76a;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
  color: #5a4634;
  transition:
    background-color 0.15s,
    color 0.15s;
  cursor: pointer;
}
.option-button.clicked {
  background-color: #f7d76a !important;
  color: #ffffff !important;
  border-color: #f7d76a !important;
}

.dialogue-bubble {
  position: relative;
  background-color: rgba(255, 253, 245, 0.98);
  border: 4px solid #a8c989;
  border-radius: 20px;
  padding: 20px 25px 8px 25px;
  cursor: pointer;
  display: block;
  box-shadow: 0 8px 24px rgba(168, 201, 137, 0.15);
}
.name-tag {
  position: absolute;
  top: -18px;
  left: 15px;
  background-color: #f7d76a;
  color: #5a4634;
  padding: 4px 18px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.05rem;
  border: 3px solid #fffdf5;
  z-index: 10;
}
.dialogue-text {
  color: #5a4634 !important;
  font-size: 1.1rem;
  line-height: 1.5;
  height: 3em;
  overflow: hidden;
  margin-top: 0;
  z-index: 5;
}
.next-indicator {
  position: absolute;
  bottom: 12px;
  right: 22px;
  color: #a8c989;
  font-size: 1rem;
  display: none;
  animation: float-bounce 1s infinite;
}
@keyframes float-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}
.dialogue-bubble.thought-style {
  border-color: #cbd5e0;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 16px 25px;
}
.dialogue-bubble.thought-style .name-tag {
  display: none !important;
}
.dialogue-bubble.thought-style .dialogue-text {
  color: #718096 !important;
  font-style: italic;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
