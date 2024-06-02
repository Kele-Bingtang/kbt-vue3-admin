<template>
  <el-config-provider :namespace="variables.elNamespace" :locale="i18nLocale" :button="config" :size="layoutSize">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts" name="App">
import { ElConfigProvider } from "element-plus";
import { useLayoutStore } from "./stores/layout";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { getBrowserLang } from "@/utils";
import { useTheme } from "./hooks/useTheme";
import { useFrame } from "./layout/components/FrameLayout/useFrame";
import settings from "@/config/settings";
import { useSettingsStore } from "@/stores";
import { useDesign, useCache } from "@/hooks";
import { reactive, computed, provide, onMounted } from "vue";
import { ConfigGlobalKey } from "@/config/symbols";

const { variables } = useDesign();

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();

// 初始化主题配置
const { initTheme } = useTheme();
initTheme();

// 配置 element 按钮文字中间是否有空格
const config = reactive({
  autoInsertSpace: false,
});

// element 语言配置
const i18nLocale = computed(() => {
  if (layoutStore.language === "zh-CN") return zhCn;
  if (layoutStore.language === "en-US") return en;
  return getBrowserLang() === "zh-CN" ? zhCn : en;
});

// 配置全局组件大小
const layoutSize = computed(() => layoutStore.layoutSize);

// 自定义注入全局参数。ElConfigProvider 会自动使用 provide 全局注入它的 props 到项目里，可以通过 configProviderContextKey 来 inject 获取（先从 element-plus 引入，然后 const config = inject(configProviderContextKey)）
provide(ConfigGlobalKey, {
  size: layoutSize,
});

onMounted(() => {
  handleMsgFromFrame();
  versionCache();
});

const { acceptFrameMsg } = useFrame();
/**
 * 接收 frame 传来的消息，执行该消息（如果把 admin 作为门户来嵌入各个系统，则用到）
 * 消息：需要打开的连接
 */
const handleMsgFromFrame = () => {
  if (settings.watchFrame) window.addEventListener("message", acceptFrameMsg);
};

/**
 * 根据版本号进行缓存
 */
const versionCache = () => {
  const { version } = __APP_INFO__.pkg;
  const cacheVersion = useCache().getCacheVersion();
  if (version && cacheVersion !== version) {
    const { layoutSize, language } = settings;
    settingsStore.$patch({ ...(settings as any), menuTheme: settings.layoutTheme });
    layoutStore.$patch({
      layoutSize,
      language,
    });
    layoutStore.removeAllTabs();
    useCache().removeProjectsCache();
    useCache().setCacheVersion(version);
  }
};
</script>
