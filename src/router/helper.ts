import type { RouteLocationNormalizedLoaded } from "vue-router";
import SystemConfig from "@/config";
import { t } from "@/languages";
import { isFunction } from "@/utils";

type Route = RouteLocationNormalizedLoaded | RouterConfigRaw;

/**
 * 获取页面标题、侧边菜单、面包屑、tabNav 展示的 title
 *
 * @param route 当前路由
 * @param reTranslate 是否从头开始翻译 title，因为路由在编译阶段已经翻译了一部分，所以涉及路由里的配置不需要从头开始翻译，具体看 ./useRoutes.ts 的 processRouteMeta 函数
 */
export const formatTitle = (route: Route, reTranslate = false) => {
  // 取消 meta 响应式
  const meta: MetaProp = { ...route.meta };
  const { title: routeTitle, useI18n } = meta;
  const name = route.name as string;
  let title = routeTitle;

  if (reTranslate && !isFunction(title)) title = translateTitle(title + "", name, useI18n);
  if (title && !isFunction(title)) return title + "";

  if (isFunction(title)) title = title({ ...route } as RouteLocationNormalizedLoaded);

  return translateTitle(title + "", name, useI18n);
};

/**
 * 国际化转换路由的 title
 *
 * @param title 国际化 title
 * @param name 路由的 name
 * @param useI18n 是否使用 i18n
 */
export const translateTitle = (title: string, name?: string, useI18n = false) => {
  const { routeUseI18n } = SystemConfig.routerConfig;
  const finalTitle = title + "" || name || "no-name";

  if (!routeUseI18n || !useI18n) return finalTitle;

  // 处理 {{ }}，如 title 为 "{{ _route.Home }}"，则说明 _route.Home 需要 i18n 转化
  if (finalTitle.includes("{{") && finalTitle.includes("}}")) {
    return finalTitle.replace(/({{[\s\S]+?}})/, (_: any, str: string) =>
      str.replace(/{{([\s\S]*)}}/, (_: any) => t(_.trim()))
    );
  }

  if (name) {
    const translateName = t(`_route.${name}`);
    // 转换多语言后，如果还是 _route.${route.name}，代表没有配置多语言，直接返回 name
    return translateName === `_route.${name}` ? name : translateName;
  }

  return finalTitle;
};
