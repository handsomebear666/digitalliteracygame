<template>
  <div class="action-sheet-bg" @click="store.showActionSheet = false">
    <div class="action-sheet" @click.stop>
      <div class="sheet-btn" style="color: #ff4d4f" @click="store.doReport()">
        投诉
      </div>
      <div class="sheet-btn" @click="store.showActionSheet = false">取消</div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from "@/views/games/game2/store/useGameStore";
const store = useGameStore();
</script>

<style scoped>
.action-sheet-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.action-sheet {
  background: #f7f7f7;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
  animation: slideUp 0.3s forwards;
}
.sheet-btn {
  background: #fff;
  text-align: center;
  padding: 16px;
  font-size: 17px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
