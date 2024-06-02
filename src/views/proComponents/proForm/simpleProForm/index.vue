<template>
  <div style="padding: 10px">
    <div class="card">
      <ProForm :elFormProps="elFormProps" :schema="schema" v-model="model" />
    </div>

    {{ model }}
  </div>
</template>

<script setup lang="ts" name="SimpleProForm">
import { ref } from "vue";
import { ProForm, type FormSchemaProps, type ProElFormProps } from "@/components";

const model = ref<Record<string, any>>({});

// 表单整体配置项
const elFormProps: ProElFormProps = {
  inline: false,
  labelPosition: "right",
  labelWidth: "80px",
  disabled: false,
  labelSuffix: " :",
};

// 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
const schema: FormSchemaProps[] = [
  {
    formItem: { labelWidth: "80px", required: true },
    label: "用户名",
    prop: "username",
    el: "el-input",
    props: { clearable: true, placeholder: "请输入用户名", disabled: true },
  },
  {
    label: "密码",
    prop: "password",
    el: "el-input",
    props: { clearable: true, autofocus: true, placeholder: "请输入密码", type: "password" },
  },
  {
    label: "邮箱",
    prop: "email",
    el: "el-input",
    width: 500,
    props: { placeholder: "请输入邮箱", clearable: true },
  },
];
</script>
