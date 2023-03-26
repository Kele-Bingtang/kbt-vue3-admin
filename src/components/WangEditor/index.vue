<template>
  <div :class="['editor-component', disabled ? 'editor-disabled' : '']">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      v-if="!hideToolBar"
    />
    <Editor
      class="editor-content"
      :style="{ height: typeof height == 'string' ? height : `${height}px`, overflowY: 'hidden' }"
      v-model="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      v-bind="$attrs"
      @on-created="handleCreated"
      @custom-paste="handlePaste"
    />
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import { Boot, type IEditorConfig, type IDomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import attachmentModule from "@wangeditor/plugin-upload-attachment"; // wangeditor 的附件插件
import "@wangeditor/editor/dist/css/style.css";
import { toolbarKeys } from "./config";

export type ImageInsertFnType = (url: string, alt: string) => void;
export type VideoInsertFnType = (url: string, poster: string) => void;
export type FileInsertFnType = (fileName: string, url: string) => void;

interface WangEditorProp {
  value?: string; // 编辑器内容 ==> 必传
  toolbarKeys?: string[]; // 工具栏内容 ==> 非必传（默认为空）
  excludeKeys?: string[]; // 去除掉指定的工具类内容 ==> 非必传（默认为空）
  height?: string; // 富文本高度 ==> 非必传（默认为 500px）
  mode?: "default" | "simple"; // 富文本模式 ==> 非必传（默认为 default）
  disabled?: boolean; // 是否禁用编辑器 ==> 非必传（默认为false）
  hideToolBar?: boolean; // 是否隐藏工具栏 ==> 非必传（默认为false）
}
type EmitProps = {
  (e: "update:value", value: string): void;
  (e: "image-upload", file: File, insertFn: ImageInsertFnType): void;
  (e: "image-before-upload", file: File): void;
  (e: "image-progress", progress: number): void;
  (e: "image-success", file: File, res: any): void;
  (e: "image-failed", file: File, res: any): void;
  (e: "image-error", file: File, err: any, res: any): void;
  (e: "video-upload", file: File, insertFn: VideoInsertFnType): void;
  (e: "file-before-upload", file: File): void;
  (e: "file-upload", file: File, insertFn: VideoInsertFnType): void;
  (e: "on-paste", editor: IDomEditor, event: ClipboardEvent): void;
  (e: "on-created", editor: IDomEditor): void;
};

const props = withDefaults(defineProps<WangEditorProp>(), {
  value: "",
  toolbarKeys: () => [],
  excludeKeys: () => [],
  height: "400px",
  mode: "default",
  disabled: false,
  hideToolBar: false,
});

const emits = defineEmits<EmitProps>();

// 富文本 DOM 元素
const editorRef = shallowRef();

const editorConfig = reactive<Partial<IEditorConfig>>({
  placeholder: "请输入内容 ...",
  readOnly: props.disabled, // 是否编辑编辑器
  // hoverbarKeys: {
  //   image: {
  //     // 图片选题菜单
  //     menuKeys: [
  //       "imageWidth30",
  //       "imageWidth50",
  //       "imageWidth100",
  //       "editImage",
  //       "viewImageLink",
  //       "deleteImage",
  //       "|",
  //       "justifyLeft",
  //       "justifyRight",
  //       "justifyCenter",
  //     ],
  //   },
  //   attachment: {
  //     menuKeys: ["downloadAttachment"], // 下载附件菜单
  //   },
  //   paragraph: {
  //     menuKeys: ["uploadImage"],
  //   },
  // },
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 10 * 1024 * 1024, // 10M
      // 最多可上传几个文件，默认为 100
      // maxNumberOfFiles: 10,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ["image/*"],
      // 自定义上传
      customUpload: (file: File, insertFn: ImageInsertFnType) => {
        emits("image-upload", file, insertFn);
      },
      onBeforeUpload: (file: File) => {
        emits("image-before-upload", file);
      },
      onProgress: (progress: number) => {
        emits("image-progress", progress);
      },
      onSuccess: (file: File, res: any) => {
        emits("image-success", file, res);
      },
      onFailed: (file: File, res: any) => {
        emits("image-failed", file, res);
      },
      onError: (file: File, err: any, res: any) => {
        emits("image-error", file, err, res);
      },
    },
    uploadVideo: {
      // 300M
      maxFileSize: 300 * 1024 * 1024,
      allowedFileTypes: ["video/*"],
      customUpload: (file: File, insertFn: VideoInsertFnType) => {
        emits("video-upload", file, insertFn);
      },
    },
    uploadAttachment: {
      // 10M
      maxFileSize: 10 * 1024 * 1024,
      onBeforeUpload: (file: File) => {
        emits("file-before-upload", file);
      },
      customUpload: (file: File, insertFn: VideoInsertFnType) => {
        emits("file-upload", file, insertFn);
      },
    },
  },
});

const toolbarConfig = computed(() => {
  return {
    toolbarKeys: props.toolbarKeys.length > 0 ? props.toolbarKeys : toolbarKeys, // 工具栏内容
    excludeKeys: props.excludeKeys, // 去除掉指定的工具类内容3
    // 插入哪些菜单
    insertKeys: {
      index: 22, // 自定义插入的位置
      keys: ["uploadAttachment"], // 上传附件菜单
    },
    // excludeKeys: ["group-video", "insertImage"],
  };
});

const content = computed({
  get() {
    return props.value;
  },
  set(value) {
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) value = "";
    emits("update:value", value);
  },
});

watch(
  () => props.disabled,
  () => {
    if (editorRef.value) {
      props.disabled ? editorRef.value.disable() : editorRef.value.enable();
    }
  }
);

onMounted(() => {
  Boot.registerModule(attachmentModule);
});
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  props.disabled ? editorRef.value.disable() : editorRef.value.enable();
  emits("on-created", editor);
};

const handlePaste = (editor: IDomEditor, event: ClipboardEvent) => {
  emits("on-paste", editor, event);
};

onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy(); // 组件销毁时，及时销毁编辑器
});

defineExpose({
  editor: editorRef,
});
</script>

<style lang="scss" scoped>
/* 富文本组件校验失败样式 */
.is-error {
  .editor-component {
    border-color: var(--el-color-danger);
  }
}

/* 富文本组件禁用样式 */
.editor-disabled {
  cursor: not-allowed !important;
}

/* 富文本组件样式 */
.editor-component {
  /* 防止富文本编辑器全屏时 tabs组件 在其层级之上 */
  z-index: 2;
  width: 100%;
  border: 1px solid #ccc;

  .editor-toolbar {
    border-bottom: 1px solid #ccc;
  }

  .editor-content {
    overflow-y: hidden;
  }
}
</style>
