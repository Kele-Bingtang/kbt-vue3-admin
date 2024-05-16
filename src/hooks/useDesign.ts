import variables from "@/styles/namespace.module.scss";

export const useDesign = () => {
  /**
   * @param scope 类名
   * @returns 返回空间名-类名
   */
  const getPrefixClass = (scope: string) => {
    return `${variables.namespace}-${scope}`;
  };

  return {
    variables: variables,
    getPrefixClass,
  };
};
