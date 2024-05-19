<template>
  <canvas ref="domRef" width="120" height="40" class="cursor-pointer" @click="getImgCode" />
</template>

<script setup lang="ts">
import { useImageVerify } from "./hooks";
import { defineOptions, watch } from "vue";

defineOptions({ name: "ImageVerifyCode" });

const { domRef, imgCode, setImgCode, getImgCode } = useImageVerify();

const code = defineModel<string>({ required: true });

watch(code, newValue => {
  setImgCode(newValue);
});

watch(imgCode, newValue => {
  code.value = newValue;
});

defineExpose({ getImgCode });
</script>
