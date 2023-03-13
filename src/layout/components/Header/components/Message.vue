<template>
  <!-- 三个 tab：通知、消息、代办。三个的 DOM 结构基本一样，所以可以写一个 Item 组件进行封装，然后循环传入即可 -->
  <div class="message-container">
    <el-popover placement="bottom" :width="330" trigger="click" popper-class="message-popover">
      <template #reference>
        <el-badge :value="messageLength" class="item">
          <svg-icon name="bell" width="25px" height="25px" :icon-style="{ cursor: 'pointer' }" />
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`通知(${noticeList.length})`" name="first">
          <el-scrollbar max-height="365px" v-if="noticeList.length > 0">
            <div class="message-list">
              <div class="message-item" v-for="notice in noticeList" :key="notice.id">
                <img :src="notice.image" alt="" class="message-icon" />
                <div class="message-content">
                  <el-tooltip
                    popper-class="message-tooltip"
                    effect="light"
                    :content="notice.title"
                    placement="top"
                    :disabled="!titleTooltip"
                  >
                    <div class="message-title" @mouseover="hoverTitle">
                      <span class="title">{{ notice.title }}</span>
                    </div>
                  </el-tooltip>
                  <span class="message-date">{{ notice.createTime }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="message-empty" v-else>
            <img src="@/assets/images/msg/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`消息(${messageList.length})`" name="second">
          <el-scrollbar max-height="365px" v-if="messageList.length > 0">
            <div class="message-list">
              <el-button @click="$router.push('/message-center')">详情</el-button>
              <div class="message-item" v-for="message in messageList" :key="message.id">
                <img src="@/assets/images/msg/msg02.png" alt="" class="message-icon" />
                <div class="message-content">
                  <el-tooltip
                    popper-class="message-tooltip"
                    effect="light"
                    :content="message.title"
                    placement="top"
                    :disabled="!titleTooltip"
                  >
                    <div class="message-title" @mouseover="hoverTitle">
                      <span class="title">{{ message.title }}</span>
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    popper-class="message-tooltip"
                    effect="light"
                    :content="message.description"
                    placement="top"
                    :disabled="!descriptionTooltip"
                  >
                    <span class="message-desc" @mouseover="hoverDescription($event, message.description)">
                      {{ message.description }}
                    </span>
                  </el-tooltip>
                  <span class="message-date">{{ message.createTime }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="message-empty" v-else>
            <img src="@/assets/images/msg/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`代办(${arList.length})`" name="third">
          <el-scrollbar max-height="365px" v-if="arList.length > 0">
            <div class="message-list">
              <div class="message-item" v-for="ar in arList" :key="ar.id">
                <div class="message-content">
                  <div class="message-title">
                    <el-tooltip
                      popper-class="message-tooltip"
                      effect="light"
                      :content="ar.title"
                      placement="top"
                      :disabled="!titleTooltip"
                    >
                      <span class="title" @mouseover="hoverTitle">{{ ar.title }}</span>
                    </el-tooltip>
                    <el-tag v-if="ar.priority.name" style="margin-right: 2px" :type="ar.priority.type" size="small">
                      {{ ar.priority.name }}
                    </el-tag>
                    <el-tag v-if="ar.status.name" :type="ar.status.type" size="small">
                      {{ ar.status.name }}
                    </el-tag>
                  </div>
                  <el-tooltip
                    popper-class="message-tooltip"
                    effect="light"
                    :content="ar.description"
                    placement="top"
                    :disabled="!descriptionTooltip"
                  >
                    <span class="message-desc" @mouseover="hoverDescription($event, ar.description)">
                      {{ ar.description }}
                    </span>
                  </el-tooltip>
                  <span class="message-date">{{ ar.closeTime }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="message-empty" v-else>
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

interface Notice {
  id: string;
  image: string;
  title: string;
  createTime: string;
}

interface TitleTag {
  name: string;
  type: "" | "danger" | "success" | "info" | "warning";
}

interface Ar {
  id: string;
  title: string;
  description: string;
  status: TitleTag;
  priority: TitleTag;
  closeTime: string;
}

const noticeList: Notice[] = [
  {
    id: "1",
    image: import.meta.env.DEV ? `/src/assets/images/msg/msg01.png` : "https://youngkbt.cn//public/msg/msg01.png",
    title: "请您尽快填写本周的周报。",
    createTime: "一分钟前",
  },
  {
    id: "2",
    image: import.meta.env.DEV ? `/src/assets/images/msg/msg02.png` : "https://youngkbt.cn//public/msg/msg02.png",
    title: "您今天有 4 个重要会议。",
    createTime: "一小时前",
  },
  {
    id: "3",
    image: import.meta.env.DEV ? `/src/assets/images/msg/msg03.png` : "https://youngkbt.cn//public/msg/msg03.png",
    title: "请下午 18:30 参加前端面试。",
    createTime: "半天前",
  },
  {
    id: "4",
    image: import.meta.env.DEV ? `/src/assets/images/msg/msg04.png` : "https://youngkbt.cn//public/msg/msg04.png",
    title: "今天将举行消费演练，于下午 14 点至 16 点之间开始，请注意配合，谢谢！",
    createTime: "一星期前",
  },
  {
    id: "5",
    image: import.meta.env.DEV ? `/src/assets/images/msg/msg05.png` : "https://youngkbt.cn//public/msg/msg05.png",
    title: "恭喜您喜获 2022 年人才质量提升奖。",
    createTime: "一个月前",
  },
];

const arList: Ar[] = [
  {
    id: "1",
    title: "Kbt-Admin 版本发布",
    description: "Kbt-Admin 版本发布",
    status: {
      name: "进行中",
      type: "",
    },
    priority: {
      name: "高",
      type: "danger",
    },
    closeTime: "2099-12-31",
  },
  {
    id: "2",
    title: "参加 IT 方案评审例会",
    description:
      "【会议通知】IT 运作周例会   时间：3月13日（周一）09:30-12:00，地点：(山海平吉)2-B05R中会议室；请您预留时间准时与会，谢谢~",
    status: {
      name: "即将截至",
      type: "danger",
    },
    priority: {
      name: "中",
      type: "warning",
    },
    closeTime: "2023-09-15",
  },
  {
    id: "3",
    title: "通知",
    description: "请 Jessany 完成 API 网关和证书系统",
    status: {
      name: "已耗时 7 天",
      type: "warning",
    },
    priority: {
      name: "低",
      type: "info",
    },
    closeTime: "2023-12-31",
  },
  {
    id: "4",
    title: "开发 ETS 系统",
    description: "请 Kobe 在截止日期（2023-07-27）前开发出第一版 ETS 系统",
    status: {
      name: "已完成",
      type: "success",
    },
    priority: {
      name: "高",
      type: "danger",
    },
    closeTime: "2023-07-27",
  },
];

const messageStore = useMessageStore();

const activeName = ref("first");
const messageList = computed(() => messageStore.unreadMessageList);
const messageLength = computed(() => noticeList.length + messageList.value.length);
const titleTooltip = ref(false);
const descriptionTooltip = ref(false);

onMounted(() => {
  // 请求获取消息列表
  messageStore.getMessageList();
});

const hoverTitle = (e: any) => {
  nextTick(() => {
    const titleDom = e.target;
    titleDom && titleDom.scrollWidth > titleDom?.clientWidth
      ? (titleTooltip.value = true)
      : (titleTooltip.value = false);
  });
};

const hoverDescription = (event: any, description: string | undefined) => {
  // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取 currentWidth ,最后在移除
  const tempTag = document.createElement("span");
  tempTag.innerText = description ?? "";
  tempTag.className = "getDescriptionWidth";
  const bodyDom = document.querySelector("body");
  bodyDom && bodyDom.appendChild(tempTag);
  const currentWidth = (document.querySelector(".getDescriptionWidth") as HTMLSpanElement).offsetWidth;
  const descriptionDom = document.querySelector(".getDescriptionWidth");
  descriptionDom && descriptionDom.remove();

  // cellWidth 为容器的宽度
  const cellWidth = event.target?.offsetWidth;

  // 当文本宽度大于容器宽度两倍时，代表文本显示超过两行
  currentWidth > 2 * cellWidth ? (descriptionTooltip.value = true) : (descriptionTooltip.value = false);
};
</script>

<style lang="scss" scoped>
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
  padding: 10px 24px;
  .message-item {
    display: flex;
    align-items: center;
    padding: 13px 0;
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
      flex: 1;
      .message-title {
        display: flex;
        flex: 1;
        margin-bottom: 5px;
        color: rgba(0, 0, 0, 0.85);
        .title {
          flex: 1;
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; // 1 行溢出后隐藏文字
        }
      }
      .message-desc {
        display: -webkit-box;
        -webkit-line-clamp: 2; // 2 行溢出后隐藏文字
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        color: #000;
        font-size: 12px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>

<style lang="scss">
.message-popover {
  padding: 0 !important;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__nav-wrap {
    display: flex;
    justify-content: center;
  }
}
.message-tooltip {
  max-width: 240px;
}
</style>
