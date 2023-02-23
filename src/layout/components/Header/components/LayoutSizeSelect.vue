<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div class="svg-container">
      <svg-icon name="size" width="20px" height="20px" :icon-style="{ cursor: 'pointer' }" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="layoutSize === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="LayoutSizeSelect">
import type { LayoutSizeType } from "@/stores";
import { useLayoutStore } from "@/stores/layout";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const sizeOptions = [
  { label: "Large", value: "large" },
  { label: "Default", value: "default" },
  { label: "Small", value: "small" },
];
const i18n = useI18n();
const layoutStore = useLayoutStore();
const layoutSize = computed(() => layoutStore.layoutSize);

const handleSetSize = (layoutSize: LayoutSizeType) => {
  layoutStore.setLayoutSize(layoutSize);
  let message = i18n.t("_headerBar.changeSize");
  message = message === "_headerBar.changeSize" ? "修改尺寸成功！" : message;
  ElMessage({
    message,
    type: "success",
  });
};
</script>

<style lang="scss" scoped></style>
