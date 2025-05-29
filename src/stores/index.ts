import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import SystemConfig from "@/config";
import { useStorage } from "@/composables";

export * from "./interface";
export * from "./errorLog";
export * from "./layout";
export * from "./route";
export * from "./settings";
export * from "./user";
export * from "./message";
export * from "./websocket";

const { getStorage, setStorage } = useStorage();

const customStorage = {
  getItem: getStorage,
  setItem: setStorage,
};

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: key => `${SystemConfig.layoutConfig.cacheKeyPrefix}:${key}`,
    storage: customStorage,
  })
);

export default pinia;
