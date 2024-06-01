<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx">
import { inject, ref, useSlots, unref } from "vue";
import {
  type TableColumnProps,
  type TableRenderScope,
  type HeaderRenderScope,
  enumMapKey,
  filterKey,
} from "../interface";
import { filterEnum, filterEnumLabel, formatValue, lastProp, handleRowAccordingToProp } from "../helper";
import { ElCheckTag, ElTag, ElTableColumn, ElPopover, ElIcon, ElButton, ElConfigProvider } from "element-plus";
import { Filter } from "@element-plus/icons-vue";
import { ProForm } from "@/components";
import { useDesign } from "@/hooks";

defineOptions({ name: "TableColumn" });

const { variables } = useDesign();

defineProps<{ column: TableColumnProps }>();

const slots = useSlots();

const enumMap = inject(enumMapKey, ref(new Map<string, Record<string, any>[]>()));
const filterProps = inject(filterKey);

const getEnumData = (item: TableColumnProps, scope: TableRenderScope<any>) => {
  return unref(enumMap).get(item.prop!) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), unref(enumMap).get(item.prop!), item.fieldNames)
    : "";
};

const renderCellData = (item: TableColumnProps, scope: TableRenderScope<any>, enumData: any) => {
  return unref(enumMap).get(item.prop!) && item.isFilterEnum
    ? filterEnumLabel(enumData, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 标签
const renderTag = (item: any, data: any, last = true, index?: number) => {
  const { tagType, tagEffect } = item;

  if (["el-check-tag", "ElCheckTag"].includes(item.tagEl)) {
    // 直接 index ? : 是不行的，因为这样 index = 0 是 false
    return (
      <>
        <ElCheckTag key={index} checked type={tagType || "primary"}>
          {data}
        </ElCheckTag>
        {last ? "" : " "}
      </>
    );
  }
  return (
    <>
      <ElTag key={index} type={tagType} effect={tagEffect || "light"}>
        {data}
      </ElTag>
      {last ? "" : " "}
    </>
  );
};

const RenderTableColumn = (item: TableColumnProps) => {
  /**
   * 是否使用自定义表头过滤器功能
   */
  const useFilter = computed(() => {
    // item.filterConfig.enabled 优先级最高
    if (item.filterConfig?.enabled === false || item.prop === "operation") return false;
    // 全部的可过滤表头启用过滤器
    if (filterProps?.useFilter) return true;
    // 启用过滤器且开启 search
    if (filterProps?.filter && (item.search?.el || item.search?.render)) return true;

    return item.filterConfig?.enabled;
  });

  return (
    <>
      {item.isShow && (
        <ElTableColumn
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: TableRenderScope<any>) => {
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[lastProp(item.prop!)]) return slots[lastProp(item.prop!)]!(scope);

              const enumData = getEnumData(item, scope);
              const data = renderCellData(item, scope, enumData);

              if (item.tag && enumData) {
                // data 是从 enumData 取出来的，如果 enumData 是数组，那么 data 必然是数组
                if (Array.isArray(enumData)) {
                  return enumData.map((e, index) => renderTag(e, data[index], enumData.length - 1 === index, index));
                }
                return renderTag(enumData, data);
              }
              return Array.isArray(data) ? data.join(",") : data;
            },
            header: (scope: HeaderRenderScope<any>) => {
              let headerSlot = <>{item.label}</>;

              if (item.headerRender) headerSlot = item.headerRender(scope);
              if (slots[`${lastProp(item.prop!)}Header`]) headerSlot = slots[`${lastProp(item.prop!)}Header`]!(scope);

              return (
                <>
                  {headerSlot}
                  {unref(useFilter) ? filterHeader(item) : undefined}
                </>
              );
            },
          }}
        </ElTableColumn>
      )}
    </>
  );
};

/**
 * 渲染表头自定义过滤器
 */
const filterHeader = (item: TableColumnProps) => {
  const { searchParam = {}, search, reset } = filterProps || {};

  const model = computed({
    get: () => {
      return searchParam;
    },
    set: () => {
      for (const key in model) searchParam[key] = model[key];
    },
  });

  // watch(
  //   model,
  //   () => {
  //     for (const key in model) searchParam[key] = model[key];
  //   },
  //   { deep: true }
  // );

  const commonSchema = {
    label: "",
    prop: item.prop || "",
    enum: item.enum as any,
    useEnumMap: item.useEnumMap,
    enumKey: item.enumKey,
    fieldNames: item.fieldNames,
    props: {
      teleported: false, // 解决 ElSelect 的 Option 选中后，自动关闭 Popover 问题
    },
  };

  const schema = item.search
    ? { ...item.search, ...commonSchema, props: { ...item.search.props, ...commonSchema.props } }
    : { el: "ElInput", ...commonSchema };

  const handleSearch = () => {
    search && search(searchParam);
  };

  const handleReset = () => {
    for (const key in unref(model)) unref(model)[key] = undefined;
    handleSearch();
  };

  const { filterConfig = {} } = item;
  const { width, trigger } = filterConfig;

  return (
    <ElConfigProvider namespace={variables.elNamespace}>
      <ElPopover {...filterConfig} width={width || 230} trigger={trigger || "click"}>
        {{
          reference: () => (
            <ElIcon style="vertical-align: -2px; margin-left: 2px; cursor: pointer;" class="hover-theme-color">
              <Filter />
            </ElIcon>
          ),
          default: () => (
            <>
              <ProForm v-model={model.value} onlyRenderComponent schema={[schema]}></ProForm>
              <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <ElButton onClick={reset}>重置</ElButton>
                <div>
                  <ElButton onClick={handleReset}>清除</ElButton>
                  <ElButton onClick={handleSearch}>筛选</ElButton>
                </div>
              </div>
            </>
          ),
        }}
      </ElPopover>
    </ElConfigProvider>
  );
};
</script>
