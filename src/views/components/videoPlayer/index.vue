<template>
  <el-card shadow="never" header="视频播放器">
    <VideoPlayer
      url="//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4"
      poster="//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/poster.jpg"
    />

    <el-divider />

    <el-button @Click="showVideo">视频播放器预览</el-button>
  </el-card>
</template>

<script setup lang="ts" name="VideoPlayerDemo">
import { VideoPlayer, createVideoViewer } from "@/components";

const showVideo = () => {
  createVideoViewer({
    url: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4",
    poster: "//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/poster.jpg",
  });
};
</script>

<style lang="scss" scoped></style>
