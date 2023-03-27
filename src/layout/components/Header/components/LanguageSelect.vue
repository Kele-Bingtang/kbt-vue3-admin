<template>
  <el-dropdown trigger="click" @command="handleSelectLanguage">
    <svg-icon name="language" width="1.5rem" height="1.5rem" :icon-style="{ cursor: 'pointer' }" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="local in localList"
          :key="local.value"
          :command="local.value"
          :disabled="language === local.value"
        >
          {{ local.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="LanguageSelect">
import { useLayout } from "@/hooks/useLayout";
import type { LanguageType } from "@/stores";
import { useLayoutStore } from "@/stores/layout";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const localList = [
  { label: "中文简体", value: "zh-CN" },
  // { label: "中文繁体", value: "zh-TW" },
  { label: "English", value: "en-US" },
];

const i18n = useI18n();
const route = useRoute();
const layoutStore = useLayoutStore();
const { setBrowserTitle } = useLayout();

const language = computed(() => layoutStore.language);

const handleSelectLanguage = (lang: LanguageType) => {
  i18n.locale.value = lang;
  layoutStore.setLanguage(lang);
  document.documentElement.lang = lang;
  setBrowserTitle(route);
  let message = i18n.t("_headerBar.changeLanguage");
  message = message === "_headerBar.changeLanguage" ? "修改语言成功！" : message;
  ElMessage({
    message,
    type: "success",
  });
};
</script>

<style lang="scss" scoped></style>
