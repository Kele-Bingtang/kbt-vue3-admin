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
import { scrollTo } from "@/utils/layout/scrollTo";

export const pageSetting = {
  currentPage: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: 20,
};
</script>

<script setup lang="ts" name="Pagination">
export interface Paging {
  currentPage: number;
  pageSizes: number[];
  pageSize: number;
}

export interface PaginationProps {
  total: number;
  paging?: Paging;
  layout?: string;
  background?: boolean;
  autoScroll?: boolean;
  hidden?: boolean;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  paging: () => pageSetting,
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  autoScroll: true,
  hidden: false,
});

type PaginationEmitProps = {
  (e: "pagination", value: Paging): void;
};

const emits = defineEmits<PaginationEmitProps>();
const pageObj = toRef(props, "paging");

const handleSizeChange = (value: number) => {
  pageObj.value.pageSize = value;
  emits("pagination", props.paging);
  nextTick(() => {
    if (props.autoScroll) {
      scrollTo("el-table__body-wrapper", 0, 700);
      scrollTo("el-main", 0, 700);
    }
  });
};

const handleCurrentChange = (value: number) => {
  pageObj.value.currentPage = value;
  emits("pagination", props.paging);
  nextTick(() => {
    if (props.autoScroll) {
      scrollTo("el-table__body-wrapper", 0, 700);
      scrollTo("el-main", 0, 700);
    }
  });
};
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
