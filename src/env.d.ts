/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

// import.meta.env 环境变量
interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_API_URL: string;
  readonly VITE_ROUTE_BASE: string;
  readonly VITE_PUBLIC_PATH: string;
}
