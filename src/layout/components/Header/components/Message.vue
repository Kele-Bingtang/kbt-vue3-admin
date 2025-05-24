<template>
  <!-- 三个 tab：通知、消息、代办。三个的 DOM 结构基本一样，所以可以写一个 Item 组件进行封装，然后循环传入即可 -->
  <div :class="prefixClass">
    <el-popover placement="bottom" :width="330" trigger="click" popper-class="message-popover">
      <template #reference>
        <el-badge :value="messageLength" :class="`${prefixClass}__badge-item`">
          <Icon name="bell" width="25px" height="25px" :icon-style="{ cursor: 'pointer' }" />
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`通知(${noticeList.length})`" name="first">
          <el-scrollbar max-height="365px" v-if="noticeList.length > 0">
            <div :class="`${prefixClass}__list`">
              <div :class="`${prefixClass}__list-item`" v-for="notice in noticeList" :key="notice.id">
                <img :src="notice.image" alt="" :class="`${prefixClass}__list-item__icon`" />
                <div :class="`${prefixClass}__list-item__content`">
                  <div :class="`${prefixClass}__list-item__content--header`">
                    <Tooltip :effect="SystemConfig.layoutConfig.tooltipEffect" :line="1" :try="1">
                      <span>{{ notice.title }}</span>
                    </Tooltip>
                  </div>
                  <span :class="`${prefixClass}__list-item__content--date`">{{ notice.createTime }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div :class="`${prefixClass}__empty`" v-else>
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`消息(${messageList.length})`" name="second">
          <el-scrollbar max-height="365px" v-if="messageList.length > 0">
            <div :class="`${prefixClass}__list`">
              <el-button @click="$router.push('/message-center')">详情</el-button>
              <div :class="`${prefixClass}__list-item`" v-for="message in messageList" :key="message.id">
                <img src="@/assets/images/msg/msg02.png" alt="" :class="`${prefixClass}__list-item__icon`" />
                <div :class="`${prefixClass}__list-item__content`">
                  <div :class="`${prefixClass}__list-item__content--header`">
                    <Tooltip :effect="SystemConfig.layoutConfig.tooltipEffect" :line="1" :try="1">
                      <span>{{ message.title }}</span>
                    </Tooltip>
                  </div>
                  <Tooltip :effect="SystemConfig.layoutConfig.tooltipEffect" :line="2" :try="1">
                    <span :class="`${prefixClass}__list-item__content--desc`">{{ message.description }}</span>
                  </Tooltip>
                  <span :class="`${prefixClass}__list-item__content--date`">{{ message.createTime }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div :class="`${prefixClass}__empty`" v-else>
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`代办(${arList.length})`" name="third">
          <el-scrollbar max-height="365px" v-if="arList.length > 0">
            <div :class="`${prefixClass}__list`">
              <div :class="`${prefixClass}__list-item`" v-for="ar in arList" :key="ar.id">
                <div :class="`${prefixClass}__list-item__content`">
                  <div :class="`${prefixClass}__list-item__content--header`">
                    <Tooltip :line="1" :try="1">
                      <span>{{ ar.title }}</span>
                    </Tooltip>
                    <el-tag v-if="ar.priority.name" style="margin-right: 2px" :type="ar.priority.type" size="small">
                      {{ ar.priority.name }}
                    </el-tag>
                    <el-tag v-if="ar.status.name" :type="ar.status.type" size="small">
                      {{ ar.status.name }}
                    </el-tag>
                  </div>
                  <Tooltip :line="2" :try="1">
                    <span :class="`${prefixClass}__list-item__content--desc`">{{ ar.description }}</span>
                  </Tooltip>
                  <span :class="`${prefixClass}__list-item__content--date`">{{ ar.closeTime }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div :class="`${prefixClass}__empty`" v-else>
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无代办</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { ElPopover, ElTabs, ElTabPane, ElScrollbar, ElButton, ElBadge, ElTag } from "element-plus";
import { useMessageStore } from "@/stores";
import SystemConfig from "@/config";
import { Tooltip } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("message-notice");
const prefixClass = ns.b();

interface Notice {
  id: string;
  image: string;
  title: string;
  createTime: string;
}

interface TitleTag {
  name: string;
  type: "primary" | "danger" | "success" | "info" | "warning";
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
    title: "Kbt Vue3 Admin 版本发布",
    description: "Kbt Vue3 Admin 版本发布",
    status: {
      name: "进行中",
      type: "primary",
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

onMounted(() => {
  // 请求获取消息列表
  messageStore.getMessageList();
});
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-message-notice;

.#{$prefix-class} {
  &__list {
    display: flex;
    flex-direction: column;
    padding: 10px 24px;

    &-item {
      display: flex;
      align-items: center;
      padding: 13px 0;
      border-bottom: 1px solid var(--#{$el-namespace}-border-color-light);

      &:last-child {
        border: none;
      }

      &__icon {
        width: 40px;
        height: 40px;
        margin: 0 20px 0 5px;
      }

      &__content {
        display: flex;
        flex: 1;
        flex-direction: column;

        &--header {
          display: flex;
          flex: 1;
          width: 220px;
          margin-bottom: 5px;
          color: rgb(0 0 0 / 85%);
        }

        &--desc {
          margin-bottom: 5px;
          font-size: 12px;
          color: #000000;
        }

        &--date {
          font-size: 12px;
          color: var(--#{$el-namespace}-text-color-secondary);
        }
      }
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    line-height: 45px;
  }
}
</style>

<style lang="scss">
.message-popover {
  padding: 0 !important;

  .#{$el-namespace}-tabs__header {
    margin: 0;
  }

  .#{$el-namespace}-tabs__nav-wrap {
    display: flex;
    justify-content: center;
  }
}
</style>
