import ImageViewer from "./src/index.vue";
import { createVNode, render, type VNode } from "vue";
import type { ImageViewerProps } from "./src/index.vue";

export { ImageViewer };

let instance: VNode | null = null;

export const createImageViewer = (options: ImageViewerProps & { show?: boolean }) => {
  if (typeof window === "undefined") return;
  const {
    urlList,
    initialIndex = 0,
    infinite = true,
    hideOnClickModal = false,
    teleported = false,
    zIndex = 2000,
    show = true,
  } = options;

  const propsData: Partial<ImageViewerProps> = {};
  const container = document.createElement("div");
  propsData.urlList = urlList;
  propsData.initialIndex = initialIndex;
  propsData.infinite = infinite;
  propsData.hideOnClickModal = hideOnClickModal;
  propsData.teleported = teleported;
  propsData.zIndex = zIndex;
  propsData.modelValue = show;

  document.body.appendChild(container);
  instance = createVNode(ImageViewer, propsData);
  render(instance, container);
};
