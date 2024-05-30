<template>
  <IconifyIcon
    :icon="icon"
    :style="style ? Object.assign(style, { outline: 'none' }) : { outline: 'none' }"
    v-bind="$attrs"
  ></IconifyIcon>
</template>

<script setup lang="ts">
import { Icon as IconifyIcon } from "@iconify/vue";
import { type CSSProperties } from "vue";

defineOptions({ name: "IconifyOnline" });

interface IconifyOfflineProps {
  icon: string;
  style?: CSSProperties;
}

defineProps<IconifyOfflineProps>();
</script>
