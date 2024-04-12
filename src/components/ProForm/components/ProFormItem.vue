<template>
  <component
    :is="column.attrs?.render ?? column.attrs?.el ?? ''"
    :disabled="isDisabled()"
    v-bind="{
      ...handleFormProps,
      ...placeholder,
      scope: { form: _form, data: _form[column.formItem.prop], enumData: columnEnum },
      clearable,
    }"
    v-model="_form[column.formItem.prop]"
    :data="column.attrs?.el === 'el-tree-select' ? columnEnum : []"
    :options="['el-cascader', 'el-select-v 2'].includes(column.attrs?.el!) ? columnEnum : []"
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
import { computed, inject, ref } from "vue";
import type { FormColumnProps } from "../interface";

defineOptions({ name: "ProFormItem" });

interface ProFormItemProps {
  column: FormColumnProps;
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
  const attrs = props.column.attrs;

  if (attrs.useEnumMap) {
    if (typeof attrs.useEnumMap === "function") {
      return attrs.useEnumMap(enumMap.value);
    }

    const data = enumMap.value.get(attrs.useEnumMap);
    if (!data) return [];
    if (attrs.enumKey) return data[attrs.enumKey] || [];
    return data;
  }

  let enumData = enumMap.value.get(props.column.formItem.prop);

  if (!enumData) return [];
  if (props.column.attrs?.el === "el-select-v2") {
    enumData = enumData.map((item: { [key: string]: any }) => {
      return { ...item, label: item[fieldNames.value.label], value: item[fieldNames.value.value] };
    });
  }
  if (attrs.enumKey) return enumData[attrs.enumKey];
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
  if (typeof props.column.attrs.isDisabled === "function") return props.column.attrs.isDisabled(_form.value);
  return props.column.attrs.isDisabled;
};
</script>
