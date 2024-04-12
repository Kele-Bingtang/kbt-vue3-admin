<template>
  <component
    :is="column.search?.render ?? `${column.search?.el}`"
    v-bind="{ ...handleSearchProps, ...placeholder, searchParam: _searchParam, clearable }"
    v-model.trim="_searchParam[column.search?.key ?? lastProp(column.prop!)]"
    :data="column.search?.el === 'el-tree-select' ? columnEnum : []"
    :options="['el-cascader', 'el-select-v 2'].includes(column.search?.el!) ? columnEnum : []"
  >
    <template v-if="column.search?.el === 'el-cascader'" #default="{ data }">
      <span>{{ data[fieldNames.label] }}</span>
    </template>

    <template v-if="column.search?.el === 'el-select' && column.search?.type === 'el-select-group'">
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

    <template v-else-if="column.search?.el === 'el-select'">
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

<script setup lang="ts">
import type { TableColumnProps } from "@/components/ProTable/interface";
import { lastProp } from "@/components/ProTable/utils";
import { computed, inject, ref } from "vue";

defineOptions({ name: "SearchFormItem" });

interface SearchFormItemProps {
  column: TableColumnProps;
  searchParam: { [key: string]: any };
}

const props = defineProps<SearchFormItemProps>();
const _searchParam = computed(() => props.searchParam);

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.fieldNames?.label ?? "label",
    value: props.column.fieldNames?.value ?? "value",
    children: props.column.fieldNames?.children ?? "children",
  };
});

// 接收 enumMap (el 为 select-v 2 需单独处理 enumData)
const enumMap = inject("enumMap", ref(new Map()));
const columnEnum = computed(() => {
  const column = props.column;

  if (column.useEnumMap) {
    if (typeof column.useEnumMap === "function") {
      return column.useEnumMap(enumMap.value);
    }

    const data = enumMap.value.get(column.useEnumMap);
    if (!data) return [];
    if (column.enumKey) return data[column.enumKey] || [];
    return data;
  }

  let enumData = enumMap.value.get(props.column.prop);
  if (!enumData) return [];
  if (props.column.search?.el === "el-select-v 2" && props.column.fieldNames) {
    enumData = enumData.map((item: { [key: string]: any }) => {
      return { ...item, label: item[fieldNames.value.label], value: item[fieldNames.value.value] };
    });
  }
  if (column.enumKey) return enumData[column.enumKey];
  return enumData;
});

// 处理透传的 searchProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleSearchProps = computed(() => {
  const label = fieldNames.value.label;
  const value = fieldNames.value.value;
  const children = fieldNames.value.children;
  const searchEl = props.column.search?.el;
  let searchProps = props.column.search?.props ?? {};

  if (searchEl === "el-tree-select") {
    searchProps = { ...searchProps, props: { ...searchProps.props, label, children }, nodeKey: value };
  }

  if (searchEl === "el-cascader") {
    searchProps = { ...searchProps, props: { ...searchProps.props, label, value, children } };
  }

  if (["date", "daterange"].includes(searchProps.type)) searchProps = { valueFormat: "YYYY-MM-DD", ...searchProps };
  else if (searchEl === "el-date-picker") searchProps = { valueFormat: "YYYY-MM-DD", ...searchProps };

  if (["datetime", "datetimerange"].includes(searchProps.type)) {
    searchProps = { valueFormat: "YYYY-MM-DD HH:mm:ss", ...searchProps };
  } else if (searchEl === "el-time-picker") searchProps = { valueFormat: "YYYY-MM-DD HH:mm:ss", ...searchProps };

  return searchProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const search = props.column.search;

  if (["datetimerange", "daterange", "monthrange"].includes(search?.props?.type) || search?.props?.isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }

  const placeholder = search?.props?.placeholder ?? (search?.el?.includes("input") ? "请输入" : "请选择");
  return { placeholder };
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const search = props.column.search;
  return search?.props?.clearable ?? (search?.defaultValue === null || search?.defaultValue === undefined);
});
</script>
