import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import SystemConfig from "@/config";

export * from "./interface";
export * from "./errorLog";
export * from "./layout";
export * from "./route";
export * from "./settings";
export * from "./user";
export * from "./message";
export * from "./websocket";

// 搭配 useStorage 使用
const customStorage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    if (!value) return value;

    const { value: val } = JSON.parse(value);
    return JSON.stringify(val);
  },
  setItem: (key: string, value: string) => {
    const valueType = Object.prototype.toString.call(value).slice(8, -1);
    localStorage.setItem(key, JSON.stringify({ _type: valueType, value: JSON.parse(value) }));
  },
};

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: key => `${SystemConfig.layoutConfig.cacheKeyPrefix}:${key}`,
    storage: customStorage,
  })
);

export default pinia;
