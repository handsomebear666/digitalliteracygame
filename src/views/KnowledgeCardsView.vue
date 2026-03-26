<template>
  <div class="cards-view-root">
    <div class="header-bar">
      <button class="back-icon-btn" @click="goBack" title="返回主页地图">
        <img
          src="@/assets/back.svg"
          alt="返回"
          style="width: 44px; height: 44px"
        />
      </button>
      <div class="title">{{ gameData?.title }} - 知识图鉴</div>
    </div>

    <div v-if="cards.length === 0" class="empty-state">
      该关卡暂未收录卡片哦~
    </div>

    <div
      v-else
      class="stack-main"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="stack-container">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="knowledge-card"
          :style="getCardStyle(index)"
        >
          <div class="card-inner">
            <div class="card-badge">
              卡片 {{ index + 1 }} / {{ cards.length }}
            </div>
            <h2 class="card-title">{{ card.title }}</h2>
            <div class="card-divider"></div>
            <p class="card-content">{{ card.content }}</p>
          </div>
        </div>
      </div>

      <div class="swipe-hint">
        <span>☝️ 向上滑动 / 👇 向下滑动</span>
      </div>

      <div class="desktop-controls">
        <button class="ctrl-btn" @click="prevCard">🔺 上一张</button>
        <button class="ctrl-btn" @click="nextCard">🔻 下一张</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameProgress } from "@/composables/useGameProgress";

const route = useRoute();
const router = useRouter();
const { games } = useGameProgress();

const gameId = route.params.id;
const gameData = computed(() => games.value.find((g) => g.id === gameId));
const cards = computed(() =>
  gameData.value ? gameData.value.cards || [] : [],
);

const totalCards = computed(() => cards.value.length);
const currentIndex = ref(0);

// 堆叠效果参数
const MAX_TOTAL_OFFSET = 150; // 最远卡片的偏移量（px），控制堆叠总高度
const MIN_OPACITY = 0.3; // 最远卡片的透明度
const MIN_SCALE = 0.6; // 最远卡片的缩放

// 计算步长：使最大偏移量固定，卡片数量多时步长小，数量少时步长大
const step = computed(() => {
  const n = totalCards.value;
  if (n <= 1) return 0;
  const maxDiff = Math.floor(n / 2);
  return MAX_TOTAL_OFFSET / maxDiff;
});

// 计算环形相对差值（返回 [-floor(n/2), floor(n/2)] 之间的整数）
const getRelativeDiff = (cardIdx, currentIdx, total) => {
  if (total === 0) return 0;
  let diff = (cardIdx - currentIdx + total) % total;
  if (diff > total / 2) diff = diff - total;
  return diff;
};

// 卡片样式：所有卡片可见，偏移量由步长和环形距离决定
const getCardStyle = (index) => {
  if (totalCards.value === 0) return { display: "none" };

  const diff = getRelativeDiff(index, currentIndex.value, totalCards.value);
  const absDiff = Math.abs(diff);
  const s = step.value;

  // 偏移量（正数向下，负数向上）
  const translateY = diff * s;
  // 缩放（线性衰减，不低于最小值）
  const scale = Math.max(1 - absDiff * 0.08, MIN_SCALE);
  // 透明度（线性衰减，不低于最小值）
  const opacity = Math.max(1 - absDiff * 0.2, MIN_OPACITY);
  const zIndex = 100 - absDiff;

  return {
    opacity,
    transform: `translateY(${translateY}px) scale(${scale})`,
    zIndex,
    pointerEvents: diff === 0 ? "auto" : "none",
    visibility: "visible",
  };
};

// 触摸滑动
let touchStartY = 0;
const SWIPE_THRESHOLD = 15;

const goBack = () => router.push("/");

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchEndY - touchStartY;
  if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
  if (deltaY < 0) nextCard();
  else prevCard();
};

// 键盘控制
const handleKeyDown = (e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    prevCard();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    nextCard();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// 循环翻页
const prevCard = () => {
  if (totalCards.value === 0) return;
  currentIndex.value =
    (currentIndex.value - 1 + totalCards.value) % totalCards.value;
};
const nextCard = () => {
  if (totalCards.value === 0) return;
  currentIndex.value = (currentIndex.value + 1) % totalCards.value;
};
</script>

<style scoped>
/* 样式完全保留原有内容，未做任何改动 */
.cards-view-root {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.header-bar {
  width: 100%;
  padding: max(15px, env(safe-area-inset-top)) 20px 15px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  z-index: 1000;
}

.back-icon-btn {
  position: relative;
  background: transparent;
  border: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.back-icon-btn::before {
  content: "";
  position: absolute;
  top: -15px;
  bottom: -15px;
  left: -15px;
  right: -15px;
  border-radius: 50%;
}

.back-icon-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.back-icon-btn svg {
  fill: #4db6ac;
  transition: fill 0.2s;
}
.back-icon-btn:hover svg {
  fill: #00897b;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #00695c;
  margin-left: -44px;
}

.stack-main {
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stack-container {
  position: relative;
  width: 90%;
  max-width: 400px;
  height: 60vh;
  min-height: 400px;
  perspective: 1000px;
}

.knowledge-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
  padding: 25px;
}

.card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-badge {
  align-self: flex-end;
  background: #ffecb3;
  color: #f57f17;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
}
.card-title {
  color: #333;
  font-size: 24px;
  margin: 20px 0 15px 0;
}
.card-divider {
  width: 40px;
  height: 4px;
  background: #4db6ac;
  border-radius: 2px;
  margin-bottom: 25px;
}
.card-content {
  color: #555;
  font-size: 16px;
  line-height: 1.8;
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  margin-top: 100px;
  color: #888;
  font-size: 16px;
}

.swipe-hint {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: #00796b;
  font-size: 13px;
  font-weight: bold;
  opacity: 0.6;
  pointer-events: none;
}
.desktop-controls {
  display: none;
}

@media (min-width: 768px) {
  .swipe-hint {
    display: none;
  }
  .desktop-controls {
    display: flex;
    gap: 20px;
    margin-top: 40px;
    z-index: 100;
  }
  .ctrl-btn {
    background: #00796b;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 121, 107, 0.3);
    transition: all 0.2s;
  }
  .ctrl-btn:disabled {
    background: #b0bec5;
    box-shadow: none;
    cursor: not-allowed;
  }
  .ctrl-btn:not(:disabled):hover {
    background: #00695c;
    transform: translateY(-2px);
  }
  .desktop-controls::after {
    content: "💡 提示：也可以使用键盘 ↑ ↓ 方向键翻页";
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #00796b;
    font-size: 12px;
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
