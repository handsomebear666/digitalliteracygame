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

        <div class="dialogue-text measure-el" ref="measureEl"></div>

        <div class="dialogue-text">
          <div class="text-inner">
            <span
              v-for="(char, index) in currentText"
              :key="index"
              :style="{
                visibility: index < visibleCount ? 'visible' : 'hidden',
              }"
              >{{ char }}</span
            >
          </div>
        </div>

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
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import { GAME_STORY } from "@/views/games/game2/data/story";

const store = useGameStore();

// 💥 替换为测算专用的 measureEl
const measureEl = ref(null);

const isTyping = ref(false);
const textPages = ref([]);
const currentPageIdx = ref(0);
let typingTimer = null;

// 💥 新增：精确管理当前页的文字字符和可见字数
const currentText = computed(() => textPages.value[currentPageIdx.value] || "");
const visibleCount = ref(0);

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

// === 核心升级：带智能分词的高度测算 ===
const splitTextDynamically = async (text) => {
  await nextTick();
  const el = measureEl.value; // 💥 使用隐藏的测算节点
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
  visibleCount.value = 0; // 💥 重置可见字数
  const textLen = currentText.value.length;

  typingTimer = setInterval(() => {
    if (visibleCount.value < textLen) {
      visibleCount.value++; // 💥 每次单纯增加一个可见字的索引，极速渲染
    } else {
      clearInterval(typingTimer);
      isTyping.value = false;
    }
  }, 30);
};

const startLine = async () => {
  if (!currentLine.value) return;
  clearInterval(typingTimer);
  visibleCount.value = 0;

  textPages.value = await splitTextDynamically(currentLine.value.text);
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
  store.tryPlayBGM();

  if (isTyping.value) {
    clearInterval(typingTimer);
    visibleCount.value = currentText.value.length; // 💥 瞬间全显
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

  /* 💥 核心修复：取消原本的 20px 上边距和 8px 下边距，改为完全对称的上下 16px */
  padding: 16px 25px;

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

/* 💥 更新的对话文字层 */
.dialogue-text {
  color: #5a4634 !important;
  font-size: 1.1rem;
  line-height: 1.5;
  height: 3em; /* 绝对锁死两行高度 */
  overflow: hidden;
  margin-top: 0;
  z-index: 5;

  /* 使用 flex 让内部文字块绝对垂直居中 */
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 💥 测算专用的隐藏层，不影响正式视图 */
.measure-el {
  position: absolute !important;
  visibility: hidden !important;
  z-index: -100;
  width: calc(100% - 50px);
  height: auto !important;
  display: block !important;
}

/* 💥 文字包装层 */
.text-inner {
  width: 100%;
  margin: 0;
  white-space: pre-wrap; /* 允许换行符正常渲染 */
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

/* --- 取消头重脚轻，赋予完全对称的上下内边距 --- */
.dialogue-bubble.thought-style {
  border-color: #cbd5e0;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 16px 25px; /* 上下左右完美对称 */
}
.dialogue-bubble.thought-style .name-tag {
  display: none !important;
}

/* 独白文本居中对齐 */
.dialogue-bubble.thought-style .dialogue-text {
  justify-content: center;
}
.dialogue-bubble.thought-style .text-inner {
  text-align: center;
  color: #718096 !important;
  font-style: italic;
}
</style>
