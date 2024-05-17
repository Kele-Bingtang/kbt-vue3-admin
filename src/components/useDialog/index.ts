import { initDialog, closeDialog, type UseDialogProps } from "./src/index";
import { getCurrentInstance, type ComponentInternalInstance } from "vue";
import Dialog from "./src/index.vue";

export { Dialog as BasicDialog, type UseDialogProps };

export const useDialog = (ctx?: any) => {
  const thisAppContext = ctx || (getCurrentInstance() as ComponentInternalInstance);
  const { showDialog } = initDialog(thisAppContext);

  return { open: showDialog, close: closeDialog };
};
