// game1 游戏状态仓库（音频 / 定时器 / 消息引擎 / 剧本播放）
// 对应原 src/views/games/game1/store/gameStore.js
// 依赖 js/game1/assets.js（先于本文件加载）

// ----- 音频引擎 -----
// 项目里的 BGM MP3 文件帧头与实际帧长不一致，HTMLAudioElement 无法解码
// （报 MEDIA_ELEMENT_ERROR: Format error），但 Web Audio 的 decodeAudioData
// 可以正常解码，因此优先使用 Web Audio 播放，并保留 <audio> 元素兜底。
const AUDIO_URLS = {
  sysMsg: ASSETS.AUDIO.message,
  bgm: ASSETS.AUDIO.bgm,
  click: ASSETS.AUDIO.click,
  confetti: ASSETS.AUDIO.confetti,
};

const audioEngine = {
  ctx: null, // AudioContext（首次播放时创建）
  buffers: {}, // 已解码的 AudioBuffer 缓存
  elements: {}, // 兜底 <audio> 元素缓存
  bgmSource: null, // 正在循环播放的 BGM BufferSource
  bgmWanted: false, // BGM 是否应该播放（用于手势恢复）
  resumeHandler: null,

  getContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    return this.ctx;
  },

  // 加载音频字节（fetch 优先，失败或不可用时用 XHR 兜底，兼容旧内核与 file:// 场景）
  loadArrayBuffer(url) {
    const viaXhr = () =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 0) {
            resolve(xhr.response);
          } else {
            reject(new Error(`音频加载失败: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("音频加载失败"));
        xhr.send();
      });

    if (window.fetch) {
      return fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error(`音频加载失败: ${resp.status}`);
          return resp.arrayBuffer();
        })
        .catch(() => viaXhr());
    }
    return viaXhr();
  },

  async decode(type) {
    if (this.buffers[type]) return this.buffers[type];
    const ctx = this.getContext();
    if (!ctx) throw new Error("Web Audio 不可用");
    const bytes = await this.loadArrayBuffer(AUDIO_URLS[type]);
    const decoded = await ctx.decodeAudioData(bytes);
    this.buffers[type] = decoded;
    return decoded;
  },

  // 兜底播放：<audio> 元素（兼容不支持 Web Audio 的环境）
  fallback(type, { loop = false, volume = 1 } = {}) {
    if (!this.elements[type]) {
      const el = new Audio(AUDIO_URLS[type]);
      el.loop = loop;
      el.volume = volume;
      this.elements[type] = el;
    }
    const el = this.elements[type];
    el.currentTime = 0;
    el.play().catch(() => {});
    return el;
  },

  async playOneShot(type, volume = 1) {
    try {
      const ctx = this.getContext();
      if (!ctx) throw new Error("Web Audio 不可用");
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }
      const buffer = await this.decode(type);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = volume;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    } catch (err) {
      this.fallback(type);
    }
  },

  // 被自动播放策略拦截后，在首次用户交互时恢复 BGM
  ensureResumeOnGesture() {
    if (this.resumeHandler) return;
    const tryResume = () => {
      const fb = this.elements.bgm;
      const bgmSounding =
        !!this.bgmSource || (fb && !fb.paused && !fb.ended);
      if (this.bgmWanted && !bgmSounding) {
        this.startBgm();
        return;
      }
      window.removeEventListener("pointerdown", tryResume);
      window.removeEventListener("keydown", tryResume);
      this.resumeHandler = null;
    };
    this.resumeHandler = tryResume;
    window.addEventListener("pointerdown", tryResume);
    window.addEventListener("keydown", tryResume);
  },

  async startBgm(volume = 0.3) {
    this.bgmWanted = true;
    try {
      const ctx = this.getContext();
      if (!ctx) throw new Error("Web Audio 不可用");
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }
      if (ctx.state !== "running") {
        // 没有用户手势，等首次交互后再恢复播放
        this.ensureResumeOnGesture();
        return;
      }
      const buffer = await this.decode("bgm");
      if (!this.bgmWanted) return;
      this.stopBgm();
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = volume;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
      this.bgmSource = src;
    } catch (err) {
      this.fallback("bgm", { loop: true, volume });
    }
  },

  stopBgm() {
    if (this.bgmSource) {
      try {
        this.bgmSource.stop();
      } catch (e) {
        // 已停止则忽略
      }
      try {
        this.bgmSource.disconnect();
      } catch (e) {
        // 已断开则忽略
      }
      this.bgmSource = null;
    }
  },

  stopAll() {
    this.stopBgm();
    this.bgmWanted = false;
    if (this.resumeHandler) {
      window.removeEventListener("pointerdown", this.resumeHandler);
      window.removeEventListener("keydown", this.resumeHandler);
      this.resumeHandler = null;
    }
    Object.values(this.elements).forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  },
};

// 名字与头像的自动映射表
const senderAvatarMap = {
  我: ASSETS.AVATARS.me,
  二大爷: ASSETS.AVATARS.uncle,
  三姑: ASSETS.AVATARS.aunt,
  老爸: ASSETS.AVATARS.father,
  老妈: ASSETS.AVATARS.mother,
  大舅: ASSETS.AVATARS.one_uncle,
  大堂哥: ASSETS.AVATARS.one_cousin,
  三表姐: ASSETS.AVATARS.three_cousin,
  四表哥: ASSETS.AVATARS.four_cousin,
};

function defaultFlaws() {
  return {
    inspector: { mountain: false, billboard: false, ai: false, isOpen: false },
    taobao: { url: false, countdown: false, password: false, isOpen: false },
    facetime: {
      channel: false,
      transfer: false,
      screenshare: false,
      isOpen: false,
    },
  };
}

function createStore() {
  const state = {
    activeOverlay: "loading",
    currentLevel: 0,
    messages: [],
    toastText: "",
    showToast: false,
    showDrawer: false,
    drawerOptions: [],
    resultData: { type: "", title: "", text: "" },
    groupName: "相亲相爱一家人 (27)",
    flaws: defaultFlaws(),
  };

  // ----- 定时器管理 -----
  let timers = [];

  // 订阅者（由 main.js 注册，用于状态变化后刷新界面）
  const listeners = new Set();
  const subscribe = (fn) => listeners.add(fn);
  const notify = () => listeners.forEach((fn) => fn());

  const setGameTimeout = (callback, delay) => {
    const id = setTimeout(() => {
      callback();
      const index = timers.indexOf(id);
      if (index !== -1) timers.splice(index, 1);
      notify();
    }, delay);
    timers.push(id);
    return id;
  };

  const clearAllTimers = () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers = [];
  };

  // ----- 游戏重置 -----
  const resetGame = () => {
    clearAllTimers();
    state.activeOverlay = "loading";
    state.currentLevel = 0;
    state.messages = [];
    state.toastText = "";
    state.showToast = false;
    state.showDrawer = false;
    state.drawerOptions = [];
    state.resultData = { type: "", title: "", text: "" };
    state.groupName = "相亲相爱一家人 (27)";
    state.flaws = defaultFlaws();
    notify();
  };

  // ----- 音频控制 -----
  const playSound = (type) => {
    if (type === "bgm") {
      audioEngine.startBgm();
    } else {
      audioEngine.playOneShot(type);
    }
  };

  const stopAllAudio = () => {
    audioEngine.stopAll();
  };

  // ----- 提示系统 -----
  let toastTimer = null;
  const triggerHint = (text, duration = 2000) => {
    state.toastText = text;
    state.showToast = true;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      state.showToast = false;
      notify();
    }, duration);
    notify();
  };

  // ----- 消息系统 -----
  const pushMessage = (msg) => {
    if (!msg.avatar && msg.sender && senderAvatarMap[msg.sender]) {
      msg.avatar = senderAvatarMap[msg.sender];
    }
    state.messages.push({
      id: Date.now() + Math.random(),
      hidden: false,
      ...msg,
    });
    if (!msg.isMe && msg.type !== "sys" && msg.type !== "time") {
      playSound("sysMsg");
    }
    notify();
  };

  // ----- 剧本播放引擎 -----
  const playScript = (scriptArray, onComplete) => {
    let maxDelay = 0;
    scriptArray.forEach((item) => {
      setGameTimeout(() => {
        pushMessage({
          sender: item.sender,
          text: item.text,
          image: item.image,
          type: item.image ? "image" : "text",
          avatar: ASSETS.AVATARS[item.avatar],
          isMe: false,
          extraClass: "",
        });
      }, item.delay);
      if (item.delay > maxDelay) maxDelay = item.delay;
    });
    if (onComplete) {
      setGameTimeout(onComplete, maxDelay + 1500);
    }
  };

  // ----- 撤回消息 -----
  const hideMessageByKeyword = (sender, keyword, isImage = false) => {
    const target = state.messages.find(
      (m) =>
        !m.hidden &&
        m.sender === sender &&
        (isImage ? m.type === "image" : m.text && m.text.includes(keyword)),
    );
    if (target) {
      target.hidden = true;
      pushMessage({ type: "sys", text: `${sender}撤回了一条消息` });
    }
  };

  // ----- 结算弹窗 -----
  const showResult = (type, title, text) => {
    state.resultData = { type, title, text };
    state.activeOverlay = "result";
    if (type === "success") {
      playSound("confetti");
      fireConfetti();
      setGameTimeout(fireConfetti, 500);
    }
    notify();
  };

  // ----- 礼花特效（game1 无 #app-container，保持原样为空操作）-----
  const fireConfetti = () => {
    const colors = ["#07c160", "#ffc107", "#ff5252", "#448aff", "#e040fb"];
    const container = document.getElementById("app-container");
    if (!container) return;
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = "50%";
      confetti.style.top = "40%";
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 120;
      confetti.style.setProperty("--tx", `${Math.cos(angle) * velocity}px`);
      confetti.style.setProperty("--ty", `${Math.sin(angle) * velocity}px`);
      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1500);
    }
  };

  return {
    state,
    subscribe,
    notify,
    playSound,
    triggerHint,
    pushMessage,
    playScript,
    hideMessageByKeyword,
    showResult,
    stopAllAudio,
    resetGame,
    setGameTimeout,
    clearAllTimers,
    fireConfetti,
  };
}

const gameStore = createStore();
// 全局别名 store：供 story-handler.js / main.js 使用（经典脚本共享全局作用域）
const store = gameStore;
