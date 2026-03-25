<template>
  <div class="wechat-page" style="background: #f5f5f5; z-index: 100">
    <div class="wechat-header" style="background: #ffffff">
      <div class="wechat-header-left" @click="store.returnToDialogue()">
        <img
          :src="iconClose"
          class="header-icon icon-close"
          style="filter: brightness(0)"
        />
      </div>
      <div class="wechat-header-title" style="font-size: 16px">
        三十周年回馈活动
      </div>
      <div class="wechat-header-right">
        <img
          :src="iconDots"
          class="header-icon icon-dots"
          style="filter: brightness(0)"
        />
      </div>
    </div>
    <div class="welfare-banner">
      <h2>🎁 倾情回馈 免费领取</h2>
      <p>50 元话费 + 高级抽纸一箱</p>
    </div>
    <div class="welfare-form">
      <div class="form-title">请填写收货与充值信息</div>
      <input
        type="text"
        class="welfare-input"
        value="幸福小区 3 栋 2 单元 501"
        readonly
      />
      <input type="text" class="welfare-input" value="138****5678" readonly />
      <div class="code-group">
        <input
          type="text"
          class="welfare-input code-input"
          placeholder="请输入短信验证码"
        />
        <button
          class="get-code-btn"
          @click="store.showToast('验证码已发送，请注意查收！')"
        >
          重新获取 (59s)
        </button>
      </div>
      <button
        class="submit-welfare-btn"
        @click="store.showToast('请先输入验证码！')"
      >
        立即免费领取
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import iconClose from "@/views/games/game2/assets/img/icon_close.svg";
import iconDots from "@/views/games/game2/assets/img/icon_dots.svg";
const store = useGameStore();
</script>
