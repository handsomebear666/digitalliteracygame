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

      <!-- 电脑端按钮，支持循环 -->
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
const STEP = 25; // 每张卡片之间的垂直偏移量（固定厚度）
const MAX_VISIBLE = 3; // 前后最多显示 3 张（当前 + 前后各 3，共最多 7 张）
const OPACITY_FACTOR = 0.2; // 每远离一层，透明度减少 0.2
const SCALE_FACTOR = 0.05; // 每远离一层，缩放减少 0.05

let touchStartY = 0;
const SWIPE_THRESHOLD = 15;

const goBack = () => router.push("/");

// 触摸滑动
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

// 计算环形相对差值（使 diff 在 [-floor(total/2), floor(total/2)] 之间）
const getRelativeDiff = (cardIdx, currentIdx, total) => {
  if (total === 0) return 0;
  let diff = (cardIdx - currentIdx + total) % total;
  if (diff > total / 2) diff = diff - total;
  return diff;
};

// 卡片样式：根据环形相对位置计算偏移、缩放、透明度
const getCardStyle = (index) => {
  if (totalCards.value === 0) return { display: "none" };

  const diff = getRelativeDiff(index, currentIndex.value, totalCards.value);
  const absDiff = Math.abs(diff);

  if (absDiff > MAX_VISIBLE) {
    return {
      opacity: 0,
      transform: `translateY(${diff * STEP}px) scale(${1 - absDiff * SCALE_FACTOR})`,
      zIndex: 0,
      pointerEvents: "none",
      visibility: "hidden",
    };
  }

  const translateY = diff * STEP;
  const scale = 1 - absDiff * SCALE_FACTOR;
  const opacity = 1 - absDiff * OPACITY_FACTOR;
  const zIndex = 100 - absDiff;

  return {
    opacity,
    transform: `translateY(${translateY}px) scale(${scale})`,
    zIndex,
    pointerEvents: diff === 0 ? "auto" : "none",
    visibility: "visible",
  };
};
</script>

<style scoped>
/* 全局容器保持不变 */
.cards-view-root {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* 导航栏样式保持不变 */
/* 💥 优化 1：防止刘海屏或状态栏遮挡按钮 */
.header-bar {
  width: 100%;
  /* 使用 env(safe-area) 自动适配刘海屏，如果没刘海则默认 15px */
  padding: max(15px, env(safe-area-inset-top)) 20px 15px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  z-index: 1000;
}

/* 💥 优化 2：固定按钮大小，并为扩大热区做准备 */
.back-icon-btn {
  position: relative; /* 关键：为下方的 ::before 扩大热区做定位参照 */
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 121, 107, 0.3);
  width: 44px; /* 明确宽度，达到苹果推荐的最小触摸尺寸 */
  height: 44px; /* 明确高度 */
  padding: 0; /* 清除之前的 padding */
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

/* 💥 优化 3：核心魔法！向外扩张 15px 的隐形点击热区 */
.back-icon-btn::before {
  content: "";
  position: absolute;
  top: -15px;
  bottom: -15px;
  left: -15px;
  right: -15px;
  border-radius: 50%;
  /* background: rgba(255, 0, 0, 0.2); 你可以临时取消这行注释，看看实际的点击区域有多大！ */
}

/* 悬停与颜色过渡保持不变 */
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

/* 标题居中补丁（因为按钮变成了固定的44px，所以这里补偿44px即可居中） */
.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #00695c;
  margin-left: -44px;
}

/* 卡片主滑动区域 */
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

/* 手机端默认样式 */
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
  display: none; /* 手机端默认隐藏按钮 */
}

/* 💥 响应式适配：如果是电脑宽屏（大于768px），则显示按钮，隐藏手势提示 */
@media (min-width: 768px) {
  .swipe-hint {
    display: none; /* 电脑上隐藏“向上滑动”的文字提示 */
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
  /* 按钮永远启用，移除禁用样式 */
  .ctrl-btn:disabled {
    background: #00796b;
    cursor: pointer;
    opacity: 0.9;
  }
  .ctrl-btn:not(:disabled):hover {
    background: #00695c;
    transform: translateY(-2px);
  }
  .ctrl-btn:disabled:hover {
    background: #00695c;
    transform: translateY(-2px);
  }

  /* 在按钮下方追加一行键盘快捷键提示 */
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
