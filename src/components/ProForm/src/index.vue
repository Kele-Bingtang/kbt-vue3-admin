<template>
  <RenderFormWrap />
</template>

<script setup lang="tsx">
import {
  shallowRef,
  ref,
  provide,
  watch,
  unref,
  useSlots,
  onMounted,
  computed,
  type ComponentPublicInstance,
  defineComponent,
} from "vue";
import {
  ComponentNameEnum,
  formEnumMapKey,
  type FormSchemaProps,
  type FormSetProps,
  type ProElFormProps,
  type ValueType,
} from "./interface";
import ProFormItem from "./components/ProFormItem.vue";
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  type FormInstance,
  type RowProps,
  type ColProps,
  type FormItemInstance,
  type FormItemProp,
} from "element-plus";
import { getPx, getFormProp, isString, setFormProp, hyphenToCamelCase, deleteObjProperty } from "./helper";
import { useDesign } from "@/hooks";
import { componentMap } from "./helper/componentMap";

defineOptions({ name: "ProForm" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("pro-form");

export interface ProFormProps {
  modelValue?: Record<string, any>;
  schema?: FormSchemaProps[]; // 表单配置项
  elFormProps?: ProElFormProps | Record<string, any>; // ElForm 的 props
  useCol?: boolean; // 是否使用栅格布局
  // 栅格布局全局设置
  rowProps?: Partial<RowProps> & {
    col?: Partial<ColProps>;
  };
  onlyRenderComponent?: boolean; // 是否只渲染 ProFormItem 组件，只使用表单组件
  dynamicModel?: boolean; // 动态 model，如果 schema 发生变化，则重新渲染 model 表单数据（将不存在 schema 的 prop 从 model 中去掉），默认启用 true
  includeModelKeys?: string[]; // 搭配 dynamicModel 使用，清除 model 不存在的 prop 时，指定保留 prop
  enumMapProps?: Map<string, Record<string, any>[]>; // 存储 enum 值。该 props 是搭配 ProTable 使用，因为 ProTable 已经初始化部分字典数据，因此不需要 ProForm 再次请求这些字典数据
}

const props = withDefaults(defineProps<ProFormProps>(), {
  modelValue: () => ({}),
  schema: () => [],
  useCol: true,
  formProps: () => ({}),
  onlyRenderComponent: false,
  dynamicModel: true,
  includeModelKeys: () => [],
});

const model = defineModel<Record<string, any>>({ default: () => ({}) });

// 存储 ElForm 实例
const elFormRef = shallowRef<FormInstance>();

const mergeProps = ref<ProFormProps>({});

const getProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, unref(mergeProps));
  return propsObj;
});

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(props.enumMapProps || new Map<string, Record<string, any>[]>());

const setEnumMap = async ({ enum: enumValue, prop, useCacheEnum = true }: FormSchemaProps) => {
  if (!enumValue) return;

  const enumMapConst = unref(enumMap);

  // 如果当前 enumMap 存在相同的值 return & 开启缓存功能
  if (
    useCacheEnum &&
    enumMapConst.has(prop!) &&
    (typeof enumValue === "function" || enumMapConst.get(prop!) === enumValue)
  ) {
    return;
  }

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== "function") return enumMapConst.set(prop, unref(enumValue)!);

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMapConst.set(prop!, []);

  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  let data = await enumValue(unref(model), enumMapConst);
  // 适配 enum 接口返回 data 以及自定义函数返回数组
  data = data?.data || data;

  enumMapConst.set(prop, data);
};
provide(formEnumMapKey, enumMap);

