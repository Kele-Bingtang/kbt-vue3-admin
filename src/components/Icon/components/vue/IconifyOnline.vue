<template>
  <IconifyIcon
    :icon="icon"
    :style="style ? Object.assign(style, { outline: 'none' }) : { outline: 'none' }"
    v-bind="$attrs"
  ></IconifyIcon>
</template>

<script setup lang="ts" name="IconifyOffline">
import { Icon as IconifyIcon } from "@iconify/vue";
import type { CSSProperties } from "vue";

interface IconifyOfflineProps {
  icon: string;
  style?: CSSProperties;
}

defineProps<IconifyOfflineProps>();
</script>
