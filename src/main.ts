import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css' // 内置暗黑模式
import '@/styles/element-dark.scss' // 自定义暗黑模式
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
import router from "./router";
import "@/styles/normalize.css"; // CSS Reset
import directives from "@/directives/index";
import I18n from "@/languages/index";
// svg icons
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon/index.vue";

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistedstate)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component("svg-icon", SvgIcon);

app.use(I18n).use(pinia).use(router).use(directives).use(ElementPlus).mount("#app");

export default app;
