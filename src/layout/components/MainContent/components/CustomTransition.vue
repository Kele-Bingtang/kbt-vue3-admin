<template>
  <transition
    appear
    :name="name"
    :enterActiveClass="enterActiveClass"
    :leaveActiveClass="leaveActiveClass"
    mode="out-in"
  >
    <slot></slot>
  </transition>
</template>

<script setup lang="ts" name="CustomTransition">
const route = useRoute();

const name = computed(() => {
  const transition = route.meta.transition;
  if (transition) return transition.name;
  return "fade-transform";
});

const enterActiveClass = computed(() => {
  const transition = route.meta.transition;
  if (transition) return `animate__animated ${transition.enterTransition}`;
});
const leaveActiveClass = computed(() => {
  const transition = route.meta.transition;
  if (transition) return `animate__animated ${transition.leaveTransition}`;
});
</script>

<style lang="scss" scoped></style>
