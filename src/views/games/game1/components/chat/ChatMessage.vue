<template>
  <div v-show="!message.hidden">
    <div
      v-if="message.type === 'time' || message.type === 'sys'"
      class="sys-msg"
      :class="message.extraClass"
    >
      <span>{{ message.text }}</span>
    </div>

    <div
      v-else
      class="msg-row"
      :class="[message.isMe ? 'msg-right' : 'msg-left', message.extraClass]"
    >
      <template v-if="!message.isMe">
        <div class="avatar">
          <img :src="message.avatar" />
        </div>
        <div class="msg-wrapper">
          <div class="msg-name">{{ message.sender }}</div>
          <div
            class="msg-content"
            :class="{ 'no-tail': message.type === 'image' }"
            @click="handleContentClick"
          >
            <img
              v-if="message.type === 'image'"
              :src="message.image"
              class="msg-image"
              @click="$emit('image-click', message.image)"
            />
            <span v-else v-html="message.text"></span>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          class="msg-content"
          :class="{ 'no-tail': message.type === 'image' }"
          @click="handleContentClick"
        >
          <img
            v-if="message.type === 'image'"
            :src="message.image"
            class="msg-image"
            @click="$emit('image-click', message.image)"
          />
          <span v-else v-html="message.text"></span>
        </div>
        <div class="avatar">
          <img :src="avatarSrc" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
// 1. ⭐️ 必须引入 computed，否则下面会报错
import { computed } from "vue";
import meImg from "@/views/games/game1/assets/img/me.png";

const props = defineProps({
  message: { type: Object, required: true },
});
const emit = defineEmits(["image-click", "link-click"]);

// 2. ⭐️ 动态计算“我的头像”路径
const avatarSrc = computed(() => {
  if (props.message.avatar) return props.message.avatar;
  return meImg;
});

// 拦截 v-html 中 <a> 标签的点击事件 (你的原有逻辑，保持不变)
const handleContentClick = (e) => {
  const link = e.target.closest("a");
  if (link) {
    e.preventDefault();
    if (link.innerText.includes("taoobaoo")) {
      emit("link-click", "taobao");
    } else if (link.innerText.includes("视频会议")) {
      emit("link-click", "facetime");
    }
  }
};
</script>

<style scoped>
.sys-msg {
  text-align: center;
  font-size: 12px;
  color: #fff;
}
.sys-msg span {
  background-color: #dadada;
  padding: 4px 8px;
  border-radius: 4px;
}

.msg-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.msg-content {
  max-width: 68%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  word-wrap: break-word;
}

.msg-left {
  justify-content: flex-start;
}
.msg-left .avatar {
  margin-right: 12px;
  background-color: #e5cd9e;
}
.msg-left .msg-content {
  background-color: #fff;
}
.msg-left .msg-content::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 14px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 10px solid #fff;
}

.msg-right {
  justify-content: flex-end;
}
.msg-right .avatar {
  margin-left: 12px;
  background-color: #576b95;
}
.msg-right .msg-content {
  background-color: #95ec69;
}
.msg-right .msg-content::before {
  content: "";
  position: absolute;
  right: -10px;
  top: 14px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 10px solid #95ec69;
}

.msg-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 68%;
}
.msg-left .msg-content {
  max-width: 100%;
}

.msg-name {
  font-size: 12px;
  color: #888;
  margin-bottom: 2px;
  margin-left: 4px;
}

.msg-image {
  max-width: 200px;
  border-radius: 8px;
  cursor: pointer;
  display: block;
}

.msg-content.no-tail::before {
  display: none !important;
}
.msg-content.no-tail {
  background-color: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}
</style>
