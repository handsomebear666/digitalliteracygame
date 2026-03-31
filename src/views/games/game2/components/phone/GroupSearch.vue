<template>
  <div class="wechat-page">
    <div class="search-header">
      <div class="search-bar-wrap">
        <img :src="iconSearch" class="search-icon" />
        <input type="text" class="search-input" value="张大姐" readonly />
      </div>
      <div class="search-back" @click="store.navigatePhone('chat')">取消</div>
    </div>

    <div class="search-list">
      <div
        class="search-result-item"
        @click="store.showToast('你刚刚看过了，这是个假冒的！')"
      >
        <img :src="auntZhangImg" class="search-avatar" />
        <div class="search-info">
          <div class="s-name"><span class="highlight">张</span>大姐</div>
          <div class="s-sub">昵称：<span class="highlight">张</span>大姐</div>
        </div>
      </div>

      <div
        class="search-result-item flaw-row"
        :class="{ 'flaw-exposed': store.foundFlawsL3.includes('real') }"
        @click="store.triggerL3Debunk('real')"
      >
        <img :src="auntZhangImg" class="search-avatar" />
        <div class="search-info">
          <div class="s-name"><span class="highlight">张</span>大姐</div>
          <div class="s-sub">群昵称：<span class="highlight">张</span>大姐</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import auntZhangImg from "@/views/games/game2/assets/img/aunt_zhang.png";
import iconSearch from "@/views/games/game2/assets/img/icon_search.svg";

const store = useGameStore();
</script>

<style scoped>
.wechat-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f2f2f2; /* 微信搜索底层通常是浅灰色 */
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部搜索栏样式 */
.search-header {
  background: #ededed;
  padding: 10px 15px;
  display: flex;
  align-items: center;
}

.search-bar-wrap {
  flex: 1;
  background: #fff;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-right: 15px; /* 与右侧取消按钮保持间距 */
}

.search-icon {
  font-size: 16px;
  color: #b2b2b2;
  margin-right: 6px;
}

.search-input {
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
  background: transparent;
}

.search-back {
  color: #576b95; /* 微信标准文字链接蓝 */
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
}

/* 列表区域 */
.search-list {
  background: #fff;
}

/* 列表项样式 */
.search-result-item {
  display: flex;
  align-items: center;
  padding: 0 15px; /* 上下内边距移到 info 层，为了完美控制底边框 */
  background: #fff;
  cursor: pointer;
  position: relative;
}

/* 触摸反馈效果 */
.search-result-item:active {
  background: #ececec;
}

.search-avatar {
  width: 44px;
  height: 44px;
  border-radius: 4px; /* 微信头像是微圆角矩形 */
  margin-right: 12px;
  flex-shrink: 0;
}

/* 右侧信息层：控制底边框不穿越头像 */
.search-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 0;
  border-bottom: 0.5px solid #e5e5e5; /* 极细的分割线 */
}

/* 最后一项隐藏底边框 */
.search-result-item:last-child .search-info {
  border-bottom: none;
}

.s-name {
  font-size: 16px;
  color: #1a1a1a;
  line-height: 1.4;
}

.s-sub {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}

/* 微信专属匹配高亮绿 */
.highlight {
  color: #07c160;
}

/* 破绽动画逻辑保持不变 */
.flaw-row {
  border-radius: 4px;
}

.flaw-exposed::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border: 2.5px solid #ff4d4f;
  border-radius: 8px;
  pointer-events: none;
  z-index: 100;
  animation: pop-flaw 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

@keyframes pop-flaw {
  0% {
    transform: scale(1.05);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
