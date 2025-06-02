import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import SystemConfig from "@/config";

export * from "./core/layout";
export * from "./core/route";
export * from "./core/setting";
export * from "./core/user";
export * from "./error-log";
export * from "./message";
export * from "./websocket";

const { version } = __APP_INFO__.pkg;
const cacheKeyPrefix = SystemConfig.keyConfig.cacheKeyPrefix;

// 自定义存储逻辑，与 useStorage 方式一样
const customStorage = {
  getItem: (key: string) => {
    // userStore 不进行版本管控，否则每次升版都要登录
    if (key.includes("userStore")) key = `${cacheKeyPrefix}:userStore`;

    const value = localStorage.getItem(key);
    if (!value) return value;

    const { value: val } = JSON.parse(value);
    return JSON.stringify(val);
  },
  setItem: (key: string, value: string) => {
    // userStore 不进行版本管控，否则每次升版都要登录
    if (key.includes("userStore")) key = `${cacheKeyPrefix}:userStore`;

    const valueType = Object.prototype.toString.call(value).slice(8, -1);
    localStorage.setItem(key, JSON.stringify({ _type: valueType, value: JSON.parse(value) }));
  },
};

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: key => `${cacheKeyPrefix}:v${version}:${key}`,
    storage: customStorage,
  })
);

export default pinia;
