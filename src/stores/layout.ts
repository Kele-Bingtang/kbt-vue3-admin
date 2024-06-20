import { defineStore } from "pinia";
import { DeviceType, type LanguageType, type LayoutSizeType, type TabProp } from "./interface";
import { useSettingsStore } from "./settings";
import defaultSettings from "@/config/settings";
import type { Frame } from "@/layout/components/FrameLayout/useFrame";
import { ref, watch } from "vue";
import { useCache } from "@/hooks";

export const useLayoutStore = defineStore(
  "layoutStore",
  () => {
    const tabNavList = ref<TabProp[]>(useCache().getCacheTabNavList() || []);
    const keepAliveName = ref<string[]>([]);
    const device = ref(DeviceType.Desktop);
    const layoutSize = ref<LayoutSizeType>(defaultSettings.layoutSize);
    const language = ref(defaultSettings.language);
    const frameList = ref<Frame[]>([]);

    const toggleDevice = (deviceParam: DeviceType) => {
      device.value = deviceParam;
    };

    const setLayoutSize = (layoutSizeParam: LayoutSizeType) => {
      layoutSize.value = layoutSizeParam;
    };

    const setLanguage = (languageParam: LanguageType) => {
      language.value = languageParam;
    };

    const addTab = async (tab: TabProp) => {
      const path = tab.path;
      if (tab.meta.hideInTab) return;
      if (tabNavList.value.some(v => v.path === path || v.path + "/" === path)) return;
      // 判断动态路由的可打开最大数量
      const dynamicLevel = tab.meta.dynamicLevel ?? -1;
      if (dynamicLevel > 0 && tabNavList.value.filter(t => t.name === tab.name).length >= dynamicLevel) {
        // 如果当前已打开的动态路由数大于 dynamicLevel，替换第一个动态路由标签
        const index = tabNavList.value.findIndex(t => t.name === tab.name);
        index !== -1 && tabNavList.value.splice(index, 1);
      }
      tabNavList.value.push(tab);
    };

    const removeCurrentTab = async (tab: TabProp) => {
      for (const [i, v] of tabNavList.value.entries()) {
        if (v.path === tab.path) {
          tabNavList.value.splice(i, 1);
          removeFrame(tab);
          break;
        }
      }
    };

    const removeBatchTab = async (pathList: string[]) => {
      pathList.forEach(path => {
        removeCurrentTab({ path } as TabProp);
      });
    };

    const removeLeftTab = async (tab: TabProp) => {
      const index = tabNavList.value.findIndex(v => v.path === tab.path);
      if (index === -1) return;
      const frameNameList = frameList.value.map(e => e.name);
      tabNavList.value = tabNavList.value.filter((item, i) => {
        if (frameNameList.includes(item.name)) removeFrame(item);
        if (i >= index || (item.meta && item.meta.isAffix)) return true;
        if (tab.meta.isKeepAlive) removeKeepAliveName(tab.name);
        return false;
      });
    };

    const removeRightTab = async (tab: TabProp) => {
      const index = tabNavList.value.findIndex(v => v.path === tab.path);
      if (index === -1) return;
      const frameNameList = frameList.value.map(e => e.name);
      tabNavList.value = tabNavList.value.filter((item, i) => {
        if (frameNameList.includes(item.name)) removeFrame(item);
        if (i <= index || (item.meta && item.meta.isAffix)) return true;
        if (tab.meta.isKeepAlive) removeKeepAliveName(tab.name);
        return false;
      });
    };

    const removeOtherTabs = async (tab: TabProp) => {
      tabNavList.value = tabNavList.value.filter(v => {
        return !v.close || v.path === tab.path;
      });
      frameList.value = frameList.value.filter(v => {
        return v.name === tab.name;
      });
    };

    const removeAllTabs = async () => {
      const fixedTabs = tabNavList.value.filter(tab => !tab.close);
      tabNavList.value = fixedTabs;
      frameList.value = [];
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

    const addFrame = (obj: Frame) => {
      frameList.value.push(obj);
    };

    const removeFrame = (tab: TabProp) => {
      for (const [i, v] of frameList.value.entries()) {
        if (v.name === tab.name) {
          frameList.value.splice(i, 1);
          break;
        }
      }
    };

    const settingsStore = useSettingsStore();

    watch(
      () => settingsStore.recordTabsNav,
      () => {
        handleRecordTabsNav(settingsStore.recordTabsNav);
      }
    );
    watch(
      () => tabNavList.value,
      () => {
        handleRecordTabsNav(settingsStore.recordTabsNav);
      },
      { deep: true }
    );

    const handleRecordTabsNav = (value: boolean) => {
      if (value) useCache().setCacheTabNavList(tabNavList.value);
      else useCache().removeCacheTabNavList();
    };

    return {
      tabNavList,
      keepAliveName,
      device,
      layoutSize,
      language,
      frameList,

      toggleDevice,
      setLayoutSize,
      setLanguage,
      addTab,
      removeCurrentTab,
      removeBatchTab,
      removeLeftTab,
      removeRightTab,
      removeOtherTabs,
      removeAllTabs,
      updateTab,
      addKeepAliveName,
      removeKeepAliveName,
      setKeepAliveName,
      addFrame,
      removeFrame,
    };
  },
  {
    persist: {
      paths: ["layoutSize", "language", "device"],
    },
  }
);
