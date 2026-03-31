<template>
  <div class="wechat-page">
    <div class="wechat-header">
      <div class="header-left" @click="store.navigatePhone('chat')">
        <img :src="iconBack" class="svg-icon icon-back" alt="back" />
      </div>
      <div class="header-title">
        聊天信息(492)
        <img src="" class="svg-icon icon-mute-bell" alt="mute" />
      </div>
      <div class="header-right">
        <img :src="iconSearch" class="svg-icon icon-search" alt="search" />
      </div>
    </div>

    <div class="page-content">
      <div class="section members-section">
        <div class="members-grid">
          <div class="member-item" v-for="i in 19" :key="i">
            <div class="member-avatar placeholder-avatar"></div>
            <div class="member-name">成员{{ i }}</div>
          </div>
          <div class="member-item">
            <div class="member-avatar add-btn">
              <div class="add-icon"></div>
            </div>
            <div class="member-name"></div>
          </div>
        </div>
        <div class="more-members-btn">
          更多群成员 <span class="arrow-down"></span>
        </div>
      </div>

      <div class="section">
        <div class="list-item">
          <span class="item-label">群聊名称</span>
          <div class="item-value-wrap">
            <span class="item-value truncate-text">幸福家园业主群</span>
            <span class="arrow-right"></span>
          </div>
        </div>
        <div class="list-item">
          <span class="item-label">群二维码</span>
          <div class="item-value-wrap">
            <img src="" class="svg-icon icon-qrcode" alt="qr" />
            <span class="arrow-right"></span>
          </div>
        </div>
        <div class="list-item notice-item">
          <div class="notice-header">
            <span class="item-label">群公告</span>
            <span class="arrow-right"></span>
          </div>
          <div class="notice-content truncate-text-2">
            4️⃣月1️⃣号到货团品 —<br />
            🌈团品一，🔥🔥🔥云南高山L25花香蓝莓🫐 又脆又甜又香15➕的
            ，💥💥💥秒杀💰4️⃣3️⃣元🉐2️⃣罐，8️⃣...
          </div>
        </div>
        <div class="list-item no-border">
          <span class="item-label">备注</span>
          <span class="arrow-right"></span>
        </div>
      </div>

      <div class="section">
        <div class="list-item no-border">
          <span class="item-label">查找聊天记录</span>
          <span class="arrow-right"></span>
        </div>
      </div>

      <div class="section">
        <div class="list-item">
          <span class="item-label">消息免打扰</span>
          <div
            class="ios-switch"
            :class="{ active: settings.muteNotif }"
            @click="toggle('muteNotif')"
          ></div>
        </div>
        <div class="list-item">
          <span class="item-label">折叠该群聊</span>
          <div
            class="ios-switch"
            :class="{ active: settings.collapseChat }"
            @click="toggle('collapseChat')"
          ></div>
        </div>
        <div class="list-item double-line-item">
          <div class="item-text-col">
            <span class="item-label">以下消息仍通知</span>
            <span class="item-sub-label">@我，@所有人和群公告</span>
          </div>
          <span class="arrow-right"></span>
        </div>
        <div class="list-item">
          <span class="item-label">置顶聊天</span>
          <div
            class="ios-switch"
            :class="{ active: settings.stickyTop }"
            @click="toggle('stickyTop')"
          ></div>
        </div>
        <div class="list-item no-border">
          <span class="item-label">保存到通讯录</span>
          <div
            class="ios-switch"
            :class="{ active: settings.saveContact }"
            @click="toggle('saveContact')"
          ></div>
        </div>
      </div>

      <div class="section">
        <div class="list-item">
          <span class="item-label">我在群里的昵称</span>
          <div class="item-value-wrap">
            <span class="item-value">小熊佩琪</span>
            <span class="arrow-right"></span>
          </div>
        </div>
        <div class="list-item no-border">
          <span class="item-label">显示群成员昵称</span>
          <div
            class="ios-switch"
            :class="{ active: settings.showMemberName }"
            @click="toggle('showMemberName')"
          ></div>
        </div>
      </div>

      <div class="section">
        <div class="list-item">
          <span class="item-label">设置当前聊天背景</span>
          <span class="arrow-right"></span>
        </div>
        <div class="list-item">
          <span class="item-label">清空聊天记录</span>
          <span class="arrow-right"></span>
        </div>
        <div class="list-item no-border">
          <span class="item-label">投诉</span>
          <span class="arrow-right"></span>
        </div>
      </div>

      <div class="section action-section">
        <div class="danger-btn">退出群聊</div>
      </div>

      <div class="bottom-spacer"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useGameStore } from "@/views/games/game2/store/useGameStore";
