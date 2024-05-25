<template>
  <div :class="prefixClass" v-loading="loading" element-loading-text="加载中...">
    <iframe v-if="needRefresh" :src="iframeSrc" :class="`${prefixClass}__iframe`" ref="frameRef" />
  </div>
</template>

<script setup lang="ts" name="FrameView">
import { withDefaults, nextTick, ref, onMounted, computed, unref } from "vue";
import { mittBus } from "@/utils";
import { useRoute } from "vue-router";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("frame");

const loading = ref(true);
const route = useRoute();
const frameRef = ref<HTMLElement | null>(null);

const props = withDefaults(defineProps<{ frameSrc?: string; frameName?: string }>(), {
  frameSrc: "",
  frameName: "",
});

const iframeSrc = computed(() => {
  if (!props.frameSrc && route.meta?.frameSrc) return route.meta?.frameSrc as string;
  else return props.frameSrc;
});

route.meta?.frameLoading === false && hideLoading();

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

const needRefresh = ref(true);

mittBus.on("refreshFrame", async () => {
  if (route.name === props.frameName) {
    needRefresh.value = false;
    await nextTick();
    needRefresh.value = true;
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-frame;

.#{$prefix-class} {
  z-index: 998;
  height: calc(100vh - 88px);

  &__iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}
</style>
