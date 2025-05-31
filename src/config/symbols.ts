import type { LayoutSizeType, WebSocketStore } from "@/stores";
import type { InjectionKey, Ref } from "vue";

interface ConfigGlobal {
  size: Ref<LayoutSizeType>;
}

export const ConfigGlobalKey: InjectionKey<ConfigGlobal> = Symbol("ConfigGlobal");
export const RefreshPageKey: InjectionKey<(value?: boolean) => void> = Symbol("RefreshPage");
export const WebSocketKey: InjectionKey<WebSocketStore> = Symbol("WebSocket");
export const RefreshIFrameKey: InjectionKey<WebSocketStore> = Symbol("RefreshIFrameKey");
export const OpenSearchDialogKey: InjectionKey<WebSocketStore> = Symbol("OpenSearchDialog");
export const OpenThemePanelKey: InjectionKey<WebSocketStore> = Symbol("OpenThemePanel");
