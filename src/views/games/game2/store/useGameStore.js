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
    hasStarted: true,
    gameLevel: 1,
    level2Solved: false,
    currentLineId: 0,
    isTyping: false,
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
  }),

  actions: {
    // 设置游戏结果，并记录失败时的关卡
    setGameResult(result, message = "") {
      this.gameResult = result;
      this.gameResultMessage = message;
      this.isGameOver = true;
      if (result === "lose") {
        this.failLevel = this.gameLevel;
      }
    },

    // 重置整个游戏
    resetGame() {
      this.gameLevel = 1;
      this.level2Solved = false;
      this.currentLineId = 0;
      this.showPhoneSystem = false;
      this.activePhonePage = "chat";
      this.previousPhonePage = null;
      this.showHintBtn = false;
      this.showSmsPopup = false;
      this.showActionSheet = false;
      this.isShaking = false;
      this.showEndScreen = false;
      this.toastMsg = "";
      this.foundFlawsL1 = [];
      this.foundFlawsL3 = [];
      this.gameResult = null;
      this.gameResultMessage = "";
      this.isGameOver = false;
      this.failLevel = null;
      this.resetPhishingForm = false;
      if (bgmInstance) {
        bgmInstance.pause();
        bgmInstance.currentTime = 0;
        bgmInstance = null;
      }
      this.tryPlayBGM();
    },

    // 回到选项处或第二关开始处（根据失败时的关卡）
    goBackToOptions() {
      const level = this.failLevel;
      if (level === 1) {
        this.currentLineId = 3;
        this.gameLevel = 1;
        this.level2Solved = false;
        this.showPhoneSystem = false;
        this.showHintBtn = false;
        this.showSmsPopup = false;
        this.foundFlawsL1 = [];
        this.foundFlawsL3 = [];
        this.isGameOver = false;
        this.gameResult = null;
        this.gameResultMessage = "";
        this.failLevel = null;
        this.clearAllTimers();
        this.tryPlayBGM();
        this.resetPhishingForm = false;
      } else if (level === 2) {
        this.gameLevel = 2;
        this.level2Solved = false;
        this.showPhoneSystem = true;
        this.activePhonePage = "welfare";
        this.showHintBtn = true;
        this.showSmsPopup = false;
        this.isGameOver = false;
        this.gameResult = null;
        this.gameResultMessage = "";
        this.failLevel = null;
        this.clearAllTimers();
        this.setGameTimeout(() => {
          if (
            this.showPhoneSystem &&
            this.activePhonePage === "welfare" &&
            !this.level2Solved
          ) {
            this.showSmsPopup = true;
          }
        }, 1000);
        this.tryPlayBGM();
        this.resetPhishingForm = true;
      } else {
        this.resetGame();
      }
    },

    // 页面导航（记录上一个页面）
    navigatePhone(page) {
      this.previousPhonePage = this.activePhonePage;
      this.activePhonePage = page;
    },

    // 返回上一个页面
    returnToPrevious() {
      if (this.previousPhonePage) {
        this.activePhonePage = this.previousPhonePage;
        this.previousPhonePage = null;
      } else {
        this.returnToDialogue();
      }
    },

    // ... 其余方法保持不变（setGameTimeout, clearAllTimers, stopAllAudio, tryPlayBGM, playClickAudio, nextLine, togglePhone, returnToDialogue, showToast, triggerL1Debunk, catchSMSFlaw, triggerL3Debunk, doReport）
    // 注意：以下方法保留原样，为避免遗漏，请确保复制完整。
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

    nextLine(id) {
      if (this.isGameOver) return;
      this.currentLineId = id;
      const line = GAME_STORY.scriptLines.find((l) => l.id === id);
      if (line?.customAction === "startLevel2") this.gameLevel = 2;
      else if (line?.customAction === "startLevel3") this.gameLevel = 3;
      // else if (line?.customAction === "startReport") this.gameLevel = 4;
      else if (line?.customAction === "gameWin") {
        // 胜利，弹出弹窗
        this.setGameResult("win");
        // 不继续推进，因为 isGameOver 已为 true
      }
    },

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

    showToast(text, isDanger = false) {
      this.toastMsg = text;
      this.toastBgColor = isDanger ? "#ff4d4f" : "#07c160";
      this.setGameTimeout(() => {
        if (this.toastMsg === text) this.toastMsg = "";
      }, 2000);
    },

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

    triggerL3Debunk(type) {
      if (this.gameLevel < 3 || this.foundFlawsL3.includes(type)) return;
      this.foundFlawsL3.push(type);
      if (type === "info") this.showToast("地区安道尔，典型的黑号！");
      if (type === "moments") this.showToast("朋友圈只有广告，没有生活痕迹！");
      if (type === "add")
        this.showToast(
          "竟然还要添加到通讯录？真正的张大姐明明就是妈妈的好友！这是骗子无疑！",
        );
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
      if (this.isGameOver) return;
      this.showActionSheet = false;
      this.showToast("✅ 投诉提交成功！微信安全中心已介入！");
      this.setGameTimeout(() => {
        this.showPhoneSystem = false;
        this.showHintBtn = false;
        this.setGameResult("win");
      }, 2000);
    },
  },
});
