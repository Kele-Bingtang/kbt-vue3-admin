<script setup lang="ts">
import { usePermission } from "@/composables";

defineOptions({ name: "Role" });

interface RoleProps {
  value?: string | string[];
}

withDefaults(defineProps<RoleProps>(), {
  value: "",
});

const { hasRole } = usePermission();
</script>

<template>
  <slot v-if="hasRole(value)" />
</template>
