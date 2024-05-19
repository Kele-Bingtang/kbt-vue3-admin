import { initDrawer, closeDrawer, type WorkDrawerProps } from "./src/index";
import { getCurrentInstance, type ComponentInternalInstance } from "vue";
import WorkDrawer from "./src/index.vue";

export { WorkDrawer, type WorkDrawerProps };

export const useDrawer = (ctx?: any) => {
  const thisAppContext = ctx || (getCurrentInstance() as ComponentInternalInstance);
  const { showDrawer } = initDrawer(thisAppContext);

  return { open: showDrawer, close: closeDrawer };
};
