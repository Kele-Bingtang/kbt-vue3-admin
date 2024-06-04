<template>
  <div :class="prefixClass">
    <img src="@/assets/images/status/403.png" :class="`${prefixClass}__img`" alt="403" />
    <div :class="`${prefixClass}__detail`">
      <h2>403</h2>
      <h4>抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</h4>
      <el-button type="primary" @click="router.push(HOME_URL)">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { HOME_URL } from "@/router/routesConfig";
import { useDesign } from "@/hooks";

defineOptions({ name: "403" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("error-page");

const router = useRouter();
</script>

<style scoped lang="scss">
@import "./index";
</style>
