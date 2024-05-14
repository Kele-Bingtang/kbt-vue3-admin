<template>
  <div class="wang-editor-container">
    <el-alert title="官网地址：https://www.wangeditor.com/" type="success" style="margin-bottom: 10px" />
    <el-button type="primary" @click="disabled = !disabled" style="margin-bottom: 20px">
      {{ disabled ? "启动编辑器" : "禁用编辑器" }}
    </el-button>
    <WangEditor
      v-model="content"
      height="400px"
      :disabled="disabled"
      @image-upload="imageUpload"
      @video-upload="videoUpload"
      @file-upload="fileUpload"
    ></WangEditor>
    <h3>实时预览</h3>
    <div class="editor-content" v-html="content"></div>
    {{ content }}
  </div>
</template>

<script setup lang="ts" name="WangEditorDemo">
import { WangEditor, type FileInsertFnType, type ImageInsertFnType, type VideoInsertFnType } from "@/components";
import { uploadLocal } from "@/utils";

const content = ref("");
const disabled = ref(false);

const imageUpload = async (file: File, insertFn: ImageInsertFnType) => {
  // 上传到本地
  const { blobInfo, file: f } = await uploadLocal(file);
  console.log(blobInfo);
  const url = URL.createObjectURL(file);
  insertFn(url, f.name);
  // 上传服务器
  // uploadFiles(file, appId, this.$sso.userId)
  //   .then(res => {
  //     if (res.result === true) {
  //       let { fileKey, fileName } = res.data[0];
  //       let url = `${import.meta.env.VITE_API_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
  //       insertFn(url, fileName);
  //     } else {
  //       this.$message.error("上传出错，服务器开小差了呢");
  //     }
  //   })
  //   .catch(() => {
  //     this.$message.error("上传出错，服务器开小差了呢");
  //   });
};

const videoUpload = async (file: File, insertFn: VideoInsertFnType) => {
  // 上传到本地
  const { blobInfo, file: f } = await uploadLocal(file);
  console.log(blobInfo);
  const url = URL.createObjectURL(file);
  insertFn(url, f.name);
  // 上传服务器
  // uploadFiles(file, appId, this.$sso.userId)
  //   .then(res => {
  //     if (res.result === true) {
  //       let { fileKey, fileName } = res.data[0];
  //       let url = `${import.meta.env.VITE_API_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
  //       insertFn(url, fileName);
  //     } else {
  //       this.$message.error("上传出错，服务器开小差了呢");
  //     }
  //   })
  //   .catch(() => {
  //     this.$message.error("上传出错，服务器开小差了呢");
  //   });
};

const fileUpload = async (file: File, insertFn: FileInsertFnType) => {
  // 上传到本地
  const { blobInfo, file: f } = await uploadLocal(file);
  console.log(blobInfo);
  const url = URL.createObjectURL(file);
  insertFn(f.name, url);
  // 上传服务器
  // uploadFiles(file, appId, this.$sso.userId)
  //   .then(res => {
  //     if (res.result === true) {
  //       let { fileKey, fileName } = res.data[0];
  //       let url = `${import.meta.env.VITE_API_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
  // 名称放在前面
  //       insertFn(fileName, url);
  //     } else {
  //       this.$message.error("上传出错，服务器开小差了呢");
  //     }
  //   })
  //   .catch(() => {
  //     this.$message.error("上传出错，服务器开小差了呢");
  //   });
};
</script>

<style lang="scss" scoped>
.wang-editor-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;
}
</style>
