<template>
  <el-switch
    v-model="settingStore.isDark"
    @change="onAddDarkChange"
    inline-prompt
    :active-icon="Sunny"
    :inactive-icon="Moon"
  />
</template>

<script setup lang="ts">
import { useTheme } from "@/composables";
import { useSettingsStore } from "@/stores";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { ElSwitch } from "element-plus";

defineOptions({ name: "SwitchDark" });

const settingStore = useSettingsStore();

const { switchDark } = useTheme();

const onAddDarkChange = () => {
  switchDark();
};
</script>
