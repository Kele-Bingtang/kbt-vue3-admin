<script setup lang="ts" name="Maximize">
import { ElIcon } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/stores";
import { useNamespace } from "@/composables";

const ns = useNamespace("maximize");

const settingsStore = useSettingsStore();

const exitMaximize = () => {
  settingsStore.$patch({ maximize: false });
};
</script>

<template>
  <div :class="ns.b()" @click="exitMaximize">
    <el-icon><Close /></el-icon>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(maximize) {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 52px;
  height: 52px;
  cursor: pointer;
  background-color: cssVar(gray-600);
  border-radius: 50%;
  opacity: 0.7;

  &:hover {
    background-color: cssVar(gray-700);
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
