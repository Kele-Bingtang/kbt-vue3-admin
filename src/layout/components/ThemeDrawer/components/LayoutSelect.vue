<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";
import { mobileMaxWidthMedia } from "@/config";
import { useI18n } from "vue-i18n";
import { TabNavModeEnum } from "@/enums/appEnum";

defineOptions({ name: "LayoutSelect" });

const ns = useNamespace("layout-select");

const settingsStore = useSettingsStore();
const isMobile = useMediaQuery(mobileMaxWidthMedia);
const { t } = useI18n();

const tabNavModeOptions = [
  { value: TabNavModeEnum.Simple, label: t("_settings.tabNavModeSelect.simple") },
  { value: TabNavModeEnum.Classic, label: t("_settings.tabNavModeSelect.classic") },
  { value: TabNavModeEnum.Element, label: t("_settings.tabNavModeSelect.element") },
];
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.tabNavMode") }}</span>
      <el-select v-model="settingsStore.tabNavMode" placeholder="Select" size="default">
        <el-option v-for="item in tabNavModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_settings.headerHeight") }}</span>
      <el-input-number :min="30" :max="70" :step="2" v-model="settingsStore.headerHeight" controls-position="right" />
      <!-- <el-slider v-model="settingsStore.headerHeight" :min="30" :max="70" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_settings.menuWidth") }}</span>
      <el-input-number :min="100" :max="400" :step="10" v-model="settingsStore.menuWidth" controls-position="right" />
      <!-- <el-slider v-model="settingsStore.menuWidth" :min="100" :max="400" /> -->
    </div>

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
      <span>{{ $t("_tabNav.maximize") }}</span>
      <el-switch v-model="settingsStore.maximize" />
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

    .#{$el-namespace}-select {
      width: 40%;
    }
    .#{$el-namespace}-input-number {
      width: 40%;
    }
  }
}
</style>
