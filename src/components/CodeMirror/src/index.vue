<template>
  <CodeMirror class="code-mirror" v-model="code" v-bind="bindValue"></CodeMirror>
</template>

<script setup lang="ts" name="CodeMirror6">
import CodeMirror from "vue-codemirror6";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { getPx } from "@/utils";

export interface CodeMirrorProps {
  basic?: boolean; // 是否导入代码编辑器常用功能，See https://codemirror.net/docs/ref/#codemirror.basicSetup
  minimal?: boolean; // 是否导入代码编辑器 Mini 功能，See https://codemirror.net/docs/ref/#codemirror.minimalSetup
  dark?: boolean; // 是否切换暗黑主题
  placeholder?: string; // 代码编辑器占位符
  wrap?: boolean; // 内容是否换行
  tab?: boolean; // 是否启用 Tab 键缩进
  tabSize?: number; // Tab 键缩进单位
  multiple?: boolean; // 是否允许多选
  lineSeparator?: string; // 换行符，默认 \n
  customTheme?: Record<string, any>; // 主题
  readonly?: boolean; // 是否只读代码编辑器
  disabled?: boolean; // 是否禁用代码编辑器
  theme?: "oneDark"; // 主题
  lang?: string; // 代码语言
  phrases?: Record<string, string>; // 自定义代码编辑器的国际化语言内容，See https://codemirror.net/6/examples/translate/
  linterConfig?: Record<string, any>;
  gutter?: boolean; // 当代码语法出错，是否高亮提示，前提开启 linter 属性
  gutterConfig?: Record<string, any>;
  tag?: string; // 代码编辑器跟标签，默认是 div
  height?: string | number; // 代码编辑器高度
}

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  basic: true,
  minimal: false,
  dark: false,
  placeholder: "",
  wrap: true,
  tab: true,
  tabSize: 2,
  multiple: false,
  lineSeparator: "\n",
  customTheme: () => {
    return {};
  },
  theme: "oneDark",
  lang: "json",
  readonly: false,
  disabled: false,
  gutter: true,
  tag: "div",
  height: 400,
});

const bindValue = computed(() => {
  const bindValue = {
    basic: props.basic,
    minimal: props.minimal,
    dark: props.dark,
    placeholder: props.placeholder,
    wrap: props.wrap,
    tab: props.tab,
    tabSize: props.tabSize,
    multiple: props.multiple,
    theme: props.customTheme,
    lineSeparator: props.lineSeparator,
    readonly: props.readonly,
    phrases: props.phrases,
    linterConfig: props.linterConfig,
    gutter: props.gutter,
    gutterConfig: props.gutterConfig,
    disabled: props.disabled,
    tag: props.tag,
  } as Record<string, any>;

  if (props.theme === "oneDark") bindValue.extensions = [oneDark];
  if (props.lang === "json") {
    bindValue.lang = json();
    bindValue.linter = jsonParseLinter();
  }

  return bindValue;
});

const code = defineModel<string>({ required: true });

const codeMirrorHeight = computed(() => getPx(props.height));
</script>

<style lang="scss" scoped>
.code-mirror {
  height: v-bind(codeMirrorHeight);

  // CodeMirror 实际高度
  :deep(.cm-editor) {
    height: 100%;
  }
}
</style>
