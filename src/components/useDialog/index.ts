import { initDialog, closeDialog } from "./src/index";
import { getCurrentInstance, type ComponentInternalInstance } from "vue";

export const useDialog = (ctx?: any) => {
  const thisAppContext = ctx || (getCurrentInstance() as ComponentInternalInstance);
  const { showDialog } = initDialog(thisAppContext);

  return { open: showDialog, close: closeDialog };
};
