<template>
  <div class="drag-table-container">
    <p>循环 table-column 可以实现列和行拖拽</p>
    <!-- 实现行拖拽, 必须指定 row-key 为一条数据的唯一值 -->
    <el-table ref="draggableTable1" :data="tableData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column
        v-for="(item, index) in col"
        :key="`col_${index}`"
        :prop="dropCol[index].prop"
        :label="item.label"
        :type="item.type"
        :width="item.width"
      >
        <template #default="scope">
          <template v-if="dropCol[index].prop === 'status'">
            <el-tag :type="tableStatusFilter(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
          <template v-else>
            {{ scope.row[dropCol[index].prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <p>完整 table-column 只能实现行拖拽</p>
    <el-table ref="draggableTable2" :data="tableData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="tableStatusFilter(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="DragTable">
import Sortable from "sortablejs";
import { simpleData } from "@/test/table";

interface ColItem {
  label: string;
  prop: string;
  type?: string;
  width?: string;
}

const col: Array<ColItem> = [
  {
    label: "ID",
    prop: "id",
    width: "50",
  },
  {
    label: "姓名",
    prop: "name",
  },
  {
    label: "日期",
    prop: "date",
  },

  {
    label: "地址",
    prop: "address",
  },
  {
    label: "状态",
    prop: "status",
  },
];
const draggableTable1 = ref();
const draggableTable2 = ref();
const dropCol = ref<ColItem[]>([]);
const tableData = ref(simpleData);
const sortable = shallowRef();

onMounted(() => {
  dropCol.value = [...col];
  nextTick(() => {
    rowDrop();
    columnDrop();
    rowDrop2();
  });
});

// 循环 table-column 行拖拽
const rowDrop = () => {
  const el = draggableTable1.value.$el.querySelector(
    ".el-table__body-wrapper .el-scrollbar__view > table > tbody"
  ) as HTMLElement;
  sortable.value = Sortable.create(el, {
    ghostClass: "sortable-ghost",
    onEnd: (evt: any) => {
      if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
        // 删除选择的行，并获取
        const targetRow = tableData.value.splice(evt.oldIndex, 1)[0];
        // 获取的行插入到新的地方
        tableData.value.splice(evt.newIndex, 0, targetRow);
      }
    },
  });
};
// 列拖拽
const columnDrop = () => {
  const el = draggableTable1.value.$el.querySelector(".el-table__header tr") as HTMLElement;
  sortable.value = Sortable.create(el, {
    animation: 180,
    delay: 0,
    onEnd: (evt: any) => {
      if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
        const targetItem = dropCol.value.splice(evt.oldIndex, 1)[0];
        dropCol.value.splice(evt.newIndex, 0, targetItem);
      }
    },
  });
};

// 完整 table-column 行拖拽
const rowDrop2 = () => {
  const el = draggableTable2.value.$el.querySelector(
    ".el-table__body-wrapper .el-scrollbar__view > table > tbody"
  ) as HTMLElement;
  sortable.value = Sortable.create(el, {
    ghostClass: "sortable-ghost",
    onEnd: (evt: any) => {
      if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
        // 删除选择的行，并获取
        const targetRow = tableData.value.splice(evt.oldIndex, 1)[0];
        // 获取的行插入到新的地方
        tableData.value.splice(evt.newIndex, 0, targetRow);
      }
    },
  });
};

const tableStatusFilter = (status: string): "success" | "info" | "danger" => {
  const statusMap: { [key: string]: "success" | "info" | "danger" } = {
    Enable: "success",
    Disable: "info",
    Deleted: "danger",
  };
  return statusMap[status];
};
</script>

<style lang="scss" scoped>
.drag-table-container {
  padding: 20px;
  background-color: #fff;
}
</style>

<style lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
