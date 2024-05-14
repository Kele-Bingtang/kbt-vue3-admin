<template>
  <div class="drag-item-component">
    <div class="drag-item-header" :class="titleClass" :style="{ backgroundColor: titleBgColor }">
      <slot name="title">{{ title }}</slot>
    </div>
    <draggable :list="list" v-bind="$attrs" class="drag-item-content" :class="dragClass" itemKey="id">
      <template #item="{ element }">
        <div class="item">
          <slot name="content" :item="element">{{ element }}</slot>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import { defineOptions } from "vue";

defineOptions({ name: "DraggableItem" });

export interface DragItemList {
  id: string;
  name: string;
}

interface DraggableItemProps {
  title?: string;
  list?: Array<DragItemList>;
  titleBgColor?: string;
  titleClass?: string;
  dragClass?: string;
}

withDefaults(defineProps<DraggableItemProps>(), {
  title: "header",
  list: () => [],
  titleBgColor: "",
  titleClass: "",
  dragClass: "",
});
</script>

<style lang="scss" scoped>
.drag-item-component {
  min-width: 300px;
  height: auto;
  min-height: 100px;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .drag-item-header {
    height: 50px;
    padding: 0 20px;
    overflow: hidden;
    line-height: 50px;
    color: #ffffff;
    text-align: center;
    background: #333333;
    border-radius: 3px 3px 0 0;
  }

  .drag-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: auto;
    min-height: 60px;
    overflow: hidden;
    border: 10px solid transparent;

    .item {
      box-sizing: border-box;
      width: 100%;
      height: 64px;
      padding: 5px 10px;
      margin: 5px 0;
      line-height: 54px;
      text-align: left;
      cursor: pointer;
      background-color: #ffffff;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 20%);
    }
  }
}
</style>
