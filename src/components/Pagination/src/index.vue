<template>
  <div :class="{ hidden: hidden }" class="pagination-component">
    <el-pagination
      :background="background"
      v-model:current-page="pageObj.currentPage"
      v-model:page-size="pageObj.pageSize"
      :page-sizes="pageObj.pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { scrollTo } from "@/utils";
import { reactive, toRef, nextTick, defineOptions } from "vue";

defineOptions({ name: "MaterialInput" });

export const pageSetting = { currentPage: 1, pageSizes: [10, 20, 50, 100, 200], pageSize: 20 };
</script>

<script setup lang="ts" name="Pagination">
export interface Paging {
  currentPage: number; // 当前页
  pageSizes: number[]; // 页数数组
  pageSize: number; // 一页显示多少条数据
}

export interface PaginationProps {
  total: number; // 总页数
  modelValue?: Paging; // 分页信息
  layout?: string; // 布局
  background?: boolean; // 是否开启背景色
  autoScroll?: boolean; // 切换页数，是否自动滚动到最上面
  hidden?: boolean; // 是否不显示分页
  reset?: boolean; // 切换 pageSize，currentPage 重置为 1
}

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

const handleSizeChange = (value: number) => {
  if (props.reset) handleCurrentChange(1);
  pageObj.value.pageSize = value;
  emits("update:modelValue", pageObj.value);
  emits("pagination", props.modelValue);
  nextTick(() => {
    if (props.autoScroll) {
      scrollTo("el-table__body-wrapper", 0, 700);
      scrollTo("el-main", 0, 700);
    }
  });
};

const handleCurrentChange = (value: number) => {
  pageObj.value.currentPage = value;
  emits("update:modelValue", pageObj.value);
  emits("pagination", props.modelValue);
  nextTick(() => {
    if (props.autoScroll) {
      scrollTo("el-table__body-wrapper", 0, 700);
      scrollTo("el-main", 0, 700);
    }
  });
};

defineExpose({ paging: pageSetting });
</script>

<style lang="scss" scoped>
.pagination-component {
  padding: 32px 16px;
  background: #ffffff;
}

.pagination-component.hidden {
  display: none;
}
</style>
