<script setup lang="ts" n>
import type { Frame } from "./useFrame";
import { computed, unref, watch } from "vue";
import { useRoute } from "vue-router";
import { useLayoutStore } from "@/stores";
import { useFrame } from "./useFrame";
import FrameView from "./FrameView.vue";

defineOptions({ name: "FrameLayout" });

const route = useRoute();
const layoutStore = useLayoutStore();
const { showIframe } = useFrame();
const showFrames = computed(() => unref(layoutStore.frameList).length > 0);
const frameList = computed(() => layoutStore.frameList);

/**
 * @description iframe 是否已经缓存
 */
function isIframeExist(name: string): boolean {
  for (const item of frameList.value) {
    if (item.name === name) return true;
  }
  return false;
}
watch(
  () => route.fullPath,
  () => {
    const {
      name,
      meta: { frameSrc, frameKeepAlive },
    } = route;

    if (!frameSrc) return;

    const obj: Frame = {
      src: frameSrc as string,
      name: name as string,
      show: true,
    };
    if (!isIframeExist(obj.name) && frameKeepAlive) layoutStore.addFrame(obj);
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="showFrames">
    <template v-for="frame in frameList" :key="frame.src">
      <FrameView v-if="frame.src" v-show="showIframe(frame)" :frameSrc="frame.src" :frameName="frame.name" />
    </template>
  </div>
</template>
