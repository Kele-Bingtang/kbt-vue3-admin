<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElImage, ElMessage, ElMessageBox } from "element-plus";
import { ArrowDownBold, User, Bell, Setting, Back } from "@element-plus/icons-vue";
import { useSettingStore, useUserStore } from "@/stores";
import { mittBus } from "@/utils";
import { useNamespace } from "@/composables";
import { useRoute, useRouter } from "vue-router";
import defaultAvatar from "@/assets/images/default.png";
import { LOGIN_URL, OpenThemePanelKey } from "@/config";

defineOptions({ name: "User" });

const ns = useNamespace("user-dropdown");

withDefaults(defineProps<{ showAvatar?: boolean }>(), {
  showAvatar: true,
});

const userStore = useUserStore();
const settingStore = useSettingStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const { userInfo } = storeToRefs(userStore);
const { showSetting } = storeToRefs(settingStore);

const profileLabel = computed(() => {
  const profile = t("_headerBar.profile");
  return profile === "_headerBar.profile" ? "我的主页" : profile;
});

const messageCenterLabel = computed(() => {
  const messageCenter = t("_headerBar.messageCenter");
  return messageCenter === "_headerBar.messageCenter" ? "我的消息" : messageCenter;
});

const settingLabel = computed(() => {
  const setting = t("_headerBar.setting");
  return setting === "_headerBar.setting" ? "我的设置" : setting;
});

const logOutLabel = computed(() => {
  const logOut = t("_headerBar.logOut");
  return logOut === "_headerBar.logOut" ? "退出登录" : logOut;
});

const openSettingDrawer = () => {
  mittBus.emit(OpenThemePanelKey);
};

const logout = async () => {
  ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    // 调用退出登录接口
    await userStore.logout();
    // 重定向到登陆页
    router.push(`${LOGIN_URL}?redirect=${route.path}`);
    ElMessage.success("退出登录成功！");
  });
};
</script>

<template>
  <el-dropdown :class="[ns.b(), 'customize']" trigger="click">
    <div :class="[ns.e('avatar'), 'flx-align-center']">
      <template v-if="showAvatar">
        <el-image :src="userInfo.avatar" :class="ns.em('avatar', 'img')" alt="头像">
          <template #error>
            <el-image :src="defaultAvatar" alt="头像" />
          </template>
        </el-image>

        <span :class="ns.em('avatar', 'username')">{{ userInfo.username }}</span>
      </template>

      <Icon size="1em"><ArrowDownBold /></Icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile">
          <el-dropdown-item :icon="User">
            {{ profileLabel }}
          </el-dropdown-item>
        </router-link>

        <router-link to="/message-center">
          <el-dropdown-item :icon="Bell">
            {{ messageCenterLabel }}
          </el-dropdown-item>
        </router-link>

        <el-dropdown-item @click="openSettingDrawer" :icon="Setting" v-if="showSetting">
          <span>
            {{ settingLabel }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout" :icon="Back">
          <span>
            {{ logOutLabel }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

@include b(user-dropdown) {
  @include e(avatar) {
    position: relative;
    height: 100%;

    @include m(img) {
      width: 35px;
      height: 35px;
      cursor: pointer;
      border-radius: 50%;
    }

    @include m(username) {
      display: inline-block;
      margin: 0 7px 0 9px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
