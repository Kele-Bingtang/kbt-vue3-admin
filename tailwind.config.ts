import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

/**
 * 配置文件内容介绍：https://tailwind.nodejs.cn/docs/configuration
 * Tailwind 默认的配置内容：https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
 * 本文将的配置将会覆盖 Tailwind 的默认配置
 */
export default {
  darkMode: "selector", // 暗黑模式
  // 路径是相对于项目根目录，而不是 tailwind.config.js 文件目录
  content: [
    "./src/layout/**/*.{tsx,vue,ts}",
    "./src/components/**/*.{tsx,vue,ts}",
    "./src/views/**/*.{js,tsx,vue,jsx,ts}",
  ],
  theme: {
    colors: {
      // 使用官方的默认调色板
      ...colors,
      // 添加 EP 色
      primary: "var(--el-color-primary)",
      success: "var(--el-color-success)",
      warning: "var(--el-color-warning)",
      danger: "var(--el-color-danger)",
      info: "var(--el-color-info)",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
