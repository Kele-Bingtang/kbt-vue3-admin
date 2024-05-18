<template>
  <div ref="splitPaneRef" :class="[prefixClass, { 'no-select': isMoving }]">
    <div v-if="isHorizontal" :class="`${prefixClass}__horizontal`">
      <div :style="{ bottom: `${anotherOffset}%` }" :class="`${prefixClass}__item top-pane`">
        <slot name="top" />
      </div>
      <div :class="`${prefixClass}__container`" :style="{ top: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="line">
          <split-line mode="horizontal" />
        </slot>
      </div>
      <div :style="{ top: `${offset}%` }" :class="`${prefixClass}__item bottom-pane`"><slot name="bottom" /></div>
    </div>
    <div v-else :class="`${prefixClass}__vertical`">
      <div :style="{ right: `${anotherOffset}%` }" :class="`${prefixClass}__item left-pane`"><slot name="left" /></div>
      <div :class="`${prefixClass}__container`" :style="{ left: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="line">
          <split-line mode="vertical" />
        </slot>
      </div>
      <div :style="{ left: `${offset}%` }" :class="`${prefixClass}__item right-pane`"><slot name="right" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, computed, watch, onMounted, nextTick, defineOptions, unref } from "vue";
import SplitLine from "./SplitLine.vue";
import { useDesign } from "@/hooks";

defineOptions({ name: "SplitPane" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("split-pane");

type NumOrStr = number | string;

interface SplitPaneProps {
  modelValue?: NumOrStr;
  mode?: "horizontal" | "vertical";
  min?: NumOrStr;
  max?: NumOrStr;
}

const props = withDefaults(defineProps<SplitPaneProps>(), {
  modelValue: 0.5,
  mode: "horizontal",
  min: "40px",
  max: "40px",
});

const emits = defineEmits(["update:modelValue", "on-moving", "on-move-end", "on-move-start"]);

const splitPaneRef = shallowRef();
const offset = ref(0);
const initOffset = ref(0);
const oldOffset = ref<unknown>(0);
const isMoving = ref(false);

const isHorizontal = computed(() => props.mode === "horizontal");
const anotherOffset = computed(() => 100 - unref(offset));
const valueIsString = computed(() => typeof props.modelValue === "string");
const offsetSize = computed(() => (unref(isHorizontal) ? "offsetHeight" : "offsetWidth"));
const computedMin = computed(() => getComputedThresholdValue("min"));
const computedMax = computed(() => getComputedThresholdValue("max"));

watch(
  () => props.modelValue,
  () => init()
);

onMounted(() => {
  nextTick(() => {
    init();
  });
});

const init = () => {
  const value = unref(valueIsString)
    ? px2percent(props.modelValue as string, unref(splitPaneRef)[unref(offsetSize)])
    : props.modelValue;
  offset.value = ((value as number) * 10000) / 100;
};

const px2percent = (numerator: string, denominator: string) => {
  return parseFloat(numerator) / parseFloat(denominator);
};

const getComputedThresholdValue = (type: string) => {
  let value: NumOrStr = "";
  if (type === "min") value = props.min;
  else if (type === "max") value = props.max;
  const size = unref(splitPaneRef)[unref(offsetSize)];
  if (unref(valueIsString)) return typeof value === "string" ? value : size * value;
  else return typeof value === "string" ? px2percent(value, size) : value;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const getMin = (value1: NumOrStr, value2: NumOrStr) => {
  if (unref(valueIsString)) return `${Math.min(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
  else return Math.min(value1 as number, value2 as number);
};

const getMax = (value1: NumOrStr, value2: NumOrStr) => {
  if (unref(valueIsString)) return `${Math.max(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
  else return Math.max(value1 as number, value2 as number);
};

const getAnotherOffset = (value: NumOrStr) => {
  let res: NumOrStr = "0";
  if (unref(valueIsString)) res = `${unref(splitPaneRef)[unref(offsetSize)] - parseFloat(value as string)}px`;
  else res = 1 - (value as number);
  return res;
};

const handleMove = (e: any) => {
  const pageOffset = unref(isHorizontal) ? e.pageY : e.pageX;
  const offset = pageOffset - unref(initOffset);
  const outerWidth = unref(splitPaneRef)[unref(offsetSize)];
  let value = unref(valueIsString)
    ? `${parseFloat(unref(oldOffset) + "") + offset}px`
    : px2percent(outerWidth * (unref(oldOffset) as number) + offset + "", outerWidth);
  console.log(px2percent(outerWidth * (unref(oldOffset) as number) + offset + "", outerWidth));
  const anotherValue = getAnotherOffset(value);
  if (parseFloat(value + "") <= parseFloat(unref(computedMin) + "")) value = getMax(value, unref(computedMin));
  if (parseFloat(anotherValue + "") <= parseFloat(unref(computedMax) + "")) {
    value = getAnotherOffset(getMax(anotherValue, unref(computedMax)));
  }
  e.atMin = props.modelValue === unref(computedMin);
  e.atMax = unref(valueIsString)
    ? getAnotherOffset(props.modelValue) === unref(computedMax)
    : (getAnotherOffset(props.modelValue) as number).toFixed(5) === (unref(computedMax) as number).toFixed(5);
  emits("update:modelValue", value);
  emits("on-moving", e);
};

const handleUp = () => {
  isMoving.value = false;
  document.removeEventListener("mousemove", handleMove);
  document.removeEventListener("mouseup", handleUp);
  emits("on-move-end");
};

const handleMousedown = (e: MouseEvent) => {
  initOffset.value = unref(isHorizontal) ? e.pageY : e.pageX;
  oldOffset.value = props.modelValue;
  isMoving.value = true;
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleUp);
  emits("on-move-start");
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-split-pane;

.#{$prefix-class} {
  position: relative;
  width: 100%;
  height: 100%;

  &__item {
    position: absolute;

    &.left-pane,
    &.right-pane {
      top: 0;
      bottom: 0;
    }

    &.left-pane {
      left: 0;
    }

    &.right-pane {
      right: 0;
    }

    &.top-pane,
    &.bottom-pane {
      right: 0;
      left: 0;
    }

    &.top-pane {
      top: 0;
    }

    &.bottom-pane {
      bottom: 0;
    }
  }

  &__vertical {
    height: 100%;

    .#{$prefix-class}__container {
      top: 50%;
      left: 50%;
      width: 0;
      height: 100%;
    }
  }

  &__container {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, -50%);
  }

  &__horizontal {
    width: 100%;

    .#{$prefix-class}__container {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 10;
      width: 100%;
      height: 0;
      transform: translate(-50%, -50%);
    }
  }

  &.no-select {
    -webkit-touch-callout: none;
    user-select: none;
  }
}
</style>
