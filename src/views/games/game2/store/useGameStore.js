// src/store/useGameStore.js
import { defineStore } from "pinia";
import { GAME_STORY, DEBUNK_MESSAGES, ASSETS } from "@game2/data/story";
let bgmInstance = null;

export const useGameStore = defineStore("game", {
  state: () => ({
    hasStarted: false, // 【新增】标记游戏是否已经点击了开始

    // 1. 游戏主进度
    gameLevel: 1,
    level2Solved: false,

    // 2. 对话系统状态
    currentLineId: 0,
    isTyping: false,

    // 3. UI 视图调度 (彻底取代原生的 display: none/block)
    showPhoneSystem: false, // 是否打开了手机
    activePhonePage: "chat", // 手机内部路由: 'chat', 'oa-profile', 'oa-about', 'welfare', 'sms-expand', 'fake-profile', 'fake-moments', 'search', 'real-profile'
    showHintBtn: false, // 是否显示悬浮提示按钮
    showSmsPopup: false, // 短信弹窗显示状态
    showActionSheet: false, // 底部投诉菜单
    isShaking: false, // 屏幕震动特效
    showEndScreen: false, // 游戏通关结算界面

    // 4. 全局 Toast 提示系统
    toastMsg: "",
    toastBgColor: "#07c160", // 成功绿 / 警告红

    // 5. 破绽收集系统
    foundFlawsL1: [], // 第一关：['typo', 'subject', 'history']
    foundFlawsL3: [], // 第三关：['info', 'moments', 'add', 'real']
  }),

  actions: {
    // 【新增】开始游戏的方法
    startGame() {
      this.hasStarted = true;
      this.tryPlayBGM(); // 完美解决浏览器拦截！玩家点击开始按钮时，顺理成章地唤醒 BGM
    },
    // === 音效管理器 (修复 BGM 漏放的问题) ===
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
      new Audio(ASSETS.AUDIO.click).play().catch(() => {});
      this.tryPlayBGM(); // 每次点击都顺便检查并启动 BGM
    },

    // === 对话与进度推进 ===
    nextLine(id) {
      this.currentLineId = id;
      const line = GAME_STORY.scriptLines.find((l) => l.id === id);

      // 关卡触发拦截器
      if (line?.customAction === "startLevel2") {
        this.gameLevel = 2;
      } else if (line?.customAction === "startLevel3") {
        this.gameLevel = 3;
      } else if (line?.customAction === "startReport") {
        this.gameLevel = 4;
      }
    },

    // === 手机界面全局调度 ===
    togglePhone() {
      this.playClickAudio();
      this.showPhoneSystem = true;
      this.showHintBtn = true;

      // 根据关卡智能挂载对应页面
      if (this.gameLevel === 1) {
        this.activePhonePage = "chat";
      } else if (this.gameLevel === 2) {
        if (!this.level2Solved) {
          this.activePhonePage = "welfare";
          setTimeout(() => {
            this.showSmsPopup = true;
          }, 1000);
        } else {
          this.activePhonePage = "chat"; // 防止玩家动画期间卡死
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

    // === 全局提示系统 ===
    showToast(text, isDanger = false) {
      this.toastMsg = text;
      this.toastBgColor = isDanger ? "#ff4d4f" : "#07c160";
      // 自动清除
      setTimeout(() => {
        if (this.toastMsg === text) this.toastMsg = "";
      }, 2000);
    },

    // === 第一关逻辑 ===
    triggerL1Debunk(type) {
      if (!this.foundFlawsL1.includes(type)) {
        this.foundFlawsL1.push(type);
      }
      this.showToast(DEBUNK_MESSAGES[type] || "发现破绽！");

      // 自动收网逻辑
      if (this.foundFlawsL1.length === 3) {
        setTimeout(
          () => this.showToast("🎉 证据收集完毕！正在切回聊天..."),
          1500,
        );
        setTimeout(() => {
          this.returnToDialogue();
          this.nextLine(6); // 切回后触发第6句对话
        }, 3500);
      }
    },

    // === 第二关逻辑 ===
    catchSMSFlaw() {
      if (this.level2Solved) return; // 安全锁

      this.level2Solved = true;
      this.isShaking = true;
      setTimeout(() => {
        this.isShaking = false;
      }, 500);

      this.showToast("🚨 这是在修改妈妈的支付密码！", true);

      setTimeout(() => {
        this.showSmsPopup = false;
        setTimeout(() => {
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

        // 第三关自动收网
        if (this.foundFlawsL3.length === 4) {
          setTimeout(() => {
            this.returnToDialogue();
            this.nextLine(14);
          }, 2500);
        }
      }
    },

    doReport() {
      this.showActionSheet = false;
      this.showToast("✅ 投诉提交成功！微信安全中心已介入！");
      setTimeout(() => {
        this.showPhoneSystem = false;
        this.showHintBtn = false;
        this.showEndScreen = true; // 触发通关结算
      }, 2000);
    },
  },
});
