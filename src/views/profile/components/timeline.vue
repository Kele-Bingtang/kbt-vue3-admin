<template>
  <div class="timeline-container">
    <el-timeline reverse>
      <el-timeline-item
        v-for="(item, index) of timeline"
        :key="index"
        :timestamp="item.timestamp"
        :icon="item.icon"
        size="large"
        type="primary"
        placement="top"
      >
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts" name="Timeline">
const timeline = [
  {
    timestamp: "2022/10/01",
    title: "学习编程 ing...",
    content: "参考了很多网站，研究大佬们优雅的代码，慢慢提升自己的技术。",
    icon: "Loading",
  },

  {
    timestamp: "2022/07/18",
    title: "南方我又回来了",
    content: "北京还是太冷，我在园区的绿荫下，和朋友选择深圳。",
    icon: "SuccessFilled",
  },
  {
    timestamp: "2022/06/30",
    title: "大学毕业，新梦的起点",
    content: "讨厌的毕业终究还是来临了，很多美好的记忆随风飘向北京。",
    icon: "SuccessFilled",
  },
  {
    timestamp: "2018/09/08",
    title: "大学时代，梦的起点",
    content: "期待的大学生活，也许给我不一样的起点和更为广阔的终点。",
    icon: "SuccessFilled",
  },
];
</script>

<style lang="scss">
.timeline-container {
  .el-timeline-item__icon:first {
    animation: rotating 2s linear infinite;
  }
}
</style>
