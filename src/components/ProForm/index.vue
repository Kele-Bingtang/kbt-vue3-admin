<template>
  <component :is="'el-form'" v-bind="options.form" ref="formRef" :model="form">
    <template v-for="item in options.columns" :key="item.formItem.prop">
      <component :is="'el-form-item'" v-bind="item.formItem" :style="{ display: item.formItem.br ? 'flex' : false }">
        <ProFormItem :column="item" :form="form" :style="formWidth(item)" />
      </component>
    </template>
    <el-form-item class="form-footer"><slot name="footer"></slot></el-form-item>
    <el-form-item class="form-operation"><slot name="operation"></slot></el-form-item>
  </component>
</template>

<script setup lang="ts" name="ProForm">
import { computed } from "vue";
import type { ColumnsProps, OptionsProps } from "./interface";
import ProFormItem from "./components/ProFormItem.vue";
import { getPx } from "@/utils";

export interface ProFormProps {
  options: OptionsProps;
  modelValue: { [key: string]: any };
  disabled?: boolean;
}

const props = withDefaults(defineProps<ProFormProps>(), { disabled: false, modelValue: () => ({}) });

const formRef = shallowRef();
const form = computed(() => props.modelValue); // 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）

const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
const setEnumMap = async (column: ColumnsProps) => {
  const attrs = column.attrs;
  const formItem = column.formItem;
  if (!attrs.enum) return;
  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (typeof attrs.enum !== "function") return enumMap.value.set(formItem.prop!, attrs.enum!);
  const data = await attrs.enum();
  enumMap.value.set(formItem.prop!, data);
};

// 初始化默认值
const initDefaultValue = (column: ColumnsProps, index: number) => {
  const { attrs, formItem } = column;
  // 设置表单排序默认值 && 设置表单项的默认值
  attrs!.order = attrs!.order ?? index + 2;
  if (attrs?.defaultValue !== undefined && attrs?.defaultValue !== null) {
    // 如果存在值，则不需要赋默认值
    if (form.value[formItem.prop]) return;
    if (typeof attrs?.defaultValue === "function") form.value[formItem.prop] = attrs?.defaultValue();
    else form.value[formItem.prop] = attrs?.defaultValue;
  }
};

const cascadeEnum = (column: ColumnsProps) => {
  const attrs = column.attrs;
  const formEl = attrs?.el;
  const formProps = attrs?.props;
  if (formEl === "el-select") {
    if (attrs && attrs.subProp && typeof attrs.subProp === "string") {
      const customOnChange = formProps.onChange;
      formProps.onChange = async (value: string) => {
        // 先执行自定义的 change 事件
        if (customOnChange && typeof customOnChange === "function") customOnChange();
        form.value[attrs.subProp!] = "";
        // 然后执行内置的级联 change 事件
        const { subEnum } = attrs;
        if (subEnum) {
          if (typeof subEnum === "function") {
            const enumList = await subEnum(value);
            enumMap.value.set(attrs.subProp!, enumList);
          } else if (typeof subEnum === "object") {
            enumMap.value.set(attrs.subProp!, subEnum);
          }
        }
        const formEnum = enumMap.value.get(attrs.prop) || [];
        const e = formEnum.filter(item => item.value === value);
        if (e[0].subValue) form.value[attrs.subProp!] = e[0].subValue;
      };
    }
  }
};

props.options.columns.forEach((item, index) => {
  // 设置枚举
  setEnumMap(item);
  // 设置默认值
  initDefaultValue(item, index);
  // 级联下拉添加 change 事件
  cascadeEnum(item);
});

// 排序表单项
props.options.columns.sort((a, b) => a.attrs!.order! - b.attrs!.order!);
const formWidth = (column: ColumnsProps) => {
  const { form } = props.options;
  const { attrs } = column;
  const style = attrs.style || {};
  if (attrs.width) return { ...style, width: getPx(attrs.width) };
  if (form?.fixWidth && !column.formItem.br) return { ...style, width: form.width || "220px" };
  return style;
};

defineExpose({ formRef });
</script>

<style scoped lang="scss">
@import "./index";
</style>
