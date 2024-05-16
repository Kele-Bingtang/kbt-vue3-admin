<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx">
import { inject, ref, useSlots, defineOptions, defineProps, unref } from "vue";
import type { TableColumnProps, RenderScope, HeaderRenderScope } from "../interface";
import { filterEnum, filterEnumLabel, formatValue, lastProp, handleRowAccordingToProp } from "../utils";
import { ElCheckTag, ElTag, ElTableColumn } from "element-plus";

defineOptions({ name: "TableColumn" });

defineProps<{ column: TableColumnProps }>();

const slots = useSlots();

const enumMap = inject("enumMap", ref(new Map()));

const getEnumData = (item: TableColumnProps, scope: RenderScope<any>) => {
  return unref(enumMap).get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), unref(enumMap).get(item.prop)!, item.fieldNames)
    : "";
};

const renderCellData = (item: TableColumnProps, scope: RenderScope<any>, enumData: any) => {
  return unref(enumMap).get(item.prop) && item.isFilterEnum
    ? filterEnumLabel(enumData, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 标签
const renderTag = (item: any, data: any, last = true, index?: number) => {
  const { tagType, tagEffect } = item;

  if (item.tagEl === "el-check-tag") {
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
  return (
    <>
      {item.isShow && (
        <ElTableColumn
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: RenderScope<any>) => {
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
              if (item.headerRender) return item.headerRender(scope);
              if (slots[`${lastProp(item.prop!)}Header`]) return slots[`${lastProp(item.prop!)}Header`]!(scope);
              return item.label;
            },
          }}
        </ElTableColumn>
      )}
    </>
  );
};
</script>
