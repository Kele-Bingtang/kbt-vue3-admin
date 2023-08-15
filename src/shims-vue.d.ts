// vue 实例全局属性
declare module "vue" {
	export interface GlobalComponents {
		Role: typeof import("./components/Permission/role.vue")["default"]
		Auth: typeof import("./components/Permission/auth")["default"]
		Icon: typeof import("./components/Icon/index.vue")["default"]
	}

  interface ComponentCustomProperties {
    // element ui 的变量
    scope: any;
    $index: number;
  }
}

export {};
