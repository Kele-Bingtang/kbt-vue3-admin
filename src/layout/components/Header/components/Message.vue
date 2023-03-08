<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="noticeList.length" class="item">
          <svg-icon name="bell" width="25px" height="25px" :icon-style="{ cursor: 'pointer' }" />
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`通知(${noticeList.length})`" name="first">
          <template v-if="noticeList.length > 0">
            <div class="message-list">
              <div class="message-item" v-for="notice in noticeList" :key="notice.id">
                <img :src="notice.image" alt="" class="message-icon" />
                <div class="message-content">
                  <span class="message-title">{{ notice.title }}</span>
                  <span class="message-date">{{ notice.createTime }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="message-empty" v-else>
            <img src="@/assets/images/msg/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`消息(${messageList.length})`" name="second">
          <template v-if="messageList.length > 0">
            <div class="message-list">
              <div class="message-item" v-for="message in messageList" :key="message.id">
                <img src="@/assets/images/msg/msg02.png" alt="" class="message-icon" />
                <div class="message-content">
                  <span class="message-title">{{ message.title }}</span>
                  <span class="message-date">{{ message.createTime }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="message-empty" v-else>
            <img src="@/assets/images/msg/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代办(0)" name="third">
          <div class="message-empty">
            <img src="@/assets/images/msg/notData.png" alt="notData" />
            <div>暂无代办</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from "@/stores/message";
import { ref } from "vue";

const noticeList = [
  {
    id: "1",
    image: "/src/assets/images/msg/msg01.png",
    title: "7 点起床",
    createTime: "一分钟前",
  },
  {
    id: "2",
    image: "/src/assets/images/msg/msg02.png",
    title: "12 点吃午餐",
    createTime: "一小时前",
  },
  {
    id: "3",
    image: "/src/assets/images/msg/msg03.png",
    title: "18 点下班",
    createTime: "半天前",
  },
  {
    id: "4",
    image: "/src/assets/images/msg/msg04.png",
    title: "19 点学习",
    createTime: "一星期前",
  },
  {
    id: "5",
    image: "/src/assets/images/msg/msg05.png",
    title: "24 点睡觉",
    createTime: "一个月前",
  },
];

const messageStore = useMessageStore();

const activeName = ref("first");
const messageList = computed(() => messageStore.unreadMessageList);

onMounted(() => {
  // 请求获取消息列表
  messageStore.getMessageList();
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
