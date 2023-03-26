<template>
  <el-card shadow="never" class="pdf-preview-container">
    <template #header>
      <div>
        PDF预览（
        <el-link
          href="https://github.com/hrynko/vue-pdf-embed"
          target="_blank"
          style="font-size: 16px; margin: 0 5px 4px 0"
        >
          Github 地址
        </el-link>
        ）
      </div>
    </template>
    <div v-loading="loading" element-loading-text="加载中 ..." class="pdf-box">
      <div class="pdf-header">
        <div v-if="showAllPages">共{{ pageCount }}页</div>
        <div v-else>
          <el-pagination
            background
            layout="prev, slot, next"
            v-model:current-page="currentPage"
            :page-size="1"
            :total="pageCount"
          >
            {{ currentPage }} / {{ pageCount }}
          </el-pagination>
        </div>
        <div class="header-content">
          <el-checkbox v-model="showAllPages" @change="showAllPagesChange">显示所有页面</el-checkbox>
          <el-tooltip effect="dark" :content="`翻转（当前角度 ${rotations[currentRotation]} 度）`" placement="top">
            <el-icon @click="currentRotation === 3 ? (currentRotation = 0) : (currentRotation += 1)">
              <Refresh />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="打印" placement="top">
            <el-icon @click="onPrint"><Printer /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="source"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="PdfPreview">
import VuePdfEmbed from "vue-pdf-embed";

const pdfRef = ref<any>();
const pageCount = ref(1);
const loading = ref(true);
const currentPage = ref<number>(1);
const currentRotation = ref(0);
const showAllPages = ref(false);
const rotations = [0, 90, 180, 270];

const source = "https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/index/Nginx_day01.pdf";

const handleDocumentRender = () => {
  loading.value = false;
  pageCount.value = pdfRef.value.pageCount;
};

const showAllPagesChange = () => {
  currentPage.value = (showAllPages.value ? null : 1) as number;
};

const onPrint = () => {
  pdfRef.value.print();
};
</script>

<style lang="scss" scoped>
.pdf-preview-container {
  .pdf-box {
    height: calc(100vh - 230px);

    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-content {
        width: 170px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
