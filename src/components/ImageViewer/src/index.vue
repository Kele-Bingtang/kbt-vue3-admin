<template>
  <ElConfigProvider :namespace="ns.elNamespace" :size="layoutSize">
    <ElImageViewer v-if="visible" v-bind="bindValue" @close="close" />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElImageViewer, ElConfigProvider } from "element-plus";
import { computed } from "vue";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/stores";

defineOptions({ name: "ImageViewer" });

const ns = useNamespace();

export interface ImageViewerProps {
  urlList?: string[];
  zIndex?: number;
  initialIndex?: number;
  infinite?: boolean;
  hideOnClickModal?: boolean;
  teleported?: boolean;
  modelValue?: boolean;
}

const props = withDefaults(defineProps<ImageViewerProps>(), {
  urlList: (): string[] => [],
  zIndex: 2000,
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  teleported: false,
  modelValue: false,
});

const bindValue = computed(() => {
  const propsData: Record<string, any> = { ...props };
  delete propsData.visible;
  delete propsData.modelValue;
  delete propsData.modelModifiers;
  return propsData;
});

const layoutSize = computed(() => useLayoutStore().layoutSize);

const visible = defineModel({ default: false });

const close = () => {
  visible.value = false;
};
</script>
