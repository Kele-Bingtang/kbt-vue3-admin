const excelRoutes = {
  path: "/excel",
  redirect: "/excel/export-excel",
  name: "Excel",
  meta: {
    title: "Excel",
    icon: "Tickets",
  },
  children: [
    {
      path: "export-excel",
      component: () => import("@/views/excel/exportExcel.vue"),
      name: "ExportExcel",
      meta: { title: "Excel 导出", icon: "StarFilled" },
    },
    {
      path: "export-selected-excel",
      component: () => import("@/views/excel/selectExcel.vue"),
      name: "SelectExcel",
      meta: { title: "指定数据导出", icon: "StarFilled" },
    },
    {
      path: "export-merge-header",
      component: () => import("@/views/excel/mergeHeader.vue"),
      name: "MergeHeader",
      meta: { title: "合并表头导出", icon: "StarFilled" },
    },
    {
      path: "upload-excel",
      component: () => import("@/views/excel/uploadExcel.vue"),
      name: "UploadExcel",
      meta: { title: "Excel 导入", icon: "StarFilled" },
    },
  ],
};

export default excelRoutes;
