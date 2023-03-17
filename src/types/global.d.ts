import type { RouteRecordRaw, RouteLocationNormalizedLoaded, RouteComponent } from "vue-router";

declare global {
  interface Navigator {
    browserLanguage: string;
  }
  interface Window {
    webkitCancelAnimationFrame;
    mozCancelAnimationFrame;
    oCancelAnimationFrame;
    msCancelAnimationFrame;
    webkitRequestAnimationFrame;
    mozRequestAnimationFrame;
    oRequestAnimationFrame;
    msRequestAnimationFrame;
  }

  type MetaNeedKey = "_fullPath" | "__titleIsFunction__" | "dynamic";

  type RouteConfig = RouteLocationNormalizedLoaded & {
    redirect?: string;
    meta: ReadOnlyKey<RequiredKey<MetaProp, MetaNeedKey>, MetaNeedKey>;
  };

  type RouterConfig = RouteRecordRaw & {
    meta: ReadOnlyKey<RequiredKey<MetaProp, MetaNeedKey>, MetaNeedKey>;
    children?: RouterConfig[];
  };

  type RouterConfigRaw = Omit<RouteRecordRaw, "component" | "children"> & {
    meta?: Omit<MetaProp, MetaNeedKey>;
    component?: string | RouteComponent | (() => Promise<RouteComponent>);
    children?: RouterConfigRaw[];
  };
  interface MetaProp {
    _fullPath?: string; // 路由的完整路径，在编译阶段自动生成
    __titleIsFunction__?: boolean; // 判断 title 是否是数组，在编译阶段自动生成
    dynamic?: boolean; // 是否是动态路由，在编译阶段自动生成
    roles?: string[];
    title?: string | number | ((route: RouteConfig) => string);
    icon?: string;
    notClickBread?: boolean;
    hideInBread?: boolean;
    hideInMenu?: boolean;
    alwaysShowRoot?: boolean;
    isKeepAlive?: boolean;
    isAffix?: boolean | number;
    isFull?: boolean;
    activeMenu?: string;
    beforeCloseName?: string;
    rank?: number;
    frameSrc?: string;
  }
}

export {}; // 扩展 global 而不是覆盖
