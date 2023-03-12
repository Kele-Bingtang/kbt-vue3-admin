<template>
  <div class="drag-container">
    <h2>拖拽指令</h2>
    <p>在标签上加 v-draggable，就可以对该标签进行拖拽，只能加在基础标签，自定义标签不支持</p>
    <div v-draggable class="drag-box">我可以拖拽哦~</div>
  </div>
</template>

<script setup lang="ts" name="Drag"></script>

<style lang="scss" scoped>
.drag-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  padding: 20px;
  .drag-box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 110px;
    width: 300px;
    height: 300px;
    font-size: 23px;
    font-weight: bold;
    color: var(--el-color-primary-light-3);
    background: var(--el-color-primary-light-9);
    border-radius: 50%;
  }
}
</style>
