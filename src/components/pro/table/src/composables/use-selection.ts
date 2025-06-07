import { ref, computed } from "vue";

/**
 * 表格多选数据操作
 *
 * @param rowKey 当表格可以多选时，所指定的 id
 * */
export const useSelection = (rowKey = "id") => {
  const isSelected = ref<boolean>(false);
  const selectedList = ref<Recordable[]>([]);

  // 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    const ids: string[] = [];
    selectedList.value.forEach(item => ids.push(item[rowKey]));
    return ids;
  });

  /**
   * 多选操作
   *
   * @param rowArr 当前选择的所有数据
   */
  const selectionChange = (newSelection: Recordable[]) => {
    newSelection.length ? (isSelected.value = true) : (isSelected.value = false);
    selectedList.value = newSelection;
  };

  return {
    isSelected,
    selectedList,
    selectedListIds,
    selectionChange,
  };
};

export type UseSelectState = Omit<ReturnType<typeof useSelection>, "selectionChange">;
