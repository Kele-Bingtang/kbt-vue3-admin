<template>
  <div :class="[prefixClass, classes]">
    <div :class="`${prefixClass}__bar ${barConClasses}`"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions } from "vue";
import { useDesign } from "@/hooks";

defineOptions({ name: "SplitLine" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("split-trigger");

const props = defineProps<{ mode: "vertical" | "horizontal" }>();

const isVertical = computed(() => props.mode === "vertical");
const classes = computed(() => (isVertical.value ? `${prefixClass}__vertical` : `${prefixClass}__horizontal`));
const barConClasses = computed(() => (isVertical.value ? "vertical" : "horizontal"));
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-split-trigger;
$trigger-background: #f8f8f9;

.#{$prefix-class} {
  &__bar {
    position: absolute;
    overflow: hidden;

    &.horizontal {
      transform: translate(0, -50%);
    }

    &.vertical {
      transform: translate(-50%, 0);
    }
  }

  &__vertical {
    width: 5px;
    height: 100%;
    cursor: col-resize;
    background: $trigger-background;

    .#{$prefix-class}__bar {
      position: absolute;
      left: 3px;
      z-index: 1;
      box-sizing: border-box;
      width: 1px;
      height: 100%;
      background: #000000;
      background-clip: padding-box;
      opacity: 0.3;
    }
  }

  &__horizontal {
    width: 100%;
    height: 3px;
    cursor: row-resize;
    background: $trigger-background;
    box-shadow: 0 0 4px 0 rgb(28 36 56 / 40%);
  }
}
</style>
