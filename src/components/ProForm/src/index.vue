<template>
  <RenderFormWrap />
</template>

<script setup lang="tsx">
import { shallowRef, ref, provide, watch, unref } from "vue";
import type { FormSchemaProps, ProElFormProps, ValueType } from "./interface";
import ProFormItem from "./components/ProFormItem.vue";
import { getPx } from "@/utils";
import { ElRow, ElCol, ElForm, ElFormItem, type FormInstance, type RowProps, type ColProps } from "element-plus";
import { getFormProp, setFormProp } from "./utils";
import { useDesign } from "@/hooks";

defineOptions({ name: "ProForm" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("pro-form");

export interface ProFormProps {
  schema: FormSchemaProps[]; // 表单配置项
  formProps?: ProElFormProps | Record<string, any>; // ElForm 的 props
  useCol?: boolean; // 是否使用栅格布局
  // 栅格布局全局设置
  rowProps?: Partial<RowProps> & {
    col?: Partial<ColProps>;
  };
  disabled?: boolean; // 是否禁用所有表单
}

const props = withDefaults(defineProps<ProFormProps>(), {
  useCol: true,
  disabled: false,
  formProps: () => ({}),
});

const formRef = shallowRef<FormInstance>();
const model = defineModel<Record<string, any>>({ required: true });

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());

const setEnumMap = async ({ enum: enumValue, prop }: FormSchemaProps) => {
  if (!enumValue) return;

  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (typeof enumValue !== "function") return unref(enumMap).set(prop, unref(enumValue)!);

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  const { data } = await enumValue(unref(model), unref(enumMap));
  unref(enumMap).set(prop, data);
};
provide("enumMap", enumMap);

// 初始化默认值
const initDefaultValue = async ({ defaultValue, fieldNames, prop }: FormSchemaProps) => {
  const formConst = unref(model);
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
const cascadeEnum = ({ prop, el, subProp, subEnum }: FormSchemaProps) => {
  if (el === "el-select") {
    if (typeof subProp !== "string") return;
    // 监听级联下拉变化
    watch(
      () => getFormProp(unref(model), prop),
      async (newVal: string) => {
        const enumMapConst = unref(enumMap);
        // 选择时将级联的 subProp 置空
        if (unref(model)[subProp!]) unref(model)[subProp!] = "";

        if (!subEnum) return;
        if (!newVal) return enumMapConst.set(subProp!, []);

        if (enumMapConst.get(`${subProp!}-${newVal}`)) {
          // 存在缓存字典数据，则取出来赋值
          enumMapConst.set(subProp!, enumMapConst.get(`${subProp!}-${newVal}`) || []);
        } else {
          if (typeof subEnum === "function") {
            const subEnumData = await subEnum(newVal, enumMapConst.get(prop));
            // 缓存字典数据
            enumMapConst.set(`${subProp!}-${newVal}`, subEnumData);
            enumMapConst.set(subProp!, subEnumData);
          } else if (Array.isArray(subEnum)) {
            // 缓存字典数据
            enumMapConst.set(`${subProp!}-${newVal}`, subEnum);
            enumMapConst.set(subProp!, subEnum);
          }
        }

        const formEnum = enumMapConst.get(prop) || [];
        const [enumValue] = formEnum.filter(item => item.value === newVal);
        // 如果选中的字典有 subValue，则直接赋值给 subProp
        if (enumValue?.subValue) unref(model)[subProp!] = enumValue.subValue;
      },
      { immediate: true }
    );
  }
};

/**
 * 是否隐藏表单项
 */
const isHidden = (isHidden: boolean | ((model: Record<string, any>) => boolean)) => {
  if (typeof isHidden === "function") return isHidden(unref(model));
  return isHidden;
};
/**
 * 是否销毁表单项 & 是否初始化表单项默认值
 */
const isDestroy = (column: FormSchemaProps) => {
  let destroy;
  if (typeof column.isDestroy === "function") destroy = column.isDestroy(unref(model));
  else destroy = column.isDestroy;

  // 如果不销毁，则初始化表单默认值，反之则重置为空
  if (!destroy) initDefaultValue(column);
  else delete unref(model)[column.prop];

  return destroy;
};

const parseLabel = (label: ValueType | ((model: Record<string, any>) => ValueType)) => {
  if (typeof label === "function") return label(unref(model));
  return label;
};

props.schema.forEach((item, index) => {
  // 设置枚举
  setEnumMap(item);
  // 级联下拉监听
  cascadeEnum(item);

  // 设置表单排序默认值
  item && (item.order = item.order ?? index + 2);
});

// 排序表单项
props.schema.sort((a, b) => a.order! - b.order!);

// 获取每个表单的宽度
const getComponentWidth = ({ width, props: componentProps }: FormSchemaProps) => {
  const { formProps = {} } = props;
  const style = componentProps?.style || { width: "100%" }; // 默认宽度 100%
  if (width) return { ...style, width: getPx(width) };
  if (formProps?.fixWidth) return { ...style, width: getPx(formProps.width || formProps.inline ? 220 : "100%") };
  return style;
};

// 获取标题样式
const getTitleFontStyle = ({ labelSize }: FormSchemaProps) => {
  if (!labelSize || labelSize === "default") return { fontSize: "16px", fontWeight: 600 };
  if (labelSize === "small") return { fontSize: "14px", fontWeight: 600 };
  if (labelSize === "large") return { fontSize: "18px", fontWeight: 600 };
  return {};
};

/**
 * @description 合并传入进来的栅格属性
 */
const setGridProp = (col: Partial<ColProps> = {}) => {
  return {
    // 如果有 span，代表用户优先级更高，所以不需要默认栅格
    ...(col.span ? {} : { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }),
    ...col,
  };
};

const slots = useSlots();

// 渲染 ELForm
const RenderFormWrap = () => {
  const { useCol, rowProps, formProps } = props;
  // 如果需要栅格，需要包裹 ElCol
  const content = useCol ? (
    // 默认 gutter 20，可以被传来的 rowProps 替换
    <ElRow gutter={20} {...rowProps} style="width: 100%">
      {renderFormItemWrap()}
    </ElRow>
  ) : (
    renderFormItemWrap()
  );

  return (
    <ElForm ref={formRef} {...formProps} class={prefixClass} model={unref(model)}>
      {{
        default: () => {
          // 如果存在自定义插槽，则直接返回自定义插槽的 Render
          if (slots.default) return slots.default({ getComponentWidth, parseLabel });
          return (
            <>
              {content}
              {slots.operation ? <ElFormItem>{slots.operation()}</ElFormItem> : undefined}
            </>
          );
        },
      }}
    </ElForm>
  );
};

// 渲染 FormItem 上一层
const renderFormItemWrap = () => {
  const { schema = [], useCol, rowProps } = props;
  return schema
    .filter(item => !isDestroy(item))
    .map(item => {
      // 如果有 title
      const useDivider = item.el === "divider";
      return useDivider ? (
        <>
          <el-divider direction="vertical" {...item.props}>
            <span style={getTitleFontStyle(item)}>{parseLabel(item.label)}</span>
          </el-divider>
        </>
      ) : useCol ? (
        // 如果需要栅格，需要包裹 ElCol
        <ElCol {...setGridProp({ ...rowProps?.col, ...item.col })} v-show={!isHidden(item.isHidden || false)}>
          {renderFormItem(item)}
        </ElCol>
      ) : (
        renderFormItem(item)
      );
    });
};

// 渲染 FormItem
const renderFormItem = (item: FormSchemaProps) => {
  return (
    <ElFormItem
      v-show={!isHidden(item.isHidden || false)}
      ref={(el: any) => (formItemComponents.value[item.field] = el)}
      {...(item.formItem || {})}
      prop={item.prop}
      label={parseLabel(item.label)}
    >
      <ProFormItem column={item} v-model={model.value} style={getComponentWidth(item)} />
    </ElFormItem>
  );
};

// 存储每一个 form-item 实例
const formItemComponents = ref({});

defineExpose({ form: formRef, formItemComponents });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
