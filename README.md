# 真相放大镜（digitalliteracygame）

一款数字素养科普小游戏，包含「家庭保卫战」与「真假张阿姨」两个关卡，以及对应的知识卡片图鉴。项目已由 Vue 3 + Vite 重构为**纯 HTML + CSS + 原生 JavaScript（ES Module）**，无需安装依赖、无需构建，直接用浏览器打开即可游玩。

## 目录结构

```
├── index.html            # 主页地图（关卡入口）
├── game1.html            # 关卡一：家庭保卫战
├── game2.html            # 关卡二：真假张阿姨
├── cards.html            # 知识卡片图鉴
├── favicon.ico           # 站点图标
├── css/                  # 样式（按页面/模块拆分）
│   ├── base.css          # 全局基础样式
│   ├── home.css          # 主页样式
│   ├── game1.css         # 关卡一样式
│   ├── game2.css         # 关卡二样式
│   ├── cards.css         # 知识卡片样式
│   └── game2/phone.css   # 关卡二手机模拟器样式
├── js/                   # 逻辑（按页面/模块拆分）
│   ├── home.js           # 主页渲染
│   ├── cards.js          # 知识卡片渲染
│   ├── progress.js       # 本地进度存取
│   ├── game1/            # 关卡一（store / main 等）
│   └── game2/            # 关卡二（store / story / main / components / phone-pages / assets）
└── assets/               # 图片、音频等静态资源
```

## 如何运行

由于是纯静态站点，直接双击打开 `index.html` 即可游玩。

也可以通过任意静态服务器预览，例如 VS Code 的 Live Server 插件，或：

```sh
python -m http.server 8080
```

然后访问 http://localhost:8080 。

## 部署到 GitHub Pages

仓库已配置 `.github/workflows/deploy.yml`，推送到 `main` 分支后会自动把仓库根目录发布为 GitHub Pages 站点，无需构建步骤。

