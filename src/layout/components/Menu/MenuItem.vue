<template>
  <el-menu-item
    :index="menuItem.meta._fullPath"
    @click="handleMenuClick(menuItem)"
    v-if="!menuItem.children || menuItem.children.length == 0"
    class="menu-item"
  >
    <Icon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" />
    <template #title>
      <span v-if="!menuItem.meta.useTooltip">{{ title(menuItem) }}</span>
      <Tooltip v-else :effect="settings.tooltipEffect" :offset="-10" :try="1">
        <span>{{ title(menuItem) }}</span>
      </Tooltip>
    </template>
  </el-menu-item>
  <el-sub-menu v-else :index="menuItem.meta._fullPath" class="sub-menu">
    <template #title>
      <Icon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" />
      <span v-if="!menuItem.meta.useTooltip">{{ title(menuItem) }}</span>
      <Tooltip v-else :effect="settings.tooltipEffect" :offset="-10" :try="1">
        <span>{{ title(menuItem) }}</span>
      </Tooltip>
    </template>
    <template v-if="menuItem.children">
      <MenuItem v-for="child in menuItem.children" :key="child.path" :menu-item="child" />
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts" name="MenuItem">
import { ref, defineProps, watch, nextTick } from "vue";
import { ElMenuItem, ElSubMenu } from "element-plus";
import { useLayout } from "@/hooks";
import { isExternal } from "@/utils";
import { Tooltip } from "@/components";
import settings from "@/config/settings";
import { useLayoutStore } from "@/stores";

defineProps<{
  menuItem: RouterConfig;
}>();

const { getTitle } = useLayout();
const router = useRouter();
const layoutStore = useLayoutStore();

const isSwitchLanguage = ref(false);

const handleMenuClick = (menuItem: RouterConfig) => {
  if (isExternal(menuItem.path)) return window.open(menuItem.path, "_blank");
  router.push(menuItem.meta._fullPath);
};

const title = (menuItem: RouterConfig) => {
  const title = getTitle(menuItem, isSwitchLanguage.value);
  menuItem.meta.title = title;
  return title;
};

watch(
  () => layoutStore.language,
  () => {
    isSwitchLanguage.value = true;
    nextTick(() => {
      isSwitchLanguage.value = false;
    });
  }
);
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
