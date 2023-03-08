import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from "vite";
import { wrapperEnv } from "./build/getEnv";
import { resolve } from "path";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  return {
    base: env.VITE_BASE_URL,
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
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: resolve(__dirname, ".", "index.html"),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  };
});
