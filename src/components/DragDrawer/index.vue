<template>
  <div class="drag-drawer-component">
    <el-drawer
      ref="drawerWrapperRef"
      :title="title"
      v-model="drawerVisible"
      :size="width"
      :direction="direction"
      :before-close="handleBeforeClose"
      v-bind="$attrs"
      :class="outerClasses"
    >
      <template #header>
        <slot name="header"></slot>
      </template>
      <slot></slot>
      <div
        v-if="draggable"
        :style="triggerStyle"
        class="drag-drawer-trigger-wrapper"
        @mousedown="handleTriggerMousedown"
      >
        <slot name="trigger">
          <drag-drawer-trigger></drag-drawer-trigger>
        </slot>
      </div>
      <div v-if="$slots.footer" class="drag-drawer-footer">
        <slot name="footer"></slot>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="DragDrawer">
import DragDrawerTrigger from "./DragDrawerTrigger.vue";
import type { StyleValue } from "vue";

interface DragDrawerProps {
  visible?: boolean;
  width?: string | number;
  placement?: string;
  draggable?: boolean;
  minWidth?: string | number;
  inner?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<DragDrawerProps>(), {
  visible: false,
  width: 200,
  placement: "right",
  draggable: false,
  minWidth: 200,
  inner: false,
  title: "",
});

type CodeMirrorEmitProps = {
  (e: "update:visible", visible: boolean): void;
  (e: "on-resize-start"): void;
  (e: "update:width", width: number): void;
  (e: "on-resize", event: MouseEvent): void;
  (e: "on-resize-end"): void;
};

const emits = defineEmits<CodeMirrorEmitProps>();

const drawerWrapperRef = ref();
const canMove = ref(false);
const wrapperWidth = ref(0);
const wrapperLeft = ref(0);
const drawerVisible = ref(false);

watch(
  () => props.visible,
  () => {
    drawerVisible.value = props.visible;
  },
  { immediate: true }
);

const outerClasses = computed(() => {
  const classesArray = [
    props.inner ? "drag-drawer-inner" : "",
    `drag-drawer-wrapper`,
    canMove.value ? "no-select" : "",
  ];
  return classesArray.join(" ");
});

const direction = computed(() => {
  if (props.placement === "right") {
    return "rtl";
  } else if (props.placement === "left") {
    return "ltr";
  } else if (props.placement === "top") {
    return "ttb";
  } else if (props.placement === "bottom") {
    return "btt";
  }
  return "rtl";
});

const innerWidth = computed(() => {
  const width = props.width as number;
  return width <= 100 ? (wrapperWidth.value * width) / 100 : width;
});

const triggerStyle = computed(() => {
  let d = "right";
  if (direction.value === "rtl") {
    d = "right";
  } else if (direction.value === "ltr") {
    d = "left";
  }
  // TODO????????? top ??? bottom ??????
  // else if (this.direction === "ttb") {
  //   direction = "top";
  // } else if (this.direction === "btt") {
  //   direction = "bottom";
  // }
  return {
    [d]: `${innerWidth.value}px`,
    position: props.inner ? "absolute" : "fixed",
  } as StyleValue;
});

onMounted(() => {
  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("mouseup", handleMouseup);
  setWrapperWidth();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMousemove);
  document.removeEventListener("mouseup", handleMouseup);
});

const handleBeforeClose = () => {
  emits("update:visible", false);
};

const handleTriggerMousedown = (event: Event) => {
  event.preventDefault();
  canMove.value = true;
  emits("on-resize-start");
  // ???????????????????????????????????????????????? trigger ?????????????????????????????????
  (window as any).getSelection().removeAllRanges();
};

const handleMousemove = (event: any) => {
  if (!canMove.value) return;
  // ????????????????????????????????????????????????????????? window ????????????????????? 0
  setWrapperWidth();
  const left = event.pageX - wrapperLeft.value;
  // ?????????????????????????????????????????????????????????????????? left
  let width = direction.value === "rtl" ? wrapperWidth.value - left : left;
  // ??????????????????
  width = Math.max(width, parseFloat(props.minWidth as string));
  event.atMin = width === parseFloat(props.minWidth as string);
  // ???????????? width ????????? 100??????????????????
  if (width <= 100) width = (width / wrapperWidth.value) * 100;
  emits("update:width", width);
  emits("on-resize", event);
};

const handleMouseup = () => {
  canMove.value = false;
  emits("on-resize-end");
};

const setWrapperWidth = () => {
  const { width, left } = drawerWrapperRef && drawerWrapperRef.value.$el.nextElementSibling.getBoundingClientRect();
  wrapperWidth.value = width;
  wrapperLeft.value = left;
};
</script>

<style lang="scss" scoped>
.drag-drawer-component {
  .no-select {
    user-select: none;
    pointer-events: none;
    .drag-drawer-trigger-wrapper {
      pointer-events: all;
    }
  }

  .drag-drawer-trigger-wrapper {
    top: 0;
    height: 100%;
    width: 0;
  }
  .drag-drawer-footer {
    flex-grow: 1;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    background: #fff;
  }
}
</style>
<style lang="scss">
.drag-drawer-component {
  .no-select.el-drawer {
    transition: none;
  }
  .drag-drawer-footer {
    flex-grow: 1;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    background: #fff;
  }
  .drag-drawer-inner {
    overflow: visible;
    position: absolute;
    & + .v-modal {
      position: absolute;
    }
  }
}
</style>
