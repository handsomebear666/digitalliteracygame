// 删除 BASE 相关定义
// const BASE = import.meta.env.BASE_URL;

// 导入所有需要用到的资源
import momNormalImg from "@/views/games/game2/assets/img/mom_normal.png";
import momHappyImg from "@/views/games/game2/assets/img/mom_happy.png";
import momThinkingImg from "@/views/games/game2/assets/img/mom_thinking.png";
import momSurprisedImg from "@/views/games/game2/assets/img/mom_surprised.png";
import momSadImg from "@/views/games/game2/assets/img/mom_sad.png";
import auntZhangImg from "@/views/games/game2/assets/img/aunt_zhang.png";
import phoneIconSvg from "@/views/games/game2/assets/img/phone_icon.svg";
import bgmMp3 from "@/views/games/game2/assets/audio/bgm.mp3";
import clickMp3 from "@/views/games/game2/assets/audio/click.mp3";
import newsBannerImg from "@/views/games/game2/assets/img/news_banner.png";
import defaultBgImg from "@/views/games/game2/assets/img/default-bg.png";

export const ASSETS = {
  AVATARS: {
    mom_normal: momNormalImg,
    mom_happy: momHappyImg,
    mom_thinking: momThinkingImg,
    mom_surprised: momSurprisedImg,
    mom_sad: momSadImg,
    aunt_zhang: auntZhangImg,
  },
  ICONS: { phone_icon: phoneIconSvg },
  AUDIO: {
    bgm: bgmMp3,
    click: clickMp3,
  },
  COVERS: {
    news_banner: newsBannerImg,
  },
  BACKGROUNDS: {
    default: defaultBgImg,
  },
};

export const DEBUNK_MESSAGES = {
  typo: "公众号名字中是管字，且无官方认证！",
  subject: "市图书馆公众号的认证主体绝对不可能是个人！",
  history: "公众号竟然只有一条发福利的推文，这不正常！",
};

export const GAME_STORY = {
  // === 对话大厅剧本 ===
  scriptLines: [
    {
      id: 0,
      name: "妈妈",
      emotion: "happy",
      text: "林林，张大姐在业主群发了个咱市图书馆的公众号名片，说在最新的推文里点击链接，就能领 50 块钱话费和一箱抽纸。",
      nextId: 1,
    },
    {
      id: 1,
      name: "妈妈",
      emotion: "thinking",
      text: "我看头像是咱图书馆的图标，我这就准备去领取了！",
      nextId: 2,
    },
    {
      id: 2,
      name: "我",
      emotion: "normal",
      text: "张大姐平时就爱转发这些，图书馆周年庆怎么会用这种微商风格的宣传图？",
      nextId: 3,
    },
    {
      id: 3,
      name: "系统",
      emotion: "thinking",
      text: "（我该怎么样劝妈妈谨慎点？）",
      options: [
        { text: "妈妈，天上不会掉馅饼，别理它。", nextId: 4 },
        { text: "等等妈！我帮你看看！", nextId: 5 },
      ],
    },
    {
      id: 4,
      name: "妈妈",
      emotion: "sad",
      text: "唉，你这孩子就是太谨慎，名额有限，我先点了啊！",
      customAction: "badEnd", // 标记为失败结局
    },
    {
      id: 5,
      name: "系统",
      emotion: "thinking",
      text: "（点击右上角图标，去群聊中帮妈妈把把关！）",
    },
    {
      id: 6,
      name: "我",
      emotion: "happy",
      text: "妈！你看这个公众号的名字，馆变成了管，没加 V 认证，主体还是个人。这就是个专门骗取信息的高仿钓鱼号！",
      nextId: 7,
    },
    {
      id: 7,
      name: "妈妈",
      emotion: "surprised",
      text: "哎哟！还真是个管字，我都没仔细看清楚！",
      nextId: 8,
    },
    {
      id: 8,
      name: "妈妈",
      emotion: "normal",
      text: "不过可能是个体店搞活动呢？我已经点击链接把地址和手机号填了，短信验证码刚好发过来了。",
      nextId: 9,
    },
    {
      id: 9,
      name: "系统",
      emotion: "thinking",
      text: "（糟糕！妈妈已经填了手机号！快点击右上角的图标，去看看那个网页！）",
      customAction: "startLevel2",
    },
    {
      id: 10,
      name: "我",
      emotion: "surprised",
      text: "妈！快停下！这不是领钱，这是在改你的支付密码准备盗刷！",
      nextId: 11,
    },
    {
      id: 11,
      name: "妈妈",
      emotion: "sad",
      text: "天呐！可是这是张大姐发的呀，平时跟我关系可好了，她怎么会骗我？",
      nextId: 12,
    },
    {
      id: 12,
      name: "我",
      emotion: "normal",
      text: "妈，您确定屏幕那头真的是张大姐吗？看我怎么拆穿她的伪装！",
      nextId: 13,
    },
    {
      id: 13,
      name: "系统",
      emotion: "thinking",
      text: "（进入群聊，点击发链接的张大姐的头像，找到其假冒的证据吧！）",
      customAction: "startLevel3",
    },
    {
      id: 14,
      name: "我",
      emotion: "happy",
      text: "妈，您看！真正的张大姐在您好友里，这里应该显示发消息。假的张大姐还得要您加好友，这就是个混进群、改了名字头像伪装成张大姐的骗子！",
      nextId: 15,
    },
    {
      id: 15,
      name: "妈妈",
      emotion: "surprised",
      text: "原来是这样！我这就去群里揭穿它，让群主把它踢了！",
      nextId: 16,
    },
    {
      id: 16,
      name: "我",
      emotion: "surprised",
      text: "妈，以后遇到这种事情，一定要擦亮眼睛仔细辨别呀！骗子就是看准了你们喜欢相信熟人这一点才冒充熟人行骗的！",
      nextId: 17,
    },
    {
      id: 17,
      name: "我",
      emotion: "surprised",
      text: "骗子就是看准了你们喜欢相信熟人这一点才会冒充熟人行骗的！",
      nextId: 18,
    },
    {
      id: 18,
      name: "妈妈",
      emotion: "normal",
      text: "吃一堑长一智啊！这次幸亏有你，要不然我肯定上当了！",
      nextId: 19,
    },
    {
      id: 19,
      name: "妈妈",
      emotion: "normal",
      text: "以后我肯定会好好注意的！",
      customAction: "gameWin", // 游戏胜利，不再继续
    },
    // id:16 和 id:17 已删除，因为不再需要投诉环节
  ],

  // === 微信群聊数据 ===
  ownerGroupMessages: [
    {
      sender: "张大姐",
      avatar: "aunt_zhang",
      type: "text",
      content:
        "咱市图书馆在搞建馆周年庆。点击推文的链接，填了信息就能领 50 块话费，还额外送一箱大卷纸，名额只有前 100 个！",
      time: "半小时前",
    },
    {
      sender: "张大姐",
      avatar: "aunt_zhang",
      type: "oa_card",
      oaName: "XX 市图书管活动中心",
      oaDesc: "公众号名片",
      time: "半小时前",
    },
  ],
};
