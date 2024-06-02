<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx">
import { inject, ref, useSlots, unref } from "vue";
import { type TableColumnProps, type TableRenderScope, type HeaderRenderScope, enumMapKey } from "../interface";
import { filterEnum, filterEnumLabel, formatValue, lastProp, handleRowAccordingToProp } from "../helper";
import { ElCheckTag, ElTag, ElTableColumn } from "element-plus";
import { useHeaderFilter } from "./plugins/HeaderFilter";
import { useRowInlineEdit } from "./plugins/RowInlineEdit";

defineOptions({ name: "TableColumn" });

const props = defineProps<{ column: TableColumnProps }>();

const slots = useSlots();

const enumMap = inject(enumMapKey, ref(new Map<string, Record<string, any>[]>()));

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

const { useFilter, renderHeaderFilter } = useHeaderFilter(props.column);
const { useEdit, renderRowInlineEdit } = useRowInlineEdit(props.column);

const RenderTableColumn = (item: TableColumnProps) => {
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
              // 行内编辑功能
              if (unref(useEdit) && scope.row._edit) return renderRowInlineEdit(scope);
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
                  {unref(useFilter) ? renderHeaderFilter() : undefined}
                </>
              );
            },
          }}
        </ElTableColumn>
      )}
    </>
  );
};
</script>
