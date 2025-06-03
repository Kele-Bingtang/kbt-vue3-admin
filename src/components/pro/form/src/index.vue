<script setup lang="ts">
import {
  shallowRef,
  ref,
  watch,
  unref,
  onMounted,
  computed,
  type ComponentPublicInstance,
  type ComputedRef,
} from "vue";
import { defineAsyncComponent } from "vue";
import {
  ComponentNameEnum,
  type FormColumnProps,
  type FormSetProps,
  type ProElFormProps,
  type ValueType,
} from "./types";
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElDivider,
  type FormInstance,
  type RowProps,
  type ColProps,
  type FormItemProp,
} from "element-plus";
import { getProp, setProp, hyphenToCamelCase, deleteObjProperty } from "./helper";
import { useNamespace } from "@/composables";
import { addUnit, isString } from "@/utils";

// 定义组件
const ProFormItem = defineAsyncComponent(() => import("./form-item.vue"));

// 组件选项
defineOptions({ name: "ProForm" });

const ns = useNamespace("pro-form");

export interface ProFormProps {
  modelValue?: Record<string, any>;
  schema?: FormColumnProps[]; // 表单配置项
  elFormProps?: ProElFormProps | Record<string, any>; // ElForm 的 props
  useCol?: boolean; // 是否使用栅格布局
  // 栅格布局全局设置
  rowProps?: Partial<RowProps>;
  colProps?: Partial<ColProps>;
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
// 存储表单组件实例
const proFormItemRefs = shallowRef<Record<string, InstanceType<typeof ProFormItem>>>({});

const mergeProps = ref<ProFormProps>({});

const getProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

// 计算属性：过滤掉需要销毁的表单项
const filteredSchema = computed(() => {
  return getProps.value.schema.filter(item => !isDestroy(item));
});

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(props.enumMapProps || new Map<string, Record<string, any>[]>());

// 初始化默认值
const initDefaultValue = async ({ defaultValue, fieldNames, prop }: FormColumnProps) => {
  const formConst = model.value;
  const value = getProp(formConst, prop);

  if (value || value === false || value === 0) return;

  const defaultValueConst = unref(defaultValue);
  // 设置表单项的默认值，如果存在值，则不需要赋默认值
  if (defaultValueConst !== undefined && defaultValueConst !== null) {
    if (typeof defaultValueConst !== "function") return setProp(formConst, prop, defaultValueConst);

    return setProp(formConst, prop, await defaultValueConst(formConst, enumMap.value));
  }

  // 如果没有设置默认值，则判断后台是否返回 isDefault 为 Y 的枚举
  const enumData = enumMap.value.get(prop);
  if (enumData?.length) {
    // 找出 isDefault 为 Y 的 value
    const data = enumData.filter(item => item.isDefault === "Y");

    return data.length && setProp(formConst, prop, data[0][fieldNames?.value ?? "value"]);
  }
};

/**
 * 是否隐藏表单项
 */
const isHidden = (item: FormColumnProps) => {
  const { hidden } = item;
  if (typeof hidden === "function") return hidden(model.value);
  return hidden;
};

/**
 * 是否销毁表单项 & 是否初始化表单项默认值
 */
const isDestroy = (item: FormColumnProps) => {
  let destroy: boolean;
  if (typeof item.destroy === "function") destroy = item.destroy(model.value);
  else destroy = item.destroy || false;

  // 如果不销毁，则初始化表单默认值，反之则重置为空
  if (!destroy) initDefaultValue(item);
  else deleteObjProperty(model.value, item.prop);

  return destroy;
};

const parseLabel = (label: ValueType | ((model: Record<string, any>) => string) | ComputedRef<ValueType>) => {
  if (typeof label === "function") return label(model.value);
  return unref(label) + "";
};

// 监听表单结构化数组，重新组装 schema
watch(
  () => getProps.value.schema,
  (schema = []) => {
    schema.forEach((item, index) => {
      // 设置表单排序默认值
      item && (item.order = item.order ?? index + 2);

      // 初始化值
      initDefaultValue(item);
    });

    // 排序表单项
    schema.sort((a, b) => a.order! - b.order!);

    if (getProps.value.dynamicModel) {
      // 如果 schema 对应的 prop 不存在，则删除 model 中的对应的 prop
      Object.keys(model.value).forEach(key => {
        const isExist = schema.some(
          item =>
            item.prop === key || item.renderUseProp?.includes(key) || getProps.value.includeModelKeys?.includes(key)
        );
        if (!isExist) delete model.value[key];
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// 获取每个表单的宽度
const getComponentWidth = ({ width, props: componentProps }: FormColumnProps) => {
  const { elFormProps = {} } = getProps.value;
  const style = componentProps?.style || { width: "100%" }; // 默认宽度 100%
  if (width) return { ...style, width: addUnit(width) };
  if (elFormProps.fixWidth) return { ...style, width: addUnit(elFormProps.width || elFormProps.inline ? 220 : "100%") };
  return style;
};

// 计算属性：获取列的 props
const getColProps = (item: FormColumnProps) => {
  return {
    ...(item.span ? {} : { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }),
    ...getProps.value.colProps,
    ...item.col,
  };
};

// 判断是否是分隔线组件
const renderDivider = (item: FormColumnProps) => {
  const el = hyphenToCamelCase(item.el) || "";
  return el === ComponentNameEnum.EL_DIVIDER;
};

// 获取标题样式
const formatDividerTitle = (labelSize = "default") => {
  if (labelSize === "default") return { fontSize: "16px", fontWeight: 600 };
  if (labelSize === "small") return { fontSize: "14px", fontWeight: 600 };
  if (labelSize === "large") return { fontSize: "18px", fontWeight: 600 };

  return {};
};

// 设置 ProFormItem 的引用
const setProFormItemRef = (el: any, prop: string) => {
  if (el) proFormItemRefs.value[prop] = el;
};

type ProFormEmits = {
  register: [proFormRef?: ComponentPublicInstance | null | any, elFormRef?: FormInstance];
  validate: [prop: FormItemProp, isValid: boolean, message: string]; // ElForm 自带的事件
};

export type ProFormOnEmits = keyOnPrefix<ProFormEmits>;

// 定义 emit 事件
const emits = defineEmits<ProFormEmits>();

onMounted(() => {
  emits("register", elFormRef.value?.$parent, elFormRef.value);
});

// 设置 form 的值
const setValues = (data: Record<string, any> = {}) => {
  model.value = Object.assign(model.value, data);
};

// 设置 ProForm 组件的 props
const setProps = (props: Partial<ProFormProps> = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props);
};

// 设置 schema
const setSchema = (schemaSet: FormSetProps[]) => {
  const { schema } = getProps.value;
  for (const v of schema) {
    for (const item of schemaSet) {
      if (v.prop === item.prop) {
        setProp(v, item.field, item.value);
      }
    }
  }
};

// 添加 schema
const addSchema = (formSchema: FormColumnProps, prop?: number | string, position: "before" | "after" = "after") => {
  const { schema } = getProps.value;

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
  const { schema } = getProps.value;

  const index = schema.findIndex(item => item.prop === prop);
  if (index > -1) schema.splice(index, 1);
};

// 获取 formItem 实例
const getFormItemExpose = (prop: string) => {
  return proFormItemRefs.value[prop].formItemComponentsRef;
};

// 获取表单组件实例
const getComponentExpose = (prop: string) => {
  return proFormItemRefs.value[prop].formComponentRef;
};

defineExpose({
  form: elFormRef,
  model,
  setValues,
  setProps,
  setSchema,
  addSchema,
  delSchema,
  getFormItemExpose,
  getComponentExpose,
  getComponentWidth,
  parseLabel,
  isDestroy,
  isHidden,
});
</script>

<template>
  <el-form ref="elFormRef" v-bind="elFormProps" :model="model" :class="ns.b()">
    <slot
      :get-component-width="getComponentWidth"
      :parse-label="parseLabel"
      :is-destroy="isDestroy"
      :is-hidden="isHidden"
    >
      <template v-if="useCol">
        <el-row :gutter="20" v-bind="rowProps" style="width: 100%">
          <el-col v-for="item in filteredSchema" :key="item.prop" v-show="!isHidden(item)" v-bind="getColProps(item)">
            <el-divider v-if="renderDivider(item)" v-bind="item.props">
              <span :style="formatDividerTitle(item?.labelSize)">
                {{ parseLabel(item.label) }}
              </span>
            </el-divider>

            <ProFormItem v-else :ref="el => setProFormItemRef(el, item.prop)" v-bind="{ ...item }" />
          </el-col>
        </el-row>
      </template>

      <template v-else>
        <template v-for="item in filteredSchema" :key="item.prop">
          <el-divider v-if="renderDivider(item)" v-bind="item.props">
            <span :style="formatDividerTitle(item.labelSize)">
              {{ parseLabel(item.label) }}
            </span>
          </el-divider>

          <ProFormItem v-else v-bind="{ ...item }" v-show="!isHidden(item)" />
        </template>
      </template>

      <el-form-item v-if="$slots.operation">
        <slot name="operation" :model="model" />
      </el-form-item>
    </slot>
  </el-form>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
