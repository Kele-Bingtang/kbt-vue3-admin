<template>
  <canvas ref="domRef" width="120" height="40" class="cursor-pointer" @click="getImgCode" />
</template>

<script setup lang="ts">
import { useImageVerify } from "./hooks";
import { withDefaults, defineOptions, defineProps, defineEmits, defineExpose, watch } from "vue";

defineOptions({ name: "ImageVerifyCode" });

interface Props {
  code?: string;
}

type ImageVerifyCodeEmits = {
  "update:code": [code: string];
};

const props = withDefaults(defineProps<Props>(), {
  code: "",
});

const emit = defineEmits<ImageVerifyCodeEmits>();

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
