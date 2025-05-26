<script setup lang="ts" name="BrowserTitleSwitch">
import { useNamespace, useLayout } from "@/composables";
import { useSettingsStore } from "@/stores";
import { useRoute } from "vue-router";
import { ElSelect, ElOption } from "element-plus";
import { useI18n } from "vue-i18n";

const ns = useNamespace("browser-title-switch");

const { t } = useI18n();
const route = useRoute();

const settingsStore = useSettingsStore();
const { setBrowserTitle } = useLayout();

const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  setBrowserTitle(route);
};

const titleModeOptions = [
  { value: "0", label: t("_settings.titleModeProjectPage") },
  { value: "1", label: t("_settings.titleModeUsernamePage") },
  { value: "2", label: t("_settings.titleModeProject") },
  { value: "3", label: t("_settings.titleModePage") },
];
</script>

<template>
  <div :class="ns.b()">
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

<style lang="scss" scoped>
@include b(browser-title-switch) {
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
