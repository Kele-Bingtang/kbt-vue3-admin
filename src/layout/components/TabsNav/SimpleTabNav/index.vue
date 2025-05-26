<script setup lang="ts" name="SimpleTabNav">
import { useSettingsStore } from "@/stores";
import ClassicTabNav from "../ClassicTabNav/index.vue";

const settingsStore = useSettingsStore();

const type = computed(() => settingsStore.tabsNavMode as "simple" | "classic");
</script>

<template>
  <ClassicTabNav :type />
</template>
