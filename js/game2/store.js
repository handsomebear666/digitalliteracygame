// game2 游戏状态仓库（Pinia useGameStore 的纯 JS 等价实现）
// 对应原 src/views/games/game2/store/useGameStore.js
// 依赖 js/game2/story.js、js/game2/assets.js（先于本文件加载）

let timers = [];

// ----- 音频引擎 -----
// 项目里的 BGM MP3 文件帧头与实际帧长不一致，HTMLAudioElement 无法解码
// （报 MEDIA_ELEMENT_ERROR: Format error），但 Web Audio 的 decodeAudioData
// 可以正常解码，因此优先使用 Web Audio 播放，并保留 <audio> 元素兜底。
const AUDIO_URLS = {
  bgm: ASSETS.AUDIO.bgm,
  click: ASSETS.AUDIO.click,
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

  isBgmPlaying() {
    if (this.bgmSource) return true;
    const fb = this.elements.bgm;
    return !!(fb && !fb.paused && !fb.ended);
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
      if (this.bgmWanted && !this.isBgmPlaying()) {
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
    if (this.isBgmPlaying()) return;
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

function createStore() {
  const state = {
    hasStarted: true,
    gameLevel: 1,
    level2Solved: false,
    currentLineId: 0,
    isTyping: false, // 原 Pinia state 中的字段，实际打字状态由 DialogueUI 本地管理
    showPhoneSystem: false,
    activePhonePage: "chat",
    previousPhonePage: null, // 记录上一个页面
    showHintBtn: false,
    showSmsPopup: false,
    showActionSheet: false,
    isShaking: false,
    showEndScreen: false,
    toastMsg: "",
    toastBgColor: "#07c160",
    foundFlawsL1: [],
    foundFlawsL3: [],
    gameResult: null,
    gameResultMessage: "",
    isGameOver: false,
    failLevel: null,
    resetPhishingForm: false,
  };

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

  const stopAllAudio = () => {
    audioEngine.stopAll();
  };

  const tryPlayBGM = () => {
    if (audioEngine.isBgmPlaying()) return;
    audioEngine.startBgm();
  };

  const playClickAudio = () => {
    audioEngine.playOneShot("click");
    tryPlayBGM();
  };

  // 设置游戏结果，并记录失败时的关卡
  const setGameResult = (result, message = "") => {
    state.gameResult = result;
    state.gameResultMessage = message;
    state.isGameOver = true;
    if (result === "lose") {
      state.failLevel = state.gameLevel;
    }
    notify();
  };

  // 重置整个游戏
  const resetGame = () => {
    state.gameLevel = 1;
    state.level2Solved = false;
    state.currentLineId = 0;
    state.showPhoneSystem = false;
    state.activePhonePage = "chat";
    state.previousPhonePage = null;
    state.showHintBtn = false;
    state.showSmsPopup = false;
    state.showActionSheet = false;
    state.isShaking = false;
    state.showEndScreen = false;
    state.toastMsg = "";
    state.foundFlawsL1 = [];
    state.foundFlawsL3 = [];
    state.gameResult = null;
    state.gameResultMessage = "";
    state.isGameOver = false;
    state.failLevel = null;
    state.resetPhishingForm = false;
    audioEngine.stopAll();
    tryPlayBGM();
    notify();
  };

  // 回到选项处或第二关开始处（根据失败时的关卡）
  const goBackToOptions = () => {
    const level = state.failLevel;
    if (level === 1) {
      state.currentLineId = 3;
      state.gameLevel = 1;
      state.level2Solved = false;
      state.showPhoneSystem = false;
      state.showHintBtn = false;
      state.showSmsPopup = false;
      state.foundFlawsL1 = [];
      state.foundFlawsL3 = [];
      state.isGameOver = false;
      state.gameResult = null;
      state.gameResultMessage = "";
      state.failLevel = null;
      clearAllTimers();
      tryPlayBGM();
      state.resetPhishingForm = false;
    } else if (level === 2) {
      state.gameLevel = 2;
      state.level2Solved = false;
      state.showPhoneSystem = true;
      state.activePhonePage = "welfare";
      state.showHintBtn = true;
      state.showSmsPopup = false;
      state.isGameOver = false;
      state.gameResult = null;
      state.gameResultMessage = "";
      state.failLevel = null;
      clearAllTimers();
      setGameTimeout(() => {
        if (
          state.showPhoneSystem &&
          state.activePhonePage === "welfare" &&
          !state.level2Solved
        ) {
          state.showSmsPopup = true;
          notify();
        }
      }, 1000);
      tryPlayBGM();
      state.resetPhishingForm = true;
    } else {
      resetGame();
      return;
    }
    notify();
  };

  // 页面导航（记录上一个页面）
  const navigatePhone = (page) => {
    state.previousPhonePage = state.activePhonePage;
    state.activePhonePage = page;
    notify();
  };

  // 返回上一个页面
  const returnToPrevious = () => {
    if (state.previousPhonePage) {
      state.activePhonePage = state.previousPhonePage;
      state.previousPhonePage = null;
    } else {
      returnToDialogue();
    }
    notify();
  };

  const nextLine = (id) => {
    if (state.isGameOver) return;
    state.currentLineId = id;
    const line = GAME_STORY.scriptLines.find((l) => l.id === id);
    if (line?.customAction === "startLevel2") state.gameLevel = 2;
    else if (line?.customAction === "startLevel3") state.gameLevel = 3;
    // else if (line?.customAction === "startReport") state.gameLevel = 4;
    else if (line?.customAction === "gameWin") {
      // 胜利，弹出弹窗
      setGameResult("win");
      // 不继续推进，因为 isGameOver 已为 true
    }
    notify();
  };

  const togglePhone = () => {
    playClickAudio();
    state.showPhoneSystem = true;
    state.showHintBtn = true;

    if (state.gameLevel === 1) {
      state.activePhonePage = "chat";
    } else if (state.gameLevel === 2) {
      if (!state.level2Solved) {
        state.activePhonePage = "welfare";
        setGameTimeout(() => {
          state.showSmsPopup = true;
          notify();
        }, 1000);
      } else {
        state.activePhonePage = "chat";
      }
    } else if (state.gameLevel === 3) {
      state.activePhonePage = "chat";
    } else if (state.gameLevel === 4) {
      state.activePhonePage = "fake-profile";
    }
    notify();
  };

  const returnToDialogue = () => {
    playClickAudio();
    state.showPhoneSystem = false;
    state.showHintBtn = false;
    state.showSmsPopup = false;
    notify();
  };

  const showToast = (text, isDanger = false) => {
    state.toastMsg = text;
    state.toastBgColor = isDanger ? "#ff4d4f" : "#07c160";
    setGameTimeout(() => {
      if (state.toastMsg === text) {
        state.toastMsg = "";
        notify();
      }
    }, 2000);
    notify();
  };

  const triggerL1Debunk = (type) => {
    if (!state.foundFlawsL1.includes(type)) {
      state.foundFlawsL1.push(type);
    }
    showToast(DEBUNK_MESSAGES[type] || "发现破绽！");
    if (state.foundFlawsL1.length === 3) {
      setGameTimeout(
        () => showToast("这不是真正的市图书馆公众号！快告诉妈妈！"),
        1500,
      );
      setGameTimeout(() => {
        returnToDialogue();
        nextLine(6);
      }, 1000);
    }
    notify();
  };

  const catchSMSFlaw = () => {
    if (state.level2Solved) return;
    state.level2Solved = true;
    state.isShaking = true;
    setGameTimeout(() => {
      state.isShaking = false;
      notify();
    }, 500);
    showToast("🚨 这是在修改妈妈的支付密码！", true);
    setGameTimeout(() => {
      state.showSmsPopup = false;
      notify();
      setGameTimeout(() => {
        returnToDialogue();
        nextLine(10);
      }, 500);
    }, 2500);
    notify();
  };

  const triggerL3Debunk = (type) => {
    if (state.gameLevel < 3 || state.foundFlawsL3.includes(type)) return;
    state.foundFlawsL3.push(type);
    if (type === "info") showToast("地区安道尔，典型的黑号！");
    if (type === "moments") showToast("朋友圈只有广告，没有生活痕迹！");
    if (type === "add")
      showToast(
        "竟然还要添加到通讯录？真正的张大姐明明就是妈妈的好友！这是骗子无疑！",
      );
    if (type === "real") {
      showToast("这才是真正的张大姐！");
      state.activePhonePage = "real-profile";
      if (state.foundFlawsL3.length === 4) {
        setGameTimeout(() => {
          returnToDialogue();
          nextLine(14);
        }, 2500);
      }
    }
    notify();
  };

  return {
    state,
    subscribe,
    notify,
    setGameTimeout,
    clearAllTimers,
    stopAllAudio,
    tryPlayBGM,
    playClickAudio,
    setGameResult,
    resetGame,
    goBackToOptions,
    navigatePhone,
    returnToPrevious,
    nextLine,
    togglePhone,
    returnToDialogue,
    showToast,
    triggerL1Debunk,
    catchSMSFlaw,
    triggerL3Debunk,
  };
}

const gameStore = createStore();
// 全局别名 store：供 main.js 使用（经典脚本共享全局作用域）
const store = gameStore;
