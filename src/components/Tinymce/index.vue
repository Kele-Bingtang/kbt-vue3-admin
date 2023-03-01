<template>
  <div class="tinymce-component" :class="{ fullscreen: fullscreen }">
    <TinymceEditor :id="id" v-model="tinymceContent" :init="initOptions" />
  </div>
</template>

<script setup lang="ts" name="Tinymce">
import TinymceEditor from "@tinymce/tinymce-vue";
import { plugins, toolbar } from "./config";

export type UITheme = "default" | "dark" | "tinymce-5" | "tinymce-5-dark";
export type ContentTheme = "default" | "dark" | "document" | "tinymce-5" | "tinymce-5-dark";

interface TinymceProps {
  value: string; // 内容
  disabled?: boolean; // 编辑器是否禁用
  theme?: UITheme; // UI 主题
  contentTheme?: ContentTheme; // 内容区主题，如果不传，默认等于 UI 主题
  id?: string; // 编辑器 id
  menubar?: string; // 菜单区
  toolbar?: string[]; // 工具区
  toolbarMode?: "floating" | "sliding" | "scrolling" | "wrap"; // 工具区超出一行的显示模式，floating：鼠标悬浮显示；sliding：鼠标点击显示；scrolling：鼠标滚动显示；wrap：直接换行显示
  height?: string | number; // 编辑器高度
  width?: string | number; // 编辑器宽度
  lang?: string; // 编辑器语言
  move?: true | false | "both"; // true：编辑器可以垂直移动；false：编辑器无法移动；both：编辑器垂直和水平都可以移动
}
const props = withDefaults(defineProps<TinymceProps>(), {
  disabled: false,
  theme: "default",
  contentTheme: "default",
  id: () => "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""),
  menubar: "file edit view insert format tools table help",
  toolbar: () => [],
  toolbarMode: "sliding",
  height: "360px",
  width: "auto",
  lang: "zh-CN",
  move: true,
});

const emits = defineEmits(["update:value", "img-upload", "file-upload"]);

const fullscreen = ref(false);

const languageTypeList = reactive<{ [key: string]: string }>({
  "en-US": "en",
  "zh-CN": "zh_CN",
});

const language = computed(() => languageTypeList[props.lang]);
const tinymceContent = computed({
  get() {
    return props.value;
  },
  set(value) {
    emits("update:value", value);
  },
});

const skinTheme = computed(() => {
  if (props.theme === "default") {
    return "oxide";
  } else if (props.theme === "dark") {
    return "oxide-dark";
  }
  return props.theme;
});

const initOptions = computed(() => ({
  selector: `#${props.id}`,
  deprecation_warnings: false,
  width: props.width,
  min_width: 60,
  height: props.height,
  min_height: 60,
  body_class: "panel-body",
  resize: props.move,
  plugins: plugins,
  toolbar: props.toolbar.length > 0 ? props.toolbar : toolbar,
  toolbar_mode: props.toolbarMode,
  menubar: props.menubar,
  language: language.value,
  // language_url: props.language === "en" ? "" : `${process.env.BASE_URL}tinymce/langs/${props.language}.js`,
  base_url: process.env.VUE_APP_PUBLIC_PATH === "/" ? "/tinymce" : `${process.env.VUE_APP_PUBLIC_PATH}/tinymce`,
  skin: skinTheme.value,
  content_css: props.contentTheme ? props.contentTheme : props.theme,
  emoticons_database_url:
    process.env.VUE_APP_PUBLIC_PATH === "/"
      ? "tinymce/emojis.min.js"
      : `${process.env.VUE_APP_PUBLIC_PATH}/tinymce/emojis.min.js`,
  end_container_on_empty_block: true,
  draggable_modal: true,
  powerpaste_word_import: "clean",
  autosave_restore_when_empty: true,
  code_dialog_height: 450,
  code_dialog_width: 1000,
  imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
  default_link_target: "_blank",
  link_title: false,
  nonbreaking_force_tab: true,
  insertdatetime_formats: ["%H:%M:%S", "%Y-%m-%d", "%I:%M:%S %p", "%D"],
  convert_urls: false,
  paste_data_images: true, // https://www.tiny.cloud/docs/tinymce/6/upload-images/
  images_file_types: "jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp", // 支持的上传图片类型
  template_mdate_format: "%Y-%m-%d : %H:%M:%S",
  template_replace_values: {
    username: "Kobe Liu",
    staffid: "100338",
  },
  template_preview_replace_values: {
    preview_username: "Kobe Liu",
    preview_staffid: "100338",
  },
  templates: [
    {
      title: "当前时间",
      description: "当前时间模板",
      content: '<p class="mdate">例如：1999-07-27 07:27:27，当然以您目前的时间为准</p>',
    },
    {
      title: "您的身份",
      description: "您的身份模板，您的身份将会放在 ${} 里",
      content: "<p>Name: {$username}, StaffID: {$staffid}</p>",
    },
    {
      title: "您的身份",
      description: "您的身份模板，这里仅是预览，输出后不是实际的效果",
      content: "<p>Name: {$username}, StaffID: {$staffid}</p>",
    },
  ],
  init_instance_callback: (editor: any) => {
    if (props.value) {
      editor.setContent(props.value);
    }
    editor.on("NodeChange Change KeyUp SetContent", () => {
      emits("update:value", editor.getContent());
    });
  },
  setup: (editor: any) => {
    editor.on("FullscreenStateChanged", (e: any) => {
      fullscreen.value = e.state;
    });
  },
  // 图片上传回调
  images_upload_handler: (blobInfo: Function, success: Function, failure: Function, progress: Function) => {
    emits("img-upload", blobInfo, success, failure, progress);
  },
  // 附件上传回调
  file_picker_callback: (callback: any, value: any, meta: any) => {
    const filetype =
      ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4,.mkv, .avi,.wmv, .rmvb,.mov,.mpg,.mpeg,.webm, .jpg, .jpeg, .png, .gif"; // 限制文件的上传类型
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", filetype);
    input.onchange = function () {
      const file = (this as any).files[0];
      emits("file-upload", file, meta.filetype, callback);
    };
    input.click();
  },
}));

onMounted(() => {
  onDisabledChange();
});

onBeforeUnmount(() => {
  destroyTinymce();
});

const destroyTinymce = () => {
  const tinymce = (window as any).tinymce.get(props.id);
  if (fullscreen.value) {
    tinymce.execCommand("mceFullScreen");
  }
  if (tinymce) {
    tinymce.destroy();
  }
};

const onDisabledChange = () => {
  const tinymceInstance = (window as any).tinymce.get(props.id);
  if (tinymceInstance) {
    const status = props.disabled ? "readonly" : "design";
    tinymceInstance.mode.set(status);
  }
};

watch(
  () => language.value,
  () => {
    const tinymceManager = (window as any).tinymce;
    const tinymceInstance = tinymceManager.get(props.id);
    if (fullscreen.value) {
      tinymceInstance.execCommand("mceFullScreen");
    }
    if (tinymceInstance) {
      tinymceInstance.destroy();
    }
    nextTick(() => tinymceManager.init(initOptions.value));
  }
);

watch(
  () => props.disabled,
  () => onDisabledChange()
);
</script>

<style lang="scss">
.tinymce-component {
  position: relative;
  line-height: normal;

  .tox-fullscreen {
    z-index: 1010 !important;
  }
}
</style>
