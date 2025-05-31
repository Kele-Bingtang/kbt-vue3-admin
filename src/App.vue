<template>
  <el-config-provider :namespace="ns.elNamespace" :locale="i18nLocale" :button="config" :size="layoutSize">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts" name="App">
import { reactive, computed, provide, onMounted } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { useLayoutStore } from "@/stores/layout";
import SystemConfig from "@/config";
import { useSettingsStore, useUserStore, useWebSocketStore } from "@/stores";
import { addUnit, isFunction, setStyleVar } from "@/utils";
import { ConfigGlobalKey, WebSocketKey } from "@/config/symbols";
import { useNamespace, useCache, useBrowserTitle } from "@/composables";
import { useTheme } from "@/composables/core/useTheme";
import { useIFrame } from "@/layout/components/IFrameLayout/useIFrame";

const ns = useNamespace();

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();

const { layoutSize, language } = storeToRefs(layoutStore);

// 自定义注入全局参数。ElConfigProvider 会自动使用 provide 全局注入它的 props 到项目里，可以通过 configProviderContextKey 来 inject 获取（先从 element-plus 引入，然后 const config = inject(configProviderContextKey)）
provide(ConfigGlobalKey, { size: layoutSize });

useIFrame(SystemConfig.layoutConfig.watchFrame);

useBrowserTitle();

// 初始化主题配置
const { initTheme } = useTheme();
initTheme();

// 配置 element 按钮文字中间是否有空格
const config = reactive({ autoInsertSpace: false });

// element 语言配置
const i18nLocale = computed(() => {
  if (language.value === "zh-CN") return zhCn;
  if (language.value === "en-US") return en;
  return document.documentElement.lang === "zh-CN" ? zhCn : en;
});

// 配置全局样式变量
watchEffect(() => setStyleVar(ns.cssVarName("layout-open-aside-width"), addUnit(settingsStore.menuWidth)));
watchEffect(() => setStyleVar(ns.cssVarName("layout-close-aside-width"), "64px"));
watchEffect(() => setStyleVar(ns.cssVarName("layout-header-height"), addUnit(settingsStore.headerHeight)));
watchEffect(() => setStyleVar(ns.cssVarName("radius"), addUnit(settingsStore.radius, "rem")));

// 初始化 WebSocket
if (import.meta.env.VITE_WEBSOCKET === "true") {
  const useWebSocket = useWebSocketStore();
  const url = import.meta.env.VITE_WEBSOCKET_URL || "";

  // url 后面的 ?token= 为认证信息，需要后端配合获取 token 来认证（这是普通的 GET 请求，WebSocket 无法放入请求头或者发起 POST 请求）
  url && useWebSocket.connect(url + "?token=" + userStore.accessToken);

  provide(WebSocketKey, useWebSocket);
}

/**
 * 根据版本号进行缓存
 */
const versionCache = () => {
  const { version } = __APP_INFO__.pkg;
  const cacheVersion = useCache().getCacheVersion();
  if (version && cacheVersion !== version) {
    const { layoutSize, language } = SystemConfig.layoutConfig;
    settingsStore.$patch({ ...(SystemConfig as any), menuTheme: SystemConfig.themeConfig.menuTheme });
    layoutStore.$patch({
      layoutSize,
      language,
    });
    layoutStore.removeAllTabs();
    useCache().removeProjectsCache();
    useCache().setCacheVersion(version);
  }
};

onMounted(() => {
  versionCache();
});

if (isFunction(log.success)) log.success(__APP_INFO__.pkg.version, "欢迎使用 Teek Design Pro 系统");
</script>
