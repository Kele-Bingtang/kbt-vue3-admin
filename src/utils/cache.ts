import type { TabProp } from "@/stores";

// 用户 token 缓存
const tokenKey = "kbt_token";
export const getCacheToken = () => localStorage.getItem(tokenKey);
export const setCacheToken = (token: string) => localStorage.setItem(tokenKey, token);
export const removeCacheToken = () => localStorage.removeItem(tokenKey);

// 标签页的 tabsNav 缓存
const tabsNavKey = "kbt_tabsNav";
export const getCacheTabNavList = () => JSON.parse(localStorage.getItem(tabsNavKey) || "[]");
export const setCacheTabNavList = (tabsNavList: TabProp[]) =>
  localStorage.setItem(tabsNavKey, JSON.stringify(tabsNavList));
export const removeCacheTabNavList = () => localStorage.removeItem(tabsNavKey);
