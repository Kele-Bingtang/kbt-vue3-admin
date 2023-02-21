import { ref } from "vue";
import { defineStore } from "pinia";
import { setCacheTabNavList } from "@/utils/cache";
import { DeviceType, type LayoutSizeType, type TabProp } from "./index.d";
import { useSettingsStore } from "./settings";

export const useLayoutStore = defineStore(
  "layoutStore",
  () => {
    const tabNavList = ref<TabProp[]>([]);
    const keepAliveName = ref<string[]>([]);
    const device = ref(DeviceType.Desktop);
    const layoutSize = ref<LayoutSizeType>("default");
    const language = ref("zh-CN");

    const toggleDevice = (deviceParam: DeviceType) => {
      device.value = deviceParam;
    };

    const setLayoutSize = (layoutSizeParam: LayoutSizeType) => {
      layoutSize.value = layoutSizeParam;
    };

    const setLanguage = (languageParam: string) => {
      language.value = languageParam;
    };

    const addTab = async (tab: TabProp) => {
      tab.path = decodeURIComponent(tab.path); // 存储的 tag.path 是解码后的
      if (tabNavList.value.some(v => v.path === tab.path || v.path + "/" === tab.path)) return;
      tabNavList.value.push(tab);
    };

    const removeTab = async (tab: TabProp) => {
      for (const [i, v] of tabNavList.value.entries()) {
        if (v.path === tab.path) {
          tabNavList.value.splice(i, 1);
          break;
        }
      }
    };

    const removeOtherTabs = async (tab: TabProp) => {
      tabNavList.value = tabNavList.value.filter(v => {
        return !v.close || v.path === tab.path;
      });
    };

    const removeAllTabs = async () => {
      const fixedTabs = tabNavList.value.filter(tab => !tab.close);
      tabNavList.value = fixedTabs;
    };

    const updateTab = (tab: TabProp) => {
      for (let v of tabNavList.value) {
        if (v.path === tab.path) {
          v = Object.assign(v, tab);
          break;
        }
      }
    };

    const addKeepAliveName = async (name: string) => {
      !keepAliveName.value.includes(name) && keepAliveName.value?.push(name);
    };

    const removeKeepAliveName = async (name: string) => {
      keepAliveName.value = keepAliveName.value.filter(item => item !== name);
    };

    const setKeepAliveName = async (keepAliveNameList: string[] = []) => {
      keepAliveName.value = keepAliveNameList;
    };

    const settingsStore = useSettingsStore();

    watchEffect(() => {
      if (settingsStore.recordTabsNav) {
        setCacheTabNavList(tabNavList.value);
      }
    });

    return {
      tabNavList,
      keepAliveName,
      device,
      layoutSize,
      language,

      toggleDevice,
      setLayoutSize,
      setLanguage,
      addTab,
      removeTab,
      removeOtherTabs,
      removeAllTabs,
      updateTab,
      addKeepAliveName,
      removeKeepAliveName,
      setKeepAliveName,
    };
  },
  {
    persist: {
      key: "kbt_layoutStore",
      storage: localStorage,
      paths: ["layoutSize", "language"],
    },
  }
);
