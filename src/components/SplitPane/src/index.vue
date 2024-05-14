<template>
  <div ref="splitPaneRef" class="split-pane-component" :class="{ 'no-select': isMoving }">
    <div v-if="isHorizontal" class="split-horizontal">
      <div :style="{ bottom: `${anotherOffset}%` }" class="split-pane top-pane"><slot name="top" /></div>
      <div class="split-line-container" :style="{ top: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="line">
          <split-line mode="horizontal" />
        </slot>
      </div>
      <div :style="{ top: `${offset}%` }" class="split-pane bottom-pane"><slot name="bottom" /></div>
    </div>
    <div v-else class="split-vertical">
      <div :style="{ right: `${anotherOffset}%` }" class="split-pane left-pane"><slot name="left" /></div>
      <div class="split-line-container" :style="{ left: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="line">
          <split-line mode="vertical" />
        </slot>
      </div>
      <div :style="{ left: `${offset}%` }" class="split-pane right-pane"><slot name="right" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, computed, watch, onMounted, nextTick, defineOptions } from "vue";
import SplitLine from "./SplitLine.vue";

defineOptions({ name: "SplitPane" });

type NumOrStr = number | string;

interface SplitPaneProps {
  value?: NumOrStr;
  mode?: "horizontal" | "vertical";
  min?: NumOrStr;
  max?: NumOrStr;
}

const props = withDefaults(defineProps<SplitPaneProps>(), {
  value: 0.5,
  mode: "horizontal",
  min: "40px",
  max: "40px",
});

const emits = defineEmits(["update:value", "on-moving", "on-move-end", "on-move-start"]);

const splitPaneRef = shallowRef();
const offset = ref(0);
const initOffset = ref(0);
const oldOffset = ref<unknown>(0);
const isMoving = ref(false);

const isHorizontal = computed(() => props.mode === "horizontal");
const anotherOffset = computed(() => 100 - offset.value);
const valueIsString = computed(() => typeof props.value === "string");
const offsetSize = computed(() => (isHorizontal.value ? "offsetHeight" : "offsetWidth"));
const computedMin = computed(() => getComputedThresholdValue("min"));
const computedMax = computed(() => getComputedThresholdValue("max"));

watch(
  () => props.value,
  () => init()
);

onMounted(() => {
  nextTick(() => {
    init();
  });
});

const init = () => {
  const value = valueIsString.value
    ? px2percent(props.value as string, splitPaneRef.value[offsetSize.value])
    : props.value;
  offset.value = ((value as number) * 10000) / 100;
};

const px2percent = (numerator: string, denominator: string) => {
  return parseFloat(numerator) / parseFloat(denominator);
};

const getComputedThresholdValue = (type: string) => {
  let value: NumOrStr = "";
  if (type === "min") value = props.min;
  else if (type === "max") value = props.max;
  const size = splitPaneRef.value[offsetSize.value];
  if (valueIsString.value) return typeof value === "string" ? value : size * value;
  else return typeof value === "string" ? px2percent(value, size) : value;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const getMin = (value1: NumOrStr, value2: NumOrStr) => {
  if (valueIsString.value) return `${Math.min(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
  else return Math.min(value1 as number, value2 as number);
};

const getMax = (value1: NumOrStr, value2: NumOrStr) => {
  if (valueIsString.value) return `${Math.max(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
  else return Math.max(value1 as number, value2 as number);
};

const getAnotherOffset = (value: NumOrStr) => {
  let res: NumOrStr = "0";
  if (valueIsString.value) (res as string) = `${splitPaneRef.value[offsetSize.value] - parseFloat(value as string)}px`;
  else res = 1 - (value as number);
  return res;
};

const handleMove = (e: any) => {
  const pageOffset = isHorizontal.value ? e.pageY : e.pageX;
  const offset = pageOffset - initOffset.value;
  const outerWidth = splitPaneRef.value[offsetSize.value];
  let value = valueIsString.value
    ? `${parseFloat(oldOffset.value + "") + offset}px`
    : px2percent(outerWidth * (oldOffset.value as number) + offset + "", outerWidth);
  console.log(px2percent(outerWidth * (oldOffset.value as number) + offset + "", outerWidth));
  const anotherValue = getAnotherOffset(value);
  if (parseFloat(value + "") <= parseFloat(computedMin.value + "")) value = getMax(value, computedMin.value);
  if (parseFloat(anotherValue + "") <= parseFloat(computedMax.value + "")) {
    value = getAnotherOffset(getMax(anotherValue, computedMax.value));
  }
  e.atMin = props.value === computedMin.value;
  e.atMax = valueIsString.value
    ? getAnotherOffset(props.value) === computedMax.value
    : (getAnotherOffset(props.value) as number).toFixed(5) === (computedMax.value as number).toFixed(5);
  emits("update:value", value);
  emits("on-moving", e);
};

const handleUp = () => {
  isMoving.value = false;
  document.removeEventListener("mousemove", handleMove);
  document.removeEventListener("mouseup", handleUp);
  emits("on-move-end");
};

const handleMousedown = (e: MouseEvent) => {
  initOffset.value = isHorizontal.value ? e.pageY : e.pageX;
  oldOffset.value = props.value;
  isMoving.value = true;
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleUp);
  emits("on-move-start");
};
</script>

<style lang="scss" scoped>
.split-pane-component {
  position: relative;
  width: 100%;
  height: 100%;

  .split-pane {
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

  .split-vertical {
    height: 100%;

    .split-line-container {
      top: 50%;
      left: 50%;
      width: 0;
      height: 100%;
    }
  }

  .split-line-container {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, -50%);
  }

  .split-horizontal {
    width: 100%;

    .split-line-container {
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
