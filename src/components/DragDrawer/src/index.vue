<template>
  <div :class="prefixClass">
    <el-drawer
      ref="drawerRef"
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
        :class="`${prefixClass}__trigger`"
        @mousedown="handleTriggerMousedown"
      >
        <slot name="trigger">
          <DragDrawerTrigger></DragDrawerTrigger>
        </slot>
      </div>
      <div v-if="$slots.footer" :class="`${prefixClass}__footer`">
        <slot name="footer"></slot>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import DragDrawerTrigger from "./DragDrawerTrigger.vue";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  defineOptions,
  defineEmits,
  defineProps,
  unref,
  type StyleValue,
} from "vue";
import { ElDrawer } from "element-plus";
import { useDesign } from "@/hooks";

defineOptions({ name: "DragDrawer" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("drag-drawer");

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

type DragDrawerEmits = {
  "update:visible": [visible: boolean];
  "on-resize-start": [];
  "update:width": [width: number];
  "on-resize": [event: MouseEvent];
  "on-resize-end": [];
};

const emits = defineEmits<DragDrawerEmits>();

const drawerRef = ref();
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
  const classesArray = [props.inner ? `${prefixClass}__inner` : "", unref(canMove) ? "no-select" : ""];
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
  return width <= 100 ? (unref(wrapperWidth) * width) / 100 : width;
});

const triggerStyle = computed(() => {
  let d = "right";
  if (direction.value === "rtl") {
    d = "right";
  } else if (direction.value === "ltr") {
    d = "left";
  }
  // TODO：支持 top 和 bottom 移动
  // else if (this.direction === "ttb") {
  //   direction = "top";
  // } else if (this.direction === "btt") {
  //   direction = "bottom";
  // }
  return {
    [d]: `${unref(innerWidth)}px`,
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
  // 防止鼠标选中抽屉中文字，造成拖动 trigger 触发浏览器原生拖动行为
  (window as any).getSelection().removeAllRanges();
};

const handleMousemove = (event: any) => {
  if (!unref(canMove)) return;
  // 更新容器宽度和距离左侧页面距离，如果是 window 则距左侧距离为 0
  setWrapperWidth();
  const left = event.pageX - unref(wrapperLeft);
  // 如果抽屉方向为右边，宽度计算需用容器宽度减去 left
  let width = direction.value === "rtl" ? unref(wrapperWidth) - left : left;
  // 限定做小宽度
  width = Math.max(width, parseFloat(props.minWidth as string));
  event.atMin = width === parseFloat(props.minWidth as string);
  // 如果当前 width 不大于 100，视为百分比
  if (width <= 100) width = (width / unref(wrapperWidth)) * 100;
  emits("update:width", width);
  emits("on-resize", event);
};

const handleMouseup = () => {
  canMove.value = false;
  emits("on-resize-end");
};

const setWrapperWidth = () => {
  const { width, left } = drawerRef.value && unref(drawerRef).$el.nextElementSibling.getBoundingClientRect();
  wrapperWidth.value = width;
  wrapperLeft.value = left;
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-drag-drawer;

.#{$prefix-class} {
  .no-select {
    pointer-events: none;
    user-select: none;

    .#{$prefix-class}__trigger {
      pointer-events: all;
    }
  }

  // #{$el-namespace} 默认为 el，如果组件迁移到其他项目，且项目架构与此项目不同，则请修改 #{$el-namespace} 为 el
  :deep(.no-select.#{$el-namespace}-drawer) {
    transition: none;
  }

  &__trigger {
    top: 0;
    width: 0;
    height: 100%;
  }

  &__footer {
    bottom: 0;
    left: 0;
    flex-grow: 1;
    width: 100%;
    padding: 10px 16px;
    background: #ffffff;
    border-top: 1px solid #e8e8e8;
  }

  :deep(.#{$prefix-class}__inner) {
    position: absolute;
    overflow: visible;

    & + .v-modal {
      position: absolute;
    }
  }
}
</style>