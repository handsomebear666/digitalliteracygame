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
import { useGameStore } from "@game2/store/useGameStore";
import auntZhangImg from "@game2/assets/img/aunt_zhang.png";

const store = useGameStore();
</script>
