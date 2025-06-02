import { Opportunity, StarFilled } from "@element-plus/icons-vue";

const componentRoutes: RouterConfigRaw = {
  path: "/components",
  name: "Components",
  meta: {
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
      component: () => import("@/views/components/use-dialog/index.vue"),
      meta: { title: "Use Dialog", icon: StarFilled },
    },
    {
      path: "use-drawer",
      name: "UseDrawerDemo",
      component: () => import("@/views/components/use-drawer/index.vue"),
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
      component: () => import("@/views/components/image-viewer/index.vue"),
      meta: { title: "图片预览", icon: StarFilled },
    },
    {
      path: "video-player",
      name: "VideoPlayerDemo",
      component: () => import("@/views/components/video-player/index.vue"),
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
      component: () => import("@/views/components/wang-editor/index.vue"),
      meta: { title: "Wang 富文本", icon: StarFilled },
    },
    {
      path: "code-mirror",
      name: "CodeMirrorDemo",
      component: () => import("@/views/components/code-mirror/index.vue"),
      meta: { title: "代码编辑器", icon: StarFilled },
    },
    {
      path: "code-diff-editor",
      name: "CodeDiffEditorDemo",
      component: () => import("@/views/components/code-diff-editor/index.vue"),
      meta: { title: "代码对比器", icon: StarFilled },
    },
    {
      path: "seamless-scroll",
      name: "SeamlessScrollDemo",
      component: () => import("@/views/components/seamless-scroll/index.vue"),
      meta: { title: "无限滚动", icon: StarFilled },
    },
    {
      path: "count-to",
      name: "CountToDemo",
      component: () => import("@/views/components/count-to/index.vue"),
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
      component: () => import("@/views/components/drag-drawer/index.vue"),
      meta: { title: "抽屉拖拽", icon: StarFilled },
    },
    {
      path: "split-pane",
      name: "SplitPaneDemo",
      component: () => import("@/views/components/split-pane/index.vue"),
      meta: { title: "分割窗口", icon: StarFilled },
    },
    {
      path: "org-tree",
      name: "OrgTreeDemo",
      component: () => import("@/views/components/org-tree/index.vue"),
      meta: { title: "组织结构树", icon: StarFilled },
    },
    {
      path: "animation-mixin",
      name: "AnimationMixinDemo",
      component: () => import("@/views/components/animation-mixin/index.vue"),
      meta: { title: "动画混入", icon: StarFilled },
    },
    {
      path: "draggable-list",
      name: "DraggableListDemo",
      component: () => import("@/views/components/draggable-list/index.vue"),
      meta: { title: "列表拖拽", icon: StarFilled },
    },
    {
      path: "draggable-item",
      name: "DraggableItemDemo",
      component: () => import("@/views/components/draggable-item/index.vue"),
      meta: { title: "面板拖拽", icon: StarFilled },
    },
    {
      path: "tree-filter",
      name: "TreeFilterDemo",
      component: () => import("@/views/components/tree-filter/index.vue"),
      meta: { title: "树形筛选", icon: StarFilled },
    },
    {
      path: "upload-images",
      name: "UploadImagesDemo",
      component: () => import("@/views/components/upload-images/index.vue"),
      meta: { title: "图片上传", icon: StarFilled },
    },
    {
      path: "qrCode-demo",
      name: "QrCodeDemo",
      component: () => import("@/views/components/qr-code/index.vue"),
      meta: { title: "二维码", icon: StarFilled },
    },
  ],
};

export default componentRoutes;
