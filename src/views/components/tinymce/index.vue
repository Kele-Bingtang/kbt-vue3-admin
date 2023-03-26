<template>
  <div class="timymce-container">
    <el-alert title="官网地址：https://www.tiny.cloud/" type="success" style="margin-bottom: 10px" />
    <el-button type="primary" @click="handleDisabled" style="margin-bottom: 20px">
      {{ disabled ? "启动编辑器" : "禁用编辑器" }}
    </el-button>
    <el-button type="primary" @click="handleTheme" style="margin-bottom: 20px">
      {{ theme === "default" ? "暗色主题" : "默认主题" }}
    </el-button>
    <Tinymce
      v-if="tinymceActive"
      v-model:value="content"
      :height="400"
      :disabled="disabled"
      :lang="lang"
      :theme="theme"
      :move="true"
      toolbar-mode="sliding"
      @img-upload="handleImgUpload"
      @file-upload="handleFileUpload"
    />
    <h3>实时预览</h3>
    <div class="editor-content" v-html="content"></div>
  </div>
</template>

<script setup lang="ts" name="TinymceDemo">
import Tinymce, { type UITheme } from "@/components/Tinymce/index.vue";
import { useLayoutStore } from "@/stores/layout";
import { tinymceHtml } from "@/test/tinymce";
import { ElMessage } from "element-plus";

const layoutStore = useLayoutStore();
const content = ref(tinymceHtml);
const tinymceActive = ref(true);
const disabled = ref(false);
const theme = ref<UITheme>("default");

const lang = computed(() => layoutStore.language);

onActivated(() => {
  tinymceActive.value = true;
});

onDeactivated(() => {
  tinymceActive.value = false;
});

const handleDisabled = () => {
  disabled.value = !disabled.value;
};

const handleTheme = () => {
  tinymceActive.value = false;
  if (theme.value === "default") {
    theme.value = "dark";
  } else {
    theme.value = "default";
  }
  nextTick(() => {
    tinymceActive.value = true;
  });
};
/**
 * 上传图片，复制图片回调
 * @param blobInfo 文件信息
 * @param success 成功回调，返回链接
 * @param failure 失败回调，返回提示信息
 */
const handleImgUpload = async (blobInfo: any, success: Function, failure: Function) => {
  const blobFile = blobInfo.blob(); // blob 图片
  // let base64File = blobInfo.base64(); // base64 图片
  // fileName 为 Tinymce 内部处理的文件名（官网说 fileName 一定唯一），而 blobFile.name 是文件上传前自带的文件名
  // let fileName = blobInfo.filename();
  const isLt2M = blobFile.size / 1024 / 1024 < 10;
  // const { name } = blobFile;
  // let imgType = name && name.substring(name.lastIndexOf(".") + 1);
  // if (imgType !== "jpg" && imgType !== "png") {
  //   failure("上传文件只能是 jpg、png 格式!");
  //   return false;
  // }
  if (!isLt2M) {
    failure("上传失败，图片不可超过 10M!");
    return false;
  }

  /**
   * 模拟本地批量上传图片，实际应该上传到云端，则下面的 if 需要去掉（单个图片上传时，length 大于 2，只有批量上传，才等于 2）
   * 批量上传只是类似于 for 循环调用该 handleImgUpload 函数，所以实际的云端批量上传，直接把下面的 if 去掉即可
   */
  if (Object.keys(blobInfo).length === 2) {
    const { blobInfo: b, file: f } = await uploadLocal(blobFile);
    success(b.blobUri(), { text: f.name, title: f.name });
  }

  // 上传服务器
  // let formData = new FormData();
  // formData.append("file", blobInfo.blob());
  // axios({
  //   url: "",
  //   method: "post",
  //   data: formData,
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // })
  //   .then((res: any) => {
  //  使用 axios 进行图片上传，注意 this 是否引入成功
  //     const { url, name } = res.data;
  //     success(url, { title: name });
  //   })
  //   .catch(() => {
  //     failure("上传出错，服务器开小差了呢");
  //   });
};
/**
 *
 * @param file 上传的文件
 * @param filetype 在哪个工具上传文件类型："image" | "media" | "file"，并不是上传的文件类型（文件上传就是插入/编辑链接的那个按钮，传入一个链接）
 * @param callback callback 是个回调，参数 1 是一个有效的 http 链接，如果是图片，执行 callback 后就会执行 @img-upload 回调
 */
