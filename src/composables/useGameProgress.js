import { ref, watch } from "vue";

export function useGameProgress() {
  // 1. 默认的游戏关卡数据
  const defaultGames = [
    {
      id: "game1",
      title: "家庭保卫战",
      icon: "🛡️",
      time: "3 分钟",
      target: "掌握 3 种反诈技巧",
      desc: "今天是周末，你正准备睡个懒觉，\n突然手机狂震，家族群里消息像连珠炮一样弹出来——\n家族成员的认知和钱包正在遭受“数字病毒”的全面入侵！\n你必须在他们受骗前，逐一击破这些陷阱。",
      status: "active",
    },
    {
      id: "game2",
      title: "隐私迷宫",
      icon: "🤫",
      time: "5 分钟",
      target: "了解权限管理",
      desc: "进入虚拟APP，正确拒绝不合理的隐私权限请求。",
      status: "active",
    },
    {
      id: "game3",
      title: "流言粉碎机",
      icon: "🗞️",
      time: "4 分钟",
      target: "识别假新闻",
      desc: "运用工具和逻辑，找出惊悚标题和AI图片中的漏洞。",
      status: "active",
    },
    {
      id: "game4",
      title: "安全网购港",
      icon: "💰",
      time: "3 分钟",
      target: "识别钓鱼网站",
      desc: "在模拟的购物节中，避开钓鱼网站和虚假客服。",
      status: "locked",
    },
  ];

  // 2. 初始化：优先尝试从 LocalStorage 读取用户之前的进度
  const savedData = localStorage.getItem("truth-magnifier-progress");
  const games = ref(savedData ? JSON.parse(savedData) : defaultGames);

  // 3. 自动保存：只要 games 发生变化，深度监听并自动存入 LocalStorage
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
      // 最后一关也通关了
      setTimeout(() => {
        alert(
          "太棒了！你已看清了数字世界的全部真相，达成了数字素养大师勋章！🏆",
        );
      }, 300);
    }
  };

  // 暴露给外部组件使用的数据和方法
  return {
    games,
    completeLevel,
  };
}
