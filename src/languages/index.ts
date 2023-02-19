import { createI18n } from "vue-i18n";
import zhCN from "./modules/zh-CN";
import enUS from "./modules/en-US";

const i18n = createI18n({
  legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
  locale: "zh-CN", // 设置语言类型
  globalInjection: true, // 全局注册 $t 方法
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export default i18n;
