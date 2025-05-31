<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";
import { mobileMaxWidthMedia } from "@/config";
import { useI18n } from "vue-i18n";
import { PageTransitionEnum, TabNavModeEnum } from "@/enums/appEnum";

defineOptions({ name: "LayoutSelect" });

const ns = useNamespace("layout-select");

const settingsStore = useSettingsStore();
const isMobile = useMediaQuery(mobileMaxWidthMedia);
const { t } = useI18n();

const tabNavModeOptions = computed(() => [
  { value: TabNavModeEnum.Simple, label: t("_settings.tabNavModeSelect.simple") },
  { value: TabNavModeEnum.Classic, label: t("_settings.tabNavModeSelect.classic") },
  { value: TabNavModeEnum.Element, label: t("_settings.tabNavModeSelect.element") },
]);

const pageTransitionOps = computed(() => [
  { value: PageTransitionEnum.None, label: t("_settings.pageTransitionSelect.none") },
  { value: PageTransitionEnum.Fade, label: t("_settings.pageTransitionSelect.fade") },
  { value: PageTransitionEnum.SlideLeft, label: t("_settings.pageTransitionSelect.slideLeft") },
  { value: PageTransitionEnum.SlideTop, label: t("_settings.pageTransitionSelect.slideTop") },
  { value: PageTransitionEnum.SlideBottom, label: t("_settings.pageTransitionSelect.slideBottom") },
]);

const customRadiusOptions = [
  { value: "0", label: "0" },
  { value: "0.25", label: "0.25" },
  { value: "0.5", label: "0.5" },
  { value: "0.75", label: "0.75" },
  { value: "1", label: "1" },
  { value: "1.25", label: "1.25" },
  { value: "1.5", label: "1.5" },
  { value: "1.75", label: "1.75" },
  { value: "2", label: "2" },
];
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_settings.tabNavMode") }}</span>
      <el-select v-model="settingsStore.tabNavMode" placeholder="Select">
        <el-option v-for="item in tabNavModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_settings.headerHeight") }}</span>
      <el-input-number v-model="settingsStore.headerHeight" :min="30" :max="70" :step="2" controls-position="right" />
      <!-- <el-slider v-model="settingsStore.headerHeight" :min="30" :max="70" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_settings.menuWidth") }}</span>
      <el-input-number v-model="settingsStore.menuWidth" :min="100" :max="400" :step="10" controls-position="right" />
      <!-- <el-slider v-model="settingsStore.menuWidth" :min="100" :max="400" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_settings.pageTransition") }}</span>
      <el-select v-model="settingsStore.pageTransition" placeholder="Select">
        <el-option v-for="item in pageTransitionOps" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_settings.radius") }}</span>
      <el-select v-model="settingsStore.radius" placeholder="Select">
        <el-option v-for="item in customRadiusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
