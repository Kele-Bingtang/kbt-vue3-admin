<template>
  <div class="switch-permission-container">
    <div style="margin-bottom: 15px">角色： {{ roles }}</div>
    角色切换：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="admin" />
      <el-radio-button label="visitor" />
    </el-radio-group>

    <div style="margin-top: 30px">
      <div>
        <span v-permission="['admin']" class="permission-alert">
          只有
          <el-tag class="permission-tag" size="small">admin</el-tag>
          有权限看
        </span>
        <el-tag v-permission="['admin']" class="permission-sourceCode" type="info">v-permission="['admin']"</el-tag>
      </div>

      <div>
        <span v-permission="['visitor']" class="permission-alert">
          只有
          <el-tag class="permission-tag" size="small">visitor</el-tag>
          有权限看
        </span>
        <el-tag v-permission="['visitor']" class="permission-sourceCode" type="info">v-permission="['visitor']"</el-tag>
      </div>

      <div>
        <span v-permission="['admin', 'visitor']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag>
          和
          <el-tag class="permission-tag" size="small">visitor</el-tag>
          都有权限看
        </span>
        <el-tag v-permission="['admin', 'visitor']" class="permission-sourceCode" type="info">
          v-permission="['admin','visitor']"
        </el-tag>
      </div>
    </div>

    <div style="margin-top: 60px">
      <el-tabs type="border-card" style="width: 550px">
        <el-tab-pane v-if="checkPermission(['admin'])" label="admin">
          只有 admin 有权限看
          <el-tag class="permission-sourceCode" type="info">v-if="checkPermission(['admin'])"</el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['visitor'])" label="visitor">
          只有 visitor 有权限看
          <el-tag class="permission-sourceCode" type="info">v-if="checkPermission(['visitor'])"</el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['admin', 'visitor'])" label="admin 和 visitor">
          admin 和 visitor 都有权限看
          <el-tag class="permission-sourceCode" type="info">v-if="checkPermission(['admin','visitor'])"</el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts" name="SwitchPermission">
import { usePermission } from "@/hooks/usePermission";
import type { RefreshFunction } from "@/layout/components/MainContent/index.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const refreshCurrentPage = inject("refresh") as RefreshFunction;
const { checkPermission } = usePermission();

const roles = computed(() => userStore.roles);
const switchRoles = computed({
  get() {
    return roles.value[0];
  },
  set(value: string) {
    const roles = [value];
    userStore.changeRoles(roles).then(() => {
      refreshCurrentPage();
    });
  },
});
</script>

<style lang="scss" scoped>
.switch-permission-container {
  padding: 20px;
  background-color: #fff;
  .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: var(--el-color-primary);
    color: #ecf5ff;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }

  .permission-sourceCode {
    margin-left: 15px;
  }

  .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>
