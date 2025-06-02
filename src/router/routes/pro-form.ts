import { Box, StarFilled } from "@element-plus/icons-vue";

const proForm: RouterConfigRaw = {
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
      component: () => import("@/views/proForm/simpleProForm/index.vue"),
      name: "SimpleProForm",
      meta: { title: "使用 ProForm", icon: StarFilled },
    },
    {
      path: "detail",
      component: () => import("@/views/proForm/detailProForm/index.vue"),
      name: "DetailProForm",
      meta: { title: "详情 ProForm", icon: StarFilled },
    },
  ],
};

export default proForm;
