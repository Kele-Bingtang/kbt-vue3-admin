<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <el-link
          href="https://codemirror.net/"
          target="_blank"
          :underline="false"
          style="margin-bottom: 10px; font-size: 22px"
        >
          CodeMirror
        </el-link>
        <el-alert :closable="false">
          如果对 CodeMirror
          的对比功能不满意，可以去看代码对比器（该菜单下方），这组件专门针对代码的对比功能，多了如统计信息、更细节对比、空格去除等功能，但是少了代码替换功能
        </el-alert>
      </template>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div style="font-weight: bold">基本编辑器</div>
      </template>

      <el-space :size="30">
        <el-select v-model="theme" style="width: 200px">
          <el-option v-for="item in themeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="lang" style="width: 200px">
          <el-option v-for="item in langOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-checkbox v-model="disabled" label="是否禁用" style="margin-left: 10px" />
        <el-checkbox v-model="readonly" label="是否只读" />
        <el-checkbox v-model="wrap" label="超出屏幕宽度是否自动换行" />
        <el-checkbox v-model="gutter" label="是否开启 🔴 语法错误提示" />

        <el-input v-model="maxHeight1" placeholder="输入编辑器最大高度" />
      </el-space>

      <CodeMirror
        v-model="code"
        :local-theme="themeValue"
        :disabled="disabled"
        :readonly="readonly"
        :wrap="wrap"
        :gutter="gutter"
        :max-height="maxHeight1"
        v-bind="langValue"
      ></CodeMirror>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div style="font-weight: bold">代码对比编辑器</div>
      </template>
      <el-space :size="20">
        <el-checkbox v-model="revertControls" label="是否支持一键替换" style="margin-left: 10px" />
        <el-checkbox v-model="highlight" label="是否下划线高亮" />
        <el-checkbox v-model="gutter1" label="是否开启线条提示" />
        <el-checkbox v-model="header" label="启用 Header" />
        <el-switch v-model="orientation" active-text="a-b" inactive-text="b-a" />
        <el-input v-model="maxHeight2" placeholder="输入编辑器最大高度" />

        <el-alert :closable="false">
          如果需要开启编辑功能，则传入 `
          <span style="color: var(--el-color-primary)">enabled: ['a', 'b']</span>
          ，代表 a、b 编辑器开启编辑功能，传入 a 则 a 开启编辑功能
        </el-alert>
      </el-space>

      <CodeMirror :wrap="wrap" :merge-config="mergeConfig" :max-height="maxHeight2"></CodeMirror>
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="CodeMirrorDemo">
import { CodeMirror, type MergeCodeMirrorProps } from "@/components";
import { computed, ref } from "vue";
// 如果需要更多主题，可以查看开源项目 https://uiwjs.github.io/react-codemirror/#/theme/home，或者自行搜索其他开源项目，或者自定义主题
import { oneDark } from "@codemirror/theme-one-dark";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";

// 组件为了 Demo，下载并引入了多种语言，实际根据自己的选择依赖
import { javascript, esLint } from "@codemirror/lang-javascript";
// 搭配 lang-javascript 使用
import * as eslintLinter from "eslint-linter-browserify";
import globals from "globals";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import oldDoc from "../codeDiffEditor/oldDoc.json";
import newDoc from "../codeDiffEditor/newDoc.json";

const code = ref('const a = "codeMirror"\nconst b = "kbt"\n\n\n\n\n\n\n\n\n\nconst getCode = () => "useCodeMirror"');
const theme = ref("default");
const lang = ref("javascript");
const disabled = ref(false);
const readonly = ref(false);
const wrap = ref(true);
const gutter = ref(false);

const revertControls = ref(false);
const highlight = ref(true);
const gutter1 = ref(true);
const orientation = ref(true);
const header = ref(true);
const maxHeight1 = ref("");
const maxHeight2 = ref("");

const mergeConfig = computed<MergeCodeMirrorProps>(() => {
  return {
    oldDoc: JSON.stringify(oldDoc, null, 2),
    newDoc: JSON.stringify(newDoc, null, 2),
    revertControls: revertControls.value,
    highlight: highlight.value,
    gutter: gutter1.value,
    orientation: orientation.value ? "a-b" : "b-a",
    header: header.value,
  };
});

/**
 * 主题
 */
const themeValue = computed(() => {
  if (theme.value === "oneDark") return oneDark;
  if (theme.value === "dracula") return dracula;
  if (theme.value === "xcodeLight") return xcodeLight;
  if (theme.value === "xcodeDark") return xcodeDark;
  return undefined;
});

// esLint Demo See https://github.com/UziTech/eslint-linter-browserify/blob/2f6d96e7cbe9f3d565bb5c9462ab78a9394c3189/example/script.js
const config = {
  languageOptions: {
    globals: { ...globals.node },
    parserOptions: { ecmaVersion: "2024", sourceType: "module" },
  },
  rules: {
    semi: ["error", "never"],
  },
};

/**
 * 代码语言
 */
const langValue = computed(() => {
  if (["js", "javascript"].includes(lang.value)) {
    return { lang: javascript(), linter: esLint(new eslintLinter.Linter(), config) };
  }

  if (["ts", "typescript"].includes(lang.value)) {
    return {
      lang: javascript({ jsx: false, typescript: true }), // jsx 可以开启变成 tsx
      linter: esLint(new eslintLinter.Linter(), config),
    };
  }

  if (lang.value === "json") return { lang: json(), linter: jsonParseLinter() };
  if (lang.value === "html") return { lang: html() };
  if (["md", "markdown"].includes(lang.value)) return { lang: markdown() };
  if (lang.value === "php") return { lang: php() };
  if (lang.value === "python") return { lang: python() };
  if (lang.value === "sql") return { lang: sql() };
  if (lang.value === "xml") return { lang: xml() };
  return {};
});

const themeOptions = [
  { label: "default", value: "default" },
  { label: "oneDark", value: "oneDark" },
  { label: "dracula", value: "dracula" },
  { label: "xcodeLight", value: "xcodeLight" },
  { label: "xcodeDark", value: "xcodeDark" },
];

const langOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSON", value: "json" },
  { label: "HTML", value: "html" },
  { label: "Markdown", value: "markdown" },
  { label: "PHP", value: "php" },
  { label: "Python", value: "python" },
  { label: "SQL", value: "sql" },
  { label: "XML", value: "xml" },
];
</script>
