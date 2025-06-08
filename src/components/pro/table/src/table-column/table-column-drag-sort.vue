<script setup lang="ts">
import type { TableInstance } from "element-plus";
import Sortable from "sortablejs";
import { DCaret } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "TableColumnDragSort" });

interface TableColumnDragSortProps {
  sortable?: boolean;
  tableInstance?: Ref<TableInstance> | TableInstance;
}

export interface ProTableEmits {
  dragSortEnd: [newIndex: number, oldIndex: number];
}

const props = withDefaults(defineProps<TableColumnDragSortProps>(), {
  sortable: true,
  tableInstance: undefined,
});

const emits = defineEmits<ProTableEmits>();

const ns = useNamespace("table-column-drag-sort");

onMounted(() => {
  if (props.tableInstance && props.sortable) dragSort();
});

watch(
  () => props.tableInstance,
  val => {
    if (val && props.sortable) dragSort();
  }
);

// 拖拽排序
const dragSort = () => {
  const tbody = unref(props.tableInstance)?.$el?.querySelector(
    `.${ns.elNamespace}-table__body-wrapper tbody`
  ) as HTMLElement;
  if (!tbody) return;

  Sortable.create(tbody, {
    handle: `.${ns.e("icon")}`,
    animation: 300,
    group: "table-column",
    easing: "cubic-bezier(1, 0, 0, 1)",
    chosenClass: "table-column-sortable-chosen",
    onEnd({ newIndex, oldIndex }) {
      if (newIndex !== undefined && oldIndex !== undefined) {
        emits("dragSortEnd", newIndex, oldIndex);
      }
    },
  });
};
</script>

<template>
  <el-table-column width="60" v-bind="$attrs">
    <span :class="ns.e('icon')" style="cursor: e-resize">
      <slot name="drag-sort-icon">
        <el-icon><DCaret /></el-icon>
      </slot>
    </span>
  </el-table-column>
</template>
