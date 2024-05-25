<template>
  <component ref="formRef" :class="prefixClass" :is="ElForm" v-bind="options.form" :model="form">
    <component :is="ElRow" v-bind="options.row" style="width: 100%">
      <template v-for="item in options.columns" :key="item.formItem.prop || item.formItem.title">
        <template v-if="item.formItem.title && !isDestroy(item)">
          <el-col :span="24" :class="`${prefixClass}__title`">
            <el-divider direction="vertical" />
            <span :style="getTitleFontStyle(item)">{{ item.formItem.title }}</span>
          </el-col>
        </template>

        <component
          :is="ElCol"
          v-bind="item.formItem.col || options.row?.col"
          :span="item.formItem.br ? 24 : item.formItem?.col?.span || options.row?.col?.span || 24"
          v-else-if="!isDestroy(item)"
          v-show="!isHidden(item)"
        >
          <component
            :is="ElFormItem"
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

    <el-form-item v-if="$slots.operation"><slot name="operation"></slot></el-form-item>
  </component>
</template>

<script setup lang="ts">
import { shallowRef, ref, provide, watch, unref, type Ref } from "vue";
import type { FormColumnProps, FormOptionsProps } from "./interface";
import ProFormItem from "./components/ProFormItem.vue";
import { getPx } from "@/utils";
import { ElRow, ElCol, ElForm, ElFormItem, type FormInstance } from "element-plus";
import { getFormProp, setFormProp } from "./utils";
import { useDesign } from "@/hooks";

defineOptions({ name: "ProForm" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("pro-form");

export interface ProFormProps {
  options: FormOptionsProps;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ProFormProps>(), { disabled: false });

const formRef = shallowRef<FormInstance>();
const form = defineModel<Record<string, any>>({ required: true });

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());

const setEnumMap = async ({ attrs, formItem }: FormColumnProps) => {
  const { enum: enumValue } = attrs;
  const { prop } = formItem;

  if (!enumValue) return;

  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (typeof enumValue !== "function") return unref(enumMap).set(prop, unref(enumValue)!);

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  const { data } = await enumValue(unref(form));
  unref(enumMap).set(prop, data);
};
provide("enumMap", enumMap);

// 初始化默认值
const initDefaultValue = async ({ attrs: { defaultValue, fieldNames }, formItem: { prop } }: FormColumnProps) => {
  const formConst = unref(form);
  const value = getFormProp(formConst, prop);

  if (value || value === false || value === 0) return;

  // 设置表单项的默认值，如果存在值，则不需要赋默认值
  if (defaultValue !== undefined && defaultValue !== null) {
    if (typeof defaultValue !== "function") return setFormProp(formConst, prop, unref(defaultValue));

    return setFormProp(formConst, prop, await defaultValue(formConst, unref(enumMap)));
  }

  // 如果没有设置默认值，则判断后台是否返回 isDefault 为 Y 的枚举
  const enumData = unref(enumMap).get(prop);
  if (enumData?.length) {
    // 找出 isDefault 为 Y 的 value
    const data = enumData.filter(item => item.isDefault === "Y");

    return data.length && setFormProp(formConst, prop, data[0][fieldNames?.value ?? "value"]);
  }
};

/**
 * 多个 Select 框级联下拉
 */
const cascadeEnum = ({ formItem, attrs: { el, subProp, subEnum } }: FormColumnProps) => {
  if (el === "el-select") {
    if (typeof subProp !== "string") return;
    // 监听级联下拉变化
    watch(
      () => getFormProp(unref(form), formItem.prop),
      async (newVal: string) => {
        const enumMapConst = unref(enumMap);

        if (!subEnum) return;

        if (!newVal) return enumMapConst.set(subProp!, []);

        if (enumMapConst.get(`${subProp!}-${newVal}`)) {
          // 存在缓存字典数据，则取出来赋值
          enumMapConst.set(subProp!, enumMapConst.get(`${subProp!}-${newVal}`) || []);
        } else {
          if (typeof subEnum === "function") {
            const subEnumData = await subEnum(newVal, enumMapConst.get(formItem.prop));
            // 缓存字典数据
            enumMapConst.set(`${subProp!}-${newVal}`, subEnumData);
            enumMapConst.set(subProp!, subEnumData);
          } else if (Array.isArray(subEnum)) {
            // 缓存字典数据
            enumMapConst.set(`${subProp!}-${newVal}`, subEnum);
            enumMapConst.set(subProp!, subEnum);
          }
        }

        const formEnum = enumMapConst.get(formItem.prop) || [];
        const [enumValue] = formEnum.filter(item => item.value === newVal);
        // 如果选中的字典有 subValue，则直接赋值给 subProp
        if (enumValue?.subValue) unref(form)[subProp!] = enumValue.subValue;
      },
      { immediate: true }
    );
  }
};

/**
 * 是否隐藏表单项
 */
const isHidden = (column: FormColumnProps) => {
  if (typeof column.attrs.isHidden === "function") return column.attrs.isHidden(unref(form));
  return column.attrs.isHidden;
};
/**
 * 是否销毁表单项 & 是否初始化表单项默认值
 */
const isDestroy = (column: FormColumnProps) => {
  let destroy;
  if (typeof column.attrs.isDestroy === "function") destroy = column.attrs.isDestroy(unref(form));
  else destroy = column.attrs.isDestroy;

  // 如果不销毁，则初始化表单默认值，反之则重置为空
  if (!destroy) initDefaultValue(column);
  else column.formItem && delete unref(form)[column.formItem.prop];

  return destroy;
};

const parseLabel = (label: any) => {
  if (typeof label === "function") return label(unref(form));
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
const formWidth = ({ attrs, formItem: { br } }: FormColumnProps) => {
  const { form } = props.options;
  const style = attrs?.style || {};
  if (br) return { ...style, width: "100%" };
  if (attrs.width) return { ...style, width: getPx(attrs.width) };
  if (form?.fixWidth) return { ...style, width: getPx(form?.width || "220px") };
  return style;
};

const getTitleFontStyle = ({ formItem: { size } }: FormColumnProps) => {
  if (!size || size === "default") return { fontSize: "16px", fontWeight: 600 };
  if (size === "small") return { fontSize: "14px", fontWeight: 600 };
  if (size === "large") return { fontSize: "18px", fontWeight: 600 };
  return {};
};

defineExpose({ formRef });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
