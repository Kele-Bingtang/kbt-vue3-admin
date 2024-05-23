<template>
  <div :class="prefixClass">
    <el-card shadow="never" header="">
      <div :class="`${prefixClass}__header`">
        <el-switch
          v-model="placement"
          active-text="右"
          inactive-text="左"
          active-value="right"
          inactive-value="left"
          :class="`${prefixClass}__header--switch`"
        ></el-switch>
        <el-switch v-model="draggable" active-text="是否可拖拽"></el-switch>
        <el-button @click="visible1 = true" type="primary" style="margin-left: 16px">打开容器内抽屉</el-button>
        <el-button @click="visible2 = true" type="primary" style="margin-left: 16px">打开全屏抽屉</el-button>
      </div>

      <div :class="`${prefixClass}__inner`">
        <DragDrawer
          v-model="visible1"
          :placement="placement"
          v-model:width="width1"
          :draggable="draggable"
          :inner="true"
          @on-resize="handleResize"
          title="我是标题"
        ></DragDrawer>
      </div>

      <DragDrawer
        v-model="visible2"
        :placement="placement"
        v-model:width="width2"
        :draggable="draggable"
        @on-resize="handleResize"
      >
        <template #header>
          <span>我是标题</span>
        </template>
      </DragDrawer>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="DragDrawerDemo">
import { DragDrawer } from "@/components";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("darg-drawer-demo");

const visible1 = ref(false);
const visible2 = ref(false);
const placement = ref("right");
const width1 = ref(200);
const width2 = ref(300);
const draggable = ref(true);

const handleResize = (event: any) => {
  const { atMin } = event;
  console.log(atMin);
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-darg-drawer-demo;

.#{$prefix-class} {
  &__header {
    margin-bottom: 30px;

    &--switch {
      margin-right: 30px;
    }
  }

  &__inner {
    position: relative;
    width: 500px;
    height: 400px;
    background: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);

    :deep(.#{$el-namespace}-overlay) {
      position: absolute;
    }
  }
}
</style>
