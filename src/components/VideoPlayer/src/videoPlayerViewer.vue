<template>
  <ElOverlay v-show="visible" @click="close">
    <div class="video-player-viewer" @click="close">
      <div class="video-player-viewer-close" @click="close">
        <Icon icon="ep:close" :size="24" />
      </div>
      <VideoPlayer :url="url" :poster="poster" />
    </div>
  </ElOverlay>
</template>

<script setup lang="ts">
import VideoPlayer from "./index.vue";
import { ElOverlay } from "element-plus";
import { ref, nextTick, withDefaults, defineOptions, defineProps } from "vue";
import { Icon } from "@/components";

defineOptions({ name: "VideoPlayerViewer" });

interface VideoPlayerViewerProps {
  show?: boolean;
  url?: string;
  poster?: string;
  id?: string;
}

const props = withDefaults(defineProps<VideoPlayerViewerProps>(), {
  show: false,
  url: "",
  poster: "",
  id: "",
});

const visible = ref(props.show);

const close = async () => {
  visible.value = false;
  await nextTick();
  const wrap = document.getElementById(props.id);
  if (!wrap) return;
  document.body.removeChild(wrap);
};
</script>

<style lang="scss" scoped>
.video-player-viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .video-player-viewer-close {
    position: absolute;
    top: 40px;
    right: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: #ffffff;
    cursor: pointer;
    background: var(--el-text-color-regular);
    border: #ffffff;
    border-radius: 9999px;
  }
}
</style>
