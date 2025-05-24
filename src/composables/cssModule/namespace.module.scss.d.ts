export interface ScssVariables {
  [x: string]: unknown;
  // 暗色主题
  namespace: string; // 自定义根节点 class 前缀
  elNamespace: string; // Element Plus 组件 class 前缀
}

export const variables: ScssVariables;

export default variables;
