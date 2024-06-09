import type { LayoutSizeType, WebSocketStore } from "@/stores";
import type { InjectionKey, ComputedRef } from "vue";

interface ConfigGlobal {
  size: ComputedRef<LayoutSizeType>;
}

export const ConfigGlobalKey: InjectionKey<ConfigGlobal> = Symbol("ConfigGlobal");
export const RefreshKey: InjectionKey<(value?: boolean) => boolean> = Symbol("Refresh");
export const WebSocketKey: InjectionKey<WebSocketStore> = Symbol("WebSocket");
