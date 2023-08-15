import { Box, StarFilled } from "@element-plus/icons-vue";

const proTable: RouterConfigRaw = {
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
      component: () => import("@/views/proTable/simpleProTable/index.vue"),
      name: "SimpleProTable",
      meta: { title: "使用 ProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
    },
    {
      path: "tree",
      component: () => import("@/views/proTable/treeFilterProTable/index.vue"),
      name: "TreeProTable",
      meta: { title: "使用 TreeProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
    },
    {
      path: "complex",
      component: () => import("@/views/proTable/complexProTable/index.vue"),
      name: "ComplexProTable",
      meta: { title: "复杂 ProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
    },
  ],
};

export default proTable;
