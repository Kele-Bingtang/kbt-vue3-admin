<template>
  <Tinymce
    v-if="column.attrs?.el === 'tinymce'"
    :model-value="getFormProp(_form, column.formItem.prop)"
    @update:model-value="v => setFormProp(_form, column.formItem.prop, v)"
    v-bind="{ ...handleFormProps }"
  ></Tinymce>

  <WangEditor
    v-else-if="column.attrs?.el === 'wang-editor'"
    :model-value="getFormProp(_form, column.formItem.prop)"
    @update:model-value="v => setFormProp(_form, column.formItem.prop, v)"
    v-bind="{ ...handleFormProps }"
  ></WangEditor>

  <Tree
    v-else-if="!column.attrs?.render && column.attrs?.el === 'el-tree'"
    :data="columnEnum"
    :model-value="getFormProp(_form, column.formItem.prop)"
    @update:model-value="v => setFormProp(_form, column.formItem.prop, v)"
    v-bind="{ ...handleFormProps }"
  ></Tree>

  <component
    v-else
    :is="column.attrs?.render ?? column.attrs?.el ?? ''"
    :disabled="isDisabled()"
    v-bind="{
      ...handleFormProps,
      ...placeholder,
      scope: { form: _form, data: getFormProp(_form, column.formItem.prop), enumData: columnEnum },
      clearable,
    }"
    :model-value="getFormProp(_form, column.formItem.prop, column.attrs.valueFormat)"
    @update:model-value="(v: any) => setFormProp(_form, column.formItem.prop, v)"
    :data="column.attrs?.el === 'el-tree-select' ? columnEnum : []"
    :options="['el-cascader', 'el-select-v2'].includes(column.attrs?.el!) ? columnEnum : []"
    :style="style"
  >
    <template v-if="column.attrs?.el === 'el-cascader'" #default="{ data }">
      <span>{{ data[fieldNames.label] }}</span>
    </template>

    <template v-if="column.attrs?.el === 'el-select'">
      <template v-if="column.attrs?.type === 'el-select-group'">
        <component :is="`el-option-group`" v-for="(colGroup, index) in columnEnum" :key="index" :label="colGroup.label">
          <component
            :is="`el-option`"
            v-for="(col, index) in colGroup.options"
            :key="index"
            :label="col[fieldNames.label]"
            :value="col[fieldNames.value]"
          ></component>
        </component>
      </template>

      <template v-else>
        <component
          :is="`el-option`"
          v-for="(col, index) in columnEnum"
          :key="index"
          :label="col[fieldNames.label]"
          :value="col[fieldNames.value]"
        ></component>
      </template>
    </template>

    <template v-if="column.attrs?.el === 'el-radio-group'">
      <template v-if="column.attrs?.type === 'el-radio-button'">
        <component
          :is="`el-radio-button`"
          v-for="(col, index) in columnEnum"
          :key="index"
          :value="col[fieldNames.value]"
          :label="col[fieldNames.label]"
        ></component>
      </template>

      <template v-else>
        <component :is="`el-radio`" v-for="(col, index) in columnEnum" :key="index" :value="col[fieldNames.value]">
          {{ col[fieldNames.label] }}
        </component>
      </template>
    </template>

    <template v-if="column.attrs?.el === 'el-checkbox-group'">
      <template v-if="column.attrs?.type === 'el-checkbox-button'">
        <component
          :is="`el-checkbox-button`"
          v-for="(col, index) in columnEnum"
          :key="index"
          :value="col[fieldNames.value]"
        >
          {{ col[fieldNames.label] }}
        </component>
      </template>

      <template v-else>
        <component
          :is="`el-checkbox`"
          v-for="(col, index) in columnEnum"
          :key="index"
          :value="col[fieldNames.value]"
          :label="col[fieldNames.label]"
        ></component>
      </template>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, inject, ref, unref } from "vue";
import type { FormColumnProps } from "../interface";
import { WangEditor, Tinymce } from "@/components";
import Tree from "./Tree.vue";
import { getFormProp, setFormProp } from "../utils";

defineOptions({ name: "ProFormItem" });

interface ProFormItemProps {
  column: FormColumnProps;
  form: { [key: string]: any };
  style: CSSStyleDeclaration;
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
  const attrs = props.column.attrs;

  if (attrs.useEnumMap) {
    if (typeof attrs.useEnumMap === "function") {
      return attrs.useEnumMap(unref(enumMap));
    }

    const data = unref(enumMap).get(attrs.useEnumMap);
    if (!data) return [];
    if (attrs.enumKey) return data[attrs.enumKey] || [];
    return data;
  }

  let enumData = unref(enumMap).get(props.column.formItem.prop);

  if (!enumData) return [];
  if (props.column.attrs?.el === "el-select-v2") {
    enumData = enumData.map((item: { [key: string]: any }) => {
      return { ...item, label: item[unref(fieldNames).label], value: item[unref(fieldNames).value] };
    });
  }
  if (attrs.enumKey) return enumData[attrs.enumKey];
  return enumData;
});

// 处理透传的 formProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleFormProps = computed(() => {
  const label = unref(fieldNames).label;
  const value = unref(fieldNames).value;
  const children = unref(fieldNames).children;
  const formEl = props.column.attrs?.el;
  let formProps = props.column.attrs.props ?? {};

  if (formEl === "el-tree-select") {
    formProps = { ...formProps, props: { ...formProps.props, label, children }, nodeKey: value };
  }

  if (formEl === "el-cascader") {
    formProps = { ...formProps, props: { ...formProps.props, label, value, children } };
  }

  if (formEl === "el-date-picker") {
    if (formProps.type === "datetime") formProps = { valueFormat: "YYYY-MM-DD HH:mm:ss", ...formProps };
    if (formProps.type === "date") formProps = { valueFormat: "YYYY-MM-DD", ...formProps };
    else formProps = { valueFormat: "YYYY-MM-DD", ...formProps };
  }

  if (formEl === "el-time-picker") formProps = { valueFormat: "HH:mm:ss", ...formProps };

  return formProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const attrs = props.column.attrs;
  if (["el-datetimerange", "el-daterange", "el-monthrange"].includes(attrs?.props?.type) || attrs?.props?.isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }
  const placeholder = attrs?.props?.placeholder ?? (attrs?.el?.includes("el-input") ? "请输入" : "请选择");
  return { placeholder };
});

// 是否有清除按钮 (当有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const attrs = props.column.attrs;
  return attrs?.props?.clearable ?? (attrs?.defaultValue === null || attrs?.defaultValue === undefined);
});

const isDisabled = () => {
  if (typeof props.column.attrs.isDisabled === "function") return props.column.attrs.isDisabled(unref(_form));
  return props.column.attrs.isDisabled;
};
</script>
