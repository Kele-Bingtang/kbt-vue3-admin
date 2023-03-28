<template>
  <el-menu-item
    :index="menuItem.meta._fullPath"
    @click="handleMenuClick(menuItem)"
    v-if="!menuItem.children || menuItem.children.length == 0"
    class="menu-item"
  >
    <CommonIcon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" />
    <template #title>
      <Tooltip :effect="settings.tooltipEffect" :offset="-10" :real-time="menuItem.meta.useTooltip">
        <span>{{ getTitle(menuItem) }}</span>
      </Tooltip>
    </template>
  </el-menu-item>
  <el-sub-menu v-else :index="menuItem.meta._fullPath" class="sub-menu">
    <template #title>
      <CommonIcon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" />
      <Tooltip :effect="settings.tooltipEffect" :offset="-10" :real-time="menuItem.meta.useTooltip">
        <span>{{ getTitle(menuItem) }}</span>
      </Tooltip>
    </template>
    <template v-if="menuItem.children">
      <MenuItem v-for="child in menuItem.children" :key="child.path" :menu-item="child" />
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts" name="MenuItem">
import { useLayout } from "@/hooks/useLayout";
import { isExternal } from "@/utils/layout/validate";
import CommonIcon from "@/layout/components/CommonIcon/index.vue";
import Tooltip from "@/components/Tooltip/index.vue";
import settings from "@/config/settings";

defineProps<{
  menuItem: RouterConfig;
}>();

const { getTitle } = useLayout();
const router = useRouter();

const handleMenuClick = (menuItem: RouterConfig) => {
  if (isExternal(menuItem.path)) return window.open(menuItem.path, "_blank");
  router.push(menuItem.meta._fullPath);
};
</script>

<style lang="scss" scoped>
.menu-item,
.sub-menu {
  user-select: none;

  :deep(.svg-icon) {
    width: 1.5rem !important;
    width: var(--el-menu-icon-width) !important;
    margin-right: 5px;
    overflow: visible;
    text-align: center;
  }
}
</style>
