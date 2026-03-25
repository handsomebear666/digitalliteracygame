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
.wechat-header {
  height: 50px;
  background: #ededed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}
.wechat-header-left {
  width: 40px;
  font-size: 22px;
  cursor: pointer;
  color: #333;
}
.wechat-header-title {
  flex: 1;
  text-align: center;
  font-weight: 500;
  font-size: 17px;
  color: #000;
}
.wechat-header-right {
  width: 40px;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #333;
  cursor: pointer;
}
.header-icon {
  vertical-align: middle;
  cursor: pointer;
}
.icon-close {
  width: 28px;
  height: 28px;
}
.icon-dots {
  width: 35px;
  height: 28px;
}
.welfare-banner {
  background: linear-gradient(135deg, #ff4d4f, #ff7a45);
  color: white;
  padding: 40px 20px;
  text-align: center;
}
.welfare-banner h2 {
  font-size: 24px;
  margin-bottom: 10px;
  letter-spacing: 2px;
}
.welfare-banner p {
  font-size: 15px;
  opacity: 0.9;
}
.welfare-form {
  background: white;
  margin: -20px 15px 0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
}
.form-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}
.welfare-input {
  width: 100%;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 15px;
  font-size: 15px;
  margin-bottom: 15px;
  color: #666;
  background: #fcfcfc;
}
.code-group {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
.code-input {
  margin-bottom: 0;
  flex: 1;
  background: #fff;
}
.get-code-btn {
  padding: 0 15px;
  background: #f2f2f2;
  color: #999;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
}
.submit-welfare-btn {
  width: 100%;
  height: 48px;
  background: #ff4d4f;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}
</style>
