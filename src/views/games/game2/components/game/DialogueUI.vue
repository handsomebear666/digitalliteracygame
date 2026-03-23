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
        @click="handleContainerClick"
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
import { useGameStore } from "@game2/store/useGameStore";
import { GAME_STORY } from "@game2/data/story";

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

// === 核心升级：带智能分词的高度测算 ===
const splitTextDynamically = async (text) => {
  await nextTick();
  const el = textEl.value;
  if (!el) return [text];

  const originalHeight = el.style.height;
  el.style.height = "auto";

  el.innerHTML = "测<br>试";
  const maxHeight = el.offsetHeight + 2;
  el.innerHTML = "";

  // 1. 智能分词：将文本切分成不可分割的“词块”
  const tokens = [];
  let i = 0;
  // 匹配连续的英文字母或数字
  const isAlNum = (c) => /^[a-zA-Z0-9]+$/.test(c);
  // 匹配常见的全半角标点符号（不可做句首）
  const isPunct = (c) =>
    /^[.,!?;:'"()\[\]{}<>\-—…、，。！？；：“”‘’（）《》【】]+$/.test(c);

  while (i < text.length) {
    let char = text[i];
    let word = char;

    if (isAlNum(char)) {
      i++;
      // 如果是数字/英文，向后寻找所有连续的数字/英文打包
      while (i < text.length && isAlNum(text[i])) {
        word += text[i];
        i++;
      }
    } else {
      i++;
    }

    // 不管前面是中文还是英文数字，只要后面紧跟标点符号，就死死黏在一起
    while (i < text.length && isPunct(text[i])) {
      word += text[i];
      i++;
    }
    tokens.push(word);
  }

  // 2. 按“词块”进行高度测算，绝不硬切
  const pages = [];
  let currentPage = "";

  for (let token of tokens) {
    el.innerHTML = currentPage + token;
    if (el.offsetHeight > maxHeight) {
      if (currentPage === "") {
        // 极端防死循环：如果一个超长的词组直接爆页，强行塞入
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
  displayedText.value = "";
  isTyping.value = true;
  let i = 0;
  const currentText = textPages.value[currentPageIdx.value] || "";

  typingTimer = setInterval(() => {
    if (i < currentText.length) {
      displayedText.value += currentText.charAt(i);
      i++;
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
    displayedText.value = textPages.value[currentPageIdx.value];
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
  z-index: 5;
  cursor: pointer;
}
</style>
