<template>
  <div v-if="showFrames">
    <template v-for="frame in frameList" :key="frame.path">
      <FrameView v-if="frame.src" v-show="showIframe(frame)" :frameSrc="frame.src" :frameName="frame.name" />
    </template>
  </div>
</template>

<script setup lang="ts" name="FrameLayout">
import FrameView from "./FrameView.vue";
import { useLayoutStore } from "@/stores/layout";
import { useFrame, type Frame } from "./useFrame";

const layoutStore = useLayoutStore();
const { showIframe } = useFrame();
const showFrames = computed(() => unref(layoutStore.frameList).length > 0);
const frameList = computed(() => layoutStore.frameList);
const route = useRoute();

/**
 * @description iframe 是否已经缓存
 */
function isIframeExist(name: string): boolean {
  for (const item of frameList.value) {
    if (item.name === name) {
      return true;
    }
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
    if (frameSrc) {
      const obj: Frame = {
        src: frameSrc as string,
        name: name as string,
        show: true,
      };
      !isIframeExist(obj.name) && frameKeepAlive && layoutStore.addFrame(obj);
    }
  },
  {
    immediate: true,
  }
);
</script>
