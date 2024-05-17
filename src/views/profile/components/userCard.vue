<template>
  <el-card style="margin-bottom: 20px" :class="prefixClass">
    <template #header>
      <span>个人中心</span>
    </template>

    <div :class="`${prefixClass}__header`">
      <div :class="`${prefixClass}__header--content`">
        <slot>
          <el-image :src="user.avatar" class="user-avatar" alt="头像">
            <template #error>
              <el-image :src="defaultAvatar" class="user-avatar" alt="头像" />
            </template>
          </el-image>
        </slot>
      </div>
      <div :class="`${prefixClass}__header--content`">
        <div class="user-name">
          {{ user.username }}
        </div>
        <div class="user-role">
          {{ getUserRoles(user.roles) }}
        </div>
      </div>
    </div>

    <div :class="`${prefixClass}__info`">
      <div :class="`${prefixClass}__info--section`">
        <div :class="`${prefixClass}__info--section__header`">
          <span>基本信息</span>
        </div>
        <div :class="`${prefixClass}__info--section__body`">
          <div class="basic-info">
            <div class="basic-info-item">
              <span>用户名称</span>
              <div class="basic-info-content">{{ user.username }}</div>
            </div>
            <div class="basic-info-item">
              <span>用户性别</span>
              <div class="basic-info-content">{{ user.sex }}</div>
            </div>
            <div class="basic-info-item">
              <span>联系方式</span>
              <div class="basic-info-content">{{ user.phone }}</div>
            </div>
            <div class="basic-info-item">
              <span>用户邮箱</span>
              <div class="basic-info-content">{{ user.email }}</div>
            </div>
            <div class="basic-info-item">
              <span>用户角色</span>
              <div class="basic-info-content">{{ getUserRoles(user.roles) }}</div>
            </div>
            <div class="basic-info-item">
              <span>注册时间</span>
              <div class="basic-info-content">{{ user.registerTime }}</div>
            </div>
          </div>
        </div>
      </div>

      <div :class="`${prefixClass}__info--section user-skills`">
        <div :class="`${prefixClass}__info--section__header`">
          <span>核心技术栈</span>
        </div>
        <div :class="`${prefixClass}__info--section__body`">
          <div class="progress-item">
            <span>Java（希望）</span>
            <el-progress :percentage="100" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Spring</span>
            <el-progress :percentage="55" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Docker</span>
            <el-progress :percentage="44" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Web（前端）</span>
            <el-progress :percentage="67" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="57" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>React</span>
            <el-progress :percentage="36" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>SQL</span>
            <el-progress :percentage="39" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Git</span>
            <el-progress :percentage="76" class="progress-content" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="UserCard">
import type { UserInfo } from "@/stores";
import defaultAvatar from "@/assets/images/default.png";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("user-card");

const props = defineProps<{ user: UserInfo }>();

const { user } = toRefs(props);

const getUserRoles = (userRoles: string[]) => {
  let userRole = "";
  const separator = " | ";
  userRoles.forEach(role => {
    userRole = userRole + separator + role;
  });
  return userRole.slice(separator.length);
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-user-card;

.#{$prefix-class} {
  &__header {
    text-align: center;

    &--content {
      .user-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }

      .user-name {
        font-weight: bold;
      }

      .user-role {
        padding-top: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  &__info {
    margin-top: 20px;
    color: #000000;

    span {
      padding-left: 4px;
    }

    &--section {
      padding: 15px 0;
      font-size: 14px;

      &:first-child {
        padding-top: 0;
      }

      &__header {
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
        border-bottom: 1px solid #dcdfe6;
      }

      &__body {
        .basic-info {
          padding-right: 0;
          padding-left: 0;
          border-right: 0;
          border-left: 0;
          border-radius: 0;
        }

        .basic-info-item {
          padding: 11px 0;
          margin-bottom: -1px;
          font-size: 13px;
          border-top: 1px solid #e7eaec;
          border-bottom: 1px solid #e7eaec;

          .basic-info-content {
            float: right;
          }
        }

        .basic-info-item:first-child {
          padding-top: 5px;
          border-top: none;
        }

        .progress-item {
          padding-bottom: 11px;

          .progress-content {
            float: right;
            width: 65%;
          }
        }
      }
    }
  }
}
</style>
