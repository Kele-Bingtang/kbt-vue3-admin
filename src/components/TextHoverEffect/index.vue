<template>
  <a :class="className" class="link--hover" :style="{ color: initColor }" href="#">
    <slot>
      {{ text }}
    </slot>
    <span :data-letters="text" />
    <span :data-letters="text" />
  </a>
</template>

<script setup lang="ts" name="TextHoverEffect">
interface TextHoverEffectProps {
  className?: string;
  text?: string;
  initColor?: string;
  hoverColor?: string;
}
const props = withDefaults(defineProps<TextHoverEffectProps>(), {
  className: "",
  text: "",
  initColor: "#4dd9d5",
  hoverColor: "#3888fa",
});

onMounted(() => {
  document.styleSheets[0].insertRule(`.link--hover::before { background: ${props.hoverColor} !important}`, 0);
  document.styleSheets[0].insertRule(`.link--hover span::before { color: ${props.hoverColor} !important}`, 0);
});
</script>

<style lang="scss" scoped>
/* hover */
.link--hover {
  font-weight: 800;
  color: #4dd9d5;
  font-family: "Dosis", sans-serif;
  -webkit-transition: color 0.5s 0.25s;
  transition: color 0.5s 0.25s;
  overflow: hidden;
  position: relative;
  display: inline-block;
  line-height: 1;
  outline: none;
  text-decoration: none;

  &:hover {
    -webkit-transition: none;
    transition: none;
    color: transparent !important;

    &::before {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  &::before {
    content: "";
    width: 100%;
    height: 6px;
    margin: -3px 0 0 0;
    background: var(--theme-color);
    position: absolute;
    left: 0;
    top: 50%;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    -webkit-transition: -webkit-transform 0.4s;
    transition: transform 0.4s;
    -webkit-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  }

  span {
    position: absolute;
    height: 50%;
    width: 100%;
    left: 0;
    top: 0;
    overflow: hidden;

    &::before {
      content: attr(data-letters);
      position: absolute;
      left: 0;
      width: 100%;
      color: var(--theme-color);
      -webkit-transition: -webkit-transform 0.5s;
      transition: transform 0.5s;
    }

    &:nth-child(2) {
      top: 50%;
    }

    &:first-child::before {
      top: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }

    &:nth-child(2)::before {
      bottom: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
  }
}

.link--hover:hover span::before {
  -webkit-transition-delay: 0.3s;
  transition-delay: 0.3s;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}
</style>
