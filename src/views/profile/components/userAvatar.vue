<template>
  <div class="user-avatar-container">
    <div class="user-avatar-header" @click="openDialog">
      <el-image :src="user.avatar" title="点击上传头像" class="user-avatar" alt="头像">
        <template #error>
          <el-image :src="defaultAvatar" class="user-avatar" alt="头像" />
        </template>
      </el-image>
    </div>

    <el-dialog
      title="修改头像"
      v-model="dialogVisible"
      width="800px"
      append-to-body
      @close="handleClose"
      class="user-avatar-dialog"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <cropper
        :imgLink="user.avatar"
        :crop-width="200"
        :crop-height="200"
        :crop-container-height="350"
        image-type="base64"
        @upload-image="uploadImage"
      ></cropper>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="UserAvatar">
import type { UserInfo } from "@/stores";
import Cropper from "@/components/Cropper/index.vue";
import defaultAvatar from "@/assets/images/default.png";

const props = defineProps<{ user: UserInfo }>();
const { user } = toRefs(props);
const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};
const uploadImage = (imgData: FormData) => {
  console.log(imgData);
};
</script>

<style lang="scss" scoped>
.user-avatar-container {
  position: relative;
  display: inline-block;
  height: 100%;

  .user-avatar-header:hover::after {
    position: absolute;
    inset: 0;
    font-size: 24px;
    font-style: normal;
    line-height: 110px;
    color: #eeeeee;
    cursor: pointer;
    content: "+";
    background: rgb(0 0 0 / 50%);
    border-radius: 50%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
</style>
