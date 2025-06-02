<template>
  <Fragment v-if="hasRole(value) && $slots.default">
    <slot></slot>
  </Fragment>
</template>

<script setup lang="ts" name="Role">
import { Fragment } from "vue";
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
