<script setup lang="ts">
import { useSettingStore } from "@/stores";
import ClassicTabNav from "../ClassicTabNav/index.vue";

defineOptions({ name: "SimpleTabNav" });

const settingStore = useSettingStore();

const type = computed(() => settingStore.tabNavMode as "simple" | "classic");
</script>

<template>
  <ClassicTabNav :type />
</template>
