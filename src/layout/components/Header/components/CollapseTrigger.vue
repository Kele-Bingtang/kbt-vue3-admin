<template>
  <el-icon class="collapse-icon" @click.stop="toggleTrigger">
    <component :is="isCollapse ? Expand : Fold"></component>
  </el-icon>
</template>
<script setup lang="ts" name="CollapseTrigger">
import { useSettingsStore } from "@/stores/settings";
import { Expand, Fold } from "@element-plus/icons-vue";

const settingsStore = useSettingsStore();
const isCollapse = computed(() => settingsStore.isCollapse);

const toggleTrigger = () => {
  settingsStore.toggleSideMenu();
};
</script>

<style lang="scss" scoped>
.collapse-icon {
  margin-right: 20px;
  font-size: 22px;
  cursor: pointer;
  // 点击避免中择文字
  user-select: none;
}
</style>
