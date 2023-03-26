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

<script setup lang="ts" name="DraggableItem">
import Draggable from "vuedraggable";

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
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .drag-item-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .drag-item-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 20%);
    }
  }
}
</style>
