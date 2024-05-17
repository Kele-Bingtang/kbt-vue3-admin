<script setup lang="ts">
import { useRouter } from "vue-router";
import { defineOptions, unref } from "vue";

defineOptions({ name: "Redirect" });

const { currentRoute, replace } = useRouter();

const { params, query } = unref(currentRoute);
const { path } = params;

const _path = Array.isArray(path) ? path.join("/") : path;

replace({
  path: "/" + _path,
  query,
});
</script>

<template>
  <div />
</template>
