<template>
  <div class="draggable-item-container">
    <DraggableItem :key="1" :list="listData1" :group="group" title-bg-color="#4A9FF9" title="Todo">
      <template #content="{ item }">
        {{ item.name }}
      </template>
    </DraggableItem>
    <DraggableItem :key="2" :list="listData2" :group="group" title-bg-color="#F9944A">
      <template #title>Working</template>
      <template #content="{ item }">
        {{ item.name }}
      </template>
    </DraggableItem>
    <DraggableItem :key="3" :list="listData3" :group="group" title-bg-color="#2AC06D">
      <template #title>Done</template>
      <template #content="{ item }">
        {{ item.name }}
      </template>
    </DraggableItem>
  </div>
</template>

<script setup lang="ts" name="DraggableItemDemo">
import DraggableItem from "@/components/DraggableItem/index.vue";
import { list1, list2, list3 } from "@/mock/drag-item";

const group = ref("drag_item");
const listData1 = ref(list1);
const listData2 = ref(list2);
const listData3 = ref(list3);
</script>

<style lang="scss" scoped>
.draggable-item-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  width: 1000px;
  height: 100%;
  padding: 20px;
  margin-left: 20px;
}
</style>
