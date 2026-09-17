// 主页：渲染页头 + 岛屿地图，并处理开始游戏 / 查看卡片的跳转
// 对应原 src/views/HomeView.vue + TheHeader.vue + MapDecoration.vue + IslandNode.vue
// 依赖 js/progress.js（经典脚本全局作用域，先于本文件加载）
const titleImg = "assets/common/game_title.png";

function renderHeader() {
  return `
    <header>
      <div class="logo-title">
        <img src="${titleImg}" alt="真相放大镜" class="title-img" />
      </div>
      <div class="slogan-card">
        <p>在这个信息爆炸的数字时代，</p>
        <p>让我们用真相放大镜</p>
        <p><strong>看清网络世界的每一个角落。</strong></p>
      </div>
    </header>
  `;
}

function renderMapDecoration() {
  return `
    <div class="map-decoration">
      <div class="roadmap-path"></div>
      <div class="bubble-group">
        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
        <div class="bubble bubble-4"></div>
      </div>
    </div>
  `;
}

function renderIslandNode(game, index) {
  const tagsHtml =
    !game.comingSoon &&
    game.status !== "locked" &&
    game.tags &&
    game.tags.length > 0
      ? `
        <div class="tag-group">
          ${game.tags
            .map(
              (tag, tagIndex) =>
                `<span class="tag tag-color-${(tagIndex % 4) + 1}">${tag}</span>`,
            )
            .join("")}
        </div>`
      : "";

  const iconHtml = game.iconImg
    ? `<div class="island-icon-img"><img src="${game.iconImg}" alt="icon" /></div>`
    : `<div class="island-icon">${game.icon}</div>`;

  const titleHtml = game.titleImg
    ? `<div class="island-title-img"><img src="${game.titleImg}" alt="title" /></div>`
    : `<h3>${game.title}</h3>`;

  // 元信息：时长、难度（星级）各占一行
  const metaItems = [];
  if (!game.comingSoon) {
    if (game.time) metaItems.push(`<p class="meta">⏱️ ${game.time}</p>`);
    if (game.level) {
      const stars = `<span class="meta-stars">${"⭐".repeat(game.level)}</span>`;
      metaItems.push(
        `<p class="meta meta-level"><span class="meta-label">难度</span>${stars}</p>`,
      );
    }
  }
  const metaHtml =
    metaItems.length > 0 ? `<div class="meta-row">${metaItems.join("")}</div>` : "";

  let buttonHtml;
  if (game.comingSoon) {
    buttonHtml = `
      <div class="button-group single-btn">
        <button class="start-btn locked-only-btn" disabled>尚未解锁</button>
      </div>`;
  } else {
    const buttonText =
      game.status === "locked"
        ? "尚未解锁"
        : game.status === "completed"
          ? "再次挑战"
          : "进入调查";
    buttonHtml = `
      <div class="button-group">
        <button
          class="start-btn"
          data-action="start"
          data-index="${index}"
          ${game.status === "locked" ? "disabled" : ""}
        >${buttonText}</button>
        <button
          class="card-btn"
          data-action="cards"
          data-index="${index}"
          ${game.status === "locked" || !game.cards.length ? "disabled" : ""}
        >🎴 卡片知识</button>
      </div>`;
  }

  return `
    <div class="island-node ${game.status}" data-index="${index}">
      <div class="island-card">
        <div class="island-number">${index + 1}</div>
        ${iconHtml}
        ${titleHtml}
        ${metaHtml}
        ${tagsHtml}
        <p class="desc">${game.desc}</p>
        ${buttonHtml}
      </div>
    </div>
  `;
}

function renderHome() {
  const games = getGames();

  document.querySelector("#app").innerHTML = `
    <div class="app-wrapper">
      ${renderHeader()}
      <div class="map-container">
        ${renderMapDecoration()}
        ${games.map((game, index) => renderIslandNode(game, index)).join("")}
      </div>
    </div>
  `;

  // 事件代理：开始游戏 / 查看卡片
  document.querySelector("#app").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const index = Number(btn.dataset.index);
    const game = games[index];
    if (!game) return;

    const action = btn.dataset.action;
    if (action === "start") {
      if (game.status === "active" || game.status === "completed") {
        sessionStorage.setItem("fromHome", "true");
        window.location.href = game.id === "game2" ? "game2.html" : "game1.html";
      }
    } else if (action === "cards") {
      if (game.status !== "locked") {
        window.location.href = `cards.html?game=${game.id}`;
      }
    }
  });
}
