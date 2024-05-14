<template>
  <component class="pro-form-container" :is="'el-form'" v-bind="options.form" ref="formRef" :model="form">
    <component :is="`el-row`" v-bind="options.row" style="width: 100%">
      <template v-for="item in options.columns" :key="item.formItem.prop || item.formItem.title">
        <template v-if="item.formItem.title && !isDestroy(item)">
          <el-col :span="24" class="title-col">
            <el-divider direction="vertical" />
            <span :style="getTitleFontStyle(item)">{{ item.formItem.title }}</span>
          </el-col>
        </template>

        <component
          :is="`el-col`"
          v-bind="item.formItem.col || options.row?.col"
          :span="item.formItem.br ? 24 : item.formItem?.col?.span || options.row?.col?.span || 24"
          v-else-if="!isDestroy(item)"
          v-show="!isHidden(item)"
        >
          <component
            :is="'el-form-item'"
            v-bind="item.formItem"
            :label="parseLabel(item.formItem.label)"
            :style="{
              display: item.formItem.br && options.form!.labelPosition !== 'top' ? 'flex' : '',
            }"
          >
            <ProFormItem :column="item" :form="form" :style="formWidth(item)" />
          </component>
        </component>
      </template>
    </component>

    <el-form-item class="form-footer" v-if="$slots.footer"><slot name="footer"></slot></el-form-item>
    <el-form-item class="form-operation" v-if="$slots.operation"><slot name="operation"></slot></el-form-item>
  </component>
</template>

<script setup lang="ts">
import { computed, shallowRef, ref, provide, watch, type Ref } from "vue";
import type { FormColumnProps, FormEnumProps, FormOptionsProps } from "./interface";
import ProFormItem from "./components/ProFormItem.vue";
import { getPx } from "@/utils";
import type { FormInstance } from "element-plus";
import { isResponsive, getFormProp, setFormProp } from "./utils";

defineOptions({ name: "ProForm" });

export interface ProFormProps {
  options: FormOptionsProps;
  modelValue: { [key: string]: any };
  disabled?: boolean;
}

const props = withDefaults(defineProps<ProFormProps>(), { disabled: false, modelValue: () => ({}) });

const formRef = shallowRef<FormInstance>();
const form = computed(() => props.modelValue);

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
const setEnumMap = async (column: FormColumnProps) => {
  const { attrs, formItem } = column;
  if (!attrs.enum) return;
  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (isResponsive(attrs.enum)) return enumMap.value.set(formItem.prop, (attrs.enum as Ref).value!);
  if (typeof attrs.enum !== "function") return enumMap.value.set(formItem.prop, (attrs.enum as FormEnumProps[])!);
  const { data } = await attrs.enum(form.value);
  enumMap.value.set(formItem.prop, data);
};

// 初始化默认值
const initDefaultValue = async (column: FormColumnProps) => {
  const { attrs, formItem } = column;
  const value = getFormProp(form.value, formItem.prop);
  if (value || value === false || value === 0) return;

  const defaultValue = attrs.defaultValue;
  // 设置表单项的默认值
  if (defaultValue !== undefined && defaultValue !== null) {
    // 如果存在值，则不需要赋默认值
    if (isResponsive(defaultValue)) return setFormProp(form.value, formItem.prop, (defaultValue as Ref).value);
    if (typeof defaultValue === "function") {
      return setFormProp(form.value, formItem.prop, await defaultValue(form.value, enumMap.value));
    }
    return setFormProp(form.value, formItem.prop, defaultValue);
  }

  // 如果没有设置默认值，则判断后台是否返回 isDefault 为 Y 的枚举
  const enumData = enumMap.value.get(formItem.prop);
  if (enumData && enumData.length) {
    // 找出 isDefault 为 Y 的 value
    const data = enumData.filter(item => item.isDefault === "Y");

    return data.length && setFormProp(form.value, formItem.prop, data[0][attrs.fieldNames?.value ?? "value"]);
  }
};

/**
 * 多个 Select 框级联下拉
 */
const cascadeEnum = (column: FormColumnProps) => {
  const { formItem, attrs } = column;
  if (attrs?.el === "el-select") {
    if (typeof attrs.subProp !== "string") return;
    // 监听级联下拉变化
    watch(
      () => getFormProp(form.value, formItem.prop),
      async (newVal: string) => {
        if (!newVal) return;
        const { subEnum } = attrs;
        if (!subEnum) return;

        let subEnumData;
        if (enumMap.value.get(`${attrs.subProp!}-${newVal}`)) {
          // 存在缓存字典数据，则取出来赋值
          enumMap.value.set(`${attrs.subProp!}`, enumMap.value.get(`${attrs.subProp!}-${newVal}`) || []);
        } else {
          if (typeof subEnum === "function") {
            subEnumData = await subEnum(newVal, enumMap.value.get(formItem.prop));
            enumMap.value.set(attrs.subProp!, subEnumData);
          } else if (Array.isArray(subEnum)) {
            subEnumData = subEnum;
            enumMap.value.set(`${attrs.subProp!}`, subEnumData);
          }
          // 缓存字典数据
          enumMap.value.set(`${attrs.subProp!}-${newVal}`, subEnumData);
        }
        const formEnum = enumMap.value.get(formItem.prop) || [];
        const e = formEnum.filter(item => item.value === newVal);
        // 如果选中的字典有 subValue，则直接赋值给 subProp
        if (e[0]?.subValue) form.value[attrs.subProp!] = e[0].subValue;
      },
      { immediate: true }
    );
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
  else column.formItem && delete form.value[column.formItem.prop];

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
  item.attrs && (item.attrs.order = item.attrs.order ?? index + 2);
});

// 排序表单项
props.options.columns.sort((a, b) => a.attrs.order! - b.attrs.order!);

// 获取每个表单的宽度
const formWidth = (column: FormColumnProps) => {
  const { form } = props.options;
  const { attrs } = column;
  const style = attrs?.style || {};
  if (column.formItem.br) return { ...style, width: "100%" };
  if (attrs.width) return { ...style, width: getPx(attrs.width) };
  if (form?.fixWidth) return { ...style, width: getPx(form?.width || "220px") };
  return style;
};

const getTitleFontStyle = (column: FormColumnProps) => {
  if (!column.formItem.size || column.formItem.size === "default") return { fontSize: "16px", fontWeight: 600 };
  if (column.formItem.size === "small") return { fontSize: "14px", fontWeight: 600 };
  if (column.formItem.size === "large") return { fontSize: "18px", fontWeight: 600 };
  return {};
};

defineExpose({ formRef });
</script>

<style scoped lang="scss">
@import "./index";
</style>
