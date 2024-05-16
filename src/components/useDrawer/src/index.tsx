import { render, getCurrentInstance, unref, type Component, type ComponentInternalInstance, type VNode } from "vue";
import { ElDrawer, ElButton, type DrawerProps } from "element-plus";
import { Icon } from "@/components";
import "./index.scss";
import { useDesign } from "@/hooks";

const { variables } = useDesign();
let id = 0;
let thisAppContext: any = null;

const getFather = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

interface Drawer extends Partial<DrawerProps> {
  render?: () => VNode;
  headerRender?: () => VNode;
  showFooter?: boolean;
  footerRender?: () => VNode;
  onConfirm?: (closeDrawer: () => void) => void;
  onClose?: (closeDrawer: () => void) => void;
}

export const closeDrawer = () => {
  const vm = document.querySelector(`#work-drawer-${id--}`) as HTMLElement;
  vm && getFather().removeChild(vm);
};

const handleClose = (drawerProps: Drawer) => {
  if (drawerProps.onClose) drawerProps.onClose(closeDrawer);
  return closeDrawer();
};

const handleConfirm = (drawerProps: Drawer) => {
  if (drawerProps.onConfirm) drawerProps.onConfirm(closeDrawer);
  return closeDrawer();
};

/**
 * 内容渲染方式有两种
 * 方式 1：在第一个参数里写 render，即可实现 el-drawer 的内容渲染
 * 方式 2：第二个参数为组件，第三个参数为组件的 props
 *
 * 在第一个参数里写 headerRender 和 footerRender，可以自定义 el-drawer 的 header 和 footer
 */
export const showDrawer = (
  drawerProps: Drawer,
  component?: Component,
  componentsProps?: any,
  ctx?: ComponentInternalInstance
) => {
  ctx && (thisAppContext = ctx?.appContext);

  const isFullscreen = ref(false);

  const toggleFull = () => {
    const elDrawerEl = document.querySelector(
      `${`#work-drawer-${id}`} .work-drawer.${variables.elNamespace}-drawer`
    ) as HTMLElement;
    if (elDrawerEl) elDrawerEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !unref(isFullscreen);
  };

  const vm = (
    <ElDrawer
      modelValue
      title="弹框"
      size="30%"
      before-close={() => handleClose(drawerProps)}
      {...drawerProps}
      render
      headerRender
      footerRender
      class="work-drawer"
    >
      {{
        default: () => {
          if (drawerProps.render) return drawerProps.render();
          return <component is={component} {...componentsProps}></component>;
        },
        header: () => {
          if (drawerProps.headerRender) return drawerProps.headerRender();
          return (
            <>
              <span class="el-drawer__title">{drawerProps.title}</span>
              {drawerProps.fullscreen === true ||
                (drawerProps.fullscreen === undefined && (
                  <Icon
                    name={unref(isFullscreen) ? "fullscreen-exit" : "fullscreen"}
                    onClick={() => toggleFull()}
                    width="18px"
                    height="18px"
                    color="var(--el-color-info)"
                    hover-color="var(--el-color-primary)"
                    icon-style={{ cursor: "pointer" }}
                  />
                ))}
            </>
          );
        },
        footer: () => {
          if (drawerProps.footerRender) return drawerProps.footerRender();
          if (drawerProps.showFooter === false) return;
          return (
            <>
              <ElButton onClick={() => handleClose(drawerProps)}>取 消</ElButton>
              <ElButton type="primary" onClick={() => handleConfirm(drawerProps)}>
                确 定
              </ElButton>
            </>
          );
        },
      }}
    </ElDrawer>
  );

  vm.appContext = thisAppContext;
  vm.children?.length && (vm.children[0].appContext = thisAppContext);

  const container = document.createElement("div");
  container.id = `work-drawer-${++id}`;
  getFather().appendChild(container);
  render(vm, container);
};

export const initDrawer = (ctx?: ComponentInternalInstance) => {
  const { appContext } = ctx || (getCurrentInstance() as ComponentInternalInstance);
  thisAppContext = appContext;
  return { showDrawer };
};
