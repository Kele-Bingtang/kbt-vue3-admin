<template>
  <div v-show="isShow" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref, ref, useAttrs, watch, defineOptions, unref } from "vue";
import type { BreakPoint } from "../index.vue";

defineOptions({ name: "GridItem" });

export type Responsive = {
  span?: number; // 偏移量
  offset?: number; // 占位量
};

interface GridItemProps {
  offset?: number; // 偏移量
  span?: number; // 占位量
  suffix?: boolean; // 最后的元素
  xs?: Responsive;
  sm?: Responsive;
  md?: Responsive;
  lg?: Responsive;
  xl?: Responsive;
}

const props = withDefaults(defineProps<GridItemProps>(), {
  offset: 0,
  span: 1,
  suffix: false,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined,
});

const attrs = useAttrs() as { index: string };

const isShow = ref(true);

// 引入断点
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref("xl"));
const shouldHiddenIndex = inject<Ref<number>>("shouldHiddenIndex", ref(-1));

watch(
  () => [shouldHiddenIndex.value, breakPoint.value],
  nv => {
    if (attrs.index) {
      isShow.value = !(nv[0] !== -1 && parseInt(attrs.index) >= Number(nv[0]));
    }
  },
  { immediate: true }
);

const gap = inject("gap", 0);
const cols = inject("cols", ref(4));

const style = computed(() => {
  const span = props[unref(breakPoint)]?.span ?? props.span;
  const offset = props[unref(breakPoint)]?.offset ?? props.offset;
  if (props.suffix) {
    return {
      gridColumnStart: unref(cols) - span - offset + 1,
      gridColumnEnd: `span ${span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : "unset",
    };
  } else {
    const c = unref(cols);
    return {
      gridColumn: `span ${span + offset > c ? c : span + offset}/span ${span + offset > c ? c : span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : "unset",
    };
  }
});
</script>
