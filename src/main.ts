import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css"; // 内置暗黑模式
import "@/styles/element-dark.scss"; // 自定义暗黑模式
import App from "./App.vue";
import router from "./router";
import "@/styles/normalize.css"; // CSS Reset
import directives from "@/directives/index";
import I18n from "@/languages/index";
// svg icons
import "virtual:svg-icons-register";
import Icon from "@/components/Icon/index.vue";
import errorHandler from "@/utils/layout/errorHandler";
import vue3TreeOrg from "vue3-tree-org";
import "vue3-tree-org/lib/vue3-tree-org.css";
import Auth from "@/components/Permission/auth";
import Role from "@/components/Permission/role.vue";

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);

app.config.errorHandler = errorHandler;

// 全局注册按钮级别权限组件
app.component("Auth", Auth);

// 全局注册页面级别权限组件
app.component("Role", Role);

app.component("Icon", Icon);

app.use(I18n).use(pinia).use(router).use(directives).use(ElementPlus).use(vue3TreeOrg).mount("#app");
