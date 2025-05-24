import SystemConfig from "@/config";
import type { TabProp } from "@/stores";
import { useStorage } from "@/composables";

export const useCache = () => {
  const { getStorage, setStorage, removeStorage, removeStorages } = useStorage("localStorage");

  // 标签页的 tabsNav 缓存
  const tabsNavKey = SystemConfig.keyConfig.tabsNavCacheKey;
  const getCacheTabNavList = () => getStorage(tabsNavKey);
  const setCacheTabNavList = (tabsNavList: TabProp[]) => setStorage(tabsNavKey, tabsNavList);
  const removeCacheTabNavList = () => removeStorage(tabsNavKey);

  // 标签页的 tabsNav 缓存
  const dynamicRoutesKey = SystemConfig.keyConfig.cacheDynamicRoutesKey;
  const getCacheDynamicRoutesKey = () => getStorage(dynamicRoutesKey);
  const setCacheDynamicRoutesKey = (dynamicRoutes: RouterConfigRaw[]) => setStorage(dynamicRoutesKey, dynamicRoutes);
  const removeCacheDynamicRoutesKey = () => removeStorage(dynamicRoutesKey);

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
    getCacheDynamicRoutesKey,
    setCacheDynamicRoutesKey,
    removeCacheDynamicRoutesKey,
    getCacheVersion,
    setCacheVersion,
    removeCacheVersion,
    removeProjectsCache,
  };
};
