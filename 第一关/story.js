// 1. 资源路径统一配置 (以后换图只在这里换)
const ASSETS = {
  AVATARS: {
    me: "assets/me.png",
    uncle: "assets/two uncle.png",
    aunt: "assets/aunt.png",
    one_uncle: "assets/one uncle.png",
    three_cousin: "assets/three_cousin.png",
    four_cousin: "assets/four_cousin.png",
    mother: "assets/mother.png",
  },
  IMAGES: {
    monster: "assets/monster.jpg", // 二大爷发的巨兽图片
  },
  ICONS: {
    battery: "assets/battery.svg",
    wifi: "assets/wifi.svg",
    signal: "assets/signal.svg",
    back: "assets/back.svg",
    more: "assets/more.svg",
    voice_icon: "assets/voice-icon.svg",
    emoji_icon: "assets/emoji-icon.svg",
    plus_icon: "assets/plus-icon.svg",
  },
};

// 2. 剧情数据配置
const GAME_STORY = {
  title: "相亲相爱一家人",
  openingimage: [
    {
      sender: "二大爷",
      image: "assets/monster.jpg",
      avatar: "uncle",
      delay: 0,
    },
  ],
  // 初始冷开场：配置好每一句话是谁说的，用什么头像，延迟几秒发
  openingtext: [
    {
      sender: "二大爷",
      text: "震惊！咱们本地捞出变异巨兽，赶紧发给家里人看，马上就要被删了！",
      avatar: "uncle",
      delay: 1000,
    },
    {
      sender: "三姑",
      text: "哎呀太可怕了！大家最近千万别吃江里的鱼了！",
      avatar: "aunt",
      delay: 2500,
    },
    {
      sender: "大舅",
      text: "😮这是在我们这的哪呀，好眼熟",
      avatar: "one_uncle",
      delay: 4500,
    },
    {
      sender: "老妈",
      text: "天哪",
      avatar: "mother",
      delay: 6000,
    },
  ],
  // 系统警告文字
  warningText: `
你是家族里唯一懂点技术的年轻人，
群昵称：全村的希望。
今天是周末，你正准备睡个懒觉，
突然手机狂震，群里消息像连珠炮一样弹出来——
家族成员的认知和钱包正在遭受“数字病毒”的全面入侵！
你必须在他们付钱或受骗前，逐一击破这些陷阱。`,
};
