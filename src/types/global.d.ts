import type { RouteRecordRaw, RouteLocationNormalizedLoaded, RouteComponent } from "vue-router";

export {}; // 扩展 global 而不是覆盖

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

  type MetaNeedKey = "_fullPath" | "_dynamic";
  // 自定义 useRoute 类型
  type RouteConfig = RouteLocationNormalizedLoaded & {
    redirect?: string;
    meta: RequiredKey<MetaProp, MetaNeedKey>;
  };
  // 自定义路由处理过程类型
  type RouterConfig = RouteRecordRaw & {
    meta: RequiredKey<MetaProp, MetaNeedKey>;
    children?: RouterConfig[];
  };
  // 自定义路由表配置类型
  type RouterConfigRaw = Omit<RouteRecordRaw, "component" | "children"> & {
    meta?: Omit<MetaProp, MetaNeedKey>;
    component?: string | RouteComponent | (() => Promise<RouteComponent>);
    children?: RouterConfigRaw[];
  };

  interface MetaProp {
    readonly _fullPath?: string; // 路由的完整路径，在编译阶段自动生成
    readonly _dynamic?: boolean; // 是否是动态路由，在编译阶段自动生成
    roles?: string[]; // 可访问该页面的权限数组，当前路由设置的权限会影响子路由
    auths?: string[]; // 路由内的按钮权限
    title?: string | number | ((route: RouteConfig) => string); // 显示在侧边栏、面包屑和标签栏的文字，使用 '{{ 多语言字段 }}' 形式结合「多语言」使用，可以传入一个回调函数，参数是当前路由对象 to
    icon?: string; // 菜单图标，该页面在左侧菜单、面包屑显示的图标，无默认值
    notClickBread?: boolean; // 是否允许点击面包屑，如果为 true，则该路由无法在面包屑中被点击，默认为 false
    hideInBread?: boolean; // 是否不添加到面包屑，如果为 true，则该路由将不会出现在面包屑中，默认为 false
    hideInMenu?: boolean; // 是否不添加到菜单，如果为 true，则该路由不会显示在左侧菜单，默认为 false
    alwaysShowRoot?: boolean; // 是否总是渲染为菜单，如果为 false 且某一级路由下只有一个二级路由，则左侧菜单直接显示该二级路由，如果为 true，则总会让一级菜单作为下拉菜单，默认为 false，仅限父级路由使用
    isKeepAlive?: boolean; // 是否缓存，如果为 true，该路由在切换标签后不会缓存，如果需要缓存，则「必须」设置页面组件 name 属性（class 名）和路由配置的 name 一致，默认为 false
    isAffix?: boolean | number; // 是否固定在 tabs nav，如果为 true，则该路由按照路由表顺序依次标签固定在标签栏，默认为 false
    isFull?: boolean; // 是否全屏，不渲染 Layout 布局，只渲染当前路由组件
    activeMenu?: string; // Restful 路由搭配使用，当前路由为详情页时，需要高亮的菜单
    beforeCloseName?: string; // 关闭路由前的回调，如果设置该字段，则在关闭当前 tab 页时会去 @/router/before-close.js 里寻找该字段名「对应」的方法，作为关闭前的钩子函数，无默认值
    rank?: number; // 路由在左侧菜单的排序，rank 值越高越靠后，当 rank 不存在时，根据顺序自动创建，首页路由永远在第一位，当 rank 存在时，可以插入指定的菜单位置，默认不存在
    frameSrc?: string; // IFrame 页是否开启首次加载动画（默认 true）
    /**
     * @description 页面加载动画（有两种形式，一种直接采用 vue 内置的 transitions 动画，另一种是使用 animate.css 写进、离场动画）
     * @see {@link https://next.router.vuejs.org/guide/advanced/transitions.html#transitions}
     * @see animate.css {@link https://animate.style}
     */
    transition?: {
      name?: string; // 当前路由动画效果
      enterTransition?: string; // 进场动画
      leaveTransition?: string; // 离场动画
    };
    hideInTab?: boolean; // 是否不添加到标签页，默认 false
    dynamicLevel?: number; // 动态路由可打开的最大数量
    useI18n?: boolean; // 是否开启 i18n，默认读取全局的 routeUseI18n（src/config/settings.ts）
    useTooltip?: boolean; // 菜单的文字超出后，是否使用 el-toolTip 提示，默认读取全局的 routeUseTooltip（src/config/settings.ts）
  }
}

declare global {
  /**
   * 平台的名称、版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    lastBuildTime: string;
  };
}
