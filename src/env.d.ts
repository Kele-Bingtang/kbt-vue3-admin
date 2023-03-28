/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

// import.meta.env 环境变量
interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_COMPRESSION: "none" | "gzip" | "brotli" | "both" | "gzip-clear" | "brotli-clear" | "both-clear";
  readonly VITE_ROUTER_MODE: string | "h5" | "hash";
}

// 覆盖全局的 useRoute 类型
declare const useRoute: () => RouteConfig;
