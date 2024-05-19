<template>
  <div :class="prefixClass">
    <slot />

    <el-select
      v-model="settingsStore.titleMode"
      :placeholder="$t('_settings.titlePlaceholder')"
      @change="handleTitleModeSelect"
    >
      <el-option
        v-for="item in titleModeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.value === settingsStore.titleMode"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts" name="BrowserTitleSwitch">
import { useDesign, useLayout } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { useRoute } from "vue-router";
import { ElSelect, ElOption } from "element-plus";
import { useI18n } from "vue-i18n";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("browser-title-switch");

const { t } = useI18n();
const route = useRoute();

const settingsStore = useSettingsStore();
const { setBrowserTitle } = useLayout();

const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  setBrowserTitle(route);
};

const titleModeOptions = [
  { value: "0", label: t("_settings.titleModeOne") },
  { value: "1", label: t("_settings.titleModeTwo") },
  { value: "2", label: t("_settings.titleModeThree") },
  { value: "3", label: t("_settings.titleModeFour") },
];
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-browser-title-switch;

.#{$prefix-class} {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0;

  span {
    font-size: 14px;
  }
}
</style>
