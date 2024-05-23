<template>
  <div :class="prefixClass">
    <el-card :class="`${prefixClass}__card`">
      <div :class="`${prefixClass}__card--box`">
        <!-- 切记设置 list1 和 list2 属性时，一定要添加 .sync 修饰符 -->
        <DraggableList :left-list="listData1" :right-list="listData2" :drag-class="dragClass" @on-change="handleChange">
          <template #leftTitle>
            <h3>待办事项</h3>
          </template>

          <template #left="{ item }">
            <el-card>
              {{ item.name }}
            </el-card>
          </template>
          <template #leftIcon>
            <el-icon style="color: var(--el-color-primary)"><ArrowRight /></el-icon>
          </template>

          <template #rightTitle>
            <h3>完成事项</h3>
          </template>
          <template #right="{ item }">
            <el-card>
              {{ item.name }}
            </el-card>
          </template>
          <template #rightIcon>
            <el-icon style="color: var(--el-color-primary)"><ArrowLeft /></el-icon>
          </template>
        </DraggableList>
      </div>

      <el-card :class="`${prefixClass}__handle`">
        <template #header>
          <span>操作记录</span>
        </template>
        <div :class="`${prefixClass}__handle--inner`">
          <p v-for="(item, index) in handleList" :key="`handle_item_${index}`">{{ item }}</p>
        </div>
      </el-card>
      <el-card :class="`${prefixClass}__handle--show`">
        <pre>{{ listData1 }}</pre>
      </el-card>
      <el-card :class="`${prefixClass}__handle--show`">
        <pre>{{ listData2 }}</pre>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="DraggableListDemo">
import { DraggableList } from "@/components";
import type { DragClass } from "@/components/DraggableList/src/index.vue";
import { list1, list2 } from "@/mock/drag-list";
import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("draggable-list-demo");

const listData1 = ref(list1);
const listData2 = ref(list2);

const dragClass: DragClass = {
  left: ["drag-box", "left-drag-box"],
  right: ["drag-box", "right-drag-box"],
};

const handleList = ref<string[]>([]);

const handleChange = ({ src, target, oldIndex, newIndex }: any) => {
  handleList.value.push(`${src} => ${target}, ${oldIndex} => ${newIndex}`);
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-draggable-list-demo;

.#{$prefix-class} {
  width: 100%;
  height: 100%;
  padding: 20;

  &__card {
    width: 100%;
    height: 100%;

    &--box {
      display: inline-block;
      width: 40%;
      height: 100%;
    }
  }

  &__handle {
    display: inline-block;
    width: 220px;
    height: 100%;

    &--inner {
      p {
        padding: 7px 0;
        margin: 0 7px;
        border-bottom: 1px dashed #eeeeee;
      }
    }

    &--show {
      display: inline-block;
      width: 370px;
      height: 100%;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
$prefix-class: #{$namespace}-draggable-list-demo;

.#{$prefix-class} {
  &__card {
    .#{$el-namespace}-card__body {
      width: 100%;
      height: 100%;
    }
  }

  &--box {
    height: calc(100% - 60px);
    margin-right: 10px;
  }
}
</style>
