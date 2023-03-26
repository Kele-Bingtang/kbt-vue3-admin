<template>
  <div :class="shadowClass" class="card-info">
    <div class="card-content">
      <div class="left-area" :style="{ width: `${iconWidth}%` }">
        <el-icon :style="{ fontSize: `${iconSize}px`, color: color }">
          <component :is="icon"></component>
        </el-icon>
      </div>
      <div class="right-area" :style="{ width: `${100 - iconWidth}%` }">
        <div style="text-align: right">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="CardItem">
interface CardItemProps {
  shadow?: string;
  icon?: string;
  iconSize?: number;
  color?: string;
  iconWidth?: number;
}

const props = withDefaults(defineProps<CardItemProps>(), {
  shadow: "",
  icon: "",
  iconSize: 48,
  color: "#168BF7",
  iconWidth: 40,
});

const shadowClass = computed(() => {
  if (props.shadow === "always") {
    return "always-shadow";
  } else if (props.shadow === "hover") {
    return "hover-shadow";
  } else {
    return "never-shadow";
  }
});
</script>

<style lang="scss" scoped>
.always-shadow {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.hover-shadow:hover {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.card-info {
  position: relative;
  height: 120px;
  overflow: hidden;
  font-size: 12px;
  color: #666666;
  background: #ffffff;
  border: 1px solid rgb(0 0 0 / 5%);

  .card-content {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

    .left-area {
      float: left;
      margin-left: 25px;
    }

    .right-area {
      & > div {
        float: right;
        margin-right: 32px;
      }
    }
  }
}
</style>
