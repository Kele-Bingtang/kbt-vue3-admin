<template>
  <div :class="prefixClass">
    <slot />

    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.collapseMenu") }}</span>
      <el-switch v-model="settingsStore.isCollapse" />
    </div>
    <div :class="`${prefixClass}__list`" v-if="!isMobile">
      <span>{{ $t("_settings.showBreadcrumb") }}</span>
      <el-switch v-model="settingsStore.showBreadcrumb" />
    </div>
    <div :class="`${prefixClass}__list`" v-if="!isMobile">
      <span>{{ $t("_settings.showBreadcrumbIcon") }}</span>
      <el-switch v-model="settingsStore.showBreadcrumbIcon" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.showTabsNav") }}</span>
      <el-switch v-model="settingsStore.showTabsNav" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.showTabsNavIcon") }}</span>
      <el-switch v-model="settingsStore.showTabsNavIcon" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.recordTabsNav") }}</span>
      <el-switch v-model="settingsStore.recordTabsNav" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.fixTabsNav") }}</span>
      <el-switch v-model="settingsStore.fixTabsNav" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.showLayoutLogo") }}</span>
      <el-switch v-model="settingsStore.showLayoutLogo" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_tabsNav.maximize") }}</span>
      <el-switch v-model="settingsStore.maximize" />
    </div>

    <div>
      <span style="font-size: 14px">{{ $t("_settings.headerHeight") }}</span>
      <el-slider v-model="settingsStore.headerHeight" :min="30" :max="70" />
    </div>

    <div>
      <span style="font-size: 14px">{{ $t("_settings.menuWidth") }}</span>
      <el-slider v-model="settingsStore.menuWidth" :min="100" :max="400" />
    </div>
  </div>
</template>

<script setup lang="ts" name="LayoutSelect">
import { useDesign } from "@/hooks";
import { useSettingsStore, useLayoutStore, DeviceType } from "@/stores";
import { computed } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout-select");

const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();

const isMobile = computed(() => layoutStore.device === DeviceType.Mobile);
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-layout-select;

.#{$prefix-class} {
  &__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 14px 0;

    span {
      font-size: 14px;
    }
  }
}
</style>
