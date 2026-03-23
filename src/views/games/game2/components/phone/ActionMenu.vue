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
import { useGameStore } from "@game2/store/useGameStore";
const store = useGameStore();
</script>
