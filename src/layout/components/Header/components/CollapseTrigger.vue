<script setup lang="ts" name="CollapseTrigger">
import { ElIcon } from "element-plus";
import { useSettingsStore } from "@/stores";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { computed } from "vue";

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
  margin-right: 20px;
  font-size: 22px;
  cursor: pointer;
  user-select: none;
}
</style>
