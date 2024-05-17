<template>
  <el-card :class="prefixClass">
    <Cropper
      imgLink="https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png"
      :crop-width="200"
      :crop-height="200"
      :crop-container-height="350"
      image-type="base64"
      @upload-image="uploadImage"
    ></Cropper>
  </el-card>
</template>

<script setup lang="ts" name="CropperDemo">
import { Cropper } from "@/components";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("cropper-demo");

const uploadImage = (imgData: FormData) => {
  console.log(imgData);
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-cropper-demo;

.#{$prefix-class} {
  width: 1000px;
  text-align: center;
}
</style>
