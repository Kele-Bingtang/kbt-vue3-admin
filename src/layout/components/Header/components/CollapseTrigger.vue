<template>
  <el-icon :class="prefixClass" @click.stop="toggleTrigger">
    <component :is="isCollapse ? Expand : Fold"></component>
  </el-icon>
</template>
<script setup lang="ts" name="CollapseTrigger">
import { ElIcon } from "element-plus";
import { useSettingsStore } from "@/stores";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("menu-collapse");

const settingsStore = useSettingsStore();
const isCollapse = computed(() => settingsStore.isCollapse);

const toggleTrigger = () => {
  settingsStore.toggleSideMenu();
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-menu-collapse;

.#{$prefix-class} {
  margin-right: 20px;
  font-size: 22px;
  cursor: pointer;

  // 点击避免中择文字
  user-select: none;
}
</style>
