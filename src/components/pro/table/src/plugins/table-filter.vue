<script setup lang="ts">
import type { ModelBaseValueType } from "@/components/pro/form-item";
import type { TableFilterProps } from "../types";
import { computed } from "vue";
import { ElPopover, ElIcon, ElButton } from "element-plus";
import { Filter } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { isEmpty, isObject } from "@/utils";
import ProFormItem, { getProp, setProp } from "@/components/pro/form-item";

defineOptions({ name: "TableFilter" });

interface TableFilterEmits {
  // 过滤事件，返回输入的值以及 prop
  filter: [filterValue: unknown, prop: string | undefined];
  // 清空事件，返回输入的 prop
  clear: [prop: string | undefined];
  // 重置所有表单事件
  reset: [];
}

const props = withDefaults(defineProps<TableFilterProps>(), {
  enabled: false,
  el: "ElInput",
  rule: "eq",
  prop: "",
  formColumn: () => ({}),
  popoverProps: () => ({}),
  filterText: "过滤",
  clearText: "清空",
  resetText: "重置",
});

const emits = defineEmits<TableFilterEmits>();

const ns = useNamespace();

const model = defineModel<ModelBaseValueType>({ required: false });

const prop = computed(() => props.prop || props.formColumn.prop);
const elProps = computed(() => ({ ...props.formColumn.elProps, teleported: false }));

// 事件处理方法
const handleFilter = () => {
  let filterValue = model.value;
  if (isObject(model.value) && prop.value) filterValue = getProp(model.value, prop.value);
  emits("filter", filterValue, prop.value);
};

const handleClear = () => {
  if (isObject(model.value) && prop.value) setProp(model.value, prop.value, undefined);
  else model.value = undefined;

  handleFilter();
  emits("clear", prop.value);
};

const handleReset = () => {
  model.value = isObject(model.value) ? {} : undefined;
  emits("reset");
};
</script>

<template>
  <ElPopover
    v-if="enabled"
    :width="popoverProps?.width || 230"
    :trigger="popoverProps?.trigger || 'click'"
    v-bind="popoverProps"
  >
    <!-- 过滤图标 -->
    <template #reference>
      <span
        @click.stop
        :style="{
          marginLeft: '4px',
          verticalAlign: '-2px',
          cursor: 'pointer',
          color: isEmpty(getProp(model, prop)) ? 'inherit' : `var(--${ns.elNamespace}-color-primary)`,
        }"
      >
        <slot name="filter-icon">
          <ElIcon><Filter /></ElIcon>
        </slot>
      </span>
    </template>

    <!-- 过滤内容区域 -->
    <div class="filter-content">
      <ProFormItem v-model="model" v-bind="formColumn" :prop :el :show-label="false" :el-props />

      <slot name="filter-button" v-bind="{ handleFilter, handleClear, handleReset }">
        <div style="display: flex; gap: 12px; justify-content: space-between; margin-top: 10px">
          <ElButton @click="handleReset">{{ resetText }}</ElButton>
          <div>
            <ElButton @click="handleClear">{{ clearText }}</ElButton>
            <ElButton @click="handleFilter">{{ filterText }}</ElButton>
          </div>
        </div>
      </slot>
    </div>
  </ElPopover>
</template>
