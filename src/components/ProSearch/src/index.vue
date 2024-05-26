<template>
  <div v-if="schema.length" :class="`card ${prefixClass}`">
    <ProForm :schema="schemaForm" v-model="model">
      <template #default="{ parseLabel, getComponentWidth }">
        <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCols">
          <GridItem v-for="(item, index) in schemaForm" :key="item.prop" v-bind="getResponsive(item)" :index="index">
            <el-form-item v-show="!item.isHidden" :label="parseLabel(item.label)">
              <ProFormItem :column="item" v-model="model" :style="getComponentWidth(item)" />
            </el-form-item>
          </GridItem>

          <GridItem suffix>
            <div :class="`${prefixClass}__operation`">
              <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
              <el-button :icon="Delete" @click="reset">重置</el-button>
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
} from "@/components";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";
import type { FormItemProps } from "element-plus";

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

interface ProSearchProps {
  schema: ProSearchSchemaProps[]; // 搜索配置列
  searchCols?: number | Record<BreakPoint, number>;
  search?: (params: any) => void; // 搜索方法
  reset?: (params: any) => void; // 重置方法
}

const schemaForm = computed(() => props.schema);

// 搜索参数
const model = defineModel<Record<string, any>>({ required: true });

// 默认值
const props = withDefaults(defineProps<ProSearchProps>(), {
  schema: () => [],
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
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
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => unref(gridRef)?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.schema.reduce((prev, current) => {
    prev +=
      ((current.grid && current.grid[unref(breakPoint)]?.span) ?? current.grid?.span ?? 1) +
      ((current.grid && current.grid[unref(breakPoint)]?.offset) ?? current.grid?.offset ?? 0);

    if (typeof props.searchCols !== "number") {
      if (prev >= props.searchCols[unref(breakPoint)]) show = true;
    } else {
      if (prev >= props.searchCols) show = true;
    }
    return prev;
  }, 0);
  return show;
});
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
