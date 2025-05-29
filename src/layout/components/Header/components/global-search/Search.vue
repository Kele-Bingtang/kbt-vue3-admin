<script setup lang="ts">
import { ArrowUp, ArrowDown, Back, Close } from "@element-plus/icons-vue";
import { useMenu, useNamespace } from "@/composables";
import { useEventListener } from "@vueuse/core";
import { mittBus } from "@/utils";

import "./search.scss";
import { formatTitle } from "@/router/helper";

defineOptions({ name: "GlobalSearch" });

const router = useRouter();
const ns = useNamespace("global-search");
const { menuList } = useMenu();

const showSearchDialog = ref(false);
const isKeyboardNavigating = ref(false);
const searchVal = ref("");
const historyHIndex = ref(0);
const highlightedIndex = ref(0);

const historyMaxLength = 10;
const searchResult = ref<RouterConfig[]>([]);
const historyResult = ref<RouterConfig[]>([]);

const searchInputRef = useTemplateRef("searchInputRef");
const searchResultScrollbarRef = useTemplateRef("searchResultScrollbarRef");

onMounted(() => {
  mittBus.on("openSearchDialog", openSearchDialog);
});

// 对话框控制
const openSearchDialog = () => {
  showSearchDialog.value = true;
  focusInput();
};

const closeSearchDialog = () => {
  searchVal.value = "";
  searchResult.value = [];
  highlightedIndex.value = 0;
  historyHIndex.value = 0;
};

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isCommandKey = isMac ? event.metaKey : event.ctrlKey;

  if (isCommandKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    showSearchDialog.value = true;
    focusInput();
  }

  // 当搜索对话框打开时，处理方向键和回车键
  if (showSearchDialog.value) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightPrevious();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightNext();
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectHighlighted();
    } else if (event.key === "Escape") {
      event.preventDefault();
      showSearchDialog.value = false;
    }
  }
};

useEventListener("keydown", handleKeydown);

/**
 * 激活文本框
 */
const focusInput = () => {
  setTimeout(() => {
    searchInputRef.value?.focus();
  }, 100);
};

const handleSearch = (val: string) => {
  if (val) searchResult.value = flattenAndFilterMenuItems(menuList.value, val);
  else searchResult.value = [];
};

const flattenAndFilterMenuItems = (items: RouterConfig[], val: string) => {
  const lowerVal = val.toLowerCase();
  const result: RouterConfig[] = [];

  const flattenAndMatch = (item: RouterConfig) => {
    if (item.meta?.hideInMenu) return;

    const lowerItemTitle = formatTitle(item).toLowerCase();

    if (item.children && item.children.length > 0) {
      item.children.forEach(flattenAndMatch);
      return;
    }

    if (lowerItemTitle.includes(lowerVal) && item.path) {
      result.push({ ...item, children: undefined });
    }
  };

  items.forEach(flattenAndMatch);
  return result;
};

/**
 * 高亮控制并实现滚动条跟随
 */
const highlightPrevious = () => {
  isKeyboardNavigating.value = true;

  if (searchVal.value) {
    highlightedIndex.value = (highlightedIndex.value - 1 + searchResult.value.length) % searchResult.value.length;
    scrollToHighlightedItem();
  } else {
    historyHIndex.value = (historyHIndex.value - 1 + historyResult.value.length) % historyResult.value.length;
    scrollToHighlightedHistoryItem();
  }
  // 延迟重置键盘导航状态，防止立即被 hover 覆盖
  setTimeout(() => {
    isKeyboardNavigating.value = false;
  }, 100);
};

const highlightNext = () => {
  isKeyboardNavigating.value = true;
  if (searchVal.value) {
    highlightedIndex.value = (highlightedIndex.value + 1) % searchResult.value.length;
    scrollToHighlightedItem();
  } else {
    historyHIndex.value = (historyHIndex.value + 1) % historyResult.value.length;
    scrollToHighlightedHistoryItem();
  }
  setTimeout(() => {
    isKeyboardNavigating.value = false;
  }, 100);
};

const scrollToHighlightedItem = async () => {
  await nextTick();

  if (!searchResultScrollbarRef.value || !searchResult.value.length) return;

  const scrollWrapper = searchResultScrollbarRef.value.wrapRef;
  if (!scrollWrapper) return;

  const highlightedElements = scrollWrapper.querySelectorAll(".result .box");
  if (!highlightedElements[highlightedIndex.value]) return;

  const highlightedElement = highlightedElements[highlightedIndex.value] as HTMLElement;
  const itemHeight = highlightedElement.offsetHeight;
  const scrollTop = scrollWrapper.scrollTop;
  const containerHeight = scrollWrapper.clientHeight;
  const itemTop = highlightedElement.offsetTop;
  const itemBottom = itemTop + itemHeight;

  if (itemTop < scrollTop) {
    searchResultScrollbarRef.value.setScrollTop(itemTop);
  } else if (itemBottom > scrollTop + containerHeight) {
    searchResultScrollbarRef.value.setScrollTop(itemBottom - containerHeight);
  }
};

