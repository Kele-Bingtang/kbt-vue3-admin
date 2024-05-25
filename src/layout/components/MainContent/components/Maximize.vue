<template>
  <div :class="prefixClass" @click="exitMaximize">
    <el-icon><Close /></el-icon>
  </div>
</template>

<script setup lang="ts" name="Maximize">
import { ElIcon } from "element-plus";
import { useSettingsStore } from "@/stores";
import { Close } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("maximize");

const settingsStore = useSettingsStore();

const exitMaximize = () => {
  settingsStore.$patch({ maximize: false });
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-maximize;

.#{$prefix-class} {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 52px;
  height: 52px;
  cursor: pointer;
  background-color: var(--#{$el-namespace}-color-info);
  border-radius: 50%;
  opacity: 0.7;

  &:hover {
    // background-color: var(--#{$el-namespace}-color-info-dark-2);
    background-color: var(--#{$el-namespace}-color-primary);
  }

  .#{$el-namespace}-icon {
    position: relative;
    top: 68%;
    left: 32%;
    font-size: 16px;
    color: #ffffff;
    transform: translate(-50%, -50%);
  }
}
</style>
