<template>
  <canvas ref="domRef" width="120" height="40" class="cursor-pointer" @click="getImgCode" />
</template>

<script setup lang="ts" name="ImageVerify">
import { useImageVerify } from "./hooks";

interface Props {
  code?: string;
}

interface Emits {
  (e: "update:code", code: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  code: "",
});

const emit = defineEmits<Emits>();

const { domRef, imgCode, setImgCode, getImgCode } = useImageVerify();

watch(
  () => props.code,
  newValue => {
    setImgCode(newValue);
  }
);
watch(imgCode, newValue => {
  emit("update:code", newValue);
});

defineExpose({ getImgCode });
</script>
