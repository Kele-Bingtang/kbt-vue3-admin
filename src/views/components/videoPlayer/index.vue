<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <el-link
          href="https://v2.h5player.bytedance.com/gettingStarted/"
          target="_blank"
          :underline="false"
          style="font-size: 20px"
        >
          视频播放器
        </el-link>
      </template>
      <VideoPlayer
        url="//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4"
        poster="//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/poster.jpg"
      />

      <el-divider />

      <el-button @Click="showVideo">函数式打开视频播放器预览</el-button>

      <el-button @Click="visible = true">组件式打开视频播放器预览</el-button>
      <VideoPlayerViewer v-model="visible" v-bind="videoInfo" />
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="VideoPlayerDemo">
import { VideoPlayer, createVideoViewer, VideoPlayerViewer } from "@/components";

const videoInfo = {
  url: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4",
  poster: "//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/poster.jpg",
};

const showVideo = () => {
  createVideoViewer(videoInfo);
};

const visible = ref(false);
</script>
