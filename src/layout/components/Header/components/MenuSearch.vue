<template>
  <div :class="{ show: isShowSearch }" class="header-search">
    <svg-icon
      name="search"
      width="20px"
      height="20px"
      :icon-style="{ cursor: 'pointer', verticalAlign: 'middle' }"
      @click.stop="handleStartSearch"
      v-if="!isShowSearch"
    />
    <el-autocomplete
      v-model="searchMenu"
      ref="autocompleteRef"
      placeholder="支持菜单名称、路径"
      :fetch-suggestions="handleSearchMenuList"
      @select="handleClickMenu"
      @click.stop
    >
      <template #prefix>
        <el-tooltip effect="dark" content="切换查询模式" placement="left" :show-after="100">
          <el-icon class="search-icon" @click.stop="handleSwitchMode"><Search /></el-icon>
        </el-tooltip>
      </template>
      <template #default="{ item }">
        <template v-if="!isFunction(item.meta.title)">
          <CommonIcon :icon="item.meta.icon" />
          <span>{{ nestMode ? item.title.join(" > ") : item.meta.title }}</span>
        </template>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts" name="MenuSearch">
import { useLayout } from "@/hooks/useLayout";
import { usePermissionStore } from "@/stores/permission";
import CommonIcon from "@/layout/components/CommonIcon/index.vue";
import { useDebounceFn } from "@vueuse/core";
import { isFunction } from "@/utils/layout/validate";

const router = useRouter();
const permissionStore = usePermissionStore();
const { getTitle } = useLayout();
const nestMode = ref(true);
const menuList = computed(() =>
  nestMode.value
    ? createNestMenuSearchList(permissionStore.loadedRouteList)
    : permissionStore.flatRouteList.filter(item => !item.meta.hideInMenu)
);

const handleSearchMenuList = (queryString: string, callback: (result: any) => void) => {
  const results = queryString ? menuList.value.filter(filterNodeMethod(queryString) as () => boolean) : menuList.value;
  callback(results);
};

const isShowSearch = ref(false);
const autocompleteRef = ref();
const searchMenu = ref("");
// 手动实现防抖
// let timer: NodeJS.Timeout | null = null;

// 关闭搜索菜单
const handleCloseSearch = () => {
  isShowSearch.value = false;
  document.body.removeEventListener("click", handleCloseSearch);
  autocompleteRef.value && (autocompleteRef.value as HTMLElement).blur();
};

// 打开搜索菜单
const handleStartSearch = () => {
  isShowSearch.value = true;
  searchMenu.value = "";
  // 手动实现防抖
  // if (timer) {
  //   document.body.removeEventListener("click", handleCloseSearch);
  //   clearInterval(timer);
  // }
  // nextTick(() => {
  //   timer = setTimeout(() => {
  //     autocompleteRef.value && (autocompleteRef.value as HTMLElement).focus();
  //     document.body.addEventListener("click", handleCloseSearch);
  //   }, 250);
  // });
  // 工具实现防抖
  useDebounceFn(() => {
    autocompleteRef.value && (autocompleteRef.value as HTMLElement).focus();
    document.body.addEventListener("click", handleCloseSearch);
  }, 250)();
};

const handleSwitchMode = () => {
  nestMode.value = !nestMode.value;
  if (autocompleteRef.value) {
    autocompleteRef.value.close();
    nextTick(() => {
      setTimeout(() => {
        (autocompleteRef.value as HTMLElement).focus();
      }, 800);
    });
  }
};

// 筛选菜单
const filterNodeMethod = (queryString: string) => {
  return (restaurant: RouteConfig) => {
    return (
      restaurant.meta._fullPath.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
      getTitle(restaurant)?.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    );
  };
};

// 点击菜单跳转
const handleClickMenu = (menuItem: Record<string, any>) => {
  searchMenu.value = "";
  if (menuItem.meta.isLink) window.open(menuItem.meta.isLink, "_blank");
  else router.push(menuItem.meta._fullPath);
  handleCloseSearch();
};

/**
 * 生成层级下的所有 title 合在一起的菜单数组
 * @param menuList 嵌套菜单列表
 */
const createNestMenuSearchList = (menuList: RouterConfig[]) => {
  const res: (RouterConfig & { title: string[] })[] = [];
  menuList.forEach(menu => {
    if (menu.meta.hideInMenu) return res;
    const item = { ...menu, title: [getTitle(menu)] };
    if (item.children && item.children.length) {
      const menuListChild = createNestMenuSearchList(item.children);
      menuListChild.forEach(child => {
        const c = { ...child };
        c.title = [...item.title, ...child.title] as string[];
        res.push(c);
      });
    } else {
      res.push(item);
    }
  });
  return res;
};

onUnmounted(() => {
  document.body.removeEventListener("click", handleCloseSearch);
});
</script>

<style lang="scss" scoped>
.header-search {
  &:not(.show) {
    :deep(.el-autocomplete) {
      width: 0;
      transition: width 0.2s;

      .el-input__wrapper {
        width: 0;
        padding: 0;
      }

      .el-input__prefix {
        display: none;
      }
    }
  }

  &.show {
    :deep(.el-autocomplete) {
      width: 220px;
      transition: width 0.2s;
    }
  }

  .search-icon {
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.el-autocomplete__popper {
  .el-icon {
    position: relative;
    top: 2px;
    font-size: 16px;
  }

  span {
    margin: 0 0 0 10px;
    font-size: 14px;
  }
}
</style>
