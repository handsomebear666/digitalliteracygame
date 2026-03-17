import { reactive, ref } from 'vue';
import { GAME_STORY, ASSETS } from '../config/story.js'; // 确保路径正确

// 全局音频实例
const audioCtx = {
    sysMsg: new Audio(ASSETS.AUDIO.message),
    bgm: new Audio(ASSETS.AUDIO.bgm),
    click: new Audio(ASSETS.AUDIO.click),
    confetti: new Audio(ASSETS.AUDIO.confetti)
};
audioCtx.bgm.loop = true;
audioCtx.bgm.volume = 0.3;

// 【新增】：名字与头像的自动映射表
const senderAvatarMap = {
    '我': ASSETS.AVATARS.me,
    '二大爷': ASSETS.AVATARS.uncle,
    '三姑': ASSETS.AVATARS.aunt,
    '老爸': ASSETS.AVATARS.father,
    '老妈': ASSETS.AVATARS.mother,
    '大舅': ASSETS.AVATARS.one_uncle,
    '大堂哥': ASSETS.AVATARS.one_cousin,
    '三表姐': ASSETS.AVATARS.three_cousin,
    '四表哥': ASSETS.AVATARS.four_cousin
};

export const useGameStore = () => {
    const state = reactive({
        activeOverlay: 'loading', // loading, intro, none, taobao, facetime, result
        currentLevel: 0,
        messages: [], // 聊天记录
        toastText: '',
        showToast: false,
        showDrawer: false,
        drawerOptions: [], // 动态渲染底部选项
        resultData: { type: '', title: '', text: '' }, // 结算弹窗数据

        // 关卡破绽进度
        flaws: {
            inspector: { mountain: false, billboard: false, ai: false, isOpen: false },
            taobao: { url: false, countdown: false, password: false, isOpen: false },
            facetime: { channel: false, transfer: false, screenshare: false, isOpen: false }
        }
    });

    // 音频控制
    const playSound = (type) => {
        if (audioCtx[type]) {
            audioCtx[type].currentTime = 0;
            audioCtx[type].play().catch(() => {});
        }
    };

    // 提示系统
    let toastTimer = null;
    const triggerHint = (text, duration = 2000) => {
        state.toastText = text;
        state.showToast = true;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            state.showToast = false;
        }, duration);
    };

    // 消息系统
    // 【核心拦截】：发消息时自动寻找对应头像！
    const pushMessage = (msg) => {
        // 如果没有传头像，并且发送者在名单里，就自动分配头像
        if (!msg.avatar && msg.sender && senderAvatarMap[msg.sender]) {
            msg.avatar = senderAvatarMap[msg.sender];
        }

        state.messages.push({ id: Date.now() + Math.random(), hidden: false, ...msg });
        if (!msg.isMe && msg.type !== 'sys' && msg.type !== 'time') {
            playSound('sysMsg');
        }
        // 自动滚动到底部由 Vue 侦听器在组件内处理
    };

    // 剧本播放引擎 (替代原来的硬编码 setTimeout)
    const playScript = (scriptArray, onComplete) => {
        let maxDelay = 0;
        scriptArray.forEach(item => {
            setTimeout(() => {
                pushMessage({
                    sender: item.sender,
                    text: item.text,
                    image: item.image,
                    type: item.image ? 'image' : 'text',
                    avatar: ASSETS.AVATARS[item.avatar],
                    isMe: false,
                    extraClass: ''
                });
            }, item.delay);
            if (item.delay > maxDelay) maxDelay = item.delay;
        });
        if (onComplete) {
            setTimeout(onComplete, maxDelay + 1500);
        }
    };

    // 撤回消息 (替代 hideUncleMessage)
    const hideMessageByKeyword = (sender, keyword, isImage = false) => {
        const target = state.messages.find(m =>
            !m.hidden && m.sender === sender &&
            (isImage ? m.type === 'image' : (m.text && m.text.includes(keyword)))
        );
        if (target) {
            target.hidden = true;
            pushMessage({ type: 'sys', text: `${sender}撤回了一条消息` });
        }
    };

    // 失败/成功结算
    const showResult = (type, title, text) => {
        state.resultData = { type, title, text };
        state.activeOverlay = 'result';
        if (type === 'success') {
            playSound('confetti');
            fireConfetti();
            setTimeout(fireConfetti, 500);
        }
    };

    // 礼花特效 (保留原生 DOM 操作，性能更好)
    const fireConfetti = () => {
        const colors = ["#07c160", "#ffc107", "#ff5252", "#448aff", "#e040fb"];
        const container = document.getElementById("app-container");
        if(!container) return;
        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
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

    // 🚀 真·预加载引擎：提取并下载所有资源
    const preloadAssets = () => {
        return new Promise((resolve) => {
            let urls = [];
            // 递归提取 ASSETS 里的所有图片路径
            const extractUrls = (obj) => {
                for (let key in obj) {
                    // 只提取字符串，并且排除掉音频文件
                    if (typeof obj[key] === "string" && !obj[key].endsWith(".mp3")) {
                        urls.push(obj[key]);
                    } else if (typeof obj[key] === "object") {
                        extractUrls(obj[key]);
                    }
                }
            };
            extractUrls(ASSETS);

            // 强制浏览器开始缓冲音频
            Object.values(audioCtx).forEach(audio => {
                // 轻轻推一下，让浏览器提前下载音频流
                audio.load(); 
            });

            if (urls.length === 0) {
                resolve();
                return;
            }

            let loadedCount = 0;
            urls.forEach((url) => {
                const img = new Image();
                // 无论加载成功还是报错（比如某张图丢了），都往下走，绝不死卡加载页
                img.onload = img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === urls.length) {
                        resolve(); // 所有图片都过了一遍，正式放行！
                    }
                };
                img.src = url;
            });
        });
    };

    return { 
        state, playSound, triggerHint, pushMessage, playScript, 
        hideMessageByKeyword, showResult, preloadAssets 
    };
};

// 单例模式抛出
export const gameStore = useGameStore();