// game2 静态资源映射（经典脚本：路径相对于站点根目录，所有 HTML 页面均位于根目录）
// 对应原 src/views/games/game2/data/story.js 顶部的资源导入
const asset = (path) => path;

const ASSETS = {
  AVATARS: {
    mom_normal: asset("assets/game2/img/mom_normal.png"),
    mom_happy: asset("assets/game2/img/mom_happy.png"),
    mom_thinking: asset("assets/game2/img/mom_thinking.png"),
    mom_surprised: asset("assets/game2/img/mom_surprised.png"),
    mom_sad: asset("assets/game2/img/mom_sad.png"),
    aunt_zhang: asset("assets/game2/img/aunt_zhang.png"),
  },
  ICONS: {
    phone_icon: asset("assets/game2/img/phone_icon.svg"),
    icon_back: asset("assets/game2/img/icon_back.svg"),
    icon_dots: asset("assets/game2/img/icon_dots.svg"),
    icon_close: asset("assets/game2/img/icon_close.svg"),
    icon_voice: asset("assets/game2/img/icon_voice.svg"),
    icon_emoji: asset("assets/game2/img/icon_emoji.svg"),
    icon_plus: asset("assets/game2/img/icon_plus.svg"),
    icon_search: asset("assets/game2/img/icon_search.svg"),
    icon_qrcode: asset("assets/game2/img/icon_qrcode.svg"),
    icon_message: asset("assets/game2/img/icon_message.svg"),
    icon_video_call: asset("assets/game2/img/icon_video_call.svg"),
  },
  AUDIO: {
    bgm: asset("assets/game2/audio/bgm.mp3"),
    click: asset("assets/game2/audio/click.mp3"),
  },
  COVERS: {
    news_banner: asset("assets/game2/img/news_banner.png"),
  },
  BACKGROUNDS: {
    default: asset("assets/game2/img/default-bg.png"),
  },
  IMAGES: {
    oa_icon: asset("assets/game2/img/oa_icon.png"),
    post_cover: asset("assets/game2/img/post_cover.png"),
  },
};
