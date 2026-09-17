// 知识图鉴（卡片）页：卡片堆叠翻页效果
// 对应原 src/views/KnowledgeCardsView.vue
// 依赖 js/progress.js（经典脚本全局作用域，先于本文件加载）
const backImg = "assets/common/back.svg";

// 堆叠效果参数
const MAX_TOTAL_OFFSET = 50;
const MIN_SCALE = 0.7;
const MIN_OPACITY = 0.3;

const SWIPE_THRESHOLD = 15;

let cards = [];
let totalCards = 0;
let currentIndex = 0;
let gameData = null;

function step() {
  const n = totalCards;
  if (n <= 1) return 0;
  return MAX_TOTAL_OFFSET / (n - 1);
}

function getDepth(index) {
  if (totalCards === 0) return 0;
  return (index - currentIndex + totalCards) % totalCards;
}

function getCardStyle(index) {
  if (totalCards === 0) return "display:none;";

  const depth = getDepth(index);
  const s = step();

  if (depth === 0) {
    return "opacity:1; transform:translateY(0px) scale(1); z-index:100; pointer-events:auto; visibility:visible;";
  }

  const translateY = Math.min(depth * s, MAX_TOTAL_OFFSET);
  const scale = Math.max(1 - depth * 0.05, MIN_SCALE);
  const opacity = Math.max(1 - depth * 0.12, MIN_OPACITY);
  const zIndex = 100 - depth;

  return `opacity:${opacity}; transform:translateY(${translateY}px) scale(${scale}); z-index:${zIndex}; pointer-events:none; visibility:visible;`;
}

function prevCard() {
  if (totalCards === 0) return;
  currentIndex = (currentIndex - 1 + totalCards) % totalCards;
  applyStyles();
}

function nextCard() {
  if (totalCards === 0) return;
  currentIndex = (currentIndex + 1) % totalCards;
  applyStyles();
}

function applyStyles() {
  document.querySelectorAll(".knowledge-card").forEach((el, index) => {
    el.style.cssText = getCardStyle(index);
  });
}

let touchStartY = 0;

function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchEndY - touchStartY;
  if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
  if (deltaY < 0) nextCard();
  else prevCard();
}

function handleKeyDown(e) {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    prevCard();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    nextCard();
  }
}

function renderCards() {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("game");

  const games = getGames();
  gameData = games.find((g) => g.id === gameId);
  cards = gameData ? gameData.cards || [] : [];
  totalCards = cards.length;
  currentIndex = 0;

  const title = gameData ? `${gameData.title} - 知识图鉴` : "知识图鉴";

  const bodyHtml = `
    <div class="cards-view-root">
      <div class="header-bar">
        <button class="back-icon-btn" id="back-btn" title="返回主页地图">
          <img src="${backImg}" alt="返回" style="width: 44px; height: 44px" />
        </button>
        <div class="title">${title}</div>
      </div>
      ${
        totalCards === 0
          ? `<div class="empty-state">该关卡暂未收录卡片哦~</div>`
          : `
        <div class="stack-main" id="stack-main">
          <div class="stack-container">
            ${cards
              .map(
                (card, index) => `
              <div class="knowledge-card" style="${getCardStyle(index)}">
                <div class="card-inner">
                  <div class="card-badge">卡片 ${index + 1} / ${totalCards}</div>
                  <h2 class="card-title">${card.title}</h2>
                  <div class="card-divider"></div>
                  <p class="card-content">${card.content}</p>
                </div>
              </div>`,
              )
              .join("")}
          </div>
          <div class="swipe-hint">
            <span>☝️ 向上滑动 / 👇 向下滑动</span>
          </div>
          <div class="desktop-controls">
            <button class="ctrl-btn" id="prev-btn">🔺 上一张</button>
            <button class="ctrl-btn" id="next-btn">🔻 下一张</button>
          </div>
        </div>`
      }
    </div>
  `;

  document.querySelector("#app").innerHTML = bodyHtml;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const stackMain = document.getElementById("stack-main");
  if (stackMain) {
    stackMain.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    stackMain.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.getElementById("prev-btn").addEventListener("click", prevCard);
    document.getElementById("next-btn").addEventListener("click", nextCard);
  }

  window.addEventListener("keydown", handleKeyDown);
}
