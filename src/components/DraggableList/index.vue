<template>
  <div class="drag-list-component">
    <div class="drag-list" :style="{ width: leftWidth }">
      <slot name="leftTitle">{{ leftTitle }}</slot>
      <draggable
        :list="leftList"
        itemKey="id"
        class="drag-left-list"
        :class="dragClass.left"
        :group="group"
        v-bind="$attrs"
        @end="handleEnd($event, 'left')"
      >
        <template #item="{ element }">
          <div class="drag-list-item" @click="handleClick(element.id, 'left')">
            <slot name="left" :item="element">{{ element }}</slot>
            <div class="left-icon icon" @click="pushList(element, 'left')"><slot name="leftIcon"></slot></div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="drag-list" :style="{ width: rightWidth }">
      <slot name="rightTitle">{{ rightTitle }}</slot>
      <draggable
        :list="rightList"
        itemKey="id"
        class="drag-right-list"
        :class="dragClass.right"
        :group="group"
        v-bind="$attrs"
        @end="handleEnd($event, 'right')"
      >
        <template #item="{ element }">
          <div class="drag-list-item" @click="handleClick(element.id, 'right')">
            <slot name="right" :item="element">{{ element }}</slot>
            <div class="right-icon icon" @click="pushList(element, 'right')"><slot name="rightIcon"></slot></div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts" name="DraggableList">
import Draggable from "vuedraggable";

export interface DragClass {
  left: string[];
  right: string[];
}

export interface DragList {
  id: string;
  name: string;
}

interface DraggableListProps {
  leftList?: DragList[];
  rightList?: DragList[];
  leftTitle?: string;
  rightTitle?: string;
  leftWidth?: string;
  rightWidth?: string;
  dragClass?: {
    left: string[];
    right: string[];
  };
}

const props = withDefaults(defineProps<DraggableListProps>(), {
  leftList: () => [],
  rightList: () => [],
  leftTitle: "",
  rightTitle: "",
  leftWidth: "48%",
  rightWidth: "48%",
  dragClass: () => ({ left: [], right: [] }),
});

const emits = defineEmits(["on-change", "item-click"]);

const group = ref("drag_list");

const handleEnd = (e: Event, type: string) => {
  const srcClassName = (e.srcElement || (e.target as any)).classList[0];
  const targetClassName = (e as any).to.classList[0];
  let src = "";
  let target = "";
  if (srcClassName === targetClassName) {
    if (type === "left") {
      src = "left";
      target = "left";
    } else {
      src = "right";
      target = "right";
    }
  } else {
    if (type === "left") {
      src = "left";
      target = "right";
    } else {
      src = "right";
      target = "left";
    }
  }
  emits("on-change", {
    src: src,
    target: target,
    oldIndex: (e as any).oldIndex,
    newIndex: (e as any).newIndex,
  });
};

const handleClick = (id: string, type: string) => {
  emits("item-click", id, type);
};

const pushList = (list: DragList, type: string) => {
  const t1 = type === "left" ? "leftList" : "rightList"; // 点击的列表
  const t2 = type === "left" ? "rightList" : "leftList"; // 移入的列表
  const l = props[t1];
  for (const item of l) {
    if (item.id === list.id) {
      const index = l.indexOf(item);
      l.splice(index, 1);
      break;
    }
  }
  props[t2].push(list);
};
</script>

<style lang="scss" scoped>
.drag-list-component {
  height: 100%;
  .drag-list {
    height: 100%;
    float: left;
    .drag-list-item {
      position: relative;
      line-height: inherit;
      .icon {
        position: absolute;
        line-height: inherit;
        top: 50%;
        transform: translateY(-50%);
        right: 7px;
      }
    }
  }
}
</style>
