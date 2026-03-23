// 导入所有图片资源
import meImg from "@/views/games/game1/assets/img/me.png";
import uncleImg from "@/views/games/game1/assets/img/two uncle.png";
import auntImg from "@/views/games/game1/assets/img/aunt.png";
import oneUncleImg from "@/views/games/game1/assets/img/one uncle.png";
import threeCousinImg from "@/views/games/game1/assets/img/three_cousin.png";
import fourCousinImg from "@/views/games/game1/assets/img/four_cousin.png";
import motherImg from "@/views/games/game1/assets/img/mother.png";
import fatherImg from "@/views/games/game1/assets/img/father.png";
import oneCousinImg from "@/views/games/game1/assets/img/one cousin.png";
import monsterImg from "@/views/games/game1/assets/img/monster.jpg";
import signalMonsterImg from "@/views/games/game1/assets/img/signalmonster.png";
import kefuImg from "@/views/games/game1/assets/img/kefu.png";
import yurongfuImg from "@/views/games/game1/assets/img/yurongfu.png";
import backSvg from "@/views/games/game1/assets/img/back.svg";
import moreSvg from "@/views/games/game1/assets/img/more.svg";
import voiceIconSvg from "@/views/games/game1/assets/img/voice-icon.svg";
import emojiIconSvg from "@/views/games/game1/assets/img/emoji-icon.svg";
import plusIconSvg from "@/views/games/game1/assets/img/plus-icon.svg";
import messageMp3 from "@/views/games/game1/assets/audio/message.mp3";
import bgmMp3 from "@/views/games/game1/assets/audio/bgm.mp3";
import clickMp3 from "@/views/games/game1/assets/audio/click.mp3";
import confettiMp3 from "@/views/games/game1/assets/audio/confetti.mp3";

export const ASSETS = {
  AVATARS: {
    me: meImg,
    uncle: uncleImg,
    aunt: auntImg,
    one_uncle: oneUncleImg,
    three_cousin: threeCousinImg,
    four_cousin: fourCousinImg,
    mother: motherImg,
    father: fatherImg,
    one_cousin: oneCousinImg,
  },
  IMAGES: {
    monster: monsterImg,
    signal_monster: signalMonsterImg,
  },
  ICONS: {
    back: backSvg,
    more: moreSvg,
    voice_icon: voiceIconSvg,
    emoji_icon: emojiIconSvg,
    plus_icon: plusIconSvg,
  },
  AUDIO: {
    message: messageMp3,
    bgm: bgmMp3,
    click: clickMp3,
    confetti: confettiMp3,
  },
  OTHERS: {
    kefu: kefuImg,
    yurongfu: yurongfuImg,
  },
};

// 剧情数据配置
export const GAME_STORY = {
  title: "相亲相爱一家人",
  openingimage: [
    {
      sender: "二大爷",
      image: monsterImg, // 图片变量
      avatar: "uncle", // 注意：这里只写字符串键名，不是图片变量！
      delay: 0,
    },
  ],
  openingtext: [
    {
      sender: "二大爷",
      text: "震惊！漓江出现了变异巨兽，赶紧发给家里人看，马上就要被删了！",
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
      text: "😮这是在漓江哪呀，好眼熟",
      avatar: "one_uncle",
      delay: 4500,
    },
    {
      sender: "老妈",
      text: "天哪，好吓人",
      avatar: "mother",
      delay: 6000,
    },
  ],
  warningText:
    "今天是周末，你正准备睡个懒觉，\n突然手机狂震，家族群里消息像连珠炮一样弹出来——\n家族成员的认知和钱包正在遭受“数字病毒”的全面入侵！\n你必须在他们受骗前，逐一击破这些陷阱。",
  level2_opening: [
    {
      sender: "三姑",
      text: "哎呀别管什么水怪了，快快快！波登登羽绒服厂家搞内部清仓，点击链接免费领一件！还剩最后几百件了，大家快抢：<br><a href='javascript:void(0)' onclick='openTaobao()' style='color: #07c160; word-break: break-all;'>www.taoobaoo-vip-free.xyz</a>",
      avatar: "aunt",
      delay: 1500,
    },
    {
      sender: "三表姐",
      text: "这么便宜，我也要来薅羊毛！",
      avatar: "three_cousin",
      delay: 3000,
    },
    {
      sender: "四表哥",
      text: "可惜是女装，要不然我也能买了😟",
      avatar: "four_cousin",
      delay: 4500,
    },
  ],
  level3_opening: [
    {
      sender: "老妈",
      text: "吓死我了！刚才微信支付客服给我打了个腾腾会议视频，说我的账户被误开通了百万保障险，每个月要自动扣我 800 块钱！",
      avatar: "mother",
      delay: 1500,
    },
    {
      sender: "老妈",
      text: "那个客服小姑娘穿着工服，说话特别专业，还能准确报出我的身份证号和家庭住址！她说马上帮我在线取消！",
      avatar: "mother",
      delay: 3500,
    },
    {
      sender: "老妈",
      text: "她给我发了个链接，让我进去后打开屏幕共享，方便指导我操作。我正在弄呢，你们帮我看看这操作对不对？<br><br><a href='javascript:void(0)' onclick='openFaceTime()' style='color: #07c160; word-break: break-all; font-weight: bold;'>📞 点击加入客服视频会议</a>",
      avatar: "mother",
      delay: 5500,
    },
    {
      sender: "大舅",
      text: "每个月要扣这么多钱？",
      avatar: "one_uncle",
      delay: 7500,
    },
    {
      sender: "大舅",
      text: "是得赶紧取消！",
      avatar: "one_uncle",
      delay: 9500,
    },
    {
      sender: "二大爷",
      text: "幸好这个小姑娘来电告诉你了，她真负责👍",
      avatar: "uncle",
      delay: 11500,
    },
  ],
};
