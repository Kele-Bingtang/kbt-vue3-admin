<script setup lang="ts">
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { useNamespace } from "@/composables";

defineOptions({ name: "500" });

const ns = useNamespace("error-page");
const prefixClass = ns.b();

const router = useRouter();
</script>

<template>
  <div :class="prefixClass">
    <img src="@/assets/images/status/500.png" :class="`${prefixClass}__img`" alt="500" />
    <div :class="`${prefixClass}__detail`">
      <h2>500</h2>
      <h4>抱歉，您的网络不见了~🤦‍♂️🤦‍♀️</h4>
      <el-button type="primary" @click="router.push(HOME_URL)">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./index";
</style>
