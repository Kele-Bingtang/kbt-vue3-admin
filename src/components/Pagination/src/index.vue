<template>
  <div :class="[prefixClass, { hidden: hidden }]" class="pagination-component">
    <el-pagination
      :background="background"
      v-model:current-page="pageObj.pageNum"
      v-model:page-size="pageObj.pageSize"
      :page-sizes="pageObj.pageSizes"
      :layout="layout"
      :total="modelValue.total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { scrollTo } from "@/utils";
import { reactive, toRef, nextTick, defineOptions, defineEmits, defineProps, unref } from "vue";

export const pageSetting = { pageNum: 1, pageSizes: [10, 20, 50, 100, 200], pageSize: 20 };
</script>

<script setup lang="ts" name="Pagination">
import { useDesign } from "@/hooks";

export interface Paging {
  pageNum: number; // 当前页
  pageSizes?: number[]; // 页数数组
  pageSize: number; // 一页显示多少条数据
  total?: number; // 总数
}

export interface PaginationProps {
  modelValue?: Paging; // 分页信息
  layout?: string; // 布局
  background?: boolean; // 是否开启背景色
  autoScroll?: boolean; // 切换页数，是否自动滚动到最上面
  hidden?: boolean; // 是否不显示分页
  reset?: boolean; // 切换 pageSize，pageNum 重置为 1
}

defineOptions({ name: "Pagination" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("pagination");

const props = withDefaults(defineProps<PaginationProps>(), {
  modelValue: () => reactive(pageSetting),
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  autoScroll: true,
  hidden: false,
  reset: true,
});

type PaginationEmits = {
  "update:modelValue": [value: Paging];
  pagination: [value: Paging];
};

const emits = defineEmits<PaginationEmits>();

const pageObj = toRef(props, "modelValue");

if (!unref(pageObj).pageNum) pageObj.value.pageNum = pageSetting.pageNum;
if (!unref(pageObj).pageSizes) pageObj.value.pageSizes = pageSetting.pageSizes;
if (!unref(pageObj).pageSize) pageObj.value.pageSize = pageSetting.pageSize;

const handleSizeChange = (value: number) => {
  if (props.reset) handleCurrentChange(1);
  pageObj.value.pageSize = value;
  afterChange();
};

const handleCurrentChange = (value: number) => {
  pageObj.value.pageNum = value;
  afterChange();
};

const afterChange = () => {
  emits("update:modelValue", unref(pageObj));
  emits("pagination", unref(pageObj));
  if (props.autoScroll) {
    nextTick(() => {
      scrollTo("el-table__body-wrapper", 0, 700);
      scrollTo("el-main", 0, 700);
    });
  }
};

defineExpose({ paging: pageSetting });
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-pagination;

.#{$prefix-class} {
  padding: 32px 16px;
  background: #ffffff;

  &.hidden {
    display: none;
  }
}
</style>
