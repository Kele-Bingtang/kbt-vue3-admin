import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { wrapperEnv } from "./src/utils/getEnv";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ["vue", "vue-router"], //自动引入 vue 的 ref、toRefs、onmounted 等，无需在页面中再次引入
        dts: "src/auto-import.d.ts", // 生成在 src 路径下名为 auto-import.d.ts 的声明文件
      }),
      // * 使用 svg 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // 跨域代理配置
      proxy: {
        "/api": {
          target: "http://172.16.49.41",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/index.scss";`,
        },
      },
    },
  };
});