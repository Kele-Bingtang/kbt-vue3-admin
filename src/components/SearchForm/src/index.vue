<template>
  <div v-if="columns.length" :class="`card ${prefixClass}`">
    <el-form ref="formRef" :model="searchParam">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCols">
        <GridItem v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
          <el-form-item :label="`${item.label} :`">
            <SearchFormItem :column="item" :search-param="searchParam" />
          </el-form-item>
        </GridItem>

        <GridItem suffix>
          <div :class="`${prefixClass}__operation`">
            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
            <el-button :icon="Delete" @click="reset">重置</el-button>
            <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
              {{ collapsed ? "展开" : "合并" }}
              <el-icon class="el-icon--right"><component :is="collapsed ? ArrowDown : ArrowUp"></component></el-icon>
            </el-button>
          </div>
        </GridItem>
      </Grid>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineOptions, unref } from "vue";
import { Grid, GridItem, type TableColumnProps, type BreakPoint } from "@/components";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import SearchFormItem from "./components/SearchFormItem.vue";
import { useDesign } from "@/hooks";

defineOptions({ name: "SearchForm" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("search-form");

interface SearchFormProps {
  columns?: TableColumnProps[]; // 搜索配置列
  searchParam?: { [key: string]: any }; // 搜索参数
  searchCols: number | Record<BreakPoint, number>;
  search: (params: any) => void; // 搜索方法
  reset: (params: any) => void; // 重置方法
}

// 默认值
const props = withDefaults(defineProps<SearchFormProps>(), { columns: () => [], searchParam: () => ({}) });

// 获取响应式设置
const getResponsive = (item: TableColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl,
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
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![unref(breakPoint)]?.span ?? current.search?.span ?? 1) +
      (current.search![unref(breakPoint)]?.offset ?? current.search?.offset ?? 0);

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
$prefix-class: #{$namespace}-search-form;

.#{$prefix-class} {
  padding: 18px 18px 0;
  margin-bottom: 10px;

  .#{$el-namespace}-form {
    .#{$el-namespace}-form-item__content > * {
      width: 100%;
    }

    // 去除时间选择器上下 padding
    .#{$el-namespace}-range-editor.#{$el-namespace}-input__wrapper {
      padding: 0 10px;
    }
  }

  &__operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 18px;
  }
}
</style>
