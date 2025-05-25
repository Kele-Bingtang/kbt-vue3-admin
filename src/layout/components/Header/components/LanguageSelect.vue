<script setup lang="ts" name="LanguageSelect">
import type { LanguageType } from "@/stores";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from "element-plus";
import { useLayout } from "@/composables";
import { useLayoutStore } from "@/stores";

const localList = [
  { label: "中文简体", value: "zh-CN" },
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
  ElMessage.success(message);
};
</script>

<template>
  <el-dropdown trigger="click" @command="handleSelectLanguage">
    <Icon icon="language" style="width: 100%; height: 100%" />

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
