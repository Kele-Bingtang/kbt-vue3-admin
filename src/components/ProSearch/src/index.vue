<template>
  <div v-if="schema.length" :class="`card ${prefixClass}`">
    <ProForm :schema="schemaForm" v-model="model" @register="formRegister" @validate="onFormValidate">
      <template #default="{ parseLabel, getComponentWidth, isDestroy, isHidden }">
        <Grid
          ref="gridRef"
          :collapsed="getProps.useCollapsed ? getProps.collapsed : false"
          :cols="getProps.searchCols"
          :gap="getProps.gap"
          :collapsedRows="getProps.collapsedRows"
        >
          <template v-for="(item, index) in schemaForm" :key="item.prop">
            <GridItem v-if="!isDestroy(item)" v-bind="getResponsive(item)" :index="index">
              <el-form-item v-show="!isHidden(item)" :label="parseLabel(item.label)">
                <ProFormItem :column="item" v-model="model" :style="getComponentWidth(item)" />
              </el-form-item>
            </GridItem>
          </template>

          <GridItem v-if="getProps.useCollapsed" :suffix="isRightPosition" :span="isBlock ? rowSpan : 1">
            <div :style="style">
              <slot name="action" :model="model" :showCollapse="showCollapse" :toggleCollapsed="toggleCollapsed">
                <el-button
                  v-if="getProps.showSearch"
                  type="primary"
                  :icon="Search"
                  @click="emits('search', model)"
                  :loading="getProps.searchLoading"
                >
                  搜索
                </el-button>
                <el-button
                  v-if="getProps.showReset"
                  :icon="Delete"
                  @click="emits('reset', model)"
                  :loading="getProps.resetLoading"
                >
                  重置
                </el-button>
                <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="toggleCollapsed()">
                  {{ getProps.collapsed ? "展开" : "折叠" }}
                  <el-icon class="el-icon--right">
                    <component :is="getProps.collapsed ? ArrowDown : ArrowUp"></component>
                  </el-icon>
                </el-button>
              </slot>
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
  useProForm,
  type FormSetProps,
  setFormProp,
  type GridInstance,
  type GridItemProps,
} from "@/components";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";
import type { FormItemProp, FormItemProps } from "element-plus";
import { isString } from "@/components/ProForm/src/helper";

defineOptions({ name: "ProSearch" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("search-form");

export type ProSearchExpose = typeof defaultExpose;

export type ActionPosition = "left" | "right" | "block-left" | "block-center" | "block-right";

export type ProSearchSchemaProps = FormSchemaProps & {
  formItem?: Partial<FormItemProps>; // ElFormItem 的 props
  grid?: Partial<GridItemProps>; // GridItem 的 props
};

export interface ProSearchProps {
  modeValue?: Record<string, any>; // 搜索表单值
  schema?: ProSearchSchemaProps[]; // 搜索配置列
  position?: ActionPosition; // Action 位置，block 代表换行
  useCollapsed?: boolean; // 是否使用折叠功能
  searchCols?: number | Record<BreakPoint, number>; // 响应式布局
  collapsed?: boolean; // 是否默认折叠搜索项
  collapsedRows?: number; // 可见的行数
  gap?: [number, number] | number; // 行和列间距
  showSearch?: boolean; // 是否展示搜索按钮
  showReset?: boolean; // 是否展示重置按钮
  searchLoading?: boolean; // 搜索按钮的 loading
  resetLoading?: boolean; // 搜索按钮的 loading
}

// 默认值
const props = withDefaults(defineProps<ProSearchProps>(), {
  modeValue: () => ({}),
  schema: () => [],
  position: "right",
  useCollapsed: true,
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  collapsed: true,
  collapsedRows: 1,
  gap: () => [20, 0],
  showSearch: true,
  showReset: true,
  searchLoading: false,
  resetLoading: false,
});

const emits = defineEmits<{
  search: [params: Record<string, any>]; // 搜索方法
  reset: [params: Record<string, any>]; // 重置方法
  register: [expose: ProSearchExpose]; // 注册方法
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

// 获取响应式断点
const gridRef = shallowRef<GridInstance>();
const breakPoint = computed<BreakPoint>(() => unref(gridRef)?.breakPoint || "xl");

const rowSpan = computed(() => unref(getProps).searchCols[unref(breakPoint)]);

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

const isRightPosition = computed(() => {
  const { position } = unref(getProps);
  return position === "right";
});

const isBlock = computed(() => {
  const { position = "right" } = unref(getProps);
  return ["block-left", "block-center", "block-right"].includes(position);
});

const style = computed(() => {
  const { position = "right" } = unref(getProps);
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "18px",
  };
  if (["block-left", "left"].includes(position)) return { ...style, justifyContent: "flex-start" };
  if (["block-center"].includes(position)) return { ...style, justifyContent: "center" };
  if (["block-right", "right"].includes(position)) return { ...style, justifyContent: "flex-end" };
  return style;
});

const onFormValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emits("validate", prop, isValid, message);
};

const toggleCollapsed = (isCollapsed?: boolean) => {
  const { collapsed } = unref(getProps);

  if (isCollapsed === undefined) return setProps({ collapsed: !collapsed });
  return setProps({ collapsed: isCollapsed });
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
}
</style>
