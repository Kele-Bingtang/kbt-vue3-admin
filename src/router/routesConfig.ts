/**
 * @description 动态路由参数配置简介 📚
 * @param path ==> 路由的地址，这是必须设置的，如果是个有效的 http 或者 https 链接，则点击该菜单跳转到新窗口
 * @param name ==> 路由的名字，这是必须设置的，如果开启了 I18n，某些路由又不想使用 I18n，则 name 以 _noUseI18n- 开头
 * @param redirect ==> 重定向到某个路由下，可选，function 使用方式请看官网：https://router.vuejs.org/zh/api/index.html#redirect
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.roles ==> 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 * @param meta.title ==> 显示在侧边栏、面包屑和标签栏的文字，使用 '{{ 多语言字段 }}' 形式结合「多语言」使用，可以传入一个回调函数，参数是当前路由对象 to
 * @param meta.icon ==> 菜单图标，该页面在左侧菜单、面包屑显示的图标，无默认值，如果是数组形式（仅支持三个下标），则对应 [icon, width, height]
 * @param meta.notClickBread ==> 是否允许点击面包屑，如果为 true，则该路由无法在面包屑中被点击，默认为 false
 * @param meta.hideInBread ==> 是否隐藏面包屑，如果为 true，则该路由将不会出现在面包屑中，默认为 false
 * @param meta.hideInMenu ==> 是否隐藏菜单，如果为 true，则该路由不会显示在左侧菜单，默认为 false
 * @param meta.alwaysShowRoot ==> 是否总是渲染为菜单，如果为 false 且某一级路由下只有一个二级路由，则左侧菜单直接显示该二级路由，如果为 true，则总会让一级菜单作为下拉菜单，默认为 false，仅限父级路由使用
 * @param meta.isKeepAlive ==> 是否缓存，如果为 true，该路由在切换标签后不会缓存，如果需要缓存，则「必须」设置页面组件 name 属性（class 名）和路由配置的 name 一致，默认为 false
 * @param meta.isAffix ==> 是否固定在 tabs nav，如果为 true，则该路由按照路由表顺序依次标签固定在标签栏，默认为 false
 * @param meta.isFull ==> 是否全屏，不渲染 Layout 布局，只渲染当前路由组件
 * @param meta.activeMenu ==> Restful 路由搭配使用，当前路由为详情页时，需要高亮的菜单
 * @param meta.beforeCloseName ==> 关闭路由前的回调，如果设置该字段，则在关闭当前 tab 页时会去 @/router/before-close.js 里寻找该字段名「对应」的方法，作为关闭前的钩子函数，无默认值
 * @param meta.rank ==> 路由在左侧菜单的排序，rank 值越高越靠后，当 rank 不存在时，根据顺序自动创建，首页路由永远在第一位，当 rank 存在时，可以插入指定的菜单位置，默认不存在
 * @param meta.frameSrc ==> IFrame 链接，填写后该路由将打开 IFrame 指定的链接
 */

import componentRoutes from "./modules/components";
import directiveRoutes from "./modules/directive";
import errorRoutes from "./modules/error";
import excelRoutes from "./modules/excel";
import frameRoutes from "./modules/frame";
import nestedRoutes from "./modules/nested";
import outerChainRoutes from "./modules/outerChain";
import permissionRoutes from "./modules/permision";
import tableRoutes from "./modules/table";

export const HOME_URL = "/home";
export const HOME_NAME = "Home";
export const LOGIN_URL = "/login";

export const constantRoutes: RouterConfigRaw[] = [
  {
    path: LOGIN_URL,
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      hideInMenu: true,
    },
  },
  {
    path: "/redirect",
    meta: { hideInMenu: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue"),
      },
    ],
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/indexAsync.vue"),
    redirect: HOME_URL,
    meta: { hideInMenu: true, hideInBread: true },
    children: [
      {
        path: "/error-log",
        name: "ErrorLog",
        component: () => import("@/views/errorLog/index.vue"),
        meta: { title: "错误日志", isKeepAlive: false, hideInMenu: true },
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "我的主页", icon: "User" },
      },
      {
        path: "/message-center",
        name: "MessageCenter",
        component: () => import("@/views/messageCenter/index.vue"),
        meta: { title: "我的消息", icon: "Bell" },
      },
    ],
  },
];

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRouter = {
  path: "/:pathMatch(.*)*",
  name: "notFound",
  redirect: { name: "404" },
};

export const rolesRoutes: RouterConfigRaw[] = [
  {
    path: "/home",
    name: "Home",
    component: "/home/index",
    meta: {
      isAffix: true,
      title: "首页",
      icon: "HomeFilled",
    },
  },
  { ...componentRoutes },
  { ...tableRoutes },
  { ...excelRoutes },
  { ...permissionRoutes },
  {
    path: "/plugins",
    redirect: "/plugins/clipboard",
    name: "Plugins",
    meta: {
      title: "插件",
      icon: "Ticket",
      alwaysShowRoot: true,
    },
    children: [
      {
        path: "clipboard",
        name: "Clipboard",
        component: () => import("@/views/plugins/clipboard/index.vue"),
        meta: { title: "文本复制", icon: "DocumentCopy" },
      },
    ],
  },
  { ...nestedRoutes },
  { ...directiveRoutes },
  { ...errorRoutes },
  { ...frameRoutes },
  { ...outerChainRoutes },
];
