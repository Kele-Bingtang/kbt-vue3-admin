<template>
  <div>
    <code-mirror v-model="code" />
  </div>
</template>

<script setup lang="ts" name="CodeMirrorDemo">
import { CodeMirror } from "@/components";

const code = ref(
  JSON.stringify(
    {
      name: `youngKbt`,
      year: 25,
      sex: "man",
      code: 99,
    },
    null,
    "\t"
  )
);
</script>

<style lang="scss" scoped></style>
