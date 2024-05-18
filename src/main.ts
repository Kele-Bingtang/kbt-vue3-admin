import { createApp } from "vue";
import pinia from "@/stores";
import "@/styles/element-dark.scss"; // 自定义暗黑模式
import App from "./App.vue";
import router from "./router";
import "@/styles/normalize.css"; // CSS Reset
import directives from "@/directives/index";
import I18n from "@/languages/index";
// svg icons
import "virtual:svg-icons-register";
import { Icon, Auth, Role } from "@/components";
import { errorHandler, checkNeed } from "@/utils";
import Vue3TreeOrg from "vue3-tree-org";
import "vue3-tree-org/lib/vue3-tree-org.css";

const app = createApp(App);

checkNeed() && (app.config.errorHandler = errorHandler);

// 全局注册按钮级别权限、页面级别权限、Icon 图标组件组件
app.use(Auth).use(Role).use(Icon);

// 注册树形组件
app.use(Vue3TreeOrg);

// 是否全部注册 Element Plus 的样式
if (import.meta.env.VITE_LOAD_ALL_EP_STYLE) {
  import("element-plus/dist/index.css");
}
// 是否全部注册 Element Plus 的组件
if (import.meta.env.VITE_LOAD_ALL_EP_COMPONENTS) {
  import("element-plus").then(ElementPlus => {
    app.use(ElementPlus);
  });
}

app.use(I18n).use(pinia).use(router).use(directives).mount("#app");
