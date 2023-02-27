<template>
  <div class="drag-list-component">
    <div class="drag-list" :style="{ width: leftWidth }">
      <slot name="leftTitle">{{ leftTitle }}</slot>
      <draggable
        :list="leftList"
        class="drag-left-list"
        :class="dragClass.left"
        :group="group"
        v-bind="$attrs"
        @end="handleEnd($event, 'left')"
      >
        <template #item="{ item }">
          <slot name="left" :item="item">{{ item }}</slot>
          <div class="left-icon icon" @click="pushList(item, 'left')"><slot name="leftIcon"></slot></div>
        </template>
      </draggable>
    </div>
    <div class="drag-list" :style="{ width: rightWidth }">
      <slot name="rightTitle">{{ rightTitle }}</slot>
      <draggable
        :list="rightList"
        class="drag-right-list"
        :class="dragClass.right"
        :group="group"
        v-bind="$attrs"
        @end="handleEnd($event, 'right')"
      >
        <template #item="{ item }">
          <slot name="right" :item="item">{{ item }}</slot>
          <div class="right-icon icon" @click="pushList(item, 'right')"><slot name="rightIcon"></slot></div>
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
  leftList: DragList[];
  rightList: DragList[];
  leftTitle: string;
  rightTitle: string;
  leftWidth: string;
  rightWidth: string;
  dragClass: {
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

const emits = defineEmits(["on-change"]);

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
.draggable-list-container {
  width: 100%;
  height: 100%;
  padding: 20;
  .draggable-list-card {
    width: 100%;
    height: 100%;
    .drag-card {
      width: 40%;
      height: 100%;
      display: inline-block;
    }
  }
  .handle-card {
    display: inline-block;
    width: 220px;
    height: 100%;
    .handle-inner-card {
      p {
        padding: 7px 0;
        margin: 0 7px;
        border-bottom: 1px dashed #eeeeee;
      }
    }
  }
  .res-show-card {
    display: inline-block;
    margin-left: 20px;
    width: 370px;
    height: 100%;
  }
}
</style>
<style lang="scss">
.draggable-list-container {
  .draggable-list-card {
    .el-card__body {
      width: 100%;
      height: 100%;
    }
  }
  .drag-box {
    margin-right: 10px;
    height: calc(100% - 60px);
  }
}
</style>
