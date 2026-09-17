// game1 静态资源映射（经典脚本：路径相对于站点根目录，所有 HTML 页面均位于根目录）
// 对应原 src/views/games/game1/config/story.js 顶部的资源导入
const asset = (path) => path;

const ASSETS = {
  AVATARS: {
    me: asset("assets/game1/img/me.png"),
    uncle: asset("assets/game1/img/two uncle.png"),
    aunt: asset("assets/game1/img/aunt.png"),
    one_uncle: asset("assets/game1/img/one uncle.png"),
    three_cousin: asset("assets/game1/img/three_cousin.png"),
    four_cousin: asset("assets/game1/img/four_cousin.png"),
    mother: asset("assets/game1/img/mother.png"),
    father: asset("assets/game1/img/father.png"),
    one_cousin: asset("assets/game1/img/one cousin.png"),
  },
  IMAGES: {
    monster: asset("assets/game1/img/monster.jpg"),
    signal_monster: asset("assets/game1/img/signalmonster.png"),
  },
  ICONS: {
    back: asset("assets/game1/img/back.svg"),
    more: asset("assets/game1/img/more.svg"),
    voice_icon: asset("assets/game1/img/voice-icon.svg"),
    emoji_icon: asset("assets/game1/img/emoji-icon.svg"),
    plus_icon: asset("assets/game1/img/plus-icon.svg"),
  },
  AUDIO: {
    message: asset("assets/game1/audio/message.mp3"),
    bgm: asset("assets/game1/audio/bgm.mp3"),
    click: asset("assets/game1/audio/click.mp3"),
    confetti: asset("assets/game1/audio/confetti.mp3"),
  },
  OTHERS: {
    kefu: asset("assets/game1/img/kefu.png"),
    yurongfu: asset("assets/game1/img/yurongfu.png"),
  },
};
