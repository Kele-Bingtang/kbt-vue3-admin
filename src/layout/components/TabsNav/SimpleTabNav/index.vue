<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import ClassicTabNav from "../ClassicTabNav/index.vue";

defineOptions({ name: "SimpleTabNav" });

const settingsStore = useSettingsStore();

const type = computed(() => settingsStore.tabsNavMode as "simple" | "classic");
</script>

<template>
  <ClassicTabNav :type />
</template>
