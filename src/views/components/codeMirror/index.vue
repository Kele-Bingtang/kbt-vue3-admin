<template>
  <div class="code-mirror-container">
    <div class="select-header">
      主题：
      <el-select v-model="cmTheme" placeholder="请选择主题" filterable style="margin-right: 20px">
        <el-option
          v-for="item in themeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.value === cmTheme"
        ></el-option>
      </el-select>
      语言：
      <el-select v-model="cmMode" placeholder="请选择语言" filterable>
        <el-option
          v-for="item in modeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.value === cmMode"
        ></el-option>
      </el-select>
    </div>
    <code-mirror v-model:value="value" :cmTheme="cmTheme" :cmMode="cmMode" />
  </div>
</template>

<script setup lang="ts" name="CodeMirrorDemo">
import CodeMirror from "@/components/CodeMirror/index.vue";
import { cmThemeOptions, cmModeOptions } from "@/components/CodeMirror/code-mirror";
const cmTheme = ref("default");
const cmMode = ref("application/json");
const value = ref(
  `{"code": 200001,"msg": "success","data": {"JSON": {"mydata": {"name": "张三","age": "21","tel": "1539324****","blance": "100"}}}}`
);

const themeOptions = ref(cmThemeOptions);
const modeOptions = ref(cmModeOptions);
</script>
<style lang="scss" scoped>
.code-mirror-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;

  .select-header {
    margin-bottom: 30px;
  }
}
</style>

<style lang="scss">
.CodeMirror {
  height: 700px;
  font-family: inherit;
}
</style>
