import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import eslintPlugin from "vite-plugin-eslint";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import { configCompressPlugin } from "./compress";
import type { ViteEnv } from "./getEnv";
import { visualizer } from "rollup-plugin-visualizer";

export function getPluginsList(command: string, viteEnv: ViteEnv) {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    vueJsx(),
    eslintPlugin(), // EsLint 报错信息显示在浏览器界面上
    VueSetupExtend(), // script setup 标签支持 name 命名组件
    AutoImport({
      imports: ["vue", "vue-router"], // 自动引入 vue 的 ref、toRefs、onMounted 等，无需在页面中再次引入
      dts: "src/auto-import.d.ts", // 生成在 src 路径下名为 auto-import.d.ts 的声明文件
      eslintrc: {
        enabled: false, // 改为 true 用于生成 eslint 配置。生成后改回 false，避免重复生成消耗
      },
    }),
    // * 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
    viteEnv.VITE_BUILD_GZIP && configCompressPlugin(viteEnv.VITE_COMPRESSION),
    // 打包分析
    (lifecycle === "report" || viteEnv.VITE_REPORT) &&
      visualizer({ open: true, brotliSize: true, filename: "report.html" }),
  ];
}
