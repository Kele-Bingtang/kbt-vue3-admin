<template>
  <div class="frame-container" v-loading="loading" element-loading-text="加载中...">
    <iframe :src="frameSrc" class="frame-iframe" ref="frameRef" />
  </div>
</template>

<script setup lang="ts" name="FrameView">
import { useRoute } from "vue-router";

const loading = ref(true);
const currentRoute = useRoute();
const frameSrc = ref<string>("");
const frameRef = ref<HTMLElement | null>(null);

if (unref(currentRoute.meta)?.frameSrc) {
  frameSrc.value = unref(currentRoute.meta)?.frameSrc as string;
}
unref(currentRoute.meta)?.frameLoading === false && hideLoading();

function hideLoading() {
  loading.value = false;
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    const _frame = iframe as any;
    if (_frame.attachEvent) {
      _frame.attachEvent("onload", () => {
        hideLoading();
      });
    } else {
      iframe.onload = () => {
        hideLoading();
      };
    }
  });
}

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.frame-container {
  z-index: 998;
  height: calc(100vh - 88px);

  .frame-iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}
</style>
<style lang="scss">
.el-main {
  padding: 0 !important;
}

::-webkit-scrollbar {
  display: none;
}
</style>
