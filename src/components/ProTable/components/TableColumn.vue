<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import type { ColumnProps, RenderScope, HeaderRenderScope } from "@/components/ProTable/interface";
import { filterEnum, formatValue, lastProp, handleRowAccordingToProp } from "@/utils/table";

defineProps<{ column: ColumnProps }>();

const slots = useSlots();

const enumMap = inject("enumMap", ref(new Map()));

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: RenderScope<any>) => {
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: RenderScope<any>) => {
  return filterEnum(
    handleRowAccordingToProp(scope.row, item.prop!),
    enumMap.value.get(item.prop),
    item.fieldNames,
    "tag"
  );
};

// 获取枚举信息，存放到 [prop.prop]EnumValue 里
const tryCreateEnumValue = (item: ColumnProps, scope: RenderScope<any>) => {
  if (enumMap.value.get(item.prop) && item.isFilterEnum) {
    scope.row[`${item.prop}EnumValue`] = filterEnum(
      handleRowAccordingToProp(scope.row, item.prop!),
      enumMap.value.get(item.prop)!,
      item.fieldNames
    );
  }
  return scope;
};

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: RenderScope<any>) => {
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[lastProp(item.prop!)]) return slots[lastProp(item.prop!)]!(tryCreateEnumValue(item, scope));
              if (item.tag && renderCellData(item, scope)) {
                return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>;
              }
              return renderCellData(item, scope);
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender) return item.headerRender(scope);
              if (slots[`${lastProp(item.prop!)}Header`]) return slots[`${lastProp(item.prop!)}Header`]!(scope);
              return item.label;
            },
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>
