// game2 通用组件 / 覆盖层的 HTML 渲染函数
// 对应原 src/views/games/game2/components/{game,common,overlays,phone}/ 中除 phone 页外的组件
// 依赖 js/game2/assets.js（经典脚本全局作用域，先于本文件加载）
// esc 由 js/game2/main.js 全局声明（组件函数均在 main.js 加载后调用）

// Character.vue
// 挂载节点本身即 .character-layer（见 main.js 骨架），这里只返回图层内容
function characterHtml(background, character) {
  return `
    <div class="background" style="background-image: url('${background}')"></div>
    <div class="character" style="background-image: url('${character}')"></div>`;
}

// PhoneIcon.vue
function phoneIconHtml(isHighlighted) {
  return `
    <div class="phone-btn ${isHighlighted ? "pulse-highlight" : ""}" data-action="toggle-phone">
      <img src="${ASSETS.ICONS.phone_icon}" alt="" />
    </div>`;
}

// DialogueUI.vue 的静态骨架（打字/分页逻辑在 main.js 中处理）
// 挂载节点本身即 .dialogue-system-wrapper（见 main.js 骨架），这里只返回内部结构
function dialogueHtml() {
  return `
    <div class="full-screen-clicker" data-action="dialogue-click"></div>
    <div class="ui-layer">
      <div class="options-container" id="options-container"></div>
      <div class="dialogue-bubble" id="dialogue-bubble" data-action="dialogue-click">
        <div class="name-tag" id="name-tag"></div>
        <div class="dialogue-text" id="dialogue-text"></div>
        <div class="next-indicator" id="next-indicator" style="display:none">▼</div>
      </div>
    </div>`;
}

// HintButton.vue
function hintButtonHtml() {
  return `
    <div class="wx-floating-btn" id="hint-btn" data-action="hint-click">
      <span style="font-size: 16px; margin-right: 4px">💡</span><span>提示</span>
    </div>`;
}

// Toast.vue
function toastHtml() {
  return `
    <div id="systemToast" class="system-hint-toast">
      <span id="toast-text"></span>
    </div>`;
}

// SmsPopup.vue（每次显示时重新创建，isExpanded 默认 false）
function smsPopupHtml(level2Solved, isExpanded) {
  if (!isExpanded) {
    return `
      <div class="sms-popup show">
        <div class="sms-header">
          <span class="sms-app-name">💬 信息 · 刚刚</span>
        </div>
        <div class="sms-body">
          【支付安全】您的验证码为 882931，您正在尝...
          <span class="sms-expand-btn" data-action="sms-expand">查看全文</span>
        </div>
      </div>`;
  }
  return `
    <div class="sms-popup show">
      <div class="sms-header">
        <span class="sms-app-name">💬 信息 · 刚刚</span>
      </div>
      <div class="sms-body">
        【支付安全】您的验证码为 882931，您正在尝试通过手机号
        <span class="sms-clickable ${level2Solved ? "sms-keyword-danger" : ""}" data-action="sms-catch">重置支付宝登录密码</span>，请勿泄露。
      </div>
    </div>`;
}

// ActionMenu.vue
function actionMenuHtml() {
  return `
    <div class="action-sheet-bg" data-action="close-action-sheet">
      <div class="action-sheet" data-action="noop">
        <div class="sheet-btn" style="color: #ff4d4f" data-action="report">投诉</div>
        <div class="sheet-btn" data-action="close-action-sheet">取消</div>
      </div>
    </div>`;
}

// ResultPopup.vue
function resultPopupHtml(resultData) {
  if (resultData.type === "fail") {
    return `
      <div class="result-popup-overlay">
        <div class="result-popup-card">
          <div class="popup-inner">
            <div class="fail-header">
              <div class="fail-icon">⚠️</div>
              <h2>${esc(resultData.title)}</h2>
            </div>
            <div class="popup-divider-fail"></div>
            <div class="fail-text">${esc(resultData.text)}</div>
            <div class="controls-group">
              <button class="ctrl-btn retry-fail-btn" data-action="result-action" data-value="replay">🔄 重新选择</button>
              <button class="ctrl-btn home-fail-btn" data-action="result-action" data-value="home">⬅ 返回主页地图</button>
            </div>
          </div>
        </div>
      </div>`;
  }
  return `
    <div class="result-popup-overlay">
      <div class="result-popup-card">
        <div class="popup-inner">
          <div class="success-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
            </svg>
            <h2>🎉成功通关！🎉</h2>
          </div>
          <div class="popup-divider"></div>
          <div class="controls-group">
            <button class="ctrl-btn card-btn" data-action="result-action" data-value="cards">🎴 查看知识卡片</button>
            <button class="ctrl-btn retry-btn" data-action="result-action" data-value="home">⬅ 返回主页地图</button>
          </div>
        </div>
      </div>`;
}
