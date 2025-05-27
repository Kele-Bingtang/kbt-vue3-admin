<script setup lang="ts" name="LayoutSelect">
import { DeviceEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingsStore, useLayoutStore } from "@/stores";
import { computed } from "vue";

const ns = useNamespace("layout-select");

const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();

const isMobile = computed(() => layoutStore.device === DeviceEnum.Mobile);
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.collapseMenu") }}</span>
      <el-switch v-model="settingsStore.isCollapse" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.menuAccordion") }}</span>
      <el-switch v-model="settingsStore.menuAccordion" />
    </div>
    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_settings.showBreadcrumb") }}</span>
      <el-switch v-model="settingsStore.showBreadcrumb" />
    </div>
    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_settings.showBreadcrumbIcon") }}</span>
      <el-switch v-model="settingsStore.showBreadcrumbIcon" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.showTabNav") }}</span>
      <el-switch v-model="settingsStore.showTabNav" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.showTabNavIcon") }}</span>
      <el-switch v-model="settingsStore.showTabNavIcon" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.showTabNavDot") }}</span>
      <el-switch v-model="settingsStore.showTabNavDot" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.recordTabNav") }}</span>
      <el-switch v-model="settingsStore.recordTabNav" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.fixTabNav") }}</span>
      <el-switch v-model="settingsStore.fixTabNav" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.showLayoutLogo") }}</span>
      <el-switch v-model="settingsStore.showLayoutLogo" />
    </div>
    <div :class="ns.e('item')">
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

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

@include b(layout-select) {
  @include e(item) {
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
