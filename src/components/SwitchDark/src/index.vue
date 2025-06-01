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
import { ElSwitch } from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useTheme } from "@/composables";
import { SystemThemeEnum } from "@/enums/appEnum";
import { useSettingStore } from "@/stores";

defineOptions({ name: "SwitchDark" });

const settingStore = useSettingStore();

const { Dark, Light } = SystemThemeEnum;

const onAddDarkChange = () => {
  const { switchSystemTheme } = useTheme();
  const { isDark } = useSettingStore();

  switchSystemTheme(isDark ? Dark : Light);
};
</script>
