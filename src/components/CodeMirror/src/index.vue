<template>
  <CodeMirror ref="codeMirrorRef" class="code-mirror" v-model="code" v-bind="bindValue" forceLinting></CodeMirror>
</template>

<script setup lang="ts" name="CodeMirror6">
import { computed, useAttrs, ref } from "vue";
import { getPx } from "@/utils";
// 组件官网 See https://github.com/logue/vue-codemirror6
import CodeMirror from "vue-codemirror6";
// 如果需要更多主题，可以查看开源项目 https://uiwjs.github.io/react-codemirror/#/theme/home，或者自行搜索其他开源项目，或者自定义主题
import { oneDark } from "@codemirror/theme-one-dark";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";

// 组件为了 Demo，下载并引入了多种语言，实际根据自己的选择移出依赖
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { javascript, esLint } from "@codemirror/lang-javascript";
// 搭配 lang-javascript 使用
import * as eslintLinter from "eslint-linter-browserify";
import globals from "globals";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";

export interface CodeMirrorProps {
  width?: string | number; // 代码编辑器宽度，默认 auto
  height?: string | number; // 代码编辑器高度，默认 400
  fontSize?: string | number; // 字体大小，默认 14px
  theme?: string; // 官方支持的主题
  lang?: string; // 官方支持的代码语言
  basic?: boolean; // 是否导入代码编辑器常用功能，See https://codemirror.net/docs/ref/#codemirror.basicSetup
  minimal?: boolean; // 是否导入代码编辑器 Mini 功能，See https://codemirror.net/docs/ref/#codemirror.minimalSetup
  dark?: boolean; // 是否切换为暗黑主题（前提是主题切换），默认不切换 false
  placeholder?: string; // 代码编辑器占位符
  wrap?: boolean; // 内容宽度超出屏幕后，是否开启自动换行，默认开启 true
  tab?: boolean; // 是否启用 Tab 键缩进，默认开启 true
  tabSize?: number; // Tab 键缩进单位，默认 2
  multiple?: boolean; // 是否开启允许多选，默认不开启 false，See https://codemirror.net/docs/ref/#state.EditorState^allowMultipleSelections
  lineSeparator?: string; // 换行符，默认 \n
  customTheme?: Record<string, any>; // 自定义主题，See https://codemirror.net/docs/ref/#view.EditorView^theme
  readonly?: boolean; // 是否只读代码编辑器，默认不开启 false
  disabled?: boolean; // 是否禁用代码编辑器，默认不开启 false
  phrases?: Record<string, string>; // 自定义代码编辑器的国际化语言内容，See https://codemirror.net/6/examples/translate/
  linterConfig?: Record<string, any>; // See https://codemirror.net/docs/ref/#lint.linter^config
  forceLinting?: boolean; // 是否在输入过程开始校验语法，false 则在输入完成后校验，默认不开启 false
  gutter?: boolean; // 当代码语法出错，开头是否红色圆圈 🔴 提示，前提开启 linter 属性，默认不开启 false
  gutterConfig?: Record<string, any>; // See https://codemirror.net/docs/ref/#lint.lintGutter^config
  tag?: string; // 代码编辑器跟标签，默认是 div
}

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  width: "auto",
  height: 400,
  fontSize: 14,
  theme: "oneDark",
  basic: true,
  minimal: false,
  dark: false,
  wrap: true,
  tab: true,
  tabSize: 2,
  multiple: false,
  lineSeparator: "\n",
  readonly: false,
  disabled: false,
  phrases: () => defaultPhrases,
  forceLinting: false,
  gutter: false,
  tag: "div",
});

// v-model 值
const code = defineModel<string>({ required: true });

/**
 * 传递给 CodeMirror 组件的 props
 */
const bindValue = computed(() => {
  const { multiple: allowMultipleSelections, customTheme: theme, ...surplusProps } = props;
  const bindValue = { ...surplusProps, ...useAttrs(), allowMultipleSelections, theme } as Record<string, any>;

  return { ...bindValue, extensions: [themeValue.value], ...getLang() };
});

/**
 * 主题
 */
const themeValue = computed(() => {
  if (props.theme === "oneDark") return oneDark;
  if (props.theme === "dracula") return dracula;
  if (props.theme === "xcodeLight") return xcodeLight;
  if (props.theme === "xcodeDark") return xcodeDark;
  return undefined;
});

// Config Demo See https://github.com/UziTech/eslint-linter-browserify/blob/2f6d96e7cbe9f3d565bb5c9462ab78a9394c3189/example/script.js
const config = {
  languageOptions: {
    globals: { ...globals.node },
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  },
  rules: {
    semi: ["error", "never"],
  },
};

/**
 * 代码语言
 */
const getLang = () => {
  const { lang = "" } = props;
  if (["js", "javascript"].includes(lang)) {
    return { lang: javascript(), linter: esLint(new eslintLinter.Linter(), config) };
  }

  if (["ts", "typescript"].includes(lang)) {
    return {
      lang: javascript({ jsx: false, typescript: true }), // jsx 可以开启变成 tsx
      linter: esLint(new eslintLinter.Linter(), config),
    };
  }

  if (lang === "json") return { lang: json(), linter: jsonParseLinter() };
  if (lang === "html") return { lang: html() };
  if (["md", "markdown"].includes(lang)) return { lang: markdown() };
  if (lang === "php") return { lang: php() };
  if (lang === "python") return { lang: python() };
  if (lang === "sql") return { lang: sql() };
  if (lang === "xml") return { lang: xml() };
  return {};
};

const codeMirrorWidth = computed(() => getPx(props.width));
const codeMirrorHeight = computed(() => getPx(props.height));
const codeMirrorFontSize = computed(() => getPx(props.fontSize));

const codeMirrorRef = ref<InstanceType<typeof CodeMirror>>();

defineExpose({
  cm: codeMirrorRef, // codeMirrorRef 暴露的方法，See https://github.com/logue/vue-codemirror6
});
</script>

<script lang="ts">
const defaultPhrases = {
  // @codemirror/view
  "Control character": "控制字符",
  // @codemirror/commands
  "Selection deleted": "选择已删除",
  // @codemirror/language
  "Folded lines": "折叠行",
  "Unfolded lines": "展开行",
  to: "到",
  "folded code": "折叠代码",
  unfold: "展开代码",
  "Fold line": "折叠行",
  "Unfold line": "展开行",
  // @codemirror/search
  "Go to line": "跳转到行",
  go: "OK",
  Find: "查找",
  Replace: "替换",
  next: "下一个",
  previous: "上一个",
  all: "全部",
  "match case": "匹配条件",
  "by word": "全文检索",
  regexp: "正则表达式",
  replace: "替换",
  "replace all": "替换全部",
  close: "关闭",
  "current match": "当前匹配",
  "replaced $ matches": "替换 $ 命中",
  "replaced match on line $": "替换 $ 行匹配",
  "on line": "在线",
  // @codemirror/autocomplete
  Completions: "自动补全",
  // @codemirror/lint
  Diagnostics: "诊断",
  "No diagnostics": "无诊断",
};
</script>

<style lang="scss" scoped>
.code-mirror {
  width: v-bind(codeMirrorWidth);
  height: v-bind(codeMirrorHeight);
  font-size: v-bind(codeMirrorFontSize);

  // CodeMirror 实际高度
  :deep(.cm-editor) {
    height: 100%;
  }
}
</style>
