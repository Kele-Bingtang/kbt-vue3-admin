<script setup lang="ts">
import type { FormColumn, FormSetProps, ProElFormProps } from "./types";
import type { FormInstance, RowProps, ColProps, FormItemProp } from "element-plus";
import type { FormOptionProps } from "@/components/pro/form-item";
import { shallowRef, ref, watch, unref, onMounted, computed } from "vue";
import { ElRow, ElCol, ElForm } from "element-plus";
import { ProFormItem, formatValue } from "@/components/pro/form-item";
import { useNamespace } from "@/composables";
import { isFunction, isPromise, isString } from "@/utils";
import { getProp, setProp, deleteObjProperty } from "./helper";

defineOptions({ name: "ProForm" });

export interface ProFormProps {
  column?: FormColumn[]; // 表单配置项
  elFormProps?: ProElFormProps | Recordable; // ElForm props
  useFlexLayout?: boolean; // 是否使用栅格布局
  rowProps?: Partial<RowProps>; // ElRow Props
  colProps?: Partial<ColProps>; // ElCol Props
  onlyRenderEl?: boolean; // 是否只渲染 ProFormItem 组件，只使用表单组件
  dynamicModel?: boolean; // 动态 model，如果 column 发生变化，则重新渲染 model 表单数据（将不存在 column 的 prop 从 model 中去掉），默认启用 true
  includeModelKeys?: string[]; // 搭配 dynamicModel 使用，清除 model 不存在的 prop 时，指定保留 prop
}

const props = withDefaults(defineProps<ProFormProps>(), {
  column: () => [],
  elFormProps: () => ({}),
  useFlexLayout: true,
  rowProps: () => ({}),
  colProps: () => ({}),
  onlyRenderEl: false,
  dynamicModel: true,
  includeModelKeys: () => [],
});

const ns = useNamespace("pro-form");

const model = defineModel<Recordable>({ default: () => ({}) });

// 存储 ElForm 实例
const elFormRef = useTemplateRef<FormInstance>("elFormRef");
// 存储表单组件实例
const proFormItemRefs = shallowRef<Record<string, InstanceType<typeof ProFormItem>>>({});

const mergeProps = ref<ProFormProps>({});

const getProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, mergeProps.value);

  return propsObj;
});

// 计算属性：过滤掉需要销毁的表单项
const filteredColumn = computed(() => getProps.value.column.filter(item => !destroyOrInit(item)));

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充下拉选择）
const enumMap = ref(new Map<string, FormOptionProps[] | ComputedRef<FormOptionProps[]>>());

const setEnumMap = async ({ options, prop, useCacheOptions = true }: FormColumn) => {
  if (!options) return;

  const enumMapConst = enumMap.value;

  // 如果当前 enumMap 存在相同的值 return & 开启缓存功能
  if (useCacheOptions && unref(enumMapConst.get(prop))?.length) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (isPromise(options)) return enumMapConst.set(prop, await options);
  if (!isFunction(options)) return enumMapConst.set(prop, options);

  // 为了防止接口执行慢，导致页面下拉等枚举数据无法填充，所以预先存储为 [] 方便获取，接口返回后再二次存储
  enumMapConst.set(prop!, []);

  const value = await options(model.value, enumMapConst);
  // 适配 enum 接口返回 data 以及自定义函数返回数组
  enumMapConst.set(prop, (value as any)?.data || value);
};

/**
 * 是否销毁表单项 & 是否初始化表单项默认值
 */
const destroyOrInit = (item: FormColumn) => {
  let destroy = item.destroy ?? false;
  if (isFunction(item.destroy)) destroy = item.destroy(model.value) ?? false;

  // 如果不销毁，则初始化表单默认值，反之则重置为空
  if (!destroy) initDefaultValue(item);
  else deleteObjProperty(model.value, item.prop);

  return destroy;
};

// 初始化默认值
const initDefaultValue = async ({ defaultValue, optionField, prop }: FormColumn) => {
  const modelConst = model.value;
  const value = getProp(modelConst, prop);

  // 如果有值，则不需要赋默认值
  if (value !== "" && value !== null && value !== undefined) return;

  const defaultValueConst = await formatValue<FormColumn["defaultValue"]>(defaultValue, [modelConst, enumMap.value]);

  if (defaultValueConst) return setProp(modelConst, prop, defaultValueConst);

  // 如果没有设置默认值，则判断字典里是否有 isDefault 为 Y 的枚举
  const enumData = unref(enumMap.value.get(prop));
  if (enumData?.length) {
    // 找出 isDefault 为 Y 的 value
    const data = enumData.find(item => item.isDefault === "Y");

    return data && setProp(modelConst, prop, data[optionField?.value ?? "value"]);
  }
};

