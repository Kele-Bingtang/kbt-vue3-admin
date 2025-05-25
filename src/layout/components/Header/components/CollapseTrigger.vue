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
  width: 40px;
  height: 100%;
  margin-right: 20px;
  font-size: 20px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: getCssVar(gray-200);
  }
}
</style>
