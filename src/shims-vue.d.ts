// vue 实例全局属性
declare module "vue" {
  interface ComponentCustomProperties {
    // element ui 的变量
    scope: any;
    $index: number;
  }
}

export {};
