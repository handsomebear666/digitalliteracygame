// src/composables/useGameProgress.js
import { ref, watch } from "vue";

export function useGameProgress() {
  const defaultGames = [
    {
      id: "game1",
      title: "家庭保卫战",
      icon: "",
      time: "3 分钟",
      // 💥 图片空链，填入链接就会自动替换掉上面的文字/Emoji
      titleImg: "src/assets/game1_title.png",
      iconImg: "",
      // 💥 利用 \n 实现换行
      desc: "今天是周末，你正准备睡个懒觉，突然手机狂震，家族群里消息像连珠炮一样弹出来——你必须在他们受骗前，逐一击破这些骗局。",
      status: "active",
      tags: ["AI图片识别", "钓鱼网站辨认", "共享屏幕诈骗"],
      cards: [
        {
          title: "绝不共享屏幕",
          content:
            "官方客服绝不会要求你使用外部会议软件进行“屏幕共享”。一旦开启，你的验证码和密码将完全透明！",
        },
        {
          title: "没有所谓的安全账户",
          content: "没有任何转入“安全账户”或“验资账户”的操作。",
        },
        {
          title: "警惕奇怪域名",
          content:
            "正规域名不会包含 free、xyz、vip 等后缀。点击链接前，务必仔细核对域名。",
        },
      ],
    },
    {
      id: "game2",
      title: "真假张阿姨",
      icon: "",
      time: "5 分钟",
      titleImg: "src/assets/game2_title.png",
      iconImg: "",
      desc: "本是家长里短的小区业主群，藏着披着 “张阿姨” 马甲的骗子，虚假推文藏着钓鱼陷阱,快来帮妈妈识破骗局！",
      status: "active",
      tags: ["隐私防护", "权限管理", "数据安全"],
      cards: [
        {
          title: "最小权限原则",
          content:
            "APP 申请的权限必须与其核心功能直接相关。例如，一个手电筒APP如果申请“通讯录”权限，请果断拒绝！",
        },
        {
          title: "警惕剪贴板读取",
          content:
            "许多APP在启动时会偷偷读取你的剪贴板，这可能泄露你刚刚复制的密码、身份证号或私人地址。",
        },
      ],
    },
    {
      id: "game3",
      title: "流言粉碎机",
      icon: "🗞️",
      time: "4 分钟",
      titleImg: "",
      iconImg: "",
      desc: "运用工具和逻辑，\n找出惊悚标题和AI图片中的漏洞。",
      status: "locked",
      tags: ["流言粉碎机", "假新闻识别", "AI鉴真"],
      cards: [],
    },
    {
      id: "game4",
      title: "敬请期待...",
      icon: "🔒",
      time: "",
      titleImg: "",
      iconImg: "",
      // 💥 特殊标识：告诉 UI 隐藏时间、标签、卡片按钮
      comingSoon: true,
      desc: "更多精彩的数字素养挑战正在加紧开发中，\n感谢您的关注！",
      status: "locked",
      tags: [],
      cards: [],
    },
  ];

  const savedDataStr = localStorage.getItem("truth-magnifier-progress");
  let initialGames = defaultGames;

  if (savedDataStr) {
    try {
      const savedGames = JSON.parse(savedDataStr);
      initialGames = defaultGames.map((newGame) => {
        const oldGameProgress = savedGames.find((g) => g.id === newGame.id);
        if (oldGameProgress) {
          return { ...newGame, status: oldGameProgress.status };
        }
        return newGame;
      });
    } catch (error) {
      initialGames = defaultGames;
    }
  }

  const games = ref(initialGames);

  watch(
    games,
    (newVal) => {
      localStorage.setItem("truth-magnifier-progress", JSON.stringify(newVal));
    },
    { deep: true },
  );

  const completeLevel = (index) => {
    games.value[index].status = "completed";
    if (index + 1 < games.value.length) {
      games.value[index + 1].status = "active";
    }
  };

  return { games, completeLevel };
}
