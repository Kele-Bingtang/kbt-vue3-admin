/**
 * 此文件作用于 `vite.config.ts` 的 `optimizeDeps.include` 依赖预构建配置项
 * 依赖预构建，`vite` 启动时会将下面 include 里的模块，编译成 esm 格式并缓存到 node_modules/.vite 文件夹，页面加载到对应模块时如果浏览器有缓存就读取浏览器缓存，如果没有会读取本地缓存并按需加载
 * 尤其当您禁用浏览器缓存时（这种情况只应该发生在调试阶段）必须将对应模块加入到 include里，否则会遇到开发环境切换页面卡顿的问题（vite 会认为它是一个新的依赖包会重新加载并强制刷新页面），因为它既无法使用浏览器缓存，又没有在本地 node_modules/.vite 里缓存
 * 温馨提示：如果您使用的第三方库是全局引入，也就是引入到 src/main.ts 文件里，就不需要再添加到 include 里了，因为 vite 会自动将它们缓存到 node_modules/.vite
 */
const include = [
  "qs",
  "mitt",
  "xlsx",
  "axios",
  "pinia",
  "echarts",
  "vue-i18n",
  "sortablejs",
  "@vueuse/core",
  "@wangeditor/editor",
  "@wangeditor/editor-for-vue",
  "@wangeditor/plugin-upload-attachment",
  "countup",
  "file-saver",
  "pinia-plugin-persistedstate",
  "vue-clipboard3",
  "vue-cropper",
  "vue3-tree-org",
  "vuedraggable",
  "xgplayer",
  "vue3-menus",
  "v-contextmenu",
  "codemirror",
  "tinymce",
  "@tinymce/tinymce-vue",
  "v-code-diff",
];

/**
 * 在预构建中强制排除的依赖项
 */
const exclude = ["@iconify-icons/ant-design"];

export { include, exclude };
