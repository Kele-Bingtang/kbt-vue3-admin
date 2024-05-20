import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from "vite";
import { wrapperEnv } from "./build/getEnv";
import { resolve } from "path";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { getNowDate } from "./src/utils/helper";
import pkg from "./package.json";

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version }, // package.json 相关信息
  lastBuildTime: getNowDate(), // 打包时间
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);

  return {
    base: env.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: getPluginsList(command, viteEnv),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude,
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
          target: "https://youngkbt.cn",
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
    // 打包去除 console.log && debugger
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log"] : [],
      drop: viteEnv.VITE_DROP_DEBUGGER ? ["debugger"] : [],
    },
    build: {
      // esbuild 打包更快，terser 打包慢
      minify: "esbuild",
      // minify: "terser",
      // terserOptions: {
      //   compress: {
      //     drop_console: viteEnv.VITE_DROP_CONSOLE,
      //     drop_debugger: viteEnv.VITE_DROP_DEBUGGER,
      //   },
      // },
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: viteEnv.VITE_SOURCEMAP,
      // 消除打包大小超过 500kb 警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: resolve(__dirname, ".", "index.html"),
        },
        // 静态资源分类打包
        output: {
          // 拆包
          manualChunks: {
            "vue-chunks": ["vue", "vue-router", "pinia", "vue-i18n"],
            "element-plus": ["element-plus"],
            "wang-editor": ["@wangeditor/editor", "@wangeditor/editor-for-vue"],
            tinymce: ["tinymce", "@tinymce/tinymce-vue"],
            echarts: ["echarts"],
            codemirror: [
              "vue-codemirror6",
              "codemirror",
              // pnpm 安装 vue-codemirror6 和 codemirror 不会自动安装如下依赖（解决幽灵依赖）
              // "@codemirror/autocomplete",
              // "@codemirror/commands",
              // "@codemirror/language",
              // "@codemirror/lint",
              // "@codemirror/search",
              // "@codemirror/state",
              // "@codemirror/view",
            ],
            // 如果项目只需要一种代码语言，则把其他去掉
            "codemirror-lang": [
              "@codemirror/lang-html",
              "@codemirror/lang-javascript",
              "@codemirror/lang-markdown",
              "@codemirror/lang-java",
              "@codemirror/lang-json",
              "@codemirror/lang-php",
              "@codemirror/lang-python",
              "@codemirror/lang-sql",
              "@codemirror/lang-xml",
            ],
            // 如果项目只需要一种主题，则把其他去掉
            "codemirror-theme": [
              "@codemirror/theme-one-dark",
              "@uiw/codemirror-theme-dracula",
              "@uiw/codemirror-theme-xcode",
            ],
          },
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
      cssCodeSplit: !env.VITE_USE_CSS_SPLIT,
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true", // 去除控制台的一个警告信息
    },
  };
});
