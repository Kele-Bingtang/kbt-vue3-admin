<template>
  <el-dropdown trigger="click" class="user-dropdown">
    <div class="avatar-wrapper">
      <template v-if="prop.showAvatar">
        <el-image :src="user.avatar" class="user-avatar" alt="头像">
          <template #error>
            <el-image :src="defaultAvatar" alt="头像" />
          </template>
        </el-image>
        <span class="username">{{ user.username }}</span>
      </template>

      <el-icon><ArrowDownBold /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile">
          <el-dropdown-item icon="User">
            {{ profileLabel }}
          </el-dropdown-item>
        </router-link>

        <router-link to="/message-center">
          <el-dropdown-item icon="Bell">
            {{ messageCenterLabel }}
          </el-dropdown-item>
        </router-link>

        <el-dropdown-item @click="openSettingsDrawer" icon="Setting" v-if="showSettings">
          <span>
            {{ settingsLabel }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout" icon="Back">
          <span>
            {{ logOutLabel }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="User">
import { useSettingsStore } from "@/stores/settings";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import defaultAvatar from "@/assets/images/default.png";
import { ArrowDownBold } from "@element-plus/icons-vue";
import mittBus from "@/utils/layout/mittBus";
import { ElMessage, ElMessageBox } from "element-plus";
import { LOGIN_URL } from "@/router/routesConfig";

const prop = withDefaults(defineProps<{ showAvatar?: boolean }>(), {
  showAvatar: true,
});

const { t } = useI18n();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const router = useRouter();

const user = computed(() => userStore.userInfo);
const showSettings = computed(() => settingsStore.showSettings);
const profileLabel = computed(() => {
  const profile = t("_headerBar.profile");
  return profile === "_headerBar.profile" ? "我的主页" : profile;
});
const messageCenterLabel = computed(() => {
  const messageCenter = t("_headerBar.messageCenter");
  return messageCenter === "_headerBar.messageCenter" ? "我的消息" : messageCenter;
});
const settingsLabel = computed(() => {
  const settings = t("_headerBar.settings");
  return settings === "_headerBar.settings" ? "我的设置" : settings;
});
const logOutLabel = computed(() => {
  const logOut = t("_headerBar.logOut");
  return logOut === "_headerBar.logOut" ? "退出登录" : logOut;
});

const openSettingsDrawer = () => {
  mittBus.emit("openThemeDrawer");
};

const logout = async () => {
  // router.push(`/login?redirect=${this.$route.fullPath}`).catch(err => {
  //   console.warn(err)
  // })
  ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    // 调用退出登录接口
    await userStore.logout();
    // 3.重定向到登陆页
    router.push(`${LOGIN_URL}?redirectTarget=${route.name as string}`);
    ElMessage.success("退出登录成功！");
  });
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  .user-avatar {
    cursor: pointer;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .username {
    line-height: 0px;
    display: inline-block;
    margin: 0 7px 0 9px;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
