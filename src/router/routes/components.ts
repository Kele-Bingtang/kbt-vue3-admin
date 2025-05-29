import { Opportunity, StarFilled } from "@element-plus/icons-vue";

const componentRoutes: RouterConfigRaw = {
  path: "/components",
  name: "Components",
  meta: {
    notClickBread: true,
    title: "组件",
    icon: Opportunity,
  },
  children: [
    {
      path: "message",
      name: "MessageDemo",
      component: () => import("@/views/components/message/index.vue"),
      meta: { title: () => "消息组件", icon: StarFilled },
    },
    {
      path: "icon",
      name: "IconDemo",
      component: () => import("@/views/components/icon/index.vue"),
      meta: { title: "图标选择", icon: StarFilled },
    },
    {
      path: "use-dialog",
      name: "UseDialogDemo",
      component: () => import("@/views/components/useDialog/index.vue"),
      meta: { title: "Use Dialog", icon: StarFilled },
    },
    {
      path: "use-drawer",
      name: "UseDrawerDemo",
      component: () => import("@/views/components/useDrawer/index.vue"),
      meta: { title: "Use Drawer", icon: StarFilled },
    },
    {
      path: "highlight",
      name: "HighlightDemo",
      component: () => import("@/views/components/highlight/index.vue"),
      meta: { title: "文字高亮", icon: StarFilled },
    },
    {
      path: "image-viewer",
      name: "ImageViewerDemo",
      component: () => import("@/views/components/imageViewer/index.vue"),
      meta: { title: "图片预览", icon: StarFilled },
    },
    {
      path: "video-player",
      name: "VideoPlayerDemo",
      component: () => import("@/views/components/videoPlayer/index.vue"),
      meta: { title: "视频播放器", icon: StarFilled },
    },
    {
      path: "tinymce-demo",
      name: "TinymceDemo",
      component: () => import("@/views/components/tinymce/index.vue"),
      meta: { title: "Tinymce 富文本", icon: StarFilled },
    },
    {
      path: "wang-editor-demo",
      name: "WangEditorDemo",
      component: () => import("@/views/components/wangEditor/index.vue"),
      meta: { title: "Wang 富文本", icon: StarFilled },
    },
    {
      path: "code-mirror",
      name: "CodeMirrorDemo",
      component: () => import("@/views/components/codeMirror/index.vue"),
      meta: { title: "代码编辑器", icon: StarFilled },
    },
    {
      path: "code-diff-editor",
      name: "CodeDiffEditorDemo",
      component: () => import("@/views/components/codeDiffEditor/index.vue"),
      meta: { title: "代码对比器", icon: StarFilled },
    },
    {
      path: "seamless-scroll",
      name: "SeamlessScrollDemo",
      component: () => import("@/views/components/seamlessScroll/index.vue"),
      meta: { title: "无限滚动", icon: StarFilled },
    },
    {
      path: "count-to",
      name: "CountToDemo",
      component: () => import("@/views/components/countTo/index.vue"),
      meta: { title: "数字渐变", icon: StarFilled },
    },
    {
      path: "images-clipper",
      name: "ClipperDemo",
      component: () => import("@/views/components/cropper/index.vue"),
      meta: { title: "图片裁剪", icon: StarFilled },
    },
    {
      path: "drag-drawer",
      name: "DragDrawerDemo",
      component: () => import("@/views/components/dragDrawer/index.vue"),
      meta: { title: "抽屉拖拽", icon: StarFilled },
    },
    {
      path: "split-pane",
      name: "SplitPaneDemo",
      component: () => import("@/views/components/splitPane/index.vue"),
      meta: { title: "分割窗口", icon: StarFilled },
    },
    {
      path: "org-tree",
      name: "OrgTreeDemo",
      component: () => import("@/views/components/orgTree/index.vue"),
      meta: { title: "组织结构树", icon: StarFilled },
    },
    {
      path: "animation-mixin",
      name: "AnimationMixinDemo",
      component: () => import("@/views/components/animationMixin/index.vue"),
      meta: { title: "动画混入", icon: StarFilled },
    },
    {
      path: "draggable-list",
      name: "DraggableListDemo",
      component: () => import("@/views/components/draggableList/index.vue"),
      meta: { title: "列表拖拽", icon: StarFilled },
    },
    {
      path: "draggable-item",
      name: "DraggableItemDemo",
      component: () => import("@/views/components/draggableItem/index.vue"),
      meta: { title: "面板拖拽", icon: StarFilled },
    },
    {
      path: "tree-filter",
      name: "TreeFilterDemo",
      component: () => import("@/views/components/treeFilter/index.vue"),
      meta: { title: "树形筛选", icon: StarFilled },
    },
    {
      path: "upload-images",
      name: "UploadImagesDemo",
      component: () => import("@/views/components/uploadImages/index.vue"),
      meta: { title: "图片上传", icon: StarFilled },
    },
    {
      path: "qrCode-demo",
      name: "QrCodeDemo",
      component: () => import("@/views/components/qrCode/index.vue"),
      meta: { title: "二维码", icon: StarFilled },
    },
  ],
};

export default componentRoutes;
