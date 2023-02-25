import settings from "@/config/settings";
import type { TabProp } from "@/stores";
/**
 * 这些没有用到 Pinia 的持久化，因为有些缓存需要动态判断，有些缓存需要单纯删除。
 */
// 用户 token 缓存
const tokenKey = "kbt_token";
export const getCacheToken = () => localStorage.getItem(tokenKey);
export const setCacheToken = (token: string) => localStorage.setItem(tokenKey, token);
export const removeCacheToken = () => localStorage.removeItem(tokenKey);

// 标签页的 tabsNav 缓存
const tabsNavKey = settings.tabsNavCacheKey;
export const getCacheTabNavList = () => JSON.parse(localStorage.getItem(tabsNavKey) || "[]");
export const setCacheTabNavList = (tabsNavList: TabProp[]) =>
  localStorage.setItem(tabsNavKey, JSON.stringify(tabsNavList));
export const removeCacheTabNavList = () => localStorage.removeItem(tabsNavKey);