const scrollToHighlightedHistoryItem = async () => {
  await nextTick();

  if (!searchResultScrollbarRef.value || !historyResult.value.length) return;

  const scrollWrapper = searchResultScrollbarRef.value.wrapRef;
  if (!scrollWrapper) return;

  const historyItems = scrollWrapper.querySelectorAll(".history-result .box");
  if (!historyItems[historyHIndex.value]) return;

  const highlightedElement = historyItems[historyHIndex.value] as HTMLElement;
  const itemHeight = highlightedElement.offsetHeight;
  const scrollTop = scrollWrapper.scrollTop;
  const containerHeight = scrollWrapper.clientHeight;
  const itemTop = highlightedElement.offsetTop;
  const itemBottom = itemTop + itemHeight;

  if (itemTop < scrollTop) {
    searchResultScrollbarRef.value.setScrollTop(itemTop);
  } else if (itemBottom > scrollTop + containerHeight) {
    searchResultScrollbarRef.value.setScrollTop(itemBottom - containerHeight);
  }
};

const selectHighlighted = () => {
  if (searchVal.value && searchResult.value.length) {
    handleGoPage(searchResult.value[highlightedIndex.value]);
  } else if (!searchVal.value && historyResult.value.length) {
    handleGoPage(historyResult.value[historyHIndex.value]);
  }
};

const isHighlighted = (index: number) => {
  return highlightedIndex.value === index;
};

const handleSearchBlur = () => {
  highlightedIndex.value = 0;
};

// 修改 hover 高亮逻辑，只有在非键盘导航时才生效
const highlightOnHover = (index: number) => {
  if (!isKeyboardNavigating.value && searchVal.value) {
    highlightedIndex.value = index;
  }
};

const highlightOnHoverHistory = (index: number) => {
  if (!isKeyboardNavigating.value && !searchVal.value) {
    historyHIndex.value = index;
  }
};

const handleGoPage = (item: RouterConfig) => {
  showSearchDialog.value = false;
  addHistory(item);
  router.push(item.path);
  searchVal.value = "";
  searchResult.value = [];
};

// 历史记录管理
const updateHistory = () => {
  if (Array.isArray(historyResult.value)) {
    // userStore.setSearchHistory(historyResult.value);
  }
};

const addHistory = (item: RouterConfig) => {
  const hasItemIndex = historyResult.value.findIndex(historyItem => historyItem.path === item.path);

  if (hasItemIndex !== -1) {
    historyResult.value.splice(hasItemIndex, 1);
  } else if (historyResult.value.length >= historyMaxLength) {
    historyResult.value.pop();
  }

  const cleanedItem = { ...item };
  delete cleanedItem.children;
  delete cleanedItem.meta.auths;
  historyResult.value.unshift(cleanedItem);
  updateHistory();
};

const deleteHistory = (index: number) => {
  historyResult.value.splice(index, 1);
  updateHistory();
};
</script>

<template>
  <div :class="ns.b()">
    <el-dialog
      v-model="showSearchDialog"
      width="600"
      :show-close="false"
      :lock-scroll="false"
      modal-class="search-modal"
      @close="closeSearchDialog"
    >
      <el-input
        ref="searchInputRef"
        v-model="searchVal"
        placeholder="搜索"
        @input="handleSearch"
        @blur="handleSearchBlur"
      >
        <template #prefix>
          <Icon icon="search" :size="17" />
        </template>
        <template #suffix>
          <div class="search-keydown">
            <span>ESC</span>
          </div>
        </template>
      </el-input>

      <el-scrollbar ref="searchResultScrollbarRef" :class="ns.e('search-scrollbar')" :max-height="380">
        <ul :class="ns.e('search-list')" v-show="searchResult.length">
          <li :class="ns.e('search-item')" v-for="(item, index) in searchResult" :key="index">
            <div
              :class="ns.is('highlighted', isHighlighted(index))"
              @click="handleGoPage(item)"
              @mouseenter="highlightOnHover(index)"
            >
              {{ formatTitle(item) }}
              <el-icon class="selected-icon" v-show="isHighlighted(index)"><Back /></el-icon>
            </div>
          </li>
        </ul>

        <div
          :class="ns.e('search-history')"
          v-show="!searchVal && searchResult.length === 0 && historyResult.length > 0"
        >
          <p class="title">搜索历史</p>
          <ul :class="ns.e('history-list')">
            <li
              :class="[ns.e('history-item'), ns.is('highlighted', historyHIndex === index)]"
              v-for="(item, index) in historyResult"
              :key="index"
              @click="handleGoPage(item)"
              @mouseenter="highlightOnHoverHistory(index)"
            >
              {{ formatTitle(item) }}
              <el-icon class="selected-icon" @click.stop="deleteHistory(index)"><Close /></el-icon>
            </li>
          </ul>
        </div>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <div>
            <el-icon><ArrowUp /></el-icon>
            <el-icon><ArrowDown /></el-icon>
            <span>切换</span>
          </div>
          <div>
            <el-icon><Back /></el-icon>
            <span>选择</span>
          </div>
          <div>
            <i>esc</i>
            <span>关闭</span>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
