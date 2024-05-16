<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  useSlots,
  computed,
  provide,
  onBeforeMount,
  onMounted,
  onUnmounted,
  onDeactivated,
  onActivated,
  defineOptions,
  defineProps,
  unref,
  type VNodeArrayChildren,
  type VNode,
} from "vue";
import type { Responsive as responsive } from "./components/GridItem.vue";

defineOptions({ name: "Grid" });

export type Responsive = responsive;

export type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl";

interface GridProps {
  cols: number | Record<BreakPoint, number>; // 响应式布局
  collapsed?: boolean; // 是否开启折叠功能
  collapsedRows?: number; // 可见的行数
  gap?: [number, number] | number; // 行和列间距
}

const props = withDefaults(defineProps<GridProps>(), {
  cols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  collapsed: false,
  collapsedRows: 1,
  gap: 0,
});

// 注入 gap 间距
provide("gap", Array.isArray(props.gap) ? props.gap[0] : props.gap);

// 注入响应式断点
const breakPoint = ref<BreakPoint>("xl");
provide("breakPoint", breakPoint);

// 注入 cols
const gridCols = computed(() => {
  if (typeof props.cols === "object") return props.cols[unref(breakPoint)] ?? props.cols;
  return props.cols;
});
provide("cols", gridCols);

// 注入要开始折叠的 index
const hiddenIndex = ref(-1);
provide("shouldHiddenIndex", hiddenIndex);

onBeforeMount(() => props.collapsed && findHiddenIndex());

onMounted(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent);
  window.addEventListener("resize", resize);
});

onActivated(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent);
  window.addEventListener("resize", resize);
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
});

onDeactivated(() => {
  window.removeEventListener("resize", resize);
});

// 监听屏幕变化
const resize = (e: UIEvent) => {
  const width = (e.target as Window).innerWidth;
  switch (!!width) {
    case width < 768:
      breakPoint.value = "xs";
      break;
    case width >= 768 && width < 992:
      breakPoint.value = "sm";
      break;
    case width >= 992 && width < 1200:
      breakPoint.value = "md";
      break;
    case width >= 1200 && width < 1920:
      breakPoint.value = "lg";
      break;
    case width >= 1920:
      breakPoint.value = "xl";
      break;
  }
};

const slots = useSlots().default!();

/**
 * 计算元素是否超出指定可见的行数，超出则折叠不可见的行数
 */
const findHiddenIndex = () => {
  const fields: VNodeArrayChildren = [];
  let suffix: VNode | null = null;
  slots.forEach((slot: any) => {
    // object：插槽只有一个 Children
    if (typeof slot.type === "object" && slot.type.name === "GridItem" && slot.props?.suffix !== undefined) {
      suffix = slot;
    }
    // symbol：插槽有很多 Children
    if (typeof slot.type === "symbol" && Array.isArray(slot.children)) fields.push(...slot.children);
  });
  // 计算 suffix children 所占用的列
  let suffixCols = 0;
  if (suffix) {
    suffixCols =
      ((suffix as VNode).props![unref(breakPoint)]?.span ?? (suffix as VNode).props?.span ?? 1) +
      ((suffix as VNode).props![unref(breakPoint)]?.offset ?? (suffix as VNode).props?.offset ?? 0);
  }
  try {
    let find = false;
    fields.reduce((prev = 0, current, index) => {
      // 计算每个 Children 的 span 和 offset 总和
      prev +=
        ((current as VNode)!.props![unref(breakPoint)]?.span ?? (current as VNode)!.props?.span ?? 1) +
        ((current as VNode)!.props![unref(breakPoint)]?.offset ?? (current as VNode)!.props?.offset ?? 0);
      // 当计算的多个 Children 的 span 和 offset 总和超出一行
      if (Number(prev) > props.collapsedRows * gridCols.value - suffixCols) {
        hiddenIndex.value = index;
        find = true;
        // 跳出 reduce
        throw new Error("find it");
      }
      return prev;
    }, 0);
    if (!find) hiddenIndex.value = -1;
  } catch (e) {
    // console.warn(e);
  }
};

// 断点变化时 执行 findHiddenIndex
watch(
  () => breakPoint.value,
  () => {
    if (props.collapsed) findHiddenIndex();
  }
);

// 监听 collapsed
watch(
  () => props.collapsed,
  value => {
    if (value) return findHiddenIndex();
    hiddenIndex.value = -1;
  }
);

const gridGap = computed(() => {
  if (typeof props.gap === "number") return `${props.gap}px`;
  if (Array.isArray(props.gap)) return `${props.gap[1]}px ${props.gap[0]}px`;
  return "unset";
});

const style = computed(() => {
  return {
    display: "grid",
    gap: unref(gridGap), // 行和列间距
    gridTemplateColumns: `repeat(${unref(gridCols)}, minmax(0, 1fr))`, // 设置网格的列数
  };
});

defineExpose({ breakPoint });
</script>
