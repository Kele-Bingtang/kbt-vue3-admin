const outerChainRoutes = {
  path: "/outer-chain",
  name: "OuterChain",
  meta: {
    title: "外部链接",
    icon: "Link",
    rank: 100,
  },
  children: [
    {
      path: "https://github.com/Kele-Bingtang/kbt-vue3-admin",
      name: "Github",
      meta: {
        title: "Github",
        icon: "svg-github",
      },
    },
    {
      path: "https://vue2-admin.youngkbt.cn/",
      name: "Vue2Admin",
      meta: {
        title: "Kbt Vue2 Admin",
        icon: "StarFilled",
      },
    },
    {
      path: "https://notes.youngkbt.cn/",
      name: "Notes",
      meta: {
        title: "我的博客",
        icon: "StarFilled",
      },
    },
  ],
};

export default outerChainRoutes;
