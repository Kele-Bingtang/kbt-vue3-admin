<script setup lang="ts">
import type { PageColumn, ProPageEmits, ProPageProps } from "./types";
import type { ProSearchColumnProps, ProSearchExpose } from "@/components/pro/search";
import { useNamespace } from "@/composables";
import { ProSearch } from "@/components/pro/search";
import { ProTable, lastProp } from "@/components/pro/table";
import { isEmpty, isFunction } from "@/utils";

defineOptions({ name: "ProPage" });

const props = withDefaults(defineProps<ProPageProps>(), {
  columns: () => [],
  searchProps: () => ({}),
  initShowSearch: true,
});

const emits = defineEmits<ProPageEmits>();

const ns = useNamespace("pro-page");

const searchParam = ref<Recordable>({});

const flatColumns = computed<PageColumn[]>(() => flatColumnsFn(props.columns));

const searchColumns = computed(() => {
  const column = flatColumns.value?.filter(item => item.search?.el || item.search?.render);
  const searchColumns: ProSearchColumnProps[] = [];

  column.forEach(async item => {
    // Table 默认查询参数初始化
    const key = item.search?.prop ?? lastProp(item.prop!);
    const defaultValue = unref(item.search?.defaultValue);

    if (!isEmpty(defaultValue)) {
      if (isFunction(defaultValue)) searchInitParam.value[key] = defaultValue;
      else searchInitParam.value[key] = await defaultValue(searchParam.value, enumMap.value);
    }

    // 组装搜索表单配置项
    const searchColumn: any = {
      ...item.search,
      key: undefined,
      beforeSearch: undefined,
      grid: {
        offset: item.search?.offset,
        span: item.search?.span,
        xs: item.search?.xs,
        sm: item.search?.sm,
        md: item.search?.md,
        lg: item.search?.lg,
        xl: item.search?.xl,
      },
      label: item.label || "",
      prop: key,
      enum: item.enum as any,
      useEnumMap: item.useEnumMap,
      enumKey: item.enumKey,
      fieldNames: item.fieldNames,
    };
    searchColumns.push(searchColumn);
  });

  return searchColumns;
});

// 扁平化 columns，为了过滤搜索配置项
const flatColumnsFn = (columns: PageColumn[], flatArr: PageColumn[] = []) => {
  columns.forEach(col => {
    if (col._children?.length) flatArr.push(...flatColumnsFn(col._children));
    flatArr.push(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

const handleSearch = (model: Recordable) => {
  emits("search", model);
};
const handleReset = (model: Recordable) => {
  emits("reset", model);
};

const searchRegister = (proSearchInstance?: ProSearchExpose) => {
  emits("searchRegister", proSearchInstance);
};
</script>

<template>
  <div :class="ns.b()">
    <ProSearch
      ref="proSearchRef"
      v-show="initShowSearch"
      v-model="searchParam"
      :column="searchColumns"
      v-bind="searchProps"
      @search="handleSearch"
      @reset="handleReset"
      @register="searchRegister"
    ></ProSearch>

    <ProTable></ProTable>
  </div>
</template>