const handleFileUpload = async (file: File, filetype: "image" | "media" | "file", callback: Function) => {
  if (filetype === "image") {
    if (file.type && !file.type.startsWith("image")) {
      ElMessage.error("请上传图片！");
      return;
    }
    /**
     * 这里不应该上传图片到云端，因为执行完 callback，就会执行 @img-upload 回调，所以请在 @img-upload 的回调函数上传到云端
     * 为了演示 Demo，这里仅仅是上传到本地浏览器，如果上传云端，则在 @img-upload 回调执行逻辑，这里就不进行 if 判断逻辑处理
     */
    const { blobInfo, file: f } = await uploadLocal(file);
    callback(blobInfo.blobUri(), { text: f.name, title: f.name });
  } else if (filetype === "media") {
    const isValid = await validateVideo(file);
    if (isValid) {
      // 本地上传
      const { blobInfo, file: f } = await uploadLocal(file);
      callback(blobInfo.blobUri(), { text: f.name, title: f.name });
      // 云端上传
      // const { url, name } = await uploadFile(file, "video");
      // callback(url, { title: name });
    }
  } else if (filetype === "file") {
    const { blobInfo, file: f } = await uploadLocal(file);
    callback(blobInfo.blobUri(), { text: f.name, title: f.name });
  }
};

/**
 * 上传到本地浏览器
 */
const uploadLocal = (file: File): Promise<{ blobInfo: any; file: File }> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function () {
      const id = "id" + new Date().getTime(); // 本地图片的文件名
      const tinymce = (window as any).tinymce;
      const blobCache = tinymce.activeEditor.editorUpload.blobCache;
      const base64 = (reader as any).result.split(",")[1];
      const blobInfo = blobCache.create(id, file, base64);
      blobCache.add(blobInfo);
      resolve({ blobInfo, file });
    };
    reader.readAsDataURL(file);
  });
};
/**
 * 视频上传前验证
 */
const validateVideo = async (file: File) => {
  const isMP4 = file.type === "video/mp4"; // 如果允许所有视频格式，可以 file.type.startsWith("video")
  const isLt100M = file.size / 1024 / 1024 < 100;

  if (!isMP4) {
    ElMessage.error("上传视频必须为 MP4 格式！");
    return false;
  }

  if (!isLt100M) {
    ElMessage.error("上传视频大小限制 100M 以内！");
    return false;
  }

  const duration = await getVideoDuration(file);
  if (duration > 60) {
    ElMessage.error("上传视频时长不能超过 60 秒！");
    return false;
  }
  return true;
};
/**
 * @description 获取视频时长
 * @param {File} file - 要上传的文件
 * @returns {Promise<number>}
 */
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise(resolve => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(file);

    videoElement.addEventListener("loadedmetadata", () => {
      resolve(videoElement.duration);
    });
  });
};
/**
 * @description 上传文件
 * @param {File} file - 要上传的文件
 * @param {string} folder - 所存放的文件夹，如果你的服务器没有该配置，则不需要传
 * @returns {Object}
 */
// const uploadFile = async (file: any, folder = "video") => {
// const formData = new FormData();
// formData.append("file", file);
// formData.append("accept", folder);

// 注：此为调用后端上传接口，需根据实际情况进行调整
// const { data } = await axios({
//   method: "POST",
//   url: "/api/v1/upload",
//   data: formData,
//   headers: { "Content-Type": "multipart/form-data" },
// });

// return {
//   url: data.url,
//   name: file.name,
// };
//   return {
//     url: "",
//     name: "",
//   };
// };
</script>

<style lang="scss" scoped>
.timymce-container {
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
}
</style>
