const frameRoutes: RouterConfigRaw = {
  path: "/iframe",
  name: "IFrame",
  meta: {
    icon: "StarFilled",
    title: "外部页面",
  },
  children: [
    {
      path: "vue2-admin",
      name: "Vue2Admin",
      meta: {
        title: "Kbt Vue2 Admin",
        icon: "HotWater",
        frameSrc: "https://vue2-admin.youngkbt.cn/",
      },
    },
    {
      path: "element-plus",
      name: "FrameEp",
      meta: {
        title: "Element Plus 文档",
        icon: "HotWater",
        frameSrc: "https://element-plus.org/zh-CN/",
      },
    },
    {
      path: "vue3",
      name: "FrameVue",
      meta: {
        title: "Vue3 文档",
        icon: "HotWater",
        frameSrc: "https://cn.vuejs.org/",
      },
    },
    {
      path: "vite",
      name: "FrameVite",
      meta: {
        title: "Vite 文档",
        icon: "HotWater",
        frameSrc: "https://cn.vitejs.dev/",
      },
    },
    {
      path: "pinia",
      name: "FramePinia",
      meta: {
        title: "Pinia 文档",
        icon: "HotWater",
        frameSrc: "https://pinia.vuejs.org/zh/index.html",
      },
    },
    {
      path: "vue-router",
      name: "FrameRouter",
      meta: {
        title: "Vue Router 文档",
        icon: "HotWater",
        frameSrc: "https://router.vuejs.org/zh/",
      },
    },
  ],
};

export default frameRoutes;
