<template>
  <div :class="{ active: isActive }" class="share-dropdown-menu">
    <div class="share-dropdown-menu-wrapper">
      <span class="share-dropdown-menu-title" @click.self="clickTitle">{{ title }}</span>
      <div v-for="(item, index) of items" :key="index" class="share-dropdown-menu-item">
        <a v-if="item.href" :href="item.href" target="_blank">{{ item.title }}</a>
        <span v-else>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineOptions, defineProps } from "vue";

defineOptions({ name: "DropdownMenu" });

interface DropdownMenuProps {
  items: any[];
  title: string;
}
withDefaults(defineProps<DropdownMenuProps>(), {
  items: () => [],
  title: "vue",
});

const isActive = ref(false);
const clickTitle = () => {
  isActive.value = !isActive.value;
};
</script>

<style lang="scss" scoped>
$item-length: 10;
$transition-time: 0.1s;

.share-dropdown-menu {
  position: relative;
  z-index: 1;
  width: 250px;
  height: auto !important;

  &-title {
    z-index: 2;
    display: block;
    width: 100%;
    height: 60px;
    margin-bottom: 5px;
    font-size: 20px;
    line-height: 60px;
    color: white;
    text-align: center;
    cursor: pointer;
    background: var(--el-color-primary);
    transform: translate3d(0, 0, 0);
  }

  &-wrapper {
    position: relative;
  }

  &-item {
    @for $i from 1 through $item-length {
      &:nth-of-type(#{$i}) {
        z-index: -1;
        transition-delay: $i * $transition-time;
        transform: translate3d(0, -60px, 0);
      }
    }

    position: absolute;
    width: 100%;
    height: 55px;
    overflow: hidden;
    font-size: 18px;
    line-height: 55px;
    color: black;
    text-align: center;
    cursor: pointer;
    background: #e0e0e0;
    opacity: 1;
    transition: transform 0.28s ease;

    &:hover {
      color: white;
      background: var(--el-color-primary);
    }
  }

  &.active {
    .share-dropdown-menu-wrapper {
      z-index: 1;
    }

    .share-dropdown-menu-item {
      @for $i from 1 through $item-length {
        &:nth-of-type(#{$i}) {
          transition-delay: ($item-length - $i) * $transition-time;
          transform: translate3d(0, ($i - 1) * 60px, 0);
        }
      }
    }
  }
}
</style>
