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
/* 这里保留你原本写在这个文件里的 CSS 样式即可 */
</style>
