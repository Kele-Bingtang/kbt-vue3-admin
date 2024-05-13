<template>
  <ElImageViewer v-if="show" v-bind="bindValue" @close="close" />
</template>

<script setup lang="ts">
import { ElImageViewer } from "element-plus";
import { computed, ref, withDefaults } from "vue";

defineOptions({
  name: "ImageViewer",
});

export interface ImageViewerProps {
  urlList?: string[];
  zIndex?: number;
  initialIndex?: number;
  infinite?: boolean;
  hideOnClickModal?: boolean;
  teleported?: boolean;
  show?: boolean;
}

const props = withDefaults(defineProps<ImageViewerProps>(), {
  urlList: (): string[] => [],
  zIndex: 200,
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  teleported: false,
  show: false,
});

const bindValue = computed(() => {
  const propsData: Recordable = { ...props };
  delete propsData.show;
  return propsData;
});

const show = ref(props.show);

const close = () => {
  show.value = false;
};
</script>
