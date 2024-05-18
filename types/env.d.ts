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
  VITE_PORT: number; // 项目端口号
  VITE_OPEN: boolean; // 运行 npm run dev 时自动打开浏览器
  VITE_REPORT: boolean; // 是否生成包分析文件
  VITE_BUILD_GZIP: boolean; // 是否开启 gzip 压缩
  VITE_DROP_CONSOLE: boolean; // 打包过程是否删除 console
  VITE_DROP_DEBUGGER: boolean; // 打包过程是否删除 debugger
  VITE_SOURCEMAP: boolean; // 是否生成 sourcemap 文件
  VITE_OUT_DIR: string; // 打包输出目录，默认 dist
  VITE_CSS_SPLIT: boolean; // 是否将 css 切割
  VITE_LOAD_ALL_EP_STYLE: boolean; // 是否加载所有 element-plus 样式
  VITE_LOAD_ALL_EP_COMPONENTS: boolean; // 是否加载所有 element-plus 组件
  VITE_NODE_ENV: string; // 当前环境
  VITE_API_URL: string; // 接口跟地址
  VITE_PUBLIC_PATH: string; // 静态资源路径
  VITE_COMPRESSION: "none" | "gzip" | "brotli" | "both" | "gzip-clear" | "brotli-clear" | "both-clear"; // 打包文件的压缩类型
  VITE_ROUTER_MODE: string; // 路由模式，默认 H5
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
