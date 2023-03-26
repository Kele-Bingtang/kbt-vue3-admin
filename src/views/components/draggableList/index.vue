<template>
  <div class="draggable-list-container">
    <el-card class="draggable-list-card">
      <div class="drag-card">
        <!-- 切记设置 list1 和 list2 属性时，一定要添加 .sync 修饰符 -->
        <DraggableList :left-list="listData1" :right-list="listData2" :drag-class="dragClass" @on-change="handleChange">
          <template #leftTitle>
            <h3>待办事项</h3>
          </template>

          <template #left="{ item }">
            <el-card class="drag-item">
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
            <el-card class="drag-item">
              {{ item.name }}
            </el-card>
          </template>
          <template #rightIcon>
            <el-icon style="color: var(--el-color-primary)"><ArrowLeft /></el-icon>
          </template>
        </DraggableList>
      </div>

      <el-card class="handle-card">
        <template #header>
          <span>操作记录</span>
        </template>
        <div class="handle-inner-card">
          <p v-for="(item, index) in handleList" :key="`handle_item_${index}`">{{ item }}</p>
        </div>
      </el-card>
      <el-card class="res-show-card">
        <pre>{{ listData1 }}</pre>
      </el-card>
      <el-card class="res-show-card">
        <pre>{{ listData2 }}</pre>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="DraggableList">
import DraggableList, { type DragClass } from "@/components/DraggableList/index.vue";
import { list1, list2 } from "@/test/drag-list";

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
.draggable-list-container {
  width: 100%;
  height: 100%;
  padding: 20;

  .draggable-list-card {
    width: 100%;
    height: 100%;

    .drag-card {
      width: 40%;
      height: 100%;
      display: inline-block;
    }
  }

  .handle-card {
    display: inline-block;
    width: 220px;
    height: 100%;

    .handle-inner-card {
      p {
        padding: 7px 0;
        margin: 0 7px;
        border-bottom: 1px dashed #eee;
      }
    }
  }

  .res-show-card {
    display: inline-block;
    margin-left: 10px;
    width: 370px;
    height: 100%;
  }
}
</style>
<style lang="scss">
.draggable-list-container {
  .draggable-list-card {
    .el-card__body {
      width: 100%;
      height: 100%;
    }
  }

  .drag-box {
    margin-right: 10px;
    height: calc(100% - 60px);
  }
}
</style>