import iconBack from "@/views/games/game2/assets/img/icon_back.svg";
import iconSearch from "@/views/games/game2/assets/img/icon_search.svg";
const store = useGameStore();

// 模拟截图中的开关状态
const settings = reactive({
  muteNotif: true,
  collapseChat: false,
  stickyTop: false,
  saveContact: false,
  showMemberName: true,
});

const toggle = (key) => {
  settings[key] = !settings[key];
};
</script>

<style scoped>
.wechat-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ededed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
}

/* 头部样式 */
.wechat-header {
  height: 50px;
  background: #ededed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  flex-shrink: 0;
}
.header-left,
.header-right {
  width: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.header-right {
  justify-content: flex-end;
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #191919;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 预留 SVG 图标样式，设置默认大小，方便你替换真实 SVG */
.svg-icon {
  display: inline-block;
  background-color: #333; /* 占位色，放入真SVG后请移除 */
}
.icon-back {
  width: 12px;
  height: 20px;
  clip-path: polygon(100% 0, 0 50%, 100% 100%);
} /* 纯CSS占位箭头 */
.icon-search {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #333;
  background: transparent;
}
.icon-mute-bell {
  width: 14px;
  height: 14px;
  margin-left: 6px;
  background: #b2b2b2;
} /* 静音铃铛颜色较浅 */
.icon-qrcode {
  width: 20px;
  height: 20px;
  background: #b2b2b2;
  margin-right: 8px;
}

/* 滚动区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 模块基础样式 */
.section {
  background: #ffffff;
  margin-bottom: 8px;
  border-top: 1px solid #e5e5e5; /* 微信细节：模块上下有极细的边框 */
  border-bottom: 1px solid #e5e5e5;
}
.section:first-child {
  border-top: none;
}

/* 成员网格 */
.members-section {
  padding: 15px 15px 0 15px;
}
.members-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 15px;
}
.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin-bottom: 5px;
  background-size: cover;
  background-position: center;
}
.placeholder-avatar {
  background-color: #e6e6e6; /* 头像占位色 */
}
.member-name {
  font-size: 11px;
  color: #888888;
  width: 50px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 添加按钮样式 */
.add-btn {
  border: 1px dashed #cccccc;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-icon {
  width: 20px;
  height: 2px;
  background: #b2b2b2;
  position: relative;
}
.add-icon::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 20px;
  background: #b2b2b2;
  top: -9px;
  left: 9px;
}

/* 更多成员按钮 */
.more-members-btn {
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  color: #888888;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arrow-down {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid #b2b2b2;
  border-bottom: 1.5px solid #b2b2b2;
  transform: rotate(45deg);
  margin-left: 6px;
  margin-top: -4px;
}

/* 列表项样式 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin: 0 16px;
  border-bottom: 0.5px solid #f2f2f2;
}
.no-border {
  border-bottom: none;
}
.item-label {
  font-size: 16px;
  color: #191919;
  white-space: nowrap;
}
.item-value-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  overflow: hidden;
}
.item-value {
  font-size: 15px;
  color: #8c8c8c;
  margin-right: 8px;
}
/* 单行文本截断 */
.truncate-text {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}

/* 群公告特定样式 */
.notice-item {
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 0;
}
.notice-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.notice-content {
  font-size: 14px;
  color: #888888;
  line-height: 1.5;
  width: 100%;
}
/* 两行文本截断 */
.truncate-text-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* 双行文字列表项 (以下消息仍通知) */
.double-line-item {
  align-items: flex-start;
}
.item-text-col {
  display: flex;
  flex-direction: column;
}
.item-sub-label {
  font-size: 13px;
  color: #b2b2b2;
  margin-top: 4px;
}

/* 纯 CSS 向右箭头 */
.arrow-right {
  width: 8px;
  height: 8px;
  border-top: 1.5px solid #b2b2b2;
  border-right: 1.5px solid #b2b2b2;
  transform: rotate(45deg);
}

/* 纯 CSS iOS/微信 风格开关 */
.ios-switch {
  width: 52px;
  height: 32px;
  border-radius: 16px;
  background: #e5e5e5;
  position: relative;
  transition: background 0.3s;
  cursor: pointer;
}
.ios-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
}
.ios-switch.active {
  background: #07c160; /* 微信绿 */
}
.ios-switch.active::after {
  transform: translateX(20px);
}

/* 底部操作按钮 */
.action-section {
  margin-top: 8px;
  margin-bottom: 0;
}
.danger-btn {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e64340; /* 微信红 */
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
}
.danger-btn:active {
  background: #ececec;
}

.bottom-spacer {
  height: 40px;
}
</style>
