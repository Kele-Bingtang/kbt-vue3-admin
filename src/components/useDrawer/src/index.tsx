import {
  render,
  getCurrentInstance,
  unref,
  type Component,
  type ComponentInternalInstance,
  type VNode,
  type AppContext,
  nextTick,
  ref,
} from "vue";
import { ElDrawer, ElButton, type DrawerProps, ElConfigProvider } from "element-plus";
import { Icon } from "@/components";
import "./index.scss";
import { useDesign } from "@/hooks";
import { useLayoutStore } from "@/stores";

const { getPrefixClass, variables } = useDesign();
const prefixClass = getPrefixClass("work-drawer");

let id = 0;

let appContextConst: AppContext | undefined;

const getFather = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

export interface WorkDrawerProps extends Partial<DrawerProps> {
  render?: () => VNode; // 内容区渲染 TSX
  headerRender?: () => VNode; // 顶部渲染 TSX
  footerRender?: () => VNode; // 顶部渲染 TSX
  showFooter?: boolean; // 是否渲染顶部
  onConfirm?: (closeDrawer: () => void) => void; // 确认按钮点击事件
  onClose?: (closeDrawer: () => void) => void; // 关闭按钮点击事件
  fullscreen?: boolean; // 是否默认全屏，默认 false
  fullscreenIcon?: boolean; // 是否渲染全屏图标，默认 true
}

export const closeDrawer = () => {
  const vm = document.querySelector(`#${prefixClass}-${id--}`) as HTMLElement;
  vm && getFather().removeChild(vm);
};

const handleClose = (drawerProps: WorkDrawerProps) => {
  if (drawerProps.onClose) drawerProps.onClose(closeDrawer);
  return closeDrawer();
};

const handleConfirm = (drawerProps: WorkDrawerProps) => {
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
export const showDrawer = (drawerProps: WorkDrawerProps, component?: Component, componentsProps?: any) => {
  const layoutSize = computed(() => useLayoutStore().layoutSize);

  const isFullscreen = ref(false);

  const toggleFull = () => {
    const elDrawerEl = document.querySelector(
      `${`#${prefixClass}-${id}`} .${prefixClass}.${variables.elNamespace}-drawer`
    ) as HTMLElement;
    if (elDrawerEl) elDrawerEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !unref(isFullscreen);
  };

  const vm = (
    <ElConfigProvider namespace={variables.elNamespace} size={unref(layoutSize)}>
      <ElDrawer
        modelValue
        title="弹框"
        size="30%"
        before-close={() => handleClose(drawerProps)}
        {...drawerProps}
        render
        headerRender
        footerRender
        class={prefixClass}
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
                <span class={`${variables.elNamespace}-drawer__title`}>{drawerProps.title}</span>
                {drawerProps.fullscreenIcon !== false && (
                  <Icon
                    name={unref(isFullscreen) ? "fullscreen-exit" : "fullscreen"}
                    onClick={() => toggleFull()}
                    width="18px"
                    height="18px"
                    color={`var(--${variables.elNamespace}-color-info)`}
                    hover-color={`var(--${variables.elNamespace}-color-primary)`}
                    icon-style={{ cursor: "pointer" }}
                  />
                )}
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
    </ElConfigProvider>
  );

  vm.appContext = appContextConst;
  vm.children?.length && (vm.children[0].appContext = appContextConst);

  const container = document.createElement("div");
  container.id = `${prefixClass}-${++id}`;
  getFather().appendChild(container);
  render(vm, container);

  nextTick(() => {
    if (drawerProps.fullscreen) toggleFull();
  });
};

export const initDrawer = (ctx?: ComponentInternalInstance) => {
  const { appContext } = ctx || getCurrentInstance() || {};
  appContextConst = appContext;

  return { showDrawer };
};
