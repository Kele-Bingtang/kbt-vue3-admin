<template>
  <div class="drag-drawer-move-trigger">
    <div class="drag-drawer-move-trigger-point">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>
</template>

<script setup lang="ts" name="DragDrawerTrigger"></script>

<style lang="scss" scoped>
.drag-drawer-move-trigger {
  position: absolute;
  top: 50%;
  height: 100px;
  line-height: 100px;
  width: 8px;
  background: rgb(243, 243, 243);
  transform: translate(-50%, -50%);
  border-radius: 4px / 6px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
  cursor: col-resize;
  .drag-drawer-move-trigger-point {
    display: inline-block;
    width: 50%;
    transform: translateX(50%);
    i {
      display: block;
      border-bottom: 1px solid rgb(192, 192, 192);
      padding-bottom: 2px;
    }
  }
}
</style>
