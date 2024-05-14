import { useLayoutStore } from "@/stores";
import { useTabsNav } from "../TabsNav/useTabsNav";

const FrameView = () => import("./FrameView.vue");
const FrameBlank = () => import("./BlankFrame.vue");

export interface Frame {
  src: string; // 地址
  name: string; // 名字
  show: boolean; // 是否展示
}

export const useFrame = () => {
  const layoutStore = useLayoutStore();
  const { closeSelectedTab } = useTabsNav();
  const route = useRoute();
  const router = useRouter();

  const showIframe = (item: Frame) => {
    return item.name === unref(route).name;
  };

  /**
   * 接收 frame 传来的消息，执行该消息（如果把 admin 作为门户来嵌入各个系统，则用到）
   * 消息：需要打开的连接
   */
  const acceptFrameMsg = (evt: MessageEvent) => {
    const tarType = Object.prototype.toString.call(evt.data);
    let msg: typeof evt.data;
    if (tarType === "[object String]") msg = JSON.parse(evt.data);
    else if (tarType === "[object Object]") msg = evt.data;
    if (msg.meta?.frameSrc) {
      const route = { ...msg };
      if (router.hasRoute(route.name)) return router.push({ name: route.name });
      if (route.component) return console.error("if you use iframe message，component must is undefined");
      if (route.meta?.frameKeepAlive) route.component = FrameBlank;
      else if (!route.meta?.frameKeepAlive && route.meta?.frameSrc) route.component = FrameView;
      router.addRoute("Layout", route);
      router.push({ name: route.name });
    } else if (msg.code) {
      closeTab(msg);
      // 匹配路由表的 name，参见 src\hooks\useRoutes.ts
      router.push({ name: msg.code });
    } else if (msg.name) {
      closeTab(msg);
      // 匹配路由表的 name，参见 src\hooks\useRoutes.ts
      router.push({ name: msg.name });
    }
  };

  const closeTab = (msg: any) => {
    if (msg.shutdownCode) {
      for (const tab of layoutStore.tabNavList) {
        if (tab.name === msg.shutdownCode) {
          closeSelectedTab(tab);
          break;
        }
      }
    }
  };
  return {
    showIframe,
    acceptFrameMsg,
  };
};
