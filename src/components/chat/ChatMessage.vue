<template>
  <div v-show="!message.hidden">
    <div v-if="message.type === 'time' || message.type === 'sys'" class="sys-msg" :class="message.extraClass">
      <span>{{ message.text }}</span>
    </div>

    <div v-else class="msg-row" :class="[message.isMe ? 'msg-right' : 'msg-left', message.extraClass]">

      <template v-if="!message.isMe">
        <div class="avatar">
          <img :src="message.avatar" />
        </div>
        <div class="msg-wrapper">
          <div class="msg-name">{{ message.sender }}</div>
          <div class="msg-content" :class="{ 'no-tail': message.type === 'image' }" @click="handleContentClick">
            <img v-if="message.type === 'image'" :src="message.image" class="msg-image" @click="$emit('image-click', message.image)" />
            <span v-else v-html="message.text"></span>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="msg-content" :class="{ 'no-tail': message.type === 'image' }" @click="handleContentClick">
          <img v-if="message.type === 'image'" :src="message.image" class="msg-image" @click="$emit('image-click', message.image)" />
          <span v-else v-html="message.text"></span>
        </div>
        <div class="avatar">
          <img :src="message.avatar || '/assets/img/me.png'" />
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: Object, required: true }
});
const emit = defineEmits(['image-click', 'link-click']);

// 拦截 v-html 中 <a> 标签的点击事件
const handleContentClick = (e) => {
  const link = e.target.closest('a');
  if (link) {
    e.preventDefault();
    if (link.innerText.includes('taoobaoo')) {
      emit('link-click', 'taobao');
    } else if (link.innerText.includes('视频会议')) {
      emit('link-click', 'facetime');
    }
  }
};
</script>