// 监听表单结构化数组，重新组装 column
watch(
  filteredColumn,
  (column = []) => {
    const { dynamicModel, includeModelKeys } = getProps.value;

    column.forEach((item, index) => {
      // 设置枚举
      setEnumMap(item);

      // 设置表单排序默认值
      item && (item.order = item.order ?? index + 2);
      // 初始化值
      initDefaultValue(item);
    });

    // 排序表单项
    column.sort((a, b) => a.order! - b.order!);

    if (!dynamicModel) return;

    // 如果 column 对应的 prop 不存在，则删除 model 中的对应的 prop
    Object.keys(model.value).forEach(key => {
      const isExist = column.some(
        item => item.prop === key || item.renderUseProp?.includes(key) || includeModelKeys?.includes(key)
      );
      if (!isExist) delete model.value[key];
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

/**
 * 是否隐藏表单项
 */
const isHidden = (item: FormColumn) => {
  const { hidden } = item;
  if (isFunction(hidden)) return hidden(model.value) ?? false;
  return hidden;
};

// 获取 ElCol Props
const getColProps = (item: FormColumn) => {
  const { colProps } = getProps.value;
  return {
    ...(colProps.span ? {} : { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }),
    ...colProps,
    ...toValue(item.colProps),
  };
};

// 设置 ProFormItem 的引用
const setProFormItemRef = (el: any, prop: string) => {
  if (el) proFormItemRefs.value[prop] = el;
};

type ProFormEmits = {
  register: [proFormRef: any, elFormRef: FormInstance | null];
  validate: [prop: FormItemProp, isValid: boolean, message: string]; // ElForm 自带的事件
};

export type ProFormOnEmits = keyOnPrefix<ProFormEmits>;

// 定义 emit 事件
const emits = defineEmits<ProFormEmits>();

onMounted(() => {
  emits("register", elFormRef.value?.$parent || null, elFormRef.value);
});

// 设置 form 的值
const setValues = (modelValue: Recordable = {}) => {
  model.value = Object.assign(model.value, modelValue);
};

// 设置 ProForm 组件的 props
const setProps = (props: Partial<ProFormProps> = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props);
};

// 设置 column
const setColumn = (columnSet: FormSetProps[]) => {
  const { column } = getProps.value;
  for (const v of column) {
    for (const item of columnSet) {
      if (v.prop === item.prop) {
        setProp(v, item.field, item.value);
      }
    }
  }
};

// 添加 column
const addColumn = (formColumn: FormColumn, prop?: number | string, position: "before" | "after" = "after") => {
  const { column } = getProps.value;

  if (isString(prop)) {
    return column.forEach((s, i) => {
      if (s.prop === prop) position === "after" ? formColumn.splice(i + 1, 0, s) : formColumn.splice(i, 0, s);
    });
  }
  if (prop !== undefined) return column.splice(prop, 0, formColumn);
  return column.push(formColumn);
};

// 删除 column
const delColumn = (prop: string) => {
  const { column } = getProps.value;

  const index = column.findIndex(item => item.prop === prop);
  if (index > -1) column.splice(index, 1);
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
  setColumn,
  addColumn,
  delColumn,
  getFormItemExpose,
  getComponentExpose,
  destroyOrInit,
  isHidden,
});
</script>

<template>
  <el-form ref="elFormRef" v-bind="getProps.elFormProps" :model="model" :class="ns.b()">
    <slot>
      <el-row v-if="getProps.useFlexLayout" :gutter="20" v-bind="getProps.rowProps" style="width: 100%">
        <el-col v-for="item in filteredColumn" :key="item.prop" v-show="!isHidden(item)" v-bind="getColProps(item)">
          <ProFormItem
            :ref="el => setProFormItemRef(el, item.prop)"
            :model-value="getProp(model, item.prop)"
            @update:model-value="v => setProp(model, item.prop, v)"
            v-bind="{ width: elFormProps.width, ...item }"
            :option="enumMap.get(item.optionsProp || item.prop)"
          />
        </el-col>
      </el-row>

      <template v-else v-for="item in filteredColumn" :key="item.prop">
        <ProFormItem
          :ref="el => setProFormItemRef(el, item.prop)"
          :model-value="getProp(model, item.prop, item.valueFormat)"
          @update:modelValue="v => setProp(model, item.prop, v)"
          v-bind="item"
          v-show="!isHidden(item)"
        />
      </template>

      <slot name="footer" :model="model" />
    </slot>
  </el-form>
</template>
