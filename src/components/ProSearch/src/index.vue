<template>
  <div v-if="schema.length" :class="`card ${prefixClass}`">
    <ProForm :schema="schemaForm" v-model="model" @register="formRegister" @validate="onFormValidate">
      <template #default="{ parseLabel, getComponentWidth }">
        <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCols">
          <GridItem v-for="(item, index) in schemaForm" :key="item.prop" v-bind="getResponsive(item)" :index="index">
            <el-form-item v-show="!item.isHidden" :label="parseLabel(item.label)">
              <ProFormItem :column="item" v-model="model" :style="getComponentWidth(item)" />
            </el-form-item>
          </GridItem>

          <GridItem suffix>
            <div :class="`${prefixClass}__operation`">
              <el-button type="primary" :icon="Search" @click="emits('search', model)">搜索</el-button>
              <el-button :icon="Delete" @click="emits('reset', model)">重置</el-button>
              <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
                {{ collapsed ? "展开" : "折叠" }}
                <el-icon class="el-icon--right"><component :is="collapsed ? ArrowDown : ArrowUp"></component></el-icon>
              </el-button>
            </div>
          </GridItem>
        </Grid>
      </template>
    </ProForm>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineOptions, unref } from "vue";
import {
  Grid,
  GridItem,
  ProForm,
  ProFormItem,
  type FormSchemaProps,
  type BreakPoint,
  type Responsive,
  useProForm,
  type FormSetProps,
  setFormProp,
  type GridInstance,
} from "@/components";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";
import type { FormItemProp, FormItemProps } from "element-plus";
import { isString } from "@/components/ProForm/src/helper";

defineOptions({ name: "ProSearch" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("search-form");

export type ProSearchSchemaProps = FormSchemaProps & {
  formItem?: Partial<FormItemProps>;
  grid?: Partial<Record<BreakPoint, Responsive>> & {
    span?: number; // 搜索项所占用的列数，默认为 1 列
    offset?: number; // 搜索字段左侧偏移列数
  };
};

export interface ProSearchProps {
  modeValue?: Record<string, any>;
  schema?: ProSearchSchemaProps[]; // 搜索配置列
  searchCols?: number | Record<BreakPoint, number>;
}

// 默认值
const props = withDefaults(defineProps<ProSearchProps>(), {
  modeValue: () => ({}),
  schema: () => [],
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
});

const emits = defineEmits<{
  search: [params: Record<string, any>]; // 搜索方法
  reset: [params: Record<string, any>]; // 重置方法
  register: [expose: typeof defaultExpose]; // 注册方法
  validate: [prop: FormItemProp, isValid: boolean, message: string]; // ElForm 触发验证事件
}>();

const schemaForm = computed(() => props.schema);

// 搜索参数
const model = defineModel<Record<string, any>>({ required: true });

const { formRegister, formMethods } = useProForm();
const { getElFormExpose, getFormData, getFormExpose } = formMethods;

const mergeProps = ref<ProSearchProps>({});

const getProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, unref(mergeProps));
  return propsObj;
});

// 获取响应式设置
const getResponsive = (item: ProSearchSchemaProps) => {
  return {
    span: item.grid?.span,
    offset: item.grid?.offset ?? 0,
    xs: item.grid?.xs,
    sm: item.grid?.sm,
    md: item.grid?.md,
    lg: item.grid?.lg,
    xl: item.grid?.xl,
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = shallowRef<GridInstance>();
const breakPoint = computed<BreakPoint>(() => unref(gridRef)?.breakPoint || "xl");

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  const { schema, searchCols } = unref(getProps);

  let show = false;
  schema.reduce((prev, current) => {
    prev +=
      ((current.grid && current.grid[unref(breakPoint)]?.span) ?? current.grid?.span ?? 1) +
      ((current.grid && current.grid[unref(breakPoint)]?.offset) ?? current.grid?.offset ?? 0);

    if (typeof searchCols !== "number") {
      if (prev >= searchCols[unref(breakPoint)]) show = true;
    } else {
      if (prev >= searchCols) show = true;
    }
    return prev;
  }, 0);
  return show;
});

const onFormValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emits("validate", prop, isValid, message);
};

const toggleCollapsed = (isCollapsed?: boolean) => {
  if (isCollapsed === undefined) return (collapsed.value = !unref(collapsed));
  collapsed.value = isCollapsed;
};

// 设置 form 的值
const setValues = async (data: Record<string, any> = {}) => {
  model.value = Object.assign(unref(model), data);
  const formExpose = await getFormExpose();
  formExpose?.setValues(data);
};

// 设置 ProForm 组件的 props
const setProps = (props: ProSearchProps = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props);
};

// 设置 schema
const setSchema = (schemaProps: FormSetProps[]) => {
  const { schema } = unref(getProps);
  for (const v of schema) {
    for (const item of schemaProps) {
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
  if (index > -1) {
    schema.splice(index, 1);
  }
};

const defaultExpose = {
  getElFormExpose,
  getFormData,
  toggleCollapsed,
  setProps,
  setSchema,
  setValues,
  delSchema,
  addSchema,
};

onMounted(() => {
  emits("register", defaultExpose);
});

defineExpose(defaultExpose);
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-search-form;

.#{$prefix-class} {
  padding: 18px 18px 0;
  margin-bottom: 10px;

  &__operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 18px;
  }
}
</style>
