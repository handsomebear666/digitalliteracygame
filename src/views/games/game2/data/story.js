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
// 还有其他图片：oa_icon.png, icon_back.svg, icon_dots.svg, icon_voice.svg, icon_emoji.svg, icon_plus.svg, icon_close.svg, post_cover.png, etc.
// 根据组件中的实际使用情况，逐一导入。

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
  typo: "【破绽 1】名字是“管”字，且无官方认证！",
  subject: "【破绽 2】市级机构的认证主体绝对不可能是“个人”！",
  history: "【破绽 3】堂堂市级机构，竟然只有最新的一条推文！",
};

export const GAME_STORY = {
  // === 对话大厅剧本 ===
  scriptLines: [
    {
      id: 0,
      name: "妈妈",
      emotion: "happy",
      text: "林林，张大姐在业主群发了个咱市图书馆的公众号名片，说关注就能领 50 块钱话费和一箱抽纸。",
      nextId: 1,
    },
    {
      id: 1,
      name: "妈妈",
      emotion: "thinking",
      text: "我看头像是咱图书馆的标，这就准备点关注了！",
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
      text: "唉，你这孩子就是太谨慎，名额有限，我先点了啊！\n【游戏结束：未能阻止风险】",
      options: [{ text: "回到刚才", nextId: 1 }],
    },
    {
      id: 5,
      name: "系统",
      emotion: "thinking",
      text: "（点击右上角手机按钮，进入群聊帮妈妈体检公众号吧！）",
    },
    {
      id: 6,
      name: "我",
      emotion: "happy",
      text: "妈！你看，这个公众号名字有错别字，'馆'变成了'管'，没加 V 认证，主体还是个'个人'。这就是个专门骗取信息的高仿钓鱼号！",
      nextId: 7,
    },
    {
      id: 7,
      name: "妈妈",
      emotion: "surprised",
      text: "哎哟！还真是个'管'字，我老眼昏花都没看清，吓死我了！",
      nextId: 8,
    },
    {
      id: 8,
      name: "妈妈",
      emotion: "normal",
      text: "不过就算是商贸店搞活动呢？我都点链接把地址和手机号填了，短信验证码刚好发过来了，我瞅瞅。",
      nextId: 9,
    },
    {
      id: 9,
      name: "系统",
      emotion: "thinking",
      text: "（糟糕！妈妈已经填了手机号！快点击右上角的【手机图标】，去看看那个网页！）",
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
      text: "妈，您确定屏幕那头真的是张大姐吗？看我怎么扒了它的皮！",
      nextId: 13,
    },
    {
      id: 13,
      name: "系统",
      emotion: "thinking",
      text: "（第三关开始：点击【手机图标】进入群聊，点击发链接的张大姐的【头像】，执行反诈军体拳！）",
      customAction: "startLevel3",
    },
    {
      id: 14,
      name: "我",
      emotion: "happy",
      text: "妈，您看！真正的张大姐在您好友里，这里应该显示'发消息'。假的张大姐还得要您'加好友'，这就是个混进群、改了名字头像伪装成张大姐的骗子！",
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
      emotion: "normal",
      text: "妈，微信有投诉的功能，我教你！直接把它的号给封了！",
      nextId: 17,
    },
    {
      id: 17,
      name: "系统",
      emotion: "thinking",
      text: "（最后一步：再次点击【手机图标】，对这个假张大姐进行【投诉】！）",
      customAction: "startReport",
    },
  ],

  // === 微信群聊数据 ===
  ownerGroupMessages: [
    {
      sender: "张大姐",
      avatar: "aunt_zhang",
      type: "text",
      content:
        "咱市图书馆在搞建馆周年庆。点进去关注就能领 50 块话费，还额外送一箱大卷纸，说名额只有前 500 个！",
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
