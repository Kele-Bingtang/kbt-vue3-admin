<template>
  <div :class="prefixClass">
    <img src="@/assets/images/status/404.png" :class="`${prefixClass}__img`" alt="404" />
    <div :class="`${prefixClass}__detail`">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
      <el-button type="primary" @click="router.push(HOME_URL)">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";

defineOptions({ name: "404" });

const ns = useNamespace("error-page");
const prefixClass = ns.b();

const router = useRouter();
</script>

<style scoped lang="scss">
@use "./index";
</style>