// 初始化默认值
const initDefaultValue = async ({ defaultValue, fieldNames, prop }: FormSchemaProps) => {
  const formConst = unref(model);
  const value = getFormProp(formConst, prop);

  if (value || value === false || value === 0) return;

  const defaultValueConst = unref(defaultValue);
  // 设置表单项的默认值，如果存在值，则不需要赋默认值
  if (defaultValueConst !== undefined && defaultValueConst !== null) {
    if (typeof defaultValueConst !== "function") return setFormProp(formConst, prop, defaultValueConst);

    return setFormProp(formConst, prop, await defaultValueConst(formConst, unref(enumMap)));
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
  if (hyphenToCamelCase(el) === ComponentNameEnum.EL_SELECT) {
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
const isHidden = (item: FormSchemaProps) => {
  const { hidden } = item;
  if (typeof hidden === "function") return hidden(unref(model));
  return hidden;
};

/**
 * 是否销毁表单项 & 是否初始化表单项默认值
 */
const isDestroy = (item: FormSchemaProps) => {
  let destroy: boolean;
  if (typeof item.destroy === "function") destroy = item.destroy(unref(model));
  else destroy = item.destroy || false;

  // 如果不销毁，则初始化表单默认值，反之则重置为空
  if (!destroy) initDefaultValue(item);
  else deleteObjProperty(unref(model), item.prop);

  return destroy;
};

const parseLabel = (label: ValueType | ((model: Record<string, any>) => string)) => {
  if (typeof label === "function") return label(unref(model));
  return label + "";
};

// 监听表单结构化数组，重新组装 schema
watch(
  () => unref(getProps).schema,
  (schema = []) => {
    schema.forEach((item, index) => {
      // 设置枚举
      setEnumMap(item);
      // 级联下拉监听
      cascadeEnum(item);

      // 设置表单排序默认值
      item && (item.order = item.order ?? index + 2);

      // 初始化值
      initDefaultValue(item);
    });

    // 排序表单项
    schema.sort((a, b) => a.order! - b.order!);

    if (unref(getProps).dynamicModel) {
      // 如果 schema 对应的 prop 不存在，则删除 model 中的对应的 prop
      Object.keys(unref(model)).forEach(key => {
        const isExist = schema.some(
          item =>
            item.prop === key || item.renderUseProp?.includes(key) || unref(getProps).includeModelKeys?.includes(key)
        );
        if (!isExist) delete unref(model)[key];
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// 获取每个表单的宽度
const getComponentWidth = ({ width, props: componentProps }: FormSchemaProps) => {
  const { elFormProps = {} } = unref(getProps);
  const style = componentProps?.style || { width: "100%" }; // 默认宽度 100%
  if (width) return { ...style, width: getPx(width) };
  if (elFormProps.fixWidth) return { ...style, width: getPx(elFormProps.width || elFormProps.inline ? 220 : "100%") };
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

const RenderFormWrap = () => {
  const { elFormProps, onlyRenderComponent, schema } = unref(getProps);
  return !onlyRenderComponent ? (
    <ElForm ref={elFormRef} {...elFormProps} class={prefixClass} model={unref(model)}>
      {{
        default: () => {
          // 如果存在自定义插槽，则直接返回自定义插槽的 Render
          if (slots.default) return slots.default({ getComponentWidth, parseLabel, isDestroy, isHidden });
          return (
            <>
              {RenderForm()}
              {slots.operation ? <ElFormItem>{slots.operation()}</ElFormItem> : undefined}
            </>
          );
        },
      }}
    </ElForm>
  ) : (
    schema
      .filter(item => !isDestroy(item))
      .map(item => {
        return (
          <div v-show={!isHidden(item)}>
            <ProFormItem
              ref={(el: any) => (unref(proFormItemRefs)[item.prop] = el)}
              column={item}
              v-model={model.value}
              style={getComponentWidth(item)}
            />
          </div>
        );
      })
  );
};

// 渲染 ELForm
const RenderForm = () => {
  const { useCol, rowProps } = unref(getProps);
  // 如果需要栅格，需要包裹 ElCol
  return useCol ? (
    // 默认 gutter 20，可以被传来的 rowProps 替换
    <ElRow gutter={20} {...rowProps} style="width: 100%">
      {renderFormItemWrap()}
    </ElRow>
  ) : (
    renderFormItemWrap()
  );
};

// 渲染 FormItem 上一层
const renderFormItemWrap = () => {
  const { schema = [], useCol, rowProps } = unref(getProps);

  return schema
    .filter(item => !isDestroy(item))
    .map(item => {
      // 如果有 title
      const el = hyphenToCamelCase(item.el) || "";
      const useDivider = el === ComponentNameEnum.EL_DIVIDER;
      const Component = componentMap[el] as ReturnType<typeof defineComponent>;

      return useDivider ? (
        <>
          <Component {...item.props}>
            <span style={getTitleFontStyle(item)}>{parseLabel(item.label)}</span>
          </Component>
        </>
      ) : useCol ? (
        // 如果需要栅格，需要包裹 ElCol
        <ElCol {...setGridProp({ ...rowProps?.col, ...item.col })} v-show={!isHidden(item)}>
          {renderFormItem(item)}
        </ElCol>
      ) : (
        renderFormItem(item)
      );
    });
};

// 存储每一个 ElFormItem 实例
const formItemComponentsRef = ref<Record<string, FormItemInstance>>({});

// 存储表单组件实例
const proFormItemRefs = shallowRef<Record<string, InstanceType<typeof ProFormItem>>>({});

// 渲染 FormItem
const renderFormItem = (item: FormSchemaProps) => {
  return (
    <ElFormItem
      v-show={!isHidden(item)}
      ref={(el: any) => (unref(formItemComponentsRef)[item.prop] = el)}
      {...(item.formItem || {})}
      prop={item.prop}
      label={parseLabel(item.label)}
    >
      <ProFormItem
        ref={(el: any) => (unref(proFormItemRefs)[item.prop] = el)}
        column={item}
        v-model={model.value}
        style={getComponentWidth(item)}
      />
    </ElFormItem>
  );
};

type ProFormEmits = {
  register: [proFormRef?: ComponentPublicInstance | null | any, elFormRef?: FormInstance];
  validate: [prop: FormItemProp, isValid: boolean, message: string]; // ElForm 自带的事件
};

export type ProFormOnEmits = keyOnPrefix<ProFormEmits>;

// 定义 emit 事件
const emits = defineEmits<ProFormEmits>();

onMounted(() => {
  emits("register", unref(elFormRef)?.$parent, unref(elFormRef));
});

// 设置 form 的值
const setValues = (data: Record<string, any> = {}) => {
  model.value = Object.assign(unref(model), data);
};

// 设置 ProForm 组件的 props
const setProps = (props: Partial<ProFormProps> = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props);
};

// 设置 schema
const setSchema = (schemaSet: FormSetProps[]) => {
  const { schema } = unref(getProps);
  for (const v of schema) {
    for (const item of schemaSet) {
      if (v.prop === item.prop) {
        setFormProp(v, item.field, item.value);
      }
    }
  }
};

// 添加 schema
const addSchema = (formSchema: FormSchemaProps, prop?: number | string, position: "before" | "after" = "after") => {
  const { schema } = unref(getProps);

  if (isString(prop)) {
    return schema.forEach((s, i) => {
      if (s.prop === prop) position === "after" ? formSchema.splice(i + 1, 0, s) : formSchema.splice(i, 0, s);
    });
  }
  if (prop !== undefined) return schema.splice(prop, 0, formSchema);
  return schema.push(formSchema);
};

// 删除 schema
const delSchema = (prop: string) => {
  const { schema } = unref(getProps);

  const index = schema.findIndex(item => item.prop === prop);
  if (index > -1) schema.splice(index, 1);
};

// 获取表单组件实例
const getComponentExpose = (prop: string) => {
  return unref(proFormItemRefs)[prop].formComponentRef;
};

// 获取 formItem 实例
const getFormItemExpose = (prop: string) => {
  return unref(formItemComponentsRef)[prop];
};

defineExpose({
  form: elFormRef,
  model,
  setValues,
  setProps,
  setSchema,
  addSchema,
  delSchema,
  getComponentExpose,
  getFormItemExpose,
  getComponentWidth,
  parseLabel,
  isDestroy,
  isHidden,
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>
