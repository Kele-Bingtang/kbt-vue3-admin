<template>
  <el-menu-item
    :index="menuItem.meta._fullPath"
    @click="handleMenuClick(menuItem)"
    v-if="!menuItem.children || menuItem.children.length == 0"
    class="menu-item"
  >
    <CommonIcon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" />
    <template #title>
      <span>{{ getTitle(menuItem) }}</span>
    </template>
  </el-menu-item>
  <el-sub-menu v-else :index="menuItem.meta._fullPath">
    <template #title>
      <CommonIcon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" />
      <span>{{ getTitle(menuItem) }}</span>
    </template>
    <template v-if="menuItem.children">
      <MenuItem v-for="child in menuItem.children" :key="child.path" :menu-item="child" :is-collapse="isCollapse" />
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts" name="MenuItem">
import { useLayout } from "@/hooks/useLayout";
import { isExternal } from "@/utils/layout/validate";
import CommonIcon from "@/components/CommonIcon/index.vue";

defineProps<{
  menuItem: RouterConfig;
  isCollapse: boolean;
}>();

const { getTitle } = useLayout();
const router = useRouter();

const handleMenuClick = (menuItem: RouterConfig) => {
  if (isExternal(menuItem.path)) return window.open(menuItem.path, "_blank");
  router.push(menuItem.meta._fullPath);
};
</script>

<style lang="scss" scoped>
.el-sub-menu {
  :deep(.svg-icon) {
    margin-right: 5px;
    width: 1.5rem !important;
    width: var(--el-menu-icon-width) !important;
    text-align: center;
    overflow: visible;
  }
}
</style>
