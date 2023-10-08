<template>
  <WangEditor
    v-if="column.attrs?.el === 'wang-editor'"
    v-model="_form[column.formItem.prop]"
    v-bind="{ ...handleFormProps, ...placeholder, scope: { form: _form, row: _form[column.formItem.prop] } }"
  ></WangEditor>

  <component
    v-else
    :is="column.attrs?.render ?? column.attrs?.el"
    v-bind="{ ...handleFormProps, ...placeholder, scope: { form: _form, row: _form[column.formItem.prop] }, clearable }"
    v-model="_form[column.formItem.prop]"
    :data="column.attrs?.el === 'el-tree-select' ? columnEnum : []"
    :options="['el-cascader', 'el-select-v 2'].includes(column.attrs?.el!) ? columnEnum : []"
  >
    <template v-if="column.attrs?.el === 'el-cascader'" #default="{ data }">
      <span>{{ data[fieldNames.label] }}</span>
    </template>
    <template v-if="column.attrs?.el === 'el-select'">
      <component
        :is="`el-option`"
        v-for="(col, index) in columnEnum"
        :key="index"
        :label="col[fieldNames.label]"
        :value="col[fieldNames.value]"
      ></component>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts" name="ProFormItem">
import { computed, inject, ref } from "vue";
import type { ColumnsProps } from "../interface/index";
import WangEditor from "@/components/WangEditor/index.vue";

interface ProFormItemProps {
  column: ColumnsProps;
  form: { [key: string]: any };
}

const props = defineProps<ProFormItemProps>();

const _form = computed(() => props.form);

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.attrs.fieldNames?.label ?? "label",
    value: props.column.attrs.fieldNames?.value ?? "value",
    children: props.column.attrs.fieldNames?.children ?? "children",
  };
});

// 接收 enumMap (el 为 select-v 2 需单独处理 enumData)
const enumMap = inject("enumMap", ref(new Map()));
const columnEnum = computed(() => {
  let enumData = enumMap.value.get(props.column.formItem.prop);
  if (!enumData) return [];
  if (props.column.attrs?.el === "el-select-v 2" && props.column.attrs.fieldNames) {
    enumData = enumData.map((item: { [key: string]: any }) => {
      return { ...item, label: item[fieldNames.value.label], value: item[fieldNames.value.value] };
    });
  }
  return enumData;
});

// 处理透传的 formProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleFormProps = computed(() => {
  const label = fieldNames.value.label;
  const value = fieldNames.value.value;
  const children = fieldNames.value.children;
  const formEl = props.column.attrs?.el;
  let formProps = props.column.attrs.props ?? {};
  if (formEl === "el-tree-select") {
    formProps = { ...formProps, props: { ...formProps.props, label, children }, nodeKey: value };
  }
  if (formEl === "el-cascader") {
    formProps = { ...formProps, props: { ...formProps.props, label, value, children } };
  }
  if (formProps.type === "date") formProps = { valueFormat: "YYYY-MM-DD", ...formProps };
  if (formProps.type === "datetime") formProps = { valueFormat: "YYYY-MM-DD HH:mm:ss", ...formProps };
  return formProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const attrs = props.column.attrs;
  if (["el-datetimerange", "el-daterange", "el-monthrange"].includes(attrs?.props.type) || attrs?.props.isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }
  const placeholder = attrs?.props.placeholder ?? (attrs?.el?.includes("el-input") ? "请输入" : "请选择");
  return { placeholder };
});

// 是否有清除按钮 (当有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const attrs = props.column.attrs;
  return attrs?.props?.clearable ?? (attrs?.defaultValue === null || attrs?.defaultValue === undefined);
});
</script>
