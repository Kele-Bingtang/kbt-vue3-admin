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
          path: "use",
          component: () => import("@/views/proComponents/proTable/useProTable/index.vue"),
          name: "UseProTable",
          meta: { title: "使用 ProTable", icon: StarFilled },
        },
        {
          path: "create",
          component: () => import("@/views/proComponents/proTable/createTable/index.vue"),
          name: "CreateTable",
          meta: { title: "创建 ProTable", icon: StarFilled },
        },
        {
          path: "tree",
          component: () => import("@/views/proComponents/proTable/treeFilterProTable/index.vue"),
          name: "TreeProTable",
          meta: { title: "使用 TreeProTable", icon: StarFilled },
        },
        {
          path: "complex",
          component: () => import("@/views/proComponents/proTable/complexProTable/index.vue"),
          name: "ComplexProTable",
          meta: { title: "复杂 ProTable", icon: StarFilled },
        },
        {
          path: "detail",
          component: () => import("@/views/proComponents/proTable/detailProTable/index.vue"),
          name: "DetailProTable",
          meta: { title: "详情 ProTable", icon: StarFilled },
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
          path: "simple",
          component: () => import("@/views/proComponents/proForm/simpleProForm/index.vue"),
          name: "SimpleProForm",
          meta: { title: "简单 ProForm", icon: StarFilled },
        },
        {
          path: "use",
          component: () => import("@/views/proComponents/proForm/useProForm/index.vue"),
          name: "UseProForm",
          meta: { title: "使用 ProForm", icon: StarFilled },
        },
        {
          path: "create",
          component: () => import("@/views/proComponents/proForm/createProForm/index.vue"),
          name: "CreateProForm",
          meta: { title: "创建 ProForm", icon: StarFilled },
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
          path: "simple",
          name: "SimpleProSearch",
          component: () => import("@/views/proComponents/proSearch/simpleProSearch.vue"),
          meta: { title: () => "简单 ProSearch", icon: StarFilled },
        },
        {
          path: "use",
          name: "UseProSearch",
          component: () => import("@/views/proComponents/proSearch/useProSearch.vue"),
          meta: { title: () => "使用 ProSearch", icon: StarFilled },
        },
        {
          path: "create",
          name: "CreateProSearch",
          component: () => import("@/views/proComponents/proSearch/createProSearch.vue"),
          meta: { title: () => "创建 ProSearch", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-steps",
      name: "ProSteps",
      meta: {
        notClickBread: true,
        title: "超级步骤条",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          name: "SimpleProSteps",
          component: () => import("@/views/proComponents/proSteps/index.vue"),
          meta: { title: () => "简单 ProSteps", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-transfer",
      name: "ProTransfer",
      meta: {
        notClickBread: true,
        title: "超级穿梭框",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          name: "SimpleProTransfer",
          component: () => import("@/views/proComponents/proTransfer/index.vue"),
          meta: { title: () => "简单 ProTransfer", icon: StarFilled },
        },
      ],
    },
  ],
};

export default proComponents;
