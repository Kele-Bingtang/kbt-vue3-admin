<script setup lang="ts">
import type { FormColumnProps, FormFieldNamesProps, PascalCaseComponentName } from "../types";
import { getProp, hyphenToCamelCase, setProp } from "../helper";
import { computed } from "vue";
import { componentMap } from "../helper/component-map";

// 使用类型标注定义 Props
interface Props {
  model: Record<string, any>;
  componentProps: Record<string, any>;
  column: FormColumnProps;
  columnEnum?: Record<string, any>[];
  fieldNames?: FormFieldNamesProps;
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  columnEnum: () => [],
  fieldNames: () => ({}),
});

// 获取组件实例
const component = computed(() => componentMap[hyphenToCamelCase(props.column.el) as PascalCaseComponentName]);

// 创建计算属性实现双向绑定
const modelValue = computed({
  get: () => getProp(props.model, props.column.prop, props.column.valueFormat),
  set: (value: any) => setProp(props.model, props.column.prop, value),
});
</script>

<template>
  <component
    :is="component"
    v-model="modelValue"
    v-bind="props.componentProps"
    :enum="props.columnEnum"
    :field-names="props.fieldNames"
  />
</template>
