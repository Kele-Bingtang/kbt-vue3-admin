import { Box, StarFilled } from "@element-plus/icons-vue";

const proComponents: RouterConfigRaw = {
  path: "/pro-components",
  name: "ProComponents",
  meta: {
    title: "超级组件",
    icon: Box,
  },
  children: [
    {
      path: "/pro-table",
      redirect: "/pro-table/simple",
      name: "ProTable",
      meta: {
        title: "超级表格",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          component: () => import("@/views/proComponents/proTable/simpleProTable/index.vue"),
          name: "SimpleProTable",
          meta: { title: "简单 ProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
        },
        {
          path: "tree",
          component: () => import("@/views/proComponents/proTable/treeFilterProTable/index.vue"),
          name: "TreeProTable",
          meta: { title: "使用 TreeProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
        },
        {
          path: "complex",
          component: () => import("@/views/proComponents/proTable/complexProTable/index.vue"),
          name: "ComplexProTable",
          meta: { title: "复杂 ProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
        },
        {
          path: "detail",
          component: () => import("@/views/proComponents/proTable/detailProTable/index.vue"),
          name: "DetailProTable",
          meta: { title: "详情 ProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
        },
      ],
    },
    {
      path: "/pro-form",
      redirect: "/pro-form/simple",
      name: "ProForm",
      meta: {
        title: "超级表单",
        icon: Box,
      },
      children: [
        {
          path: "simple-pro-form",
          component: () => import("@/views/proComponents/proForm/simpleProForm/index.vue"),
          name: "SimpleProForm",
          meta: { title: "简单 ProForm", icon: StarFilled },
        },
        {
          path: "use-pro-form",
          component: () => import("@/views/proComponents/proForm/useProForm/index.vue"),
          name: "UseProForm",
          meta: { title: "Use ProForm", icon: StarFilled },
        },
        {
          path: "detail",
          component: () => import("@/views/proComponents/proForm/detailProForm/index.vue"),
          name: "DetailProForm",
          meta: { title: "详情 ProForm", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-search",
      name: "ProSearch",
      meta: {
        notClickBread: true,
        title: "超级搜索",
        icon: Box,
      },
      children: [
        {
          path: "simple-search",
          name: "SimpleProSearch",
          component: () => import("@/views/proComponents/proSearch/simpleProSearch.vue"),
          meta: { title: () => "使用 ProSearch", icon: StarFilled },
        },
      ],
    },
  ],
};

export default proComponents;