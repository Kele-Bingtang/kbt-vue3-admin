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
import { useFrame } from "./layout/components/FrameLayout/useFrame";

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

onMounted(() => {
  handleMsgFromFrame();
});

const { acceptFrameMsg } = useFrame();
/**
 * 接收 frame 传来的消息，执行该消息（如果把 admin 作为门户来嵌入各个系统，则用到）
 * 消息：需要打开的连接
 */
const handleMsgFromFrame = () => {
  window.addEventListener("message", acceptFrameMsg);
};
</script>

<style lang="scss"></style>
