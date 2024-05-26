<template>
  <RenderSlots v-if="column?.render" />

  <Tree
    v-else-if="column?.el === 'el-tree'"
    :data="columnEnum"
    :model-value="getFormProp(model, column.prop)"
    @update:model-value="v => setFormProp(model, column.prop, v)"
    v-bind="{ ...handleFormProps }"
  />

  <RenderElComponents v-else-if="column?.el?.startsWith('el-')" />

  <RenderComponent v-else />
</template>

<script setup lang="tsx">
import { computed, inject, ref, unref, resolveDynamicComponent } from "vue";
import type { FormSchemaProps } from "../interface";
import Tree from "./Tree.vue";
import { getFormProp, setFormProp } from "../utils";
import { useRenderSelect } from "./useRenderSelect";
import { useRenderRadio } from "./useRenderRadio";
import { useRenderCheckbox } from "./useRenderCheckbox";
import { useRenderComponent } from "./useRenderComponent";

defineOptions({ name: "ProFormItem" });

interface ProFormItemProps {
  column: FormSchemaProps;
  style?: CSSStyleDeclaration;
}

const props = defineProps<ProFormItemProps>();

const model = defineModel<Record<string, any>>({ required: true });

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
  const { useEnumMap, enumKey } = props.column;

  if (useEnumMap) {
    if (typeof useEnumMap === "function") {
      return useEnumMap(unref(enumMap));
    }

    const data = unref(enumMap).get(useEnumMap);
    if (!data) return [];
    if (enumKey) return data[enumKey] || [];
    return data;
  }

  let enumData = unref(enumMap).get(props.column.prop);

  if (!enumData) return [];
  if (props.column?.el === "el-select-v2") {
    enumData = enumData.map((item: { [key: string]: any }) => {
      return { ...item, label: item[unref(fieldNames).label], value: item[unref(fieldNames).value] };
    });
  }
  if (enumKey) return enumData[enumKey];
  return enumData;
});

// 处理透传的 formProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleFormProps = computed(() => {
  const label = unref(fieldNames).label;
  const value = unref(fieldNames).value;
  const children = unref(fieldNames).children;
  const formEl = props.column?.el;
  let formProps = props.column.props ?? {};

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
  const { props: { type, isRange, placeholder } = {}, el } = props.column;
  if (["el-datetimerange", "el-daterange", "el-monthrange"].includes(type) || isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }
  const placeholderConst = placeholder ?? (el?.includes("el-input") ? "请输入" : "请选择");
  return { placeholderConst };
});

// 是否有清除按钮 (当有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const { props: { clearable } = {}, defaultValue } = props.column;
  return clearable ?? (defaultValue === null || defaultValue === undefined);
});

const isDisabled = () => {
  if (typeof props.column.isDisabled === "function") return props.column.isDisabled(unref(model));
  return props.column.isDisabled;
};

const { renderComponent: RenderComponent } = useRenderComponent(model, handleFormProps, props.column);
const { renderSelectOptions } = useRenderSelect();
const { renderRadioOptions } = useRenderRadio();
const { renderCheckboxOptions } = useRenderCheckbox();

// 渲染插槽
const RenderSlots = () => {
  const { column } = props;
  return column.render!({
    model: unref(model),
    data: getFormProp(model.value, column.prop),
    enumData: unref(columnEnum),
  });
};

// 渲染 Element Plus 的组件
const RenderElComponents = () => {
  const { column, style } = props;
  const { el } = column;
  let defaultSlot: any = () => {};

  if (el === "el-cascader") defaultSlot = ({ data }) => <span>{data[unref(fieldNames).label]}</span>;
  if (el === "el-select") defaultSlot = () => renderSelectOptions(columnEnum, unref(fieldNames));
  if (el === "el-radio-group") defaultSlot = () => renderRadioOptions(columnEnum, unref(fieldNames), column);
  if (el === "el-checkbox-group") defaultSlot = () => renderCheckboxOptions(columnEnum, unref(fieldNames), column);

  // TSX 不能直接使用 Vue3 内置组件 <component></component>，因此通过内置 resolveDynamicComponent 函数获取
  const DynamicComponent = resolveDynamicComponent(el) as any;
  return (
    <DynamicComponent
      is={el}
      disabled={isDisabled()}
      clearable={unref(clearable)}
      {...unref(handleFormProps)}
      {...unref(placeholder)}
      model-value={getFormProp(model.value, column.prop, column.valueFormat)}
      onUpdate:modelValue={(v: any) => setFormProp(model.value, column.prop, v)}
      data={el === "el-tree-select" ? unref(columnEnum) : []}
      options={["el-cascader", "el-select-v2"].includes(el!) ? unref(columnEnum) : []}
      style={style}
    >
      {{
        default: () => defaultSlot(),
      }}
    </DynamicComponent>
  );
};
</script>

<style lang="scss" scoped></style>
