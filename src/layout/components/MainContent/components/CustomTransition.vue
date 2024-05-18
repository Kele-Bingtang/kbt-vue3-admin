<template>
  <Transition
    appear
    :name="name"
    :enterActiveClass="enterActiveClass"
    :leaveActiveClass="leaveActiveClass"
    mode="out-in"
  >
    <slot></slot>
  </Transition>
</template>

<script setup lang="ts" name="CustomTransition">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const name = computed(() => {
  const transition = route.meta.transition;
  if (transition) return transition.name;
  return "fade-transform";
});

const enterActiveClass = computed(() => {
  const transition = route.meta.transition;
  if (transition) return `animate__animated ${transition.enterTransition}`;
  return "";
});
const leaveActiveClass = computed(() => {
  const transition = route.meta.transition;
  if (transition) return `animate__animated ${transition.leaveTransition}`;
  return "";
});
</script>
