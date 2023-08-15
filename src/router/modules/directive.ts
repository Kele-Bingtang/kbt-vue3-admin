import { Stamp, DocumentCopy, StarFilled } from "@element-plus/icons-vue";

const directiveRoutes: RouterConfigRaw = {
  path: "/directives",
  name: "Directives",
  redirect: "/directives/copy",
  meta: {
    title: "自定义指令",
    icon: Stamp,
  },
  children: [
    {
      path: "copy",
      name: "Copy",
      component: "/directives/copy/index",
      meta: {
        title: "复制指令",
        icon: DocumentCopy,
      },
    },
    {
      path: "watermark",
      name: "Watermark",
      component: "/directives/watermark/index",
      meta: {
        title: "水印指令",
        icon: StarFilled,
      },
    },
    {
      path: "drag",
      name: "Drag",
      component: "/directives/drag/index",
      meta: {
        title: "拖拽指令",
        icon: StarFilled,
      },
    },
    {
      path: "debounce",
      name: "Debounce",
      component: "/directives/debounce/index",
      meta: {
        title: "防抖指令",
        icon: StarFilled,
      },
    },
    {
      path: "throttle",
      name: "Throttle",
      component: "/directives/throttle/index",
      meta: {
        title: "节流指令",
        icon: StarFilled,
      },
    },
    {
      path: "longPress",
      name: "LongPress",
      component: "/directives/longPress/index",
      meta: {
        title: "长按指令",
        icon: StarFilled,
      },
    },
  ],
};

export default directiveRoutes;
