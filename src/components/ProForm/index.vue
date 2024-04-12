<template>
  <component :is="'el-form'" v-bind="options.form" ref="formRef" :model="form">
    <template v-for="item in options.columns">
      <component
        :key="item.formItem.prop"
        v-if="!isDestroy(item)"
        v-show="!isHidden(item)"
        :is="'el-form-item'"
        v-bind="item.formItem"
        :label="parseLabel(item.formItem.label)"
        :style="{
          display: item.formItem.br && options.form!.labelPosition !== 'top' ? 'flex' : '',
          width: item.formItem.br && options.form!.labelPosition === 'top' ? '100%' : '',
        }"
      >
        <ProFormItem :column="item" :form="form" :style="formWidth(item)" />
      </component>
    </template>
    <el-form-item class="form-footer"><slot name="footer"></slot></el-form-item>
    <el-form-item class="form-operation"><slot name="operation"></slot></el-form-item>
  </component>
</template>

<script setup lang="ts">
import { computed, shallowRef, ref, provide, watch, isRef, isProxy, type Ref } from "vue";
import type { FormColumnProps, FormEnumProps, FormOptionsProps } from "./interface";
import ProFormItem from "./components/ProFormItem.vue";
import { getPx } from "@/utils";
import type { FormInstance } from "element-plus";

defineOptions({ name: "ProForm" });

export interface ProFormProps {
  options: FormOptionsProps;
  modelValue: { [key: string]: any };
  disabled?: boolean;
}

const props = withDefaults(defineProps<ProFormProps>(), { disabled: false, modelValue: () => ({}) });

const formRef = shallowRef<FormInstance>();
const form = computed(() => props.modelValue);

const isResponsive = (obj: any) => {
  return isRef(obj) || isProxy(obj);
};

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
const setEnumMap = async (column: FormColumnProps) => {
  const attrs = column.attrs;
  const formItem = column.formItem;
  if (!attrs.enum) return;
  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (isResponsive(attrs.enum)) return enumMap.value.set(formItem.prop!, (attrs.enum as Ref).value!);
  if (typeof attrs.enum !== "function") return enumMap.value.set(formItem.prop!, (attrs.enum as FormEnumProps[])!);
  const { data } = await attrs.enum(enumMap.value);
  enumMap.value.set(formItem.prop!, data);
};

// 初始化默认值
const initDefaultValue = (column: FormColumnProps) => {
  const { attrs, formItem } = column;

  if (form.value[formItem.prop] || form.value[formItem.prop] === false || form.value[formItem.prop] === 0) return;

  // 设置表单项的默认值
  if (attrs?.defaultValue !== undefined && attrs?.defaultValue !== null) {
    // 如果存在值，则不需要赋默认值
    if (isResponsive(attrs.defaultValue)) return (form.value[formItem.prop] = (attrs?.defaultValue as Ref).value);
    if (typeof attrs?.defaultValue === "function") return (form.value[formItem.prop] = attrs?.defaultValue());
    return (form.value[formItem.prop] = attrs?.defaultValue);
  }

  // 如果没有设置默认值，则判断后台是否返回 isDefault 为 Y 的枚举
  const enumData = enumMap.value.get(column.formItem.prop);
  if (enumData && enumData.length) {
    // 找出 isDefault 为 Y 的 value
    const data = enumData.filter(item => item.isDefault === "Y");
    return data.length && (form.value[formItem.prop] = data[0][column.attrs.fieldNames?.value ?? "value"]);
  }
};

const cascadeEnum = (column: FormColumnProps) => {
  const { formItem, attrs } = column;
  const formEl = attrs?.el;
  if (formEl === "el-select") {
    if (attrs && attrs.subProp && typeof attrs.subProp === "string") {
      watch(
        () => form.value[formItem.prop],
        async (newVal: string) => {
          // 然后执行内置的级联 change 事件
          const { subEnum } = attrs;
          if (subEnum && !enumMap.value.get(`${attrs.subProp!}-${newVal}`)) {
            if (typeof subEnum === "function") {
              enumMap.value.set(attrs.subProp!, await subEnum(newVal, enumMap.value.get(column.formItem.prop)));
            } else if (Array.isArray(typeof subEnum)) enumMap.value.set(`${attrs.subProp!}-${newVal}`, subEnum);
          }
          const formEnum = enumMap.value.get(formItem.prop) || [];
          const e = formEnum.filter(item => item.value === newVal);
          if (e[0]?.subValue) form.value[attrs.subProp!] = e[0].subValue;
        },
        { immediate: true }
      );
    }
  }
};

/**
 * 是否隐藏表单项
 */
const isHidden = (column: FormColumnProps) => {
  if (typeof column.attrs.isHidden === "function") return column.attrs.isHidden(form.value);
  return column.attrs.isHidden;
};
/**
 * 是否销毁表单项 & 是否初始化表单项默认值
 */
const isDestroy = (column: FormColumnProps) => {
  let destroy;
  if (typeof column.attrs.isDestroy === "function") destroy = column.attrs.isDestroy(form.value);
  else destroy = column.attrs.isDestroy;

  // 如果不销毁，则初始化表单默认值，反之则重置为空
  if (!destroy) initDefaultValue(column);
  else form.value[column.formItem.prop] = "";

  return destroy;
};

const parseLabel = (label: any) => {
  if (typeof label === "function") return label(form.value);
  return label;
};

props.options.columns.forEach((item, index) => {
  // 设置枚举
  setEnumMap(item);
  // 级联下拉监听
  cascadeEnum(item);

  // 设置表单排序默认值
  item.attrs!.order = item.attrs!.order ?? index + 2;
});

// 排序表单项
props.options.columns.sort((a, b) => a.attrs!.order! - b.attrs!.order!);

// 获取每个表单的宽度
const formWidth = (column: FormColumnProps) => {
  const { form } = props.options;
  const { attrs } = column;
  const style = attrs.style || {};
  if (column.formItem.br) return { ...style, width: "100%" };
  if (attrs.width) return { ...style, width: getPx(attrs.width) };
  if (form?.fixWidth) return { ...style, width: getPx(attrs.width || "220px") };
  return style;
};

defineExpose({ formRef });
</script>

<style scoped lang="scss">
@import "./index";
</style>
