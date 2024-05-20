<template>
  <el-card shadow="never" header="CodeMirror 组件">
    <div style="display: flex; margin-bottom: 10px">
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
    </div>

    <code-mirror
      v-model="code"
      :theme="theme"
      :lang="lang"
      :disabled="disabled"
      :readonly="readonly"
      :wrap="wrap"
      :gutter="gutter"
    />
  </el-card>
</template>

<script setup lang="ts" name="CodeMirrorDemo">
import { CodeMirror } from "@/components";

const code = ref("");
const theme = ref("oneDark");
const lang = ref("javascript");
const disabled = ref(false);
const readonly = ref(false);
const wrap = ref(true);
const gutter = ref(false);

const themeOptions = [
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
