import type { RouteRecordRaw, RouteLocationNormalizedLoaded, RouteComponent } from "vue-router";

declare global {
  interface Navigator {
    browserLanguage: string;
  }

  type RouteConfig = RouteLocationNormalizedLoaded & {
    redirect?: string;
    meta: ReadOnlyKey<RequiredKey<MetaProp, "_fullPath" | "__titleIsFunction__">, "_fullPath" | "__titleIsFunction__">;
  };

  type RouterConfig = RouteRecordRaw & {
    meta: ReadOnlyKey<RequiredKey<MetaProp, "_fullPath" | "__titleIsFunction__">, "_fullPath" | "__titleIsFunction__">;
    children?: RouterConfig[];
  };

  type RouterConfigRaw = Omit<RouteRecordRaw, "component" | "children"> & {
    meta?: Omit<MetaProp, "_fullPath" | "__titleIsFunction__">;
    component?: string | RouteComponent | (() => Promise<RouteComponent>);
    children?: RouterConfigRaw[];
  };
  interface MetaProp {
    _fullPath?: string; // 路由的完整路径，在编译阶段自动生成
    __titleIsFunction__?: boolean; // 判断 title 是否是数组，在编译阶段自动生成
    roles?: string[];
    title?: string | number | ((route: RouteConfig) => string);
    icon?: string;
    notClickBread?: boolean;
    hideInBread?: boolean;
    hideInMenu?: boolean;
    alwaysShowRoot?: boolean;
    isKeepAlive?: boolean;
    isAffix?: boolean | number;
    isFull?: string;
    activeMenu?: string;
    beforeCloseName?: string;
  }
}

export {}; // 扩展 global 而不是覆盖
