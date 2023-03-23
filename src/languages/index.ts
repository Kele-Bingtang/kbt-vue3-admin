import { createI18n } from "vue-i18n";
import zhCN from "./modules/zh-CN";
import enUS from "./modules/en-US";
import { getBrowserLang } from "@/utils";
import settings from "@/config/settings";
import type { WritableComputedRef } from "vue";

const messages = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

export const getLocale = () => {
  const layoutCache = localStorage.getItem(settings.layoutCacheKey);
  const layoutStore = layoutCache ? JSON.parse(layoutCache) : "";
  const cookieLanguage = layoutStore ? layoutStore.language : layoutStore;
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage;
    return cookieLanguage;
  }
  // 自动根据浏览器系统语言设置语言
  const language = getBrowserLang();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = locale;
      return locale;
    }
  }
  // 默认是中文
  return "zh-CN";
};

/**
 * 根据指定的 I18n 前缀返回对应的内容
 * @param prefix I18n 前缀
 */
function siphonI18n(prefix = "zh-CN") {
  return Object.fromEntries(
    //  key 表示文件名，value 表示模块的默认导出，所以文件名在这里统一是 zh-CN.yml 和 en-US.yml
    Object.entries(import.meta.glob("./modules/*.ts", { eager: true })).map(([key, value]: any) => {
      // 数组的第一个元素是文件名，第二个元素是内容
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)[1];
      return [matched, value.default];
    })
  )[prefix];
}

/**
 * 自定义的国际化转换函数，等价于 $t 或 t
 * 在其他 .ts 文件使用国际化，则使用该函数转换，因为 useI18n 必须在 setup 中使用
 * @param message message
 * @returns 转化后的 message
 */
export function transformI18n(message: any = ""): string {
  if (!message) return "";

  // 处理存储动态路由的 title，格式 { zh: "", en: "" }
  if (typeof message === "object") {
    const locale: string | WritableComputedRef<string> | any = i18n.global.locale;
    return message[locale?.value];
  }
  const key = message.match(/(\S*)\./)?.[1];
  if (key && Object.keys(siphonI18n("zh-CN")).includes(key)) {
    return i18n.global.t.call(i18n.global.locale, message, message, message);
  } else if (!key && Object.keys(siphonI18n("zh-CN")).includes(message)) {
    // 兼容非嵌套形式的国际化写法
    return i18n.global.t.call(i18n.global.locale, message, message, message);
  } else {
    return message;
  }
}

const i18n = createI18n({
  legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
  locale: getLocale(), // 设置语言类型
  globalInjection: true, // 全局注册 $t 方法
  messages,
});

export default i18n;
