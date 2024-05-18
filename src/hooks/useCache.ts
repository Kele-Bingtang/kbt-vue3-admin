import settings from "@/config/settings";
import type { TabProp } from "@/stores";
import { useStorage } from "@/hooks";

export const useCache = () => {
  const { getStorage, setStorage, removeStorage, removeStorages } = useStorage("localStorage");

  // 标签页的 tabsNav 缓存
  const tabsNavKey = settings.tabsNavCacheKey;
  const getCacheTabNavList = () => getStorage(tabsNavKey);
  const setCacheTabNavList = (tabsNavList: TabProp[]) => setStorage(tabsNavKey, tabsNavList);
  const removeCacheTabNavList = () => removeStorage(tabsNavKey);

  // 标签页的 tabsNav 缓存
  const dynamicRoutesKey = settings.cacheDynamicRoutesKey;
  const getCacheDynamicRoutesKey = () => getStorage(dynamicRoutesKey);
  const setCacheDynamicRoutesKey = (dynamicRoutes: RouterConfigRaw[]) => setStorage(dynamicRoutesKey, dynamicRoutes);
  const removeCacheDynamicRoutesKey = () => removeStorage(dynamicRoutesKey);

  // 版本号缓存
  const versionKey = settings.versionCacheKey;
  const getCacheVersion = () => getStorage(versionKey);
  const setCacheVersion = (version: string) => setStorage(versionKey, version);
  const removeCacheVersion = () => removeStorage(versionKey);

  const removeProjectsCache = () => {
    const { tabsNavCacheKey, cacheDynamicRoutesKey, versionCacheKey } = settings;
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
