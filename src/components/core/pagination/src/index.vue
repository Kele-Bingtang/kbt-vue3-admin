<script lang="ts">
import { scrollTo } from "@/utils";
import { nextTick } from "vue";
import { ElPagination } from "element-plus";

export const pageSetting = { pageNum: 1, pageSizes: [10, 20, 50, 100, 200], pageSize: 20 };
</script>

<script setup lang="ts">
import { useNamespace } from "@/composables";

export interface Paging {
  pageNum: number; // 当前页
  pageSizes?: number[]; // 页数数组
  pageSize: number; // 一页显示多少条数据
  total?: number; // 总数
}

export interface PaginationProps {
  layout?: string; // 布局
  background?: boolean; // 是否开启背景色
  autoScroll?: boolean; // 切换页数，是否自动滚动到最上面
  hidden?: boolean; // 是否不显示分页
  reset?: boolean; // 切换 pageSize，pageNum 重置为 1
}

defineOptions({ name: "Pagination" });

const ns = useNamespace("pagination");

const props = withDefaults(defineProps<PaginationProps>(), {
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  autoScroll: true,
  hidden: false,
  reset: true,
});

type PaginationEmits = {
  pagination: [value: Paging];
};

const emits = defineEmits<PaginationEmits>();

const pageObj = defineModel<Paging>({ required: true });

if (!pageObj.value.pageNum) pageObj.value.pageNum = pageSetting.pageNum;
if (!pageObj.value.pageSizes) pageObj.value.pageSizes = pageSetting.pageSizes;
if (!pageObj.value.pageSize) pageObj.value.pageSize = pageSetting.pageSize;

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
  emits("pagination", pageObj.value);
  if (props.autoScroll) {
    nextTick(() => {
      scrollTo(`${ns.elNamespace}-table__body-wrapper`, 0, 700);
      scrollTo(`${ns.elNamespace}-main`, 0, 700);
    });
  }
};

defineExpose({ paging: pageSetting });
</script>

<template>
  <div :class="[ns.b(), ns.is('hidden', hidden)]">
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

<style lang="scss" scoped>
@use "./index";
</style>
