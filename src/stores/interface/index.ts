import type { IconifyIcon } from "@iconify/vue";
import type { Component, ComponentPublicInstance } from "vue";

// LayoutState
export interface TabProp {
  path: string; // 路由的 path
  name: string; // 路由的 name
  title: string; // 展示的描述
  icon: string | IconifyIcon | Component; // 图标
  close: boolean; // 是否允许关闭
  meta: MetaProp;
}

export enum DeviceType {
  Mobile = "mobile", // 移动端
  Desktop = "desktop", // 桌面端
}

export type LayoutSizeType = "default" | "small" | "large";
export type LanguageType = "zh-CN" | "en-US";

export interface LayoutState {
  device: DeviceType; // 设备类型
  tabNavList: TabProp[]; // 标签栏列表
  keepAliveName: string[]; // 缓存的路由组件名
  layoutSize: LayoutSizeType; // 布局大小
  language: LanguageType; // 语言
}

// PermissionState
export interface PermissionState {
  loadedRouteList: RouterConfigRaw[]; // 当前用户所有的权限路由表（包含基础路由）
  homeRoute: RouterConfigRaw; // 首页的路由
  flatRouteList: RouterConfigRaw[]; // 扁平化路由
}

// SettingsState
export enum LayoutModeType {
  Vertical = "vertical",
  Classic = "classic",
  Transverse = "transverse",
  Columns = "columns",
  Subsystem = "subsystem",
  Mixins = "mixins",
}

export enum TabsNavModeType {
  Classic = "classic",
  Popular = "popular",
}

export enum LayoutThemeType {
  Light = "light",
  Dark = "dark",
}

export interface SettingsState {
  theme: string; // Element UI 主题色
  titleMode: string; // 标题在浏览器标签上的多种模式。0：title + 页面 title，1：用户名 + 页面 title，2：title，3：页面 title
  layoutMode: LayoutModeType; // 布局设置，0：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧，1：Header 占顶部一行，SideMenu 占下方左侧，Main Content 占下方右侧
  tabsNavMode: TabsNavModeType; // 布局设置，0：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧，1：Header 占顶部一行，SideMenu 占下方左侧，Main Content 占下方右侧
  menuTheme: LayoutThemeType; // 侧边菜单栏主题色
  isCollapse: boolean; // 侧边菜单
  showSettings: boolean; // 是否显示 settings 配置
  showTabsNav: boolean; // 是否显示标签页
  recordTabsNav: boolean; // 是否记录打开过（没关闭）的 tags，下次打开会加载在 tagsNav
  showLayoutLogo: boolean; // 是否显示侧边菜单栏的 Logo
  showBreadcrumb: boolean; // 是否使用面包屑
  showBreadcrumbIcon: boolean; // 面包屑 Icon 是否显示
  showTabsNavIcon: boolean; // 标签栏 Icon 是否显示
  isDark: boolean; // 是否开启暗色主题
  isWeak: boolean; // 是否开启灰色主题
  isGrey: boolean; // 是否开启色弱主题
  headerTheme: LayoutThemeType; // 是否开启灰色模式
}
// UserState
export interface UserInfo {
  userId: string; // 用户 ID
  username: string; // 用户名
  sex: string; // 用户性别
  email?: string; // 用户邮箱
  phone?: string; // 用户联系方式
  avatar?: string; // 用户头像
  roles: string[]; // 用户角色
  registerTime?: string; // 用户角色
}

export interface UserState {
  token: string; // 用户的认证 token
  userInfo: UserInfo; // 用户信息
  roles: string[]; // 有时候 roles 需要等拿到 userId，再去获取，则不会在 userInfo 里
}

// ErrorLogState
export interface ErrorLog {
  error: unknown; // 错误对象
  vm?: ComponentPublicInstance | null; // 发生错误的 Vue 实例
  info: string; // Vue 组件的错误信息
  url: string; // 发生错误的 URL
  hasRead: boolean; // 错误日志是否已读
  time?: number; // 发生错误的时间
  userId?: string; // 用户 ID
  username?: string; // 用户名
  token?: string; // 用户 token
  roles?: string[]; // 用户的角色
}

// MessageStore
export interface MessageItem {
  id: string;
  title: string;
  content: string;
  description?: string;
  createTime: string;
  loading?: boolean;
}

export interface MessageStore {
  unreadList: MessageItem[];
  hasReadList: MessageItem[];
  recycleList: MessageItem[];
}

export interface MessageState {
  message: MessageStore;
}

// WebSocketStore
export interface WebSocketStore {
  websocket: Nullable<WebSocket>;
  status: string;
  websocketUrl: string;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (data: any) => void;
}
