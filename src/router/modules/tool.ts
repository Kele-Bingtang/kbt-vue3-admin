const toolsRoutes: RouterConfigRaw = {
  path: "/tools",
  redirect: "/tools/clipboard",
  name: "Tools",
  meta: {
    title: "工具",
    icon: "Ticket",
    alwaysShowRoot: true,
  },
  children: [
    {
      path: "clipboard",
      name: "Clipboard",
      component: () => import("@/views/tools/clipboard/index.vue"),
      meta: { title: "文本复制", icon: "DocumentCopy" },
    },
    {
      path: "print",
      name: "Print",
      component: () => import("@/views/tools/print/index.vue"),
      meta: { title: "打印", icon: "StarFilled" },
    },
    {
      path: "download",
      name: "Download",
      component: () => import("@/views/tools/download/index.vue"),
      meta: { title: "下载", icon: "StarFilled" },
    },
    {
      path: "timeline",
      name: "Timeline",
      component: () => import("@/views/tools/timeline/index.vue"),
      meta: { title: "时间线", icon: "StarFilled" },
    },
    {
      path: "pdf-preview",
      name: "PdfPreview",
      component: () => import("@/views/tools/pdf/index.vue"),
      meta: { title: "PDF 预览", icon: "StarFilled" },
    },
  ],
};

export default toolsRoutes;
