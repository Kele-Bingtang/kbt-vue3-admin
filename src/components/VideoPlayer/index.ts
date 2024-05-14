import { createVNode, render, type VNode } from "vue";
import index from "./src/index.vue";
import VideoPlayerViewer from "./src/videoPlayerViewer.vue";
import { generateUUID } from "@/utils";
import { useInstall } from "@/utils";

export const VideoPlayer = useInstall(index);

export default index;

let instance: VNode | null = null;

export const createVideoViewer = (options: { url: string; poster?: string; show?: boolean }) => {
  if (typeof window === "undefined") return;
  const { url, poster } = options;

  const propsData: Partial<{ url: string; poster?: string; show?: boolean; id?: string }> = {};
  const container = document.createElement("div");
  const id = generateUUID();
  container.id = id;
  propsData.url = url;
  propsData.poster = poster;
  propsData.show = true;
  propsData.id = id;

  document.body.appendChild(container);
  instance = createVNode(VideoPlayerViewer, propsData);
  render(instance, container);
};
