<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <el-link href="https://www.wangeditor.com/" target="_blank" :underline="false" style="font-size: 20px">
          WangEditor 富文本
        </el-link>
      </template>
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
    </el-card>

    <el-card shadow="never" header="实时预览">
      <div class="editor-content" v-html="content"></div>
    </el-card>

    <el-card shadow="never" header="源代码">
      {{ content }}
    </el-card>
  </el-space>
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
