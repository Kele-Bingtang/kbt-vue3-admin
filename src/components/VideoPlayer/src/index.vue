<template>
  <div ref="videoRef"></div>
</template>

<script setup lang="ts">
import Player from "xgplayer";
import { ref, unref, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import "xgplayer/dist/index.min.css";

defineOptions({ name: "VideoPlayer" });

export interface PlayerProps {
  url: string;
  poster?: string;
}

const props = withDefaults(defineProps<PlayerProps>(), {
  poster: "",
});

const playerRef = ref<Player>();

const videoRef = ref<HTMLDivElement>();

const intiPlayer = () => {
  if (!unref(videoRef)) return;
  new Player({
    autoplay: false,
    ...props,
    el: unref(videoRef),
  });
};

onMounted(() => {
  intiPlayer();
});

watch(
  () => props,
  async newProps => {
    await nextTick();
    if (newProps) {
      unref(playerRef)?.setConfig(newProps);
    }
  },
  {
    deep: true,
  }
);

onBeforeUnmount(() => {
  unref(playerRef)?.destroy();
});

defineExpose({
  playerExpose: () => unref(playerRef),
});
</script>
