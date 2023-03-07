<template>
  <el-switch
    v-model="settingStore.isDark"
    @change="onAddDarkChange"
    inline-prompt
    active-icon="Sunny"
    inactive-icon="Moon"
  />
</template>

<script setup lang="ts" name="SwitchDark">
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/stores/settings";

const settingStore = useSettingsStore();

const { switchDark } = useTheme();

const onAddDarkChange = () => {
  switchDark();
};
</script>
