<template>
  <div :class="prefixClass">
    <ElInput disabled v-model="modelValue" clearable />
    <ElPopover
      :popper-class="`${prefixClass}__popover`"
      placement="bottom"
      trigger="click"
      :width="450"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; height: 380px;"
      @show="popoverShow"
    >
      <template #reference>
        <div :style="iconWrapStyle">
          <Icon v-if="modelValue" :icon="modelValue" />
        </div>
      </template>
      <ElScrollbar style="height: calc(100% - 50px)">
        <ElInput v-model="search" clearable placeholder="搜索图标" @clear="inputClear" style="margin-bottom: 20px" />
        <ElTabs tab-position="left" v-model="iconName" @tab-change="tabChange">
          <ElTabPane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix">
            <div :class="`${prefixClass}__icons`">
              <div
                v-for="icon in filterIcons(filterItemIcons(item.icons))"
                :key="icon"
                :style="{
                  width: iconSize,
                  height: iconSize,
                  border: `1px solid ${icon === modelValue ? 'var(--el-color-primary)' : 'var(--el-border-color)'}`,
                }"
                :class="`${prefixClass}__icon`"
                @click="iconSelect(icon)"
                v-copy="modelValue"
              >
                <Icon :icon="icon" :color="icon === modelValue ? 'var(--el-color-primary)' : 'inherit'" />
              </div>
            </div>
          </ElTabPane>
        </ElTabs>
      </ElScrollbar>
      <div :class="`${prefixClass}__pagination`">
        <ElPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :pager-count="5"
          small
          :page-sizes="[100, 200, 300, 400]"
          layout="total, prev, pager, next, jumper"
          :total="filterItemIcons(icons[currentIconNameIndex].icons).length"
        />
      </div>
    </ElPopover>
  </div>
</template>

<script lang="ts" setup>
import epIcons from "./data/icons.ep";
import antIcons from "./data/icons.ant-design";
import tIcons from "./data/icons.tdesign";
import { ElInput, ElPopover, ElScrollbar, ElTabs, ElTabPane, ElPagination } from "element-plus";
import { computed, type CSSProperties, ref, unref, watch, inject, defineOptions } from "vue";
import { nextTick } from "vue";
import { useDesign } from "@/hooks";

defineOptions({ name: "IconPicker" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("icon-picker");

const configGlobal = inject("configGlobal") as Record<string, any>;

const init = async (icon?: string) => {
  if (!icon) return;
  const iconInfo = icon.split(":");
  iconName.value = iconInfo[0];
  const wrapIndex = icons.findIndex(item => item.prefix === iconInfo[0]);
  // 查询当前icon的索引
  const index = filterItemIcons(icons[wrapIndex].icons).findIndex(item => item === icon);
  // 计算当前icon的页码
  await nextTick();
  currentPage.value = Math.ceil((index + 1) / unref(pageSize));
};

const modelValue = defineModel<string>();

const size = computed(() => configGlobal?.size || "default");

const iconSize = computed(() => {
  return unref(size) === "small"
    ? "var(--el-component-size-small)"
    : unref(size) === "large"
      ? "var(--el-component-size-large)"
      : "var(--el-component-size)";
});

const iconWrapStyle = computed((): CSSProperties => {
  return {
    width: unref(iconSize),
    height: unref(iconSize),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset",
    position: "relative",
    left: "-1px",
    cursor: "pointer",
  };
});

const icons = [epIcons, antIcons, tIcons];

const iconName = ref(icons[0].prefix);

const currentIconNameIndex = computed(() => {
  return icons.findIndex(item => item.prefix === unref(iconName));
});

const tabChange = () => {
  currentPage.value = 1;
};

const pageSize = ref(49);

const currentPage = ref(1);

const filterIcons = (icons: string[]) => {
  const start = (unref(currentPage) - 1) * unref(pageSize);
  const end = unref(currentPage) * unref(pageSize);
  return icons.slice(start, end);
};

watch(
  () => modelValue.value,
  async val => {
    await nextTick();
    val && init(val);
  },
  {
    immediate: true,
  }
);

const popoverShow = () => {
  init(unref(modelValue));
};

const iconSelect = (icon: string) => {
  // 如果是同一个icon则不做处理，则相当于点击了清空按钮
  if (icon === unref(modelValue)) {
    modelValue.value = "";
    return;
  }
  modelValue.value = icon;
};

const search = ref("");

const filterItemIcons = (icons: string[]) => {
  return icons.filter(item => item.includes(unref(search)));
};

const inputClear = () => {
  init(unref(modelValue));
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
