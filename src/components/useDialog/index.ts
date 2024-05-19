import { initDialog, closeDialog, type WorkDialogProps } from "./src/index";
import { getCurrentInstance, type ComponentInternalInstance } from "vue";
import WorkDialog from "./src/index.vue";

export { WorkDialog, type WorkDialogProps };

export const useDialog = (ctx?: any) => {
  const thisAppContext = ctx || (getCurrentInstance() as ComponentInternalInstance);
  const { showDialog } = initDialog(thisAppContext);

  return { open: showDialog, close: closeDialog };
};
