// game2《真假张阿姨》游戏控制器
// 对应原 src/views/games/game2/game2.vue + DialogueUI.vue + HintButton.vue
// 负责：渲染游戏骨架、订阅 store 状态同步 UI、对话打字/分页、事件委托、结果弹窗
// 依赖 js/game2/store.js、js/game2/story.js、js/game2/assets.js、
// js/game2/components.js、js/game2/phone-pages.js、js/progress.js（均先于本文件加载）

const app = document.getElementById("game2-app");
if (!app) throw new Error("game2-app 容器不存在");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---- 本地 UI 状态（对应各组件内部的 ref/reactive） ----
const settings = createGroupSettings();
let smsExpanded = false;
let showResultPopup = false;
let resultData = null;

// 对话打字/分页状态（原 DialogueUI.vue 的本地状态）
let dialogueTypingTimer = null;
let displayedText = "";
let isTyping = false;
let textPages = [];
let currentPageIdx = 0;

// 追踪状态，用于在状态变化时做一次性动作
let lastLineId = null;
let lastGameResult = null;
let lastPhoneRenderKey = null;

const currentLine = () =>
  GAME_STORY.scriptLines.find((l) => l.id === store.state.currentLineId);
const isThought = () =>
  !currentLine()?.name || currentLine().name === "系统";
const showOptions = () =>
  !isTyping &&
  currentPageIdx === textPages.length - 1 &&
  !!currentLine()?.options;

// ==================================================================
// 1. 渲染骨架
// ==================================================================
function renderSkeleton() {
  app.innerHTML = `
    <div class="game2-fullscreen-wrapper">
      <div class="game-container" id="game-container">
        <div class="character-col" id="character-col">
          <div class="character-layer" id="character-layer"></div>
          <div id="phone-btn"></div>
        </div>
        <div class="dialogue-col" id="dialogue-col">
          <div class="dialogue-system-wrapper" id="dialogue-wrap"></div>
        </div>
        <div id="hint-btn-wrap"></div>
        <div id="sms-popup"></div>
        <div class="wechat-system-wrapper" id="wechat-system" style="display:none"></div>
        <div id="action-sheet"></div>
        <div id="result-popup"></div>
        ${toastHtml()}
      </div>
    </div>
  `;

  document.getElementById("character-layer").innerHTML = characterHtml("", "");
  document.getElementById("phone-btn").innerHTML = phoneIconHtml(false);
  document.getElementById("dialogue-wrap").innerHTML = dialogueHtml();
  document.getElementById("hint-btn-wrap").innerHTML = hintButtonHtml();
}

// ==================================================================
// 2. 对话逻辑（DialogueUI.vue）
// ==================================================================
function renderDialogueText() {
  const el = document.getElementById("dialogue-text");
  if (el) el.innerHTML = displayedText;
}

