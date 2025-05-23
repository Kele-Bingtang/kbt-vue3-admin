import SystemConfig from "@/config";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

export * from "./interface";
export * from "./errorLog";
export * from "./layout";
export * from "./permission";
export * from "./settings";
export * from "./user";
export * from "./message";
export * from "./websocket";

const customStorage = {
  getItem: (key: string) => {
    const value = window.localStorage.getItem(key);
    if (value) {
      const { value: val } = JSON.parse(value);
      return JSON.stringify(val);
    } else return value;
  },
  setItem: (key: string, value: string) => {
    const valueType = Object.prototype.toString.call(value).slice(8, -1);
    window.localStorage.setItem(key, JSON.stringify({ _type: valueType, value: JSON.parse(value) }));
  },
};

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: key => `${SystemConfig.layoutConfig.cacheKeyPrefix}_${key}`,
    storage: customStorage,
  })
);

export default pinia;
