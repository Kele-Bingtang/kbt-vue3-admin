const componentRoutes = {
  path: "/components",
  name: "Components",
  meta: {
    notClickBread: true,
    title: "组件",
    icon: "Opportunity",
  },
  children: [
    {
      path: "message",
      name: "MessageDemo",
      component: () => import("@/views/components/message/index.vue"),
      meta: { title: "消息组件", icon: "StarFilled" },
    },
    {
      path: "count-to",
      name: "CountToDemo",
      component: () => import("@/views/components/countTo/index.vue"),
      meta: { title: "数字渐变", icon: "StarFilled" },
    },

    {
      path: "images-clipper",
      name: "ClipperDemo",
      component: () => import("@/views/components/cropper/index.vue"),
      meta: { title: "图片裁剪", icon: "StarFilled" },
    },
    {
      path: "split-pane",
      name: "SplitPaneDemo",
      component: () => import("@/views/components/splitPane/index.vue"),
      meta: { title: "分割窗口", icon: "StarFilled" },
    },
    {
      path: "org-tree",
      name: "OrgTreeDemo",
      component: () => import("@/views/components/orgTree/index.vue"),
      meta: { title: "组织结构树", icon: "StarFilled" },
    },
    {
      path: "animation-mixin",
      name: "AnimationMixinDemo",
      component: () => import("@/views/components/animationMixin/index.vue"),
      meta: { title: "动画混入", icon: "StarFilled" },
    },
    {
      path: "draggable-list",
      name: "DraggableListDemo",
      component: () => import("@/views/components/draggableList/index.vue"),
      meta: { title: "列表拖拽", icon: "StarFilled" },
    },
    {
      path: "draggable-item",
      name: "DraggableItemDemo",
      component: () => import("@/views/components/draggableItem/index.vue"),
      meta: { title: "面板拖拽", icon: "StarFilled" },
    },
    {
      path: "drag-drawer",
      name: "DragDrawerDemo",
      component: () => import("@/views/components/dragDrawer/index.vue"),
      meta: { title: "抽屉拖拽", icon: "StarFilled" },
    },
    {
      path: "tree-filter",
      name: "TreeFilterDemo",
      component: () => import("@/views/components/treeFilter/index.vue"),
      meta: { title: "树形筛选", icon: "StarFilled" },
    },
    {
      path: "upload-images",
      name: "UploadImagesDemo",
      component: () => import("@/views/components/uploadImages/index.vue"),
      meta: { title: "文件上传", icon: "StarFilled" },
    },
    {
      path: "tinymce-demo",
      name: "TinymceDemo",
      component: () => import("@/views/components/tinymce/index.vue"),
      meta: { title: "Tinymce 富文本", icon: "StarFilled" },
    },
    {
      path: "wang-editor-demo",
      name: "WangEditorDemo",
      component: () => import("@/views/components/wangEditor/index.vue"),
      meta: { title: "Wang 富文本", icon: "StarFilled" },
    },
    {
      path: "code-mirror",
      name: "CodeMirrorDemo",
      component: () => import("@/views/components/codeMirror/index.vue"),
      meta: { title: "代码编辑器", icon: "StarFilled" },
    },
    {
      path: "seamless-scroll",
      name: "SeamlessScrollDemo",
      component: () => import("@/views/components/seamlessScroll/index.vue"),
      meta: { title: "无限滚动", icon: "StarFilled" },
    },
    // {
    //   path: "info-selection",
    //   name: "InfoSelectionDemo",
    //   component: () => import("@/views/components/infoSelection/index.vue"),
    //   meta: { title: "信息选择器", icon: "StarFilled" },
    // },
  ],
};

export default componentRoutes;
