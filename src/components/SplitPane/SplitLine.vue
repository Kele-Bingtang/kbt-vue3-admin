<template>
  <div class="split-trigger-component" :class="classes">
    <div class="split-trigger-bar" :class="barConClasses"></div>
  </div>
</template>

<script setup lang="ts" name="SplitLine">
const props = defineProps<{ mode: "vertical" | "horizontal" }>();

const isVertical = computed(() => props.mode === "vertical");
const classes = computed(() => (isVertical.value ? "split-trigger-vertical" : "split-trigger-horizontal"));
const barConClasses = computed(() => (isVertical.value ? "vertical" : "horizontal"));
</script>
<style lang="scss" scoped>
$trigger-background: #f8f8f9;

.split-trigger-component {
  .split-trigger-bar {
    position: absolute;
    overflow: hidden;

    &.horizontal {
      transform: translate(0, -50%);
    }

    &.vertical {
      transform: translate(-50%, 0);
    }
  }

  &.split-trigger-vertical {
    width: 5px;
    height: 100%;
    background: $trigger-background;
    cursor: col-resize;

    .split-trigger-bar {
      width: 1px;
      height: 100%;
      box-sizing: border-box;
      background: #000;
      position: absolute;
      left: 3px;
      opacity: 0.3;
      z-index: 1;
      background-clip: padding-box;
    }
  }

  &.split-trigger-horizontal {
    width: 100%;
    height: 3px;
    background: $trigger-background;
    box-shadow: 0 0 4px 0 rgb(28 36 56 / 40%);
    cursor: row-resize;
  }
}
</style>
