<template>
  <el-space fill>
    <el-card shadow="never" header="自定义复制指令">
      <p>在标签上加 v-copy="data"，data 为复制的内容。</p>
      <div>
        <el-input placeholder="请输入内容" v-model="data" style="width: 500px">
          <template #append>
            <el-button v-copy="data">复制</el-button>
          </template>
        </el-input>
      </div>
      <p>
        如果需要点击事件触发复制，请看
        <el-button link type="primary" @click="router.push('/plugins/clipboard')">文本复制</el-button>
      </p>
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="Copy">
const router = useRouter();
const data = ref<string>("https://github.com/Kele-Bingtang/kbt-vue3-admin");
</script>
