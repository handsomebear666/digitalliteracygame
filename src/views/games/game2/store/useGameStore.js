// src/views/games/game2/store/useGameStore.js
import { defineStore } from "pinia";
import {
  GAME_STORY,
  DEBUNK_MESSAGES,
  ASSETS,
} from "@/views/games/game2/data/story";

let bgmInstance = null;
let timers = [];

export const useGameStore = defineStore("game", {
  state: () => ({
    hasStarted: true, // 直接开始，不显示开始界面
    gameLevel: 1,
    level2Solved: false,
    currentLineId: 0,
    isTyping: false,
    showPhoneSystem: false,
    activePhonePage: "chat",
    showHintBtn: false,
    showSmsPopup: false,
    showActionSheet: false,
    isShaking: false,
    showEndScreen: false,
    toastMsg: "",
    toastBgColor: "#07c160",
    foundFlawsL1: [],
    foundFlawsL3: [],
  }),

  actions: {
    // 统一管理定时器
    setGameTimeout(callback, delay) {
      const id = setTimeout(() => {
        callback();
        const index = timers.indexOf(id);
        if (index !== -1) timers.splice(index, 1);
      }, delay);
      timers.push(id);
      return id;
    },

    clearAllTimers() {
      timers.forEach((timer) => clearTimeout(timer));
      timers = [];
    },

    stopAllAudio() {
      if (bgmInstance) {
        bgmInstance.pause();
        bgmInstance.currentTime = 0;
        bgmInstance = null;
      }
    },

    tryPlayBGM() {
      if (!bgmInstance) {
        bgmInstance = new Audio(ASSETS.AUDIO.bgm);
        bgmInstance.loop = true;
      }
      if (bgmInstance.paused) {
        bgmInstance.play().catch(() => {
          console.warn("浏览器限制了自动播放，等待玩家下一次交互");
        });
      }
    },

    playClickAudio() {
      const clickAudio = new Audio(ASSETS.AUDIO.click);
      clickAudio.play().catch(() => {});
      this.tryPlayBGM();
    },

    // === 对话与进度推进 ===
    nextLine(id) {
      this.currentLineId = id;
      const line = GAME_STORY.scriptLines.find((l) => l.id === id);
      if (line?.customAction === "startLevel2") this.gameLevel = 2;
      else if (line?.customAction === "startLevel3") this.gameLevel = 3;
      else if (line?.customAction === "startReport") this.gameLevel = 4;
    },

    // === 手机界面全局调度 ===
    togglePhone() {
      this.playClickAudio();
      this.showPhoneSystem = true;
      this.showHintBtn = true;

      if (this.gameLevel === 1) {
        this.activePhonePage = "chat";
      } else if (this.gameLevel === 2) {
        if (!this.level2Solved) {
          this.activePhonePage = "welfare";
          this.setGameTimeout(() => {
            this.showSmsPopup = true;
          }, 1000);
        } else {
          this.activePhonePage = "chat";
        }
      } else if (this.gameLevel === 3) {
        this.activePhonePage = "chat";
      } else if (this.gameLevel === 4) {
        this.activePhonePage = "fake-profile";
      }
    },

    returnToDialogue() {
      this.playClickAudio();
      this.showPhoneSystem = false;
      this.showHintBtn = false;
      this.showSmsPopup = false;
    },

    navigatePhone(page) {
      this.activePhonePage = page;
    },

    showToast(text, isDanger = false) {
      this.toastMsg = text;
      this.toastBgColor = isDanger ? "#ff4d4f" : "#07c160";
      this.setGameTimeout(() => {
        if (this.toastMsg === text) this.toastMsg = "";
      }, 2000);
    },

    // === 第一关逻辑 ===
    triggerL1Debunk(type) {
      if (!this.foundFlawsL1.includes(type)) {
        this.foundFlawsL1.push(type);
      }
      this.showToast(DEBUNK_MESSAGES[type] || "发现破绽！");
      if (this.foundFlawsL1.length === 3) {
        this.setGameTimeout(
          () => this.showToast("🎉 证据收集完毕！正在切回聊天..."),
          1500,
        );
        this.setGameTimeout(() => {
          this.returnToDialogue();
          this.nextLine(6);
        }, 3500);
      }
    },

    // === 第二关逻辑 ===
    catchSMSFlaw() {
      if (this.level2Solved) return;
      this.level2Solved = true;
      this.isShaking = true;
      this.setGameTimeout(() => {
        this.isShaking = false;
      }, 500);
      this.showToast("🚨 这是在修改妈妈的支付密码！", true);
      this.setGameTimeout(() => {
        this.showSmsPopup = false;
        this.setGameTimeout(() => {
          this.returnToDialogue();
          this.nextLine(10);
        }, 500);
      }, 2500);
    },

    // === 第三关与第四关逻辑 ===
    triggerL3Debunk(type) {
      if (this.gameLevel < 3 || this.foundFlawsL3.includes(type)) return;
      this.foundFlawsL3.push(type);
      if (type === "info") this.showToast("【破绽1】地区安道尔，典型的黑号！");
      if (type === "moments")
        this.showToast("【破绽2】朋友圈只有广告，没有生活痕迹！");
      if (type === "add")
        this.showToast("【破绽3】竟然还要‘添加到通讯录’？骗子无疑！");
      if (type === "real") {
        this.showToast("这才是真正的张大姐！");
        this.activePhonePage = "real-profile";
        if (this.foundFlawsL3.length === 4) {
          this.setGameTimeout(() => {
            this.returnToDialogue();
            this.nextLine(14);
          }, 2500);
        }
      }
    },

    doReport() {
      this.showActionSheet = false;
      this.showToast("✅ 投诉提交成功！微信安全中心已介入！");
      this.setGameTimeout(() => {
        this.showPhoneSystem = false;
        this.showHintBtn = false;
        this.showEndScreen = true;
      }, 2000);
    },
  },
});
