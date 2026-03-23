import { reactive } from "vue";
import { GAME_STORY, ASSETS } from "../config/story.js";

// 全局音频实例
const audioCtx = {
  sysMsg: new Audio(ASSETS.AUDIO.message),
  bgm: new Audio(ASSETS.AUDIO.bgm),
  click: new Audio(ASSETS.AUDIO.click),
  confetti: new Audio(ASSETS.AUDIO.confetti),
};
audioCtx.bgm.loop = true;
audioCtx.bgm.volume = 0.3;

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

export const useGameStore = () => {
  const state = reactive({
    activeOverlay: "loading",
    currentLevel: 0,
    messages: [],
    toastText: "",
    showToast: false,
    showDrawer: false,
    drawerOptions: [],
    resultData: { type: "", title: "", text: "" },
    groupName: "相亲相爱一家人 (27)",
    flaws: {
      inspector: {
        mountain: false,
        billboard: false,
        ai: false,
        isOpen: false,
      },
      taobao: { url: false, countdown: false, password: false, isOpen: false },
      facetime: {
        channel: false,
        transfer: false,
        screenshare: false,
        isOpen: false,
      },
    },
  });

  // ----- 定时器管理 -----
  let timers = [];

  const setGameTimeout = (callback, delay) => {
    const id = setTimeout(() => {
      callback();
      const index = timers.indexOf(id);
      if (index !== -1) timers.splice(index, 1);
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
    state.flaws = {
      inspector: {
        mountain: false,
        billboard: false,
        ai: false,
        isOpen: false,
      },
      taobao: { url: false, countdown: false, password: false, isOpen: false },
      facetime: {
        channel: false,
        transfer: false,
        screenshare: false,
        isOpen: false,
      },
    };
  };

  // ----- 音频控制 -----
  const playSound = (type) => {
    if (audioCtx[type]) {
      audioCtx[type].currentTime = 0;
      audioCtx[type].play().catch(() => {});
    }
  };

  const stopAllAudio = () => {
    Object.values(audioCtx).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  // ----- 提示系统 -----
  let toastTimer = null;
  const triggerHint = (text, duration = 2000) => {
    state.toastText = text;
    state.showToast = true;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setGameTimeout(() => {
      state.showToast = false;
    }, duration);
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
  };

  // ----- 礼花特效 -----
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
      setGameTimeout(() => confetti.remove(), 1500);
    }
  };

  // ----- 资源预加载（可保留但不再调用）-----
  const preloadAssets = () => {
    return new Promise((resolve) => {
      let urls = [];
      const extractUrls = (obj) => {
        for (let key in obj) {
          if (typeof obj[key] === "string" && !obj[key].endsWith(".mp3")) {
            urls.push(obj[key]);
          } else if (typeof obj[key] === "object") {
            extractUrls(obj[key]);
          }
        }
      };
      extractUrls(ASSETS);
      Object.values(audioCtx).forEach((audio) => audio.load());
      if (urls.length === 0) {
        resolve();
        return;
      }
      let loadedCount = 0;
      urls.forEach((url) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === urls.length) resolve();
        };
        img.src = url;
      });
    });
  };

  return {
    state,
    playSound,
    triggerHint,
    pushMessage,
    playScript,
    hideMessageByKeyword,
    showResult,
    preloadAssets,
    stopAllAudio,
    resetGame,
    setGameTimeout,
    clearAllTimers,
  };
};

export const gameStore = useGameStore();
