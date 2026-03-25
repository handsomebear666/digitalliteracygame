<template>
  <div class="wechat-page" style="background: #ededed; z-index: 100">
    <div class="search-header">
      <div class="search-back" @click="store.navigatePhone('chat')">取消</div>
      <div class="search-bar-wrap">
        <div class="search-icon">🔍</div>
        <input type="text" class="search-input" value="张大姐" readonly />
      </div>
    </div>
    <div class="search-title">群成员</div>

    <div
      class="search-result-item"
      @click="store.showToast('你刚刚看过了，这是个假冒的！')"
    >
      <img :src="auntZhangImg" class="search-avatar" />
      <div class="search-info">
        <div class="s-name">张大姐</div>
        <div class="s-sub">昵称：张大姐</div>
      </div>
    </div>

    <div
      class="search-result-item flaw-row"
      :class="{ 'flaw-exposed': store.foundFlawsL3.includes('real') }"
      @click="store.triggerL3Debunk('real')"
    >
      <img :src="auntZhangImg" class="search-avatar" />
      <div class="search-info">
        <div class="s-name">张大姐</div>
        <div class="s-sub">群昵称：张大姐</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import auntZhangImg from "@/views/games/game2/assets/img/aunt_zhang.png";

const store = useGameStore();
</script>

<style scoped>
.wechat-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ededed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.search-header {
  background: #ededed;
  padding: 10px 15px;
  display: flex;
  align-items: center;
}
.search-back {
  color: #576b95;
  font-size: 16px;
  cursor: pointer;
}
.search-bar-wrap {
  flex: 1;
  background: #fff;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-left: 15px;
}
.search-icon {
  color: #b2b2b2;
  margin-right: 8px;
}
.search-input {
  border: none;
  outline: none;
  font-size: 15px;
  width: 100%;
}
.search-title {
  padding: 10px 15px;
  font-size: 13px;
  color: #888;
}
.search-result-item {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.search-avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  margin-right: 12px;
}
.search-info {
  flex: 1;
}
.s-name {
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 2px;
}
.s-sub {
  font-size: 13px;
  color: #999;
}
.flaw-row {
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}
.flaw-exposed::after {
  content: "";
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2.5px solid #ff4d4f;
  border-radius: 8px;
  pointer-events: none;
  z-index: 100;
  animation: pop-flaw 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}
@keyframes pop-flaw {
  0% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
