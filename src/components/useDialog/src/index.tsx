import { render, getCurrentInstance, type Component, type ComponentInternalInstance, type VNode } from "vue";
import { ElDialog, ElButton, type DialogProps, ElScrollbar } from "element-plus";
import { getPx } from "@/utils";
import { Icon } from "@/components";
import "./index.scss";
import { useDesign } from "@/hooks";

const { getPrefixClass, variables } = useDesign();
const prefixClass = getPrefixClass("work-dialog");

let id = 0;
let thisAppContext: any = null;

const getFather = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

export interface UseDialogProps extends Partial<DialogProps> {
  render?: () => VNode; // 内容渲染
  headerRender?: (scope: any) => VNode; // 头部渲染
  footerRender?: () => VNode; // 底部渲染
  showFooter?: boolean; // 显示 footer，默认 true
  onConfirm?: (closeDialog: () => void) => void; // 确认按钮点击事件
  onClose?: (closeDialog: () => void) => void; // 关闭按钮点击事件
  fullscreen?: boolean; // 是否默认全屏，默认 true
  height?: string | number; // 内容高度，默认 400px
}

/**
 * @description 关闭弹框
 */
export const closeDialog = () => {
  const vm = document.querySelector(`#${prefixClass}-${id--}`) as HTMLElement;
  vm && getFather().removeChild(vm);
};

const handleClose = (dialogProps?: UseDialogProps) => {
  if (dialogProps?.onClose) dialogProps?.onClose(closeDialog);
  return closeDialog();
};

const handleConfirm = (dialogProps?: UseDialogProps) => {
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
  dialogProps: UseDialogProps,
  component?: Component,
  componentsProps?: any,
  ctx?: ComponentInternalInstance
) => {
  ctx && (thisAppContext = ctx?.appContext);

  const isFullscreen = ref(false);

  const toggleFull = () => {
    const elDialogEl = document.querySelector(
      `${`#${prefixClass}-${id}`} .${prefixClass}.${variables.elNamespace}-dialog`
    ) as HTMLElement;
    if (elDialogEl) elDialogEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !isFullscreen.value;
  };

  const contentHeight = ref(getPx(dialogProps.height || 400));

  watch(
    () => isFullscreen.value,
    async (val: boolean) => {
      await nextTick();
      if (val) {
        const windowHeight = document.documentElement.offsetHeight;
        contentHeight.value = `${windowHeight - 41 - 49 - (dialogProps.footerRender ? 63 : 0)}px`;
      } else {
        contentHeight.value = getPx(dialogProps.height || 400);
      }
    },
    {
      immediate: true,
    }
  );

  const vm = (
    <ElDialog
      modelValue
      title="弹框"
      top="2vh"
      width="50%"
      before-close={() => handleClose(dialogProps)}
      close-on-click-modal={false}
      draggable
      {...dialogProps}
      render
      headerRender
      footerRender
      class={prefixClass}
    >
      {{
        default: () => {
          if (dialogProps.render) {
            return <ElScrollbar style={{ height: contentHeight.value }}>{dialogProps.render()}</ElScrollbar>;
          }
          return (
            <ElScrollbar style={{ height: contentHeight.value }}>
              <component is={component} {...componentsProps}></component>
            </ElScrollbar>
          );
        },
        header: (scope: any) => {
          if (dialogProps?.headerRender) return dialogProps.headerRender(scope);
          return (
            <div style="display: flex">
              <span class={`${variables.elNamespace}-dialog__title`} style="flex: 1">
                {dialogProps.title}
              </span>
              {dialogProps.fullscreen === true ||
                (dialogProps.fullscreen === undefined && (
                  <Icon
                    name={isFullscreen.value ? "fullscreen-exit" : "fullscreen"}
                    onClick={() => toggleFull()}
                    width="15px"
                    height="15px"
                    color="var(--el-color-info)"
                    hover-color="var(--el-color-primary)"
                    icon-style={{ cursor: "pointer" }}
                  />
                ))}
            </div>
          );
        },
        footer: () => {
          if (dialogProps.footerRender) return dialogProps.footerRender();
          if (dialogProps.showFooter === false) return;
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
  container.id = `${prefixClass}-${++id}`;
  getFather().appendChild(container);
  render(vm, container);
};

export const initDialog = (ctx?: ComponentInternalInstance) => {
  const { appContext } = ctx || (getCurrentInstance() as ComponentInternalInstance);
  thisAppContext = appContext;
  return { showDialog };
};
