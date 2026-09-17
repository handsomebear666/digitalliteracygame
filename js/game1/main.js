// game1 入口：渲染界面、绑定事件、驱动游戏流程
// 对应原 src/views/games/game1/game1.vue + 各组件
// 依赖 js/game1/store.js、js/game1/story.js、js/game1/questions.js、
// js/game1/assets.js、js/game1/story-handler.js、js/progress.js（均先于本文件加载）

const monsterImg = ASSETS.IMAGES.monster;
const meImg = ASSETS.AVATARS.me;

let currentInspectImage = "";
let drawerConfig = { title: "", options: [] };

const HOTSPOTS = {
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

// ----- 供剧情 v-html 内联 onclick 调用 -----
window.openTaobao = () => handleLinkClick("taobao");
window.openFaceTime = () => handleLinkClick("facetime");

const app = document.getElementById("game1-app");

// ============================================================
// 骨架渲染
// ============================================================
function renderApp() {
  app.innerHTML = `
    <div class="game1-fullscreen-wrapper">
      <div class="game1-app-container">
        <div id="loading-overlay" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">正在拼命加载资源...</div>
    </div>

    <div id="result-overlay" style="display:none"></div>

    <div id="wechat-header" class="wechat-header">
      <div class="back-btn" data-action="back"><img src="${ASSETS.ICONS.back}" class="icon-img" alt="" /></div>
      <div id="groupName">${store.state.groupName}</div>
      <div class="more-btn"><img src="${ASSETS.ICONS.more}" class="icon-img" alt="" /></div>
    </div>

    <div id="chat-container" class="chat-container"></div>

    <div id="drawer-overlay" class="drawer-overlay"></div>
    <div id="game-action-area" class="game-action-area" style="display:none">
      <div class="options-panel">
        <div class="question-title" id="question-title"></div>
        <div id="options-list"></div>
      </div>
    </div>

    <div id="wechat-bottom" class="wechat-bottom">
      <img src="${ASSETS.ICONS.voice_icon}" class="bottom-icon" alt="" />
      <div class="input-wrapper">
        <input type="text" class="input-box" disabled placeholder=" " />
      </div>
      <img src="${ASSETS.ICONS.emoji_icon}" class="bottom-icon" alt="" />
      <img src="${ASSETS.ICONS.plus_icon}" class="bottom-icon" alt="" />
    </div>

    <div id="systemToast" class="system-hint-toast"><span id="toast-text"></span></div>

    <div id="inspector-overlay" class="inspector-overlay" style="display:none">
      <div class="inspector-close" data-action="inspector-close">返回聊天</div>
      <div class="inspector-img-box">
        <img id="inspector-img" src="" alt="" />
        <div id="hotspot-wrap"></div>
      </div>
    </div>

    <div id="taobao-overlay" class="taobao-overlay" style="display:none">
      <div class="taobao-header">
        <div class="taobao-close" data-action="taobao-close">✕ 关闭</div>
        <div class="fake-url" data-action="reveal-taobao" data-key="url">
          🔒 www.taoobaoo-vip-free.xyz
        </div>
        <div style="width: 40px"></div>
      </div>
      <div class="taobao-content">
        <img src="${ASSETS.OTHERS.yurongfu}" style="width: 100%; display: block" alt="" />
        <div class="countdown-box" data-action="reveal-taobao" data-key="countdown">
          🔥 距离活动结束仅剩：<span style="color: #ffeb3b; font-weight: bold; font-size: 18px">02:14</span><br />
          <span style="font-size: 12px; opacity: 0.9">已有 98,241 人成功领取</span>
        </div>
        <div class="fake-form">
          <div style="font-weight: bold; margin-bottom: 10px; color: #333">
            邮寄信息 (仅需支付 19.9 元邮费)
          </div>
          <input type="text" class="form-input" placeholder="收件人姓名" disabled />
          <div class="danger-input-wrapper" data-action="reveal-taobao" data-key="password">
            <input
              type="password"
              class="form-input danger-input"
              placeholder="请输入银行卡取款密码以验证身份"
              disabled
            />
          </div>
          <button class="fake-submit-btn">立即支付邮费并领取</button>
        </div>
      </div>
    </div>

    <div id="facetime-overlay" class="facetime-overlay" style="display:none">
      <div class="facetime-header" data-action="reveal-facetime" data-key="channel">
        <span style="color: #28c445">📞 腾腾会议 视频通话</span>
        <div class="facetime-close" data-action="facetime-close">结束</div>
      </div>
      <div class="facetime-content">
        <div class="video-placeholder">
          <img
            src="${ASSETS.OTHERS.kefu}"
            style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7"
            alt=""
          />
          <div class="agent-badge">工号：9527 (微信支付安全中心)</div>
        </div>
        <div class="meeting-chat">
          <div class="chat-msg system">系统提示：通话已加密</div>
          <div class="chat-msg agent" data-action="reveal-facetime" data-key="transfer">
            <span style="color: #007aff; font-weight: bold">客服代表：</span><br />
            为验证本人操作并拦截扣款，请将名下所有资金暂时转入指定的【银联安全保护账户】进行验资，完成后原路退回。
          </div>
          <div class="screen-share-alert" data-action="reveal-facetime" data-key="screenshare">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333">
              屏幕共享请求
            </div>
            <div style="font-size: 13px; color: #666; margin-bottom: 15px">
              “微信支付客服”请求与您共享屏幕，以便指导您取消“百万保障”服务。
            </div>
            <button class="accept-btn">同意共享</button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  `;
}

// ============================================================
// 消息渲染
// ============================================================
function messageHtml(msg) {
  if (msg.type === "time" || msg.type === "sys") {
    return `<div class="sys-msg ${msg.extraClass || ""}"><span>${msg.text}</span></div>`;
  }

  const avatar = msg.avatar || meImg;
  const content =
    msg.type === "image"
      ? `<img src="${msg.image}" class="msg-image" data-image-src="${msg.image}" alt="" />`
      : `<span>${msg.text}</span>`;

  if (!msg.isMe) {
    return `
      <div class="msg-row msg-left ${msg.extraClass || ""}">
        <div class="avatar"><img src="${avatar}" alt="" /></div>
        <div class="msg-wrapper">
          <div class="msg-name">${msg.sender}</div>
          <div class="msg-content ${msg.type === "image" ? "no-tail" : ""}">${content}</div>
        </div>
      </div>`;
  }

  return `
    <div class="msg-row msg-right ${msg.extraClass || ""}">
      <div class="msg-content ${msg.type === "image" ? "no-tail" : ""}">${content}</div>
      <div class="avatar"><img src="${avatar}" alt="" /></div>
    </div>`;
}

let lastMsgSig = null;

function renderMessages() {
  const chat = document.getElementById("chat-container");
  if (!chat) return;
  const visible = store.state.messages.filter((m) => !m.hidden);
  const sig = visible.map((m) => `${m.id}:${m.hidden}:${m.extraClass || ""}`).join("|");
  if (sig === lastMsgSig) return;
  lastMsgSig = sig;
  chat.innerHTML = visible.map(messageHtml).join("");
  chat.scrollTop = chat.scrollHeight;
}

// ============================================================
// 界面同步
// ============================================================
function updateLoading() {
  const el = document.getElementById("loading-overlay");
  if (el) el.style.display = store.state.activeOverlay === "loading" ? "" : "none";
}

function updateHeaderChatBottom() {
  const show = store.state.activeOverlay !== "loading";
  ["wechat-header", "chat-container", "wechat-bottom"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? "" : "none";
  });
  const gn = document.getElementById("groupName");
  if (gn) gn.textContent = store.state.groupName;
}

