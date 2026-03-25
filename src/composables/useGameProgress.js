// src/composables/useGameProgress.js (完整代码)
import { ref, watch } from "vue";

export function useGameProgress() {
  // 1. 默认的游戏关卡数据
  const defaultGames = [
    {
      id: "game1",
      title: "家庭保卫战",
      icon: "🛡️",
      time: "3 分钟",
      desc: "模拟遭遇“杀猪盘”和社交软件借钱陷阱，分辨虚假信息。",
      // 💥【修改】临时将这里改为 completed，用来测试✅标志是否出现。
      // 在真实游戏中，请使用 'active'，然后点击“开始调查”后再调用下面的 completeLevel
      status: "active",
      // ⭐️【修改】将枯燥的“掌握三种反诈技巧”改为可随时修改的多彩气泡标签
      tags: ["反诈高手", "官方认证", "手机安全"],
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
      title: "隐私迷宫",
      icon: "🤫",
      time: "5 分钟",
      desc: "进入虚拟APP，正确拒绝不合理的隐私权限请求。",
      status: "active", // 第一关由于我默认完成了，这里也就解锁了
      // ⭐️【修改】多彩标签
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
      desc: "运用工具和逻辑，找出惊悚标题和AI图片中的漏洞。",
      status: "locked",
      // ⭐️【修改】多彩标签
      tags: ["流言粉碎机", "假新闻识别", "AI鉴真"],
      cards: [],
    },
    {
      id: "game4",
      title: "敬请期待...",
      icon: "🔒", // 改为锁的图标，或者换成 '❓'
      time: "", // 清空时间
      desc: "更多精彩的数字素养挑战正在加紧开发中，感谢您的关注！",
      status: "locked",
      comingSoon: true, // 💥 新增一个标识，用于告诉 UI 隐藏部分元素
      tags: [], // 清空标签
      cards: [],
    },
  ];

  // 2. 💥 全新的初始化逻辑：数据融合 (Data Merge)
  const savedDataStr = localStorage.getItem("truth-magnifier-progress");
  let initialGames = defaultGames; // 默认使用最新的代码数据

  if (savedDataStr) {
    try {
      const savedGames = JSON.parse(savedDataStr);

      // 遍历最新的 defaultGames，尝试从老存档里寻找通关记录
      initialGames = defaultGames.map((newGame) => {
        // 在老存档里找有没有同 ID 的游戏 (比如找老存档里的 game1)
        const oldGameProgress = savedGames.find((g) => g.id === newGame.id);

        if (oldGameProgress) {
          // 如果找到了老存档！
          // 💥 核心：我们只继承老存档里的 status（通关状态），其他所有文本、卡片、气泡标签全部使用 latest code！
          return {
            ...newGame, // 展开最新的游戏数据（包括你刚写的新卡片）
            status: oldGameProgress.status, // 强行把老存档的通关状态覆盖上去
          };
        }

        // 如果在老存档里没找到（比如你更新游戏后新增了 game5），就直接返回最新的状态
        return newGame;
      });
    } catch (error) {
      console.error("读取本地存档失败，已重置为最新默认进度", error);
      initialGames = defaultGames;
    }
  }

  // 3. 将融合后的完美数据交给 Vue 响应式管理
  const games = ref(initialGames);

  // 4. 自动保存 (保持不变)
  watch(
    games,
    (newVal) => {
      localStorage.setItem("truth-magnifier-progress", JSON.stringify(newVal));
    },
    { deep: true },
  );

  // 4. 核心业务方法：处理通关逻辑
  const completeLevel = (index) => {
    // 标记当前关卡为已完成
    games.value[index].status = "completed";

    // 如果还有下一关，则将其状态从 'locked' 改为 'active'
    if (index + 1 < games.value.length) {
      games.value[index + 1].status = "active";
    } else {
      setTimeout(() => {
        alert(
          "太棒了！你已看清了数字世界的全部真相，达成了数字素养大师勋章！🏆",
        );
      }, 500);
    }
  };

  // 暴露给外部组件使用的数据和方法
  return {
    games,
    completeLevel,
  };
}
