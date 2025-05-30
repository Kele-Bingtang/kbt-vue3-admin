import type { TabProp } from "@/stores";
import SystemConfig from "@/config";
import { useStorage } from "@/composables";

export const useCache = () => {
  const { getStorage, setStorage, removeStorage, removeStorages } = useStorage();

  // 标签页的 tabsNav 缓存
  const tabsNavKey = SystemConfig.keyConfig.tabsNavCacheKey;
  const getCacheTabNavList = () => getStorage(tabsNavKey);
  const setCacheTabNavList = (tabsNavList: TabProp[]) => setStorage(tabsNavKey, tabsNavList);
  const removeCacheTabNavList = () => removeStorage(tabsNavKey);

  // 标签页的 tabsNav 缓存
  const dynamicRoutesKey = SystemConfig.keyConfig.cacheDynamicRoutesKey;
  const getDynamicRoutes = (): RouterConfigRaw[] => getStorage(dynamicRoutesKey);
  const setDynamicRoutes = (dynamicRoutes: RouterConfigRaw[]) => setStorage(dynamicRoutesKey, dynamicRoutes);
  const removeDynamicRoutes = () => removeStorage(dynamicRoutesKey);

  // 版本号缓存
  const versionKey = SystemConfig.keyConfig.versionCacheKey;
  const getCacheVersion = () => getStorage(versionKey);
  const setCacheVersion = (version: string) => setStorage(versionKey, version);
  const removeCacheVersion = () => removeStorage(versionKey);

  const removeProjectsCache = () => {
    const { tabsNavCacheKey, cacheDynamicRoutesKey, versionCacheKey } = SystemConfig.keyConfig;
    removeStorages([tabsNavCacheKey, cacheDynamicRoutesKey, versionCacheKey]);
  };

  return {
    getCacheTabNavList,
    setCacheTabNavList,
    removeCacheTabNavList,
    getDynamicRoutes,
    setDynamicRoutes,
    removeDynamicRoutes,
    getCacheVersion,
    setCacheVersion,
    removeCacheVersion,
    removeProjectsCache,
  };
};