function updateToast() {
  const toast = document.getElementById("systemToast");
  const text = document.getElementById("toast-text");
  if (toast) toast.classList.toggle("show", store.state.showToast);
  if (text) text.textContent = store.state.toastText;
}

function updateDrawer() {
  const overlay = document.getElementById("drawer-overlay");
  const area = document.getElementById("game-action-area");
  if (overlay) overlay.classList.toggle("show", store.state.showDrawer);
  if (!area) return;
  area.style.display = store.state.showDrawer ? "" : "none";
  if (store.state.showDrawer) {
    document.getElementById("question-title").textContent = drawerConfig.title;
    document.getElementById("options-list").innerHTML = drawerConfig.options
      .map(
        (opt, index) => `
        <button
          class="action-btn ${index === 0 ? "outline" : "solid"}"
          data-action="choice"
          data-value="${opt.value}"
        >${opt.label}</button>`,
      )
      .join("");
  }
}

function updateResult() {
  const el = document.getElementById("result-overlay");
  if (!el) return;
  const visible = store.state.activeOverlay === "result";
  el.style.display = visible ? "" : "none";
  if (!visible) return;

  const r = store.state.resultData;
  if (r.type === "fail") {
    el.innerHTML = `
      <div class="result-popup-overlay">
        <div class="result-popup-card">
          <div class="popup-inner">
            <div class="fail-header">
              <div class="fail-icon">⚠️</div>
              <h2>${r.title}</h2>
            </div>
            <div class="popup-divider-fail"></div>
            <div class="fail-text">${r.text}</div>
            <div class="controls-group">
              <button class="ctrl-btn retry-fail-btn" data-action="replay">🔄 重新选择</button>
              <button class="ctrl-btn home-fail-btn" data-action="home">⬅ 返回主页地图</button>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    el.innerHTML = `
      <div class="result-popup-overlay">
        <div class="result-popup-card">
          <div class="popup-inner">
            <div class="success-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
              </svg>
              <h2>🎉成功通关！🎉</h2>
            </div>
            <div class="popup-divider"></div>
            <div class="controls-group">
              <button class="ctrl-btn card-btn" data-action="cards">🎴 查看知识卡片</button>
              <button class="ctrl-btn retry-btn" data-action="home">⬅ 返回主页地图</button>
            </div>
          </div>
        </div>
      </div>`;
  }
}

function updateInspector() {
  const el = document.getElementById("inspector-overlay");
  if (!el) return;
  const visible = store.state.activeOverlay === "inspector";
  el.style.display = visible ? "" : "none";
  if (!visible) return;

  document.getElementById("inspector-img").src = currentInspectImage;

  const showHotspots = currentInspectImage === monsterImg;
  const wrap = document.getElementById("hotspot-wrap");
  if (showHotspots) {
    const f = store.state.flaws.inspector;
    wrap.innerHTML = Object.entries(HOTSPOTS)
      .map(
        ([key, hotspot]) => `
        <div
          class="flaw-hotspot ${f[key] ? "revealed" : ""}"
          data-action="reveal-inspector"
          data-key="${key}"
          style="${hotspot.style}"
        ></div>`,
      )
      .join("");
  } else {
    wrap.innerHTML = "";
  }
}

function updateTaobao() {
  const el = document.getElementById("taobao-overlay");
  if (!el) return;
  const visible = store.state.activeOverlay === "taobao";
  el.style.display = visible ? "" : "none";
  if (!visible) return;
  const f = store.state.flaws.taobao;
  ["url", "countdown", "password"].forEach((key) => {
    el.querySelectorAll(`[data-key="${key}"]`).forEach((node) => {
      node.classList.toggle("taobao-flaw-revealed", f[key]);
    });
  });
}

function updateFacetime() {
  const el = document.getElementById("facetime-overlay");
  if (!el) return;
  const visible = store.state.activeOverlay === "facetime";
  el.style.display = visible ? "" : "none";
  if (!visible) return;
  const f = store.state.flaws.facetime;
  ["channel", "transfer", "screenshare"].forEach((key) => {
    el.querySelectorAll(`[data-key="${key}"]`).forEach((node) => {
      node.classList.toggle("ft-flaw-revealed", f[key]);
    });
  });
}

// 对应 Vue 中三个小游戏组件对 messages 的 watch：消息被撤回时自动关闭
function checkAutoClose() {
  if (store.state.activeOverlay === "inspector") {
    const hidden = store.state.messages.some(
      (msg) =>
        msg.type === "image" && msg.image === currentInspectImage && msg.hidden,
    );
    if (hidden) store.state.activeOverlay = "none";
  } else if (store.state.activeOverlay === "taobao") {
    const hidden = store.state.messages.some(
      (msg) =>
        msg.text &&
        msg.text.includes("www.taoobaoo-vip-free.xyz") &&
        msg.hidden,
    );
    if (hidden) store.state.activeOverlay = "none";
  } else if (store.state.activeOverlay === "facetime") {
    const hidden = store.state.messages.some(
      (msg) => msg.text && msg.text.includes("视频会议") && msg.hidden,
    );
    if (hidden) store.state.activeOverlay = "none";
  }
}

function syncUI() {
  checkAutoClose();
  updateLoading();
  updateHeaderChatBottom();
  renderMessages();
  updateDrawer();
  updateResult();
  updateToast();
  updateInspector();
  updateTaobao();
  updateFacetime();
}

// ============================================================
// 交互逻辑
// ============================================================
function startGame() {
  store.resetGame();
  store.playSound("click");
  store.playSound("bgm");
  store.state.activeOverlay = "none";
  store.state.currentLevel = 1;
  store.pushMessage({ type: "time", text: "刚刚" });

  const script = [...GAME_STORY.openingimage, ...GAME_STORY.openingtext];
  store.playScript(script, () => {
    store.triggerHint("点击二大爷发的图片，放大看看吧~", 2000);
    store.state.flaws.inspector.isOpen = true;
  });
}

function handleImageClick(src) {
  currentInspectImage = src;
  store.state.activeOverlay = "inspector";

  const f = store.state.flaws.inspector;
  if (f.isOpen && !(f.mountain && f.billboard && f.ai)) {
    store.setGameTimeout(() => {
      store.triggerHint("⚠️ 这张图片怎么怪怪的？请找出3个不合理的地方！", 2000);
    }, 300);
  }
  store.notify();
}

function handleLinkClick(type) {
  store.playSound("click");
  if (type === "taobao") {
    store.state.activeOverlay = "taobao";
    const f = store.state.flaws.taobao;
    if (f.isOpen && !(f.url && f.countdown && f.password)) {
      store.setGameTimeout(() => {
        store.triggerHint("⚠️ 检测到高风险链接！请在网页中找出 3 处诈骗破绽。", 2000);
      }, 300);
    }
  } else if (type === "facetime") {
    store.state.activeOverlay = "facetime";
    const f = store.state.flaws.facetime;
    if (f.isOpen && !(f.channel && f.transfer && f.screenshare)) {
      store.setGameTimeout(() => {
        store.triggerHint("⚠️ 完美伪装的高级定制诈骗：请找出3个逻辑破绽！", 2000);
      }, 300);
    }
  }
  store.notify();
}

function handleLevelCompleted(level) {
  const levelData = LEVEL_QUESTIONS[level];
  if (!levelData) return;

  store.triggerHint(levelData.hint, 1500);
  store.setGameTimeout(() => {
    drawerConfig = { title: levelData.drawerTitle, options: levelData.options };
    store.state.showDrawer = true;
    store.notify();
  }, 1500);
}

function handleResultAction(action) {
  store.playSound("click");

  if (store.state.resultData.type !== "fail") {
    completeLevel(0);
  }

  if (action === "replay") {
    if (store.state.resultData.type === "fail") {
      store.clearAllTimers();
      store.state.messages = store.state.messages.filter(
        (m) => !m.extraClass || !m.extraClass.includes("bad-msg"),
      );
      store.state.activeOverlay = "none";
      store.state.showDrawer = true;
      store.state.groupName = "相亲相爱一家人 (27)";
      store.notify();
    } else {
      sessionStorage.setItem("fromHome", "true");
      location.reload();
    }
  } else if (action === "home") {
    goHome();
  } else if (action === "cards") {
    leaveGame();
    store.state.activeOverlay = "none";
    window.location.href = "cards.html?game=game1";
  }
}

// 离开本局游戏：停掉正在播放的剧情定时器与背景音乐
function leaveGame() {
  store.clearAllTimers();
  store.stopAllAudio();
}

// 返回主页地图（左上角返回键 / 结算弹窗的返回按钮共用）
function goHome() {
  leaveGame();
  window.location.href = "index.html";
}

function revealInspector(key) {
  const f = store.state.flaws.inspector;
  if (!f.isOpen || f[key]) return;
  store.playSound("click");
  f[key] = true;
  store.triggerHint(HOTSPOTS[key].hint, 1500);

  const foundCount = ["mountain", "billboard", "ai"].filter((k) => f[k]).length;
  if (foundCount === 3) {
    store.setGameTimeout(() => {
      store.state.activeOverlay = "none";
      handleLevelCompleted(1);
    }, 2500);
  }
  store.notify();
}

function revealTaobao(key) {
  const f = store.state.flaws.taobao;
  if (!f.isOpen || f[key]) return;
  store.playSound("click");
  f[key] = true;

  const hints = {
    url: "✅ 找到破绽：正规官方网站绝不会包含 free、xyz 等奇怪后缀！",
    countdown: "✅ 找到破绽：利用虚假倒计时制造焦虑，逼迫受害者失去理智。",
    password: "✅ 找到破绽：正规平台绝不会在网页直接索要银行卡密码！",
  };
  store.triggerHint(hints[key], 1500);

  const foundCount = ["url", "countdown", "password"].filter((k) => f[k]).length;
  if (foundCount === 3) {
    store.setGameTimeout(() => {
      store.state.activeOverlay = "none";
      handleLevelCompleted(2);
    }, 2500);
  }
  store.notify();
}

function revealFacetime(key) {
  const f = store.state.flaws.facetime;
  if (!f.isOpen || f[key]) return;
  store.playSound("click");
  f[key] = true;

  const hints = {
    channel: "✅ 找到破绽：官方客服绝不会使用外部会议软件或视频电话联系你！",
    transfer: "✅ 找到破绽：官方没有所谓的安全账户，要求转账验资100%是诈骗！",
    screenshare: "✅ 找到破绽：一旦开启屏幕共享，你的密码和验证码将对骗子完全透明！",
  };
  store.triggerHint(hints[key], 1500);

  const foundCount = ["channel", "transfer", "screenshare"].filter((k) => f[k]).length;
  if (foundCount === 3) {
    store.setGameTimeout(() => {
      store.state.activeOverlay = "none";
      handleLevelCompleted(3);
    }, 2500);
  }
  store.notify();
}

function closeFacetime() {
  store.playSound("click");
  store.state.activeOverlay = "none";
  store.notify();
  // 原 Vue 中“结束”按钮位于带 reveal 事件的 header 内部，
  // 点击后会冒泡触发 header 的 reveal('channel')，这里保持一致
  revealFacetime("channel");
}

// ============================================================
// 事件代理
// ============================================================
app.addEventListener("click", (e) => {
  // 图片点击 → 放大查看
  const img = e.target.closest(".msg-image");
  if (img) {
    handleImageClick(img.dataset.imageSrc || img.src);
    return;
  }

  const actionable = e.target.closest("[data-action]");
  if (!actionable) return;

  const action = actionable.dataset.action;

  if (action === "back") {
    goHome();
  } else if (action === "inspector-close") {
    store.state.activeOverlay = "none";
    store.notify();
  } else if (action === "taobao-close") {
    store.playSound("click");
    store.state.activeOverlay = "none";
    store.notify();
  } else if (action === "facetime-close") {
    closeFacetime();
  } else if (action === "reveal-inspector") {
    revealInspector(actionable.dataset.key);
  } else if (action === "reveal-taobao") {
    revealTaobao(actionable.dataset.key);
  } else if (action === "reveal-facetime") {
    revealFacetime(actionable.dataset.key);
  } else if (action === "choice") {
    store.playSound("click");
    store.state.showDrawer = false;
    store.notify();
    handleChoice(actionable.dataset.value);
  } else if (action === "replay" || action === "home" || action === "cards") {
    handleResultAction(action);
  }
});

// ============================================================
// 启动
// ============================================================
renderApp();
store.subscribe(syncUI);
syncUI();

const fromHome = sessionStorage.getItem("fromHome");
if (!fromHome) {
  window.location.href = "index.html";
} else {
  sessionStorage.removeItem("fromHome");
  startGame();
}
