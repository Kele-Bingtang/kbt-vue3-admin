<template>
  <div class="maximize" @click="exitMaximize">
    <el-icon><Close /></el-icon>
  </div>
</template>

<script setup lang="ts" name="Maximize">
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

const exitMaximize = () => {
  settingsStore.$patch({ maximize: false });
};
</script>

<style lang="scss" scoped>
.maximize {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 52px;
  height: 52px;
  cursor: pointer;
  background-color: var(--el-color-info);
  border-radius: 50%;
  opacity: 0.7;

  &:hover {
    // background-color: var(--el-color-info-dark-2);
    background-color: var(--el-color-primary);
  }

  .el-icon {
    position: relative;
    top: 68%;
    left: 32%;
    font-size: 16px;
    color: #ffffff;
    transform: translate(-50%, -50%);
  }
}
</style>
