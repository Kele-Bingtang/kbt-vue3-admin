<template>
  <div :class="prefixClass">
    <div :class="`${prefixClass}__content`" :style="{ width: leftWidth }">
      <slot name="leftTitle">{{ leftTitle }}</slot>
      <draggable
        :list="leftList"
        itemKey="id"
        :class="`${prefixClass}__content--left ${dragClass.left}`"
        :group="group"
        v-bind="$attrs"
        @end="handleEnd($event, 'left')"
      >
        <template #item="{ element }">
          <div :class="`${prefixClass}__content--item`" @click="handleClick(element.id, 'left')">
            <slot name="left" :item="element">{{ element }}</slot>
            <div :class="`${prefixClass}__item--left__icon icon`" @click="pushList(element, 'left')">
              <slot name="leftIcon"></slot>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div :class="`${prefixClass}__content`" :style="{ width: rightWidth }">
      <slot name="rightTitle">{{ rightTitle }}</slot>
      <draggable
        :list="rightList"
        itemKey="id"
        :class="`${prefixClass}__content--right ${dragClass.right}`"
        :group="group"
        v-bind="$attrs"
        @end="handleEnd($event, 'right')"
      >
        <template #item="{ element }">
          <div :class="`${prefixClass}__content--item`" @click="handleClick(element.id, 'right')">
            <slot name="right" :item="element">{{ element }}</slot>
            <div :class="`${prefixClass}__item--right__icon icon`" @click="pushList(element, 'right')">
              <slot name="rightIcon"></slot>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineOptions } from "vue";
import Draggable from "vuedraggable";
import { useDesign } from "@/hooks";

defineOptions({ name: "DraggableList" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("drag-list");

export interface DragClass {
  left: string[];
  right: string[];
}

export interface DragList {
  id: string;
  name: string;
}

interface DraggableListProps {
  leftList?: DragList[]; // 左侧数据
  rightList?: DragList[]; // 右侧数据
  leftTitle?: string; // 左侧标题
  rightTitle?: string; // 右侧标题
  leftWidth?: string; // 左侧宽度
  rightWidth?: string; // 右侧宽度
  // 拖拽元素 class
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

type DraggableListEmits = {
  onChange: [value: { src: string; target: string; oldIndex: number; newIndex: number }];
  itemClick: [id: string, type: string];
};

const emits = defineEmits<DraggableListEmits>();

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
  emits("onChange", {
    src: src,
    target: target,
    oldIndex: (e as any).oldIndex,
    newIndex: (e as any).newIndex,
  });
};

const handleClick = (id: string, type: string) => {
  emits("itemClick", id, type);
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
$prefix-class: #{$admin-namespace}-drag-list;
.#{$prefix-class} {
  height: 100%;

  &__content {
    float: left;
    height: 100%;

    &--item {
      position: relative;
      line-height: inherit;

      .icon {
        position: absolute;
        top: 50%;
        right: 7px;
        line-height: inherit;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
