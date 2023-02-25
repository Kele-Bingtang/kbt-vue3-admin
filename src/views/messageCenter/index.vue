<template>
  <div class="message-center-container">
    <el-card class="message-center-card">
      <div class="message-page message-category">
        <el-menu default-active="unread" @select="handleCategorySelect">
          <el-menu-item index="unread">
            <span class="category">
              未读消息
              <el-badge :value="unreadCount" type="danger" :max="99"></el-badge>
            </span>
          </el-menu-item>
          <el-menu-item index="hasRead">
            <span class="category">
              已读消息
              <el-badge :value="readCount" type="success"></el-badge>
            </span>
          </el-menu-item>
          <el-menu-item index="recycle">
            <span class="category">
              回收站
              <el-badge :value="recycleCount" type="info"></el-badge>
            </span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="message-page message-list" v-loading="listLoading">
        <el-menu
          default-active="1"
          @select="handleListSelect"
          :class="{
            'unread-list': selectedMessageType === 'hasRead',
            'recycle-list': selectedMessageType === 'recycle',
          }"
        >
          <el-menu-item v-for="message in messageList" :key="`message_${message.id}`" :index="message.id">
            <p class="list-title">{{ message.title }}</p>
            <div class="list-time">
              <span class="list-dot"></span>
              <span class="list-text">{{ message.createTime }}</span>
            </div>
            <el-button
              link
              class="list-operate operate-icon"
              :loading="message.loading"
              :icon="selectedMessageType === 'hasRead' ? 'Delete' : 'RefreshLeft'"
              @click.stop="handleOperate(message)"
              v-if="selectedMessageType !== 'unread'"
            ></el-button>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="message-page message-content" v-loading="contentLoading" element-loading-text="拼命加载中 ...">
        <div class="message-content-header">
          <h2 class="message-content-title">{{ selectedMessageItem.title }}</h2>
          <time class="message-content-time">{{ selectedMessageItem.createTime }}</time>
        </div>
        <div v-html="selectedMessageItem.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="MessageCenter">
import type { MessageItem } from "@/stores";
import { useMessageStore } from "@/stores/message";
import { ElMessage, ElMessageBox } from "element-plus";

type MessageType = "unread" | "hasRead" | "recycle";

const messageStore = useMessageStore();

const listLoading = ref(false);
const contentLoading = ref(false);
const selectedMessageType = ref<MessageType>("unread");
const lastReadMessageId = ref("");
const selectedMessageItem = ref<MessageItem>({
  id: "",
  title: "",
  content: "",
  createTime: "",
});

const unreadCount = computed(() => messageStore.unreadMessageList.length);
const readCount = computed(() => messageStore.hasReadMessageList.length);
const recycleCount = computed(() => messageStore.recycleMessageList.length);
const messageList = computed(() => {
  if (selectedMessageType.value === "unread") return messageStore.unreadMessageList;
  else if (selectedMessageType.value === "hasRead") return messageStore.hasReadMessageList;
  else if (selectedMessageType.value === "recycle") return messageStore.recycleMessageList;
  return [];
});

onMounted(() => {
  // 请求获取消息列表
  listLoading.value = true;
  messageStore
    .getMessageList()
    .then(() => {
      // 模拟延迟
      setTimeout(() => {
        listLoading.value = false;
      }, 1000);
    })
    .catch(() => (listLoading.value = false));
});

const handleCategorySelect = (id: string) => {
  selectedMessageType.value = id as MessageType;
  messageHasRead();
};

const handleListSelect = (id: string) => {
  contentLoading.value = true;
  // 模拟延迟
  setTimeout(() => {
    const item = messageList.value.find(item => item.id === id);
    if (item) {
      selectedMessageItem.value = item;
    }
    contentLoading.value = false;
    if (selectedMessageType.value === "unread") {
      messageHasRead(id);
    }
  }, 1000);
};

const messageHasRead = (id?: string) => {
  if (lastReadMessageId.value) {
    messageStore.messageHasRead({ id: lastReadMessageId.value }).then(() => {
      lastReadMessageId.value = id || "";
    });
  } else {
    lastReadMessageId.value = id || "";
  }
};

const handleOperate = (message: MessageItem) => {
  message.loading = true;
  const { id } = message;
  if (selectedMessageType.value === "hasRead") {
    // 删除
    ElMessageBox.confirm("您确定将该消息放到回收站吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        messageStore.removeReadMessage({ id });
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        message.loading = false;
      })
      .catch(() => {
        message.loading = false;
      });
  } else {
    // 恢复
    ElMessageBox.confirm("您确定恢复该消息吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        messageStore.restoreRecycleMessage({ id });
        ElMessage({
          type: "success",
          message: "恢复成功!",
        });
        message.loading = false;
      })
      .catch(() => {
        message.loading = false;
      });
  }
};
</script>

<style lang="scss" scoped>
.message-center-container {
  height: 100%;
  padding: 20px;
  .message-center-card {
    height: 100%;
    .message-page {
      height: 100%;
      display: inline-block;
      vertical-align: top;
      position: relative;
      border-right: 1px solid #e6e6e6;
      .el-menu {
        width: auto;
        .el-menu-item.is-active {
          // background-color: #f0faff;
          &:after {
            content: "";
            display: block;
            width: 2px;
            position: absolute;
            top: 0;
            bottom: 0;
            right: -1px;
            background: var(--el-color-primary);
          }
          .list-dot {
            background-color: var(--el-color-primary) !important;
          }
        }
        .el-badge {
          margin-left: 10px;
          vertical-align: middle;
          :deep(.el-badge__content) {
            vertical-align: middle;
          }
        }
      }
      &.message-category {
        width: 200px;
      }

      &.message-list {
        width: 230px;
        .el-menu-item {
          display: block;
          height: auto;
          line-height: 21px;
          padding: 14px 20px;
          white-space: normal;
          .list-title {
            margin: 0;
            padding: 0;
          }
          .list-time {
            display: inline-block;
            .list-dot {
              width: 6px;
              height: 6px;
              display: inline-block;
              border-radius: 50%;
              vertical-align: middle;
              position: relative;
              top: -1px;
              background-color: #e6e8f1;
            }
            .list-text {
              display: inline-block;
              color: #515a6e;
              font-size: 12px;
              margin-left: 6px;
            }
          }
          .list-operate {
            float: right;
            margin-right: 17px;
            padding-top: 3px;
            align-items: normal;
          }
          :deep(.el-icon) {
            font-size: 13px;
            display: none;
            color: #909399;
            &:hover {
              color: var(--el-color-primary);
            }
          }
          &:hover {
            :deep(.el-icon) {
              display: inline-block;
            }
          }
        }
        .unread-list {
          .el-menu-item:not(.is-active) {
            color: #aaa9a9;
          }
        }
      }

      &.message-content {
        width: calc(100% - 450px);
        padding: 12px 20px 0;
        overflow: auto;
        .message-content-header {
          margin-bottom: 20px;
          .message-content-title {
            display: inline-block;
            color: #515a6e;
            margin: 0;
            padding: 0;
          }
          .message-content-time {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message-center-container {
  height: 100%;
  padding: 20px;
  .message-center-card {
    .el-card__body {
      height: 100%;
      white-space: nowrap;
      overflow: auto;
    }
  }
}
.mobile {
  .message-center {
    .message-content {
      width: 100% !important;
    }
  }
}
</style>