function splitTextDynamically(text) {
  const el = document.getElementById("dialogue-text");
  if (!el) return [text];

  const originalHeight = el.style.height;
  el.style.height = "auto";
  el.innerHTML = "测<br>试";
  const maxHeight = el.offsetHeight + 2;
  el.innerHTML = "";

  // 按“字母数字词 + 标点后缀”分词，避免英文单词被拆散
  const tokens = [];
  const isAlNum = (c) => /^[a-zA-Z0-9]+$/.test(c);
  const isPunct = (c) => /^[.,!?;:'"()\[\]{}<>+\-—…、，。！？；：“”‘’（）《》【】]+$/.test(c);
  let i = 0;
  while (i < text.length) {
    let word = text[i];
    if (isAlNum(text[i])) {
      i += 1;
      while (i < text.length && isAlNum(text[i])) {
        word += text[i];
        i += 1;
      }
    } else {
      i += 1;
    }
    while (i < text.length && isPunct(text[i])) {
      word += text[i];
      i += 1;
    }
    tokens.push(word);
  }

  const pages = [];
  let currentPage = "";
  for (const token of tokens) {
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
}

function playPage() {
  clearInterval(dialogueTypingTimer);
  isTyping = true;
  syncDialogue();

  let i = 0;
  const currentText = textPages[currentPageIdx] || "";
  dialogueTypingTimer = setInterval(() => {
    if (i < currentText.length) {
      i += 1;
      const visiblePart = currentText.substring(0, i);
      const hiddenPart = currentText.substring(i);
      displayedText = `<span>${visiblePart}<span style="opacity: 0;">${hiddenPart}</span></span>`;
      renderDialogueText();
    } else {
      clearInterval(dialogueTypingTimer);
      isTyping = false;
      syncDialogue();
    }
  }, 30);
}

function syncOptions() {
  const container = document.getElementById("options-container");
  if (!container) return;
  const opts = currentLine()?.options;
  const active = showOptions();
  container.classList.toggle("active", active);
  container.innerHTML = opts
    ? opts
        .map(
          (opt) =>
            `<button class="option-button" data-action="select-option" data-next="${opt.nextId}">${esc(opt.text)}</button>`,
        )
        .join("")
    : "";
}

function syncDialogue() {
  const line = currentLine();
  const bubble = document.getElementById("dialogue-bubble");
  const nameTag = document.getElementById("name-tag");
  if (bubble) bubble.classList.toggle("thought-style", isThought());
  if (nameTag) nameTag.textContent = line?.name || "";
  renderDialogueText();

  const nextIndicator = document.getElementById("next-indicator");
  if (nextIndicator) {
    const show =
      !isTyping &&
      !showOptions() &&
      currentPageIdx === textPages.length - 1 &&
      !!line;
    nextIndicator.style.display = show ? "block" : "none";
    nextIndicator.style.color = isThought() ? "#718096" : "#ff9f43";
  }
  syncOptions();
}

function startLine() {
  const line = currentLine();
  if (!line) return;
  clearInterval(dialogueTypingTimer);
  displayedText = "";
  const cleanText = (line.text || "").trim();
  textPages = splitTextDynamically(cleanText);
  currentPageIdx = 0;
  syncDialogue();
  playPage();
}

function handleDialogueClick() {
  if (store.state.isGameOver) return;
  store.tryPlayBGM();

  if (isTyping) {
    clearInterval(dialogueTypingTimer);
    displayedText = `<span>${textPages[currentPageIdx] || ""}</span>`;
    isTyping = false;
    syncDialogue();
    return;
  }

  if (currentPageIdx < textPages.length - 1) {
    currentPageIdx += 1;
    playPage();
    return;
  }

  const line = currentLine();
  if (line?.id === 4 && line.customAction === "badEnd") {
    store.setGameResult(
      "lose",
      "你没有成功劝阻妈妈，她点击了钓鱼链接，她的钱被转走了！",
    );
    return;
  }

  if (!showOptions() && line?.nextId !== undefined) {
    store.playClickAudio();
    store.nextLine(line.nextId);
  }
}

function selectOption(nextId) {
  store.playClickAudio();
  store.setGameTimeout(() => store.nextLine(nextId), 150);
}

// ==================================================================
// 3. 各区域更新函数
// ==================================================================
function updatePhonePage() {
  const wrapper = document.getElementById("wechat-system");
  if (!wrapper) return;
  const key = phoneRenderKey();
  if (key !== lastPhoneRenderKey) {
    lastPhoneRenderKey = key;
    wrapper.innerHTML =
      key === "hidden"
        ? ""
        : phonePageHtml(store.state.activePhonePage, store.state, settings);
  }
}

function phoneRenderKey() {
  const s = store.state;
  if (!s.showPhoneSystem) return "hidden";
  const page = s.activePhonePage;
  if (page === "group-detail") return page + JSON.stringify(settings);
  if (page === "oa-profile" || page === "oa-about")
    return page + s.foundFlawsL1.join(",");
  if (["fake-profile", "fake-moments", "search", "real-profile"].includes(page))
    return page + s.foundFlawsL3.join(",");
  return page;
}

function updateToast() {
  const el = document.getElementById("systemToast");
  const textEl = document.getElementById("toast-text");
  if (!el || !textEl) return;
  if (store.state.toastMsg) {
    textEl.textContent = store.state.toastMsg;
    el.style.backgroundColor = store.state.toastBgColor || "#07c160";
    el.classList.add("show");
  } else {
    el.classList.remove("show");
  }
}

function updateSmsPopup() {
  const el = document.getElementById("sms-popup");
  if (!el) return;
  el.innerHTML = store.state.showSmsPopup
    ? smsPopupHtml(store.state.level2Solved, smsExpanded)
    : "";
}

function updateActionSheet() {
  const el = document.getElementById("action-sheet");
  if (!el) return;
  el.innerHTML = store.state.showActionSheet ? actionMenuHtml() : "";
}

function updateResultPopup() {
  const el = document.getElementById("result-popup");
  if (!el) return;
  el.innerHTML = showResultPopup && resultData ? resultPopupHtml(resultData) : "";
}

// ==================================================================
// 4. 全局同步
// ==================================================================
function syncUI() {
  const s = store.state;
  const showDialogue = !s.showPhoneSystem;

  const gc = document.getElementById("game-container");
  if (gc) gc.classList.toggle("shake-screen", s.isShaking);

  const characterCol = document.getElementById("character-col");
  if (characterCol) characterCol.style.display = showDialogue ? "" : "none";
  const dialogueCol = document.getElementById("dialogue-col");
  if (dialogueCol) dialogueCol.style.display = showDialogue ? "" : "none";
  const hintBtn = document.getElementById("hint-btn");
  if (hintBtn) hintBtn.style.display = s.showHintBtn ? "" : "none";
  const ws = document.getElementById("wechat-system");
  if (ws) ws.style.display = s.showPhoneSystem ? "" : "none";

  // 角色与背景
  const line = currentLine();
  const character = line?.emotion ? ASSETS.AVATARS[`mom_${line.emotion}`] : "";
  const background = line?.background
    ? ASSETS.BACKGROUNDS[line.background]
    : (ASSETS.BACKGROUNDS.default || "");
  const characterLayer = document.getElementById("character-layer");
  if (characterLayer) {
    characterLayer.innerHTML = characterHtml(background, character);
  }
  const phoneBtn = document.getElementById("phone-btn");
  if (phoneBtn) {
    phoneBtn.innerHTML = phoneIconHtml([2, 3, 4].includes(s.gameLevel));
  }

  // 钓鱼表单重置（对应 PhishingForm 的 watch）
  if (s.resetPhishingForm) {
    const codeInput = document.getElementById("verification-code");
    if (codeInput) codeInput.value = "";
    s.resetPhishingForm = false;
  }

  updatePhonePage();
  updateToast();
  updateSmsPopup();
  updateActionSheet();
  updateResultPopup();

  // 剧本行切换 → 重新开始打字
  if (s.currentLineId !== lastLineId) {
    lastLineId = s.currentLineId;
    startLine();
  }

  // 游戏结果变化 → 弹窗 + 解锁知识卡片
  if (s.gameResult !== lastGameResult) {
    lastGameResult = s.gameResult;
    if (s.gameResult === "win") {
      completeLevel(1);
      resultData = { type: "success" };
      showResultPopup = true;
    } else if (s.gameResult === "lose") {
      resultData = {
        type: "fail",
        title: "防骗失败",
        text:
          s.gameResultMessage || "很遗憾，没有劝阻成功，妈妈还是被骗了！",
      };
      showResultPopup = true;
    } else {
      showResultPopup = false;
      resultData = null;
    }
    updateResultPopup();
  }
}

// ==================================================================
// 5. 事件处理
// ==================================================================
function handleAvatarClick() {
  if (store.state.gameLevel >= 3) {
    store.navigatePhone("fake-profile");
  } else {
    store.showToast("现在还不需要查看她的资料哦~");
  }
}

function handleWelfareSubmit() {
  if (store.state.level2Solved) {
    store.showToast("活动已结束，请返回聊天", false);
    return;
  }
  const code = (document.getElementById("verification-code")?.value || "").trim();
  if (code === "882931") {
    store.setGameResult(
      "lose",
      "刚刚的验证码是修改妈妈的支付密码，她的钱被转走了！",
    );
  } else {
    store.showToast("❌ 验证码输入错误，请重试！", false);
  }
}

function expandSms() {
  smsExpanded = true;
  updateSmsPopup();
}

function openActionSheet() {
  if (store.state.gameLevel === 4) {
    store.state.showActionSheet = true;
    store.notify();
  }
}

function closeActionSheet() {
  if (store.state.showActionSheet) {
    store.state.showActionSheet = false;
    store.notify();
  }
}

function handleGroupToggle(key) {
  if (key in settings) {
    settings[key] = !settings[key];
    updatePhonePage();
  }
}

function handleResultAction(action) {
  showResultPopup = false;
  if (action === "replay") {
    if (store.state.gameResult === "win") {
      store.resetGame();
      window.location.reload();
    } else {
      store.goBackToOptions();
    }
  } else if (action === "home") {
    store.clearAllTimers();
    store.stopAllAudio();
    window.location.href = "index.html";
  } else if (action === "cards") {
    store.clearAllTimers();
    store.stopAllAudio();
    window.location.href = "cards.html?game=game2";
  }
}

function dispatchAction(action, target) {
  switch (action) {
    case "dialogue-click":
      handleDialogueClick();
      break;
    case "select-option":
      selectOption(Number(target.dataset.next));
      break;
    case "toggle-phone":
      store.togglePhone();
      break;
    case "return-to-dialogue":
      store.returnToDialogue();
      break;
    case "nav":
      store.navigatePhone(target.dataset.page);
      break;
    case "handle-avatar":
      handleAvatarClick();
      break;
    case "l1":
      store.triggerL1Debunk(target.dataset.type);
      break;
    case "l3":
      store.triggerL3Debunk(target.dataset.type);
      break;
    case "toast":
      store.showToast(target.dataset.message);
      break;
    case "welfare-submit":
      handleWelfareSubmit();
      break;
    case "sms-expand":
      expandSms();
      break;
    case "sms-catch":
      store.catchSMSFlaw();
      break;
    case "open-action-sheet":
      openActionSheet();
      break;
    case "close-action-sheet":
      closeActionSheet();
      break;
    case "group-toggle":
      handleGroupToggle(target.dataset.key);
      break;
    case "result-action":
      handleResultAction(target.dataset.value);
      break;
    // report / noop：投诉流程已在原版移除，保留为空操作
    case "report":
    case "noop":
      break;
    // hint-click 由 HintButton 的拖拽 + 点击逻辑单独绑定，不在此处理
    case "hint-click":
      break;
    default:
      break;
  }
}

function bindDelegation() {
  app.addEventListener("click", (e) => {
    const start = e.target && e.target.closest ? e.target : null;
    if (!start) return;
    const target = start.closest("[data-action]");
    if (!target) return;
    dispatchAction(target.getAttribute("data-action"), target);
  });
}

// ---- HintButton：拖拽 + 点击提示 ----
function hintLogic() {
  const s = store.state;
  if (s.gameLevel === 1) {
    if (s.activePhonePage.startsWith("oa-")) {
      if (!s.foundFlawsL1.includes("typo")) {
        store.showToast("💡 提示：看看公众号的名字和认证标志对不对劲？");
      } else if (!s.foundFlawsL1.includes("subject")) {
        store.showToast("💡 提示：点开资料区，查查它的“主体类型”到底是啥？");
      } else if (!s.foundFlawsL1.includes("history")) {
        store.showToast("💡 提示：往下拉，看看这个机构发过多少篇文章？");
      }
    } else {
      store.showToast("💡 提示：点击张大姐发的公众号名片进去看看吧~");
    }
  } else if (s.gameLevel === 2) {
    if (!s.level2Solved) {
      store.showToast(
        s.activePhonePage === "sms-expand"
          ? "💡 提示：仔细读！验证码后面写的是什么操作？点它！"
          : "💡 提示：短信好像没显示全，点击【查看全文】！",
      );
    }
  } else if (s.gameLevel === 3) {
    if (!s.foundFlawsL3.includes("info")) {
      store.showToast("💡 提示：在群里点击发链接的‘张大姐’的头像！");
    } else if (!s.foundFlawsL3.includes("moments")) {
      store.showToast("💡 提示：点击它的‘朋友圈’，看看里面平时发什么？");
    } else if (!s.foundFlawsL3.includes("add")) {
      store.showToast("💡 提示：退回资料页，看最下方那颗大按钮写着什么！");
    } else if (!s.foundFlawsL3.includes("real")) {
      store.showToast("💡 提示：点群聊右上角的‘...’，搜索张大姐！");
    }
  } else if (s.gameLevel === 4) {
    store.showToast("💡 提示：点击右上角的‘...’，选择投诉！");
  }
}

function bindHintDrag() {
  const btn = document.getElementById("hint-btn");
  if (!btn) return;

  let dragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;

  const getPoint = (e) =>
    e.touches && e.touches.length
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

  const onStart = (e) => {
    const p = getPoint(e);
    startX = p.x;
    startY = p.y;
    initialX = btn.offsetLeft;
    initialY = btn.offsetTop;
    dragging = true;
    hasMoved = false;
    if (e.type === "mousedown") {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
    }
  };

  const onMove = (e) => {
    if (!dragging) return;
    const p = getPoint(e);
    if (Math.abs(p.x - startX) > 5 || Math.abs(p.y - startY) > 5) {
      hasMoved = true;
      if (e.cancelable) e.preventDefault();
    }
    if (hasMoved) {
      const container = document.querySelector(".game-container");
      const maxX = Math.max(0, (container?.offsetWidth || 0) - btn.offsetWidth);
      const maxY = Math.max(0, (container?.offsetHeight || 0) - btn.offsetHeight);
      btn.style.left = `${Math.max(0, Math.min(initialX + p.x - startX, maxX))}px`;
      btn.style.top = `${Math.max(0, Math.min(initialY + p.y - startY, maxY))}px`;
      btn.style.right = "auto";
    }
  };

  const onEnd = () => {
    dragging = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);
  };

  const onClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    hintLogic();
  };

  btn.addEventListener("mousedown", onStart);
  btn.addEventListener("touchstart", onStart, { passive: true });
  btn.addEventListener("touchmove", onMove, { passive: false });
  btn.addEventListener("touchend", onEnd);
  btn.addEventListener("click", onClick);
}

// ==================================================================
// 6. 启动
// ==================================================================
renderSkeleton();
store.subscribe(syncUI);
bindDelegation();
bindHintDrag();
syncUI();

const fromHome = sessionStorage.getItem("fromHome");
if (!fromHome) {
  window.location.href = "index.html";
} else {
  sessionStorage.removeItem("fromHome");
  store.resetGame();
  store.tryPlayBGM();
}
