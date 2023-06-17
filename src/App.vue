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
import { useTabsNav } from "./layout/components/TabsNav/useTabsNav";

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

const router = useRouter();
const { closeSelectedTab } = useTabsNav();

/**
 * 接收 frame 传来的消息，执行该消息（如果把 admin 作为门户来嵌入各个系统，则用到）
 * 消息：需要打开的连接
 */
const handleMsgFromFrame = () => {
  function handleIframeMsg(evt: MessageEvent) {
    const tarType = Object.prototype.toString.call(evt.data);
    let msg: typeof evt.data;
    if (tarType === "[object String]") msg = JSON.parse(evt.data || "{}");
    else if (tarType === "[object Object]") msg = evt.data;
    if (msg.code !== undefined) {
      // 匹配路由表的 name  参见 src\hooks\useRoutes.ts
      if (msg.shutdownCode) {
        for (const tab of layoutStore.tabNavList) {
          if (tab.name === msg.shutdownCode) {
            closeSelectedTab(tab);
            break;
          }
        }
      }
      router.push({ name: msg.name });
      // TODO：如果传的是 msg.url，则打开 url
    }
  }
  window.addEventListener("message", handleIframeMsg);
};
</script>

<style lang="scss"></style>
