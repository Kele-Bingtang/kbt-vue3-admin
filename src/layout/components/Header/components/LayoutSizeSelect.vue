<script setup lang="ts">
import { computed } from "vue";
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";
import { useLayoutStore, type LayoutSizeType } from "@/stores";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

defineOptions({ name: "LayoutSizeSelect" });

const sizeOptions = [
  { label: "Large", value: "large" },
  { label: "Default", value: "default" },
  { label: "Small", value: "small" },
];
const { t } = useI18n();
const layoutStore = useLayoutStore();
const layoutSize = computed(() => layoutStore.layoutSize);

const handleSetSize = (layoutSize: LayoutSizeType) => {
  layoutStore.setLayoutSize(layoutSize);

  let message = t("_headerBar.changeSize");
  message = message === "_headerBar.changeSize" ? "修改尺寸成功！" : message;
  ElMessage.success(message);
};
</script>

<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <Icon icon="size" style="width: 100%; height: 100%" />

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
