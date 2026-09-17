// 全局游戏进度：localStorage 持久化 + 关卡卡片数据
// 对应原 src/composables/useGameProgress.js

const STORAGE_KEY = "truth-magnifier-progress";

// 经典脚本：资源路径相对于站点根目录（所有 HTML 页面均位于根目录）
const game1TitleImg = "assets/common/game1_title.png";
const game2TitleImg = "assets/common/game2_title.png";

function defaultGames() {
  return [
    {
      id: "game1",
      title: "家庭保卫战",
      icon: "",
      time: "3 分钟",
      level: 2,
      titleImg: game1TitleImg,
      iconImg: "",
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
      level: 4,
      titleImg: game2TitleImg,
      iconImg: "",
      desc: "本是家长里短的小区业主群，藏着冒充张阿姨的骗子，虚假推文藏着钓鱼陷阱,快来帮妈妈识破骗局！",
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
      title: "敬请期待...",
      icon: "🔒",
      time: "",
      titleImg: "",
      iconImg: "",
      comingSoon: true,
      desc: "更多精彩的数字素养挑战正在加紧开发中，\n感谢您的关注！",
      status: "locked",
      tags: [],
      cards: [],
    },
  ];
}

function getGames() {
  const defaults = defaultGames();
  const savedStr = localStorage.getItem(STORAGE_KEY);
  let games = defaults;

  if (savedStr) {
    try {
      const savedGames = JSON.parse(savedStr);
      games = defaults.map((newGame) => {
        const old = savedGames.find((g) => g.id === newGame.id);
        if (old) return { ...newGame, status: old.status };
        return newGame;
      });
    } catch (error) {
      games = defaults;
    }
  }

  // 所有“敬请期待”的游戏都强制为 locked 状态
  games.forEach((game) => {
    if (game.comingSoon) game.status = "locked";
  });

  return games;
}

function saveGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

function completeLevel(index) {
  const games = getGames();
  games[index].status = "completed";
  const nextIndex = index + 1;
  if (nextIndex < games.length) {
    const nextGame = games[nextIndex];
    // 如果下一个游戏是“敬请期待”，则不自动解锁
    if (!nextGame.comingSoon) nextGame.status = "active";
  }
  saveGames(games);
}
