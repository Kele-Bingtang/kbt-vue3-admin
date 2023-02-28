<template>
  <el-card class="cropper-container">
    <Cropper
      imgLink="https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png"
      :crop-width="200"
      :crop-height="200"
      :crop-container-height="350"
      image-type="base64"
      @upload-image="uploadImage"
    ></Cropper>
  </el-card>
</template>

<script setup lang="ts" name="CropperDemo">
import Cropper from "@/components/Cropper/index.vue";
const uploadImage = (imgData: FormData) => {
  console.log(imgData);
};
</script>

<style lang="scss" scoped>
.cropper-container {
  width: 1000px;
  text-align: center;
}
</style>
