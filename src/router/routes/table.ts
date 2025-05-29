import { Grid, StarFilled } from "@element-plus/icons-vue";

const tableRoutes: RouterConfigRaw = {
  path: "/table",
  name: "Table",
  meta: {
    title: "表格",
    icon: Grid,
  },
  children: [
    {
      path: "drag-table",
      name: "DragTable",
      component: () => import("@/views/table/dragTable/index.vue"),
      meta: { title: "表格拖拽", icon: StarFilled },
    },
    {
      path: "dynamic-table",
      name: "DynamicTable",
      component: () => import("@/views/table/dynamicTable/index.vue"),
      meta: { title: "动态表格添加", icon: StarFilled },
    },
    {
      path: "inline-table",
      name: "InlineTable",
      component: () => import("@/views/table/inlineTable/index.vue"),
      meta: { title: "内联表格编辑", icon: StarFilled },
    },
    {
      path: "search-table",
      name: "SearchTable",
      component: () => import("@/views/table/searchTable/index.vue"),
      meta: { title: "表格查询", icon: StarFilled },
    },
    {
      path: "page-table",
      name: "PageTable",
      component: () => import("@/views/table/pageTable/index.vue"),
      meta: { title: "表格分页", icon: StarFilled },
    },
    {
      path: "operate-table",
      name: "OperateTable",
      component: () => import("@/views/table/operateTable/index.vue"),
      meta: { title: "表格操作", icon: StarFilled },
    },
    {
      path: "sort-table",
      name: "SortTable",
      component: () => import("@/views/table/SortTable/index.vue"),
      meta: { title: "表格排序", icon: StarFilled },
    },
    {
      path: "integration-table",
      name: "IntegrationTable",
      component: () => import("@/views/table/integrationTable/index.vue"),
      meta: { title: "表格集成", icon: StarFilled },
    },
  ],
};

export default tableRoutes;
