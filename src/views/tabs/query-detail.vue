<script setup lang="ts" name="QueryDetail">
import { useDetail } from "./hooks";

const { id } = useDetail();
</script>

<template>
  <div>{{ id }} - 详情页内容在此（query 传参）</div>
</template>
