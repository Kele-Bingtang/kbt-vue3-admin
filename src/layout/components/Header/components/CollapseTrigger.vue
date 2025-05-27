<script setup lang="ts" name="CollapseTrigger">
import { computed } from "vue";
import { ElIcon } from "element-plus";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/stores";
import { useNamespace } from "@/composables";

const ns = useNamespace("collapse-trigger");

const settingsStore = useSettingsStore();
const isCollapse = computed(() => settingsStore.isCollapse);

const toggleTrigger = () => {
  settingsStore.toggleSideMenu();
};
</script>

<template>
  <el-icon :class="ns.b()" @click.stop="toggleTrigger">
    <component :is="isCollapse ? Expand : Fold"></component>
  </el-icon>
</template>

<style lang="scss" scoped>
@include b(collapse-trigger) {
  width: 45px;
  height: 100%;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color var(--#{$el-namespace}-transition-duration);

  &:hover {
    background-color: cssVar(gray-200);
  }
}
</style>
