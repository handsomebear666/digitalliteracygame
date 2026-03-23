<template>
  <div class="map-decoration">
    <div
      class="deco"
      style="width: 100px; height: 100px; top: 10%; left: 10%"
    ></div>
    <div
      class="deco"
      style="width: 60px; height: 60px; top: 40%; right: 5%"
    ></div>
    <div
      class="deco"
      style="width: 80px; height: 80px; bottom: 10%; left: 20%"
    ></div>

    <div class="roadmap-path"></div>
  </div>
</template>

<style scoped>
.map-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 让装饰层不阻挡用户的鼠标点击事件 */
  z-index: 1;
}

.roadmap-path {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% - 100px);
  border-left: 4px dashed #81d4fa;
}

.deco {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}
</style>
