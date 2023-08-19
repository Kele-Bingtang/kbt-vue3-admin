<template>
  <div class="card content-box"><ProForm :options="options" v-model="form" /></div>
</template>

<script setup lang="ts" name="SimpleProForm">
import { ref } from "vue";
import ProForm from "@/components/ProForm/index.vue";
import type { OptionsProps } from "@/components/ProForm/interface";

const form = ref<any>({});

const options: OptionsProps = {
  // 表单整体配置项
  form: {
    inline: false,
    labelPosition: "right",
    labelWidth: "80px",
    size: "default",
    disabled: false,
    labelSuffix: " :",
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  columns: [
    {
      formItem: { label: "用户名", prop: "username", labelWidth: "80px", required: true },
      attrs: { el: "el-input", clearable: true, placeholder: "请输入用户名", disabled: true },
    },
    {
      formItem: { label: "密码", prop: "password", class: "data" },
      attrs: { el: "el-input", clearable: true, autofocus: true, placeholder: "请输入密码", type: "password" },
    },
    {
      formItem: { label: "邮箱", prop: "email" },
      attrs: { el: "el-input", placeholder: "请输入邮箱", clearable: true, style: "width: 500px" },
    },
  ],
};
</script>
