<script setup lang="ts">
import { usePermission } from "@/composables";

defineOptions({ name: "Auth" });

interface AuthProps {
  value?: string | string[];
}

withDefaults(defineProps<AuthProps>(), {
  value: "",
});

const { hasAuth } = usePermission();
</script>

<template>
  <slot v-if="hasAuth(value)" />
</template>
