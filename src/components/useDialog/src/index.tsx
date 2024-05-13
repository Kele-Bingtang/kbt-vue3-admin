import { render, getCurrentInstance, type Component, type ComponentInternalInstance, type VNode } from "vue";
import { ElDialog, ElButton, type DialogProps } from "element-plus";
import "./index.scss";

let id = 0;
let thisAppContext: any = null;

const getFather = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

interface Dialog extends Partial<DialogProps> {
  render?: () => VNode;
  headerRender?: () => VNode;
  showFooter?: boolean;
  footerRender?: () => VNode;
  onConfirm?: (closeDialog: () => void) => void;
  onClose?: (closeDialog: () => void) => void;
  fullscreen?: boolean;
}

export const closeDialog = () => {
  const vm = document.querySelector(`#work-dialog-${id--}`) as HTMLElement;
  getFather().removeChild(vm);
};

const handleClose = (dialogProps?: Dialog) => {
  if (dialogProps?.onClose) dialogProps?.onClose(closeDialog);
  return closeDialog();
};

const handleConfirm = (dialogProps?: Dialog) => {
  if (dialogProps?.onConfirm) dialogProps?.onConfirm(closeDialog);
  return closeDialog();
};

/**
 * 内容渲染方式有两种
 * 方式 1：在第一个参数里写 render，即可实现 el-dialog 的内容渲染
 * 方式 2：第二个参数为组件，第三个参数为组件的 props
 *
 * 在第一个参数里写 headerRender 和 footerRender，可以自定义 el-dialog 的 header 和 footer
 */
export const showDialog = (
  dialogProps?: Dialog,
  component?: Component,
  componentsProps?: any,
  ctx?: ComponentInternalInstance
) => {
  ctx && (thisAppContext = ctx?.appContext);

  const isFullscreen = ref(false);

  const toggleFull = () => {
    const elDialogEl = document.querySelector(".el-dialog") as HTMLElement;
    if (elDialogEl) elDialogEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !isFullscreen.value;
  };

  const vm = (
    <ElDialog
      modelValue
      title="弹框"
      top="2vh"
      width="50%"
      before-close={() => handleClose(dialogProps)}
      close-on-click-modal={false}
      {...dialogProps}
      render
      headerRender
      footerRender
      class="work-dialog"
    >
      {{
        default: () => {
          if (dialogProps?.render) return dialogProps?.render();
          return <component is={component} {...componentsProps}></component>;
        },
        header: () => {
          if (dialogProps?.headerRender) return dialogProps?.headerRender();
          return (
            <div style="position: relative">
              <span class="el-dialog__title">{dialogProps?.title}</span>
              {dialogProps?.fullscreen === true ||
                (dialogProps?.fullscreen === undefined && (
                  <Icon
                    name={isFullscreen.value ? "fullscreen-exit" : "fullscreen"}
                    onClick={() => toggleFull()}
                    width="15px"
                    height="15px"
                    color="var(--el-color-info)"
                    hover-color="var(--el-color-primary)"
                    icon-style={{ cursor: "pointer", position: "absolute", top: "-3%", right: "-5px" }}
                  />
                ))}
            </div>
          );
        },
        footer: () => {
          if (dialogProps?.footerRender) return dialogProps?.footerRender();
          if (dialogProps?.showFooter === false) return;
          return (
            <>
              <ElButton onClick={() => handleClose(dialogProps)}>取 消</ElButton>
              <ElButton type="primary" onClick={() => handleConfirm(dialogProps)}>
                确 定
              </ElButton>
            </>
          );
        },
      }}
    </ElDialog>
  );

  vm.appContext = thisAppContext;
  vm.children?.length && (vm.children[0].appContext = thisAppContext);

  const container = document.createElement("div");
  container.id = `work-dialog-${++id}`;
  getFather().appendChild(container);
  render(vm, container);
};

export const initDialog = (ctx?: ComponentInternalInstance) => {
  const { appContext } = ctx || (getCurrentInstance() as ComponentInternalInstance);
  thisAppContext = appContext;
  return { showDialog };
};
