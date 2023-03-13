<template>
  <el-config-provider :locale="i18nLocale" :button="config" :size="layoutSize">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts" name="App">
import { useLayoutStore } from "./stores/layout";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { getBrowserLang } from "./utils";
import { useTheme } from "./hooks/useTheme";

const layoutStore = useLayoutStore();

// 初始化主题配置
const { initTheme } = useTheme();
initTheme();

// 配置 element 按钮文字中间是否有空格
const config = reactive({
  autoInsertSpace: false,
});

// element 语言配置
const i18nLocale = computed(() => {
  if (layoutStore.language && layoutStore.language === "zh-CN") return zhCn;
  if (layoutStore.language === "en-US") return en;
  return getBrowserLang() === "zh-CN" ? zhCn : en;
});

// 配置全局组件大小
const layoutSize = computed(() => layoutStore.layoutSize);
</script>

<style lang="scss"></style>
