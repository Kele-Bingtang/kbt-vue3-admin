<template>
  <div v-if="user.userId" class="profile-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <UserCard :user="user">
          <UserAvatar :user="user" />
        </UserCard>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="时间线" name="timeline">
              <Timeline />
            </el-tab-pane>
            <el-tab-pane label="资料编辑" name="editorUserInfo">
              <EditorInfo :user="canEditUser" @reset-user="resetUser" />
            </el-tab-pane>
            <el-tab-pane label="密码修改" name="updatePassword">
              <Account />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Profile">
import EditorInfo from "./components/editorInfo.vue";
import Account from "./components/account.vue";
import UserCard from "./components/userCard.vue";
import UserAvatar from "./components/userAvatar.vue";
import Timeline from "./components/timeline.vue";
import type { UserInfo } from "@/stores";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const activeTab = ref("timeline");
const canEditUser = ref<UserInfo>({
  userId: "",
  username: "",
  sex: "",
  roles: [],
});

const user = computed(() => {
  const { userInfo } = userStore;
  canEditUser.value = { ...userInfo };
  return userInfo;
});

const resetUser = () => {
  canEditUser.value = { ...userStore.userInfo };
};
</script>

<style lang="scss" scoped></style>
