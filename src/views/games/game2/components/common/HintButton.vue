<template>
  <div
    class="wx-floating-btn"
    ref="hintBtn"
    @touchstart="dragStart"
    @touchmove="dragMove"
    @touchend="dragEnd"
    @mousedown="dragStart"
    @click="handleClick"
    :style="
      dragged
        ? { left: position.x + 'px', top: position.y + 'px', right: 'auto' }
        : {}
    "
  >
    <span style="font-size: 16px; margin-right: 4px">💡</span><span>提示</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGameStore } from "@/views/games/game2/store/useGameStore";

const store = useGameStore();
const hintBtn = ref(null);

const position = ref({ x: 0, y: 0 });
const dragged = ref(false); // 新增：标记是否进行过物理拖拽
let isDragging = false;
let hasMoved = false; // 用于区分“点击”和“拖拽”
let startX = 0,
  startY = 0,
  initialX = 0,
  initialY = 0;

const dragStart = (e) => {
  // 记录起始位置
  if (e.type === "touchstart") {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else {
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
  }

  // 获取当前 DOM 的实时偏移量（无论初始是 left 还是 right 布局）
  initialX = hintBtn.value.offsetLeft;
  initialY = hintBtn.value.offsetTop;
  isDragging = true;
  hasMoved = false;
};

const dragMove = (e) => {
  if (!isDragging) return;
  let cx = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
  let cy = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

  // 判定为移动
  if (Math.abs(cx - startX) > 5 || Math.abs(cy - startY) > 5) {
    hasMoved = true;
    dragged.value = true; // 一旦移动，开启坐标定位模式
    e.preventDefault();
  }

  if (hasMoved) {
    const container = document.querySelector(".game-container");
    // 限制在容器范围内
    position.value.x = Math.max(
      0,
      Math.min(
        initialX + cx - startX,
        container.offsetWidth - hintBtn.value.offsetWidth,
      ),
    );
    position.value.y = Math.max(
      0,
      Math.min(
        initialY + cy - startY,
        container.offsetHeight - hintBtn.value.offsetHeight,
      ),
    );
  }
};

const dragEnd = () => {
  isDragging = false;
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragEnd);
};

const handleClick = (e) => {
  // 如果刚才是在拖拽，则不触发点击逻辑
  if (hasMoved) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // 原有的智能提示逻辑...
  handleHintLogic();
};

// 提取提示逻辑（保持不变）
const handleHintLogic = () => {
  if (store.gameLevel === 1) {
    if (store.activePhonePage.startsWith("oa-")) {
      if (!store.foundFlawsL1.includes("typo"))
        store.showToast("💡 提示：看看公众号的名字和认证标志对不对劲？");
      else if (!store.foundFlawsL1.includes("subject"))
        store.showToast("💡 提示：点开资料区，查查它的“主体类型”到底是啥？");
      else if (!store.foundFlawsL1.includes("history"))
        store.showToast("💡 提示：往下拉，看看这个机构发过多少篇文章？");
    } else {
      store.showToast("💡 提示：点击张大姐发的公众号名片进去看看吧~");
    }
  } else if (store.gameLevel === 2) {
    if (!store.level2Solved) {
      store.showToast(
        store.activePhonePage === "sms-expand"
          ? "💡 提示：仔细读！验证码后面写的是什么操作？点它！"
          : "💡 提示：短信好像没显示全，点击【查看全文】！",
      );
    }
  } else if (store.gameLevel === 3) {
    if (!store.foundFlawsL3.includes("info"))
      store.showToast("💡 提示：在群里点击发链接的‘张大姐’的头像！");
    else if (!store.foundFlawsL3.includes("moments"))
      store.showToast("💡 提示：点击它的‘朋友圈’，看看里面平时发什么？");
    else if (!store.foundFlawsL3.includes("add"))
      store.showToast("💡 提示：退回资料页，看最下方那颗大按钮写着什么！");
    else if (!store.foundFlawsL3.includes("real"))
      store.showToast("💡 提示：点群聊右上角的‘...’，搜索张大姐！");
  } else if (store.gameLevel === 4) {
    store.showToast("💡 提示：点击右上角的‘...’，选择投诉！");
  }
};
</script>
