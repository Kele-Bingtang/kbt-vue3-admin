import namespaceModule from "./cssModule/namespace.module.scss";
/**
 * 命名空间
 *
 * @param block 块，用于声明组件的命名空间
 * @param namespaceOverrides 自定义命名空间
 */
export const useNamespace = (block: string = "", namespaceOverrides?: string) => {
  const finalNamespace = namespaceOverrides || namespaceModule.namespace;

  const b = (blockSuffix?: string) => {
    return createBem(finalNamespace, block, blockSuffix);
  };

  const e = (element: string) => {
    return createBem(finalNamespace, block, "", element);
  };
  const m = (modifier: string) => {
    return createBem(finalNamespace, block, "", "", modifier);
  };

  const be = (blockSuffix: string, element: string) => {
    return createBem(finalNamespace, block, blockSuffix, element);
  };

  const bm = (blockSuffix: string, modifier: string) => {
    return createBem(finalNamespace, block, blockSuffix, "", modifier);
  };

  const em = (element: string, modifier: string) => {
    return createBem(finalNamespace, block, "", element, modifier);
  };

  const bem = (blockSuffix: string, element: string, modifier: string) => {
    return createBem(finalNamespace, block, blockSuffix, element, modifier);
  };

  const is = (name: string, bool = true) => {
    return bool ? `is-${name}` : "";
  };

  /**
   * 创建 BEM 元素
   */
  const createBem = (namespace: string, block: string, blockSuffix?: string, element?: string, modifier?: string) => {
    let space = `${namespace}-${block}`;

    if (blockSuffix) space += `-${blockSuffix}`;
    if (element) space += `__${element}`;
    if (modifier) space += `--${modifier}`;
    return space;
  };

  /**
   * 拼接命名空间
   * @param scope
   */
  const joinNamespace = (scope?: string) => {
    return `${finalNamespace}-${scope}`;
  };

  /**
   * CSS 变量，当 name = color，返回 var(--tk-color)
   */
  const cssVar = (name: string) => `var(--${finalNamespace}-${name})`;
  /**
   * CSS 变量名称当 name = color，返回 --tk-color
   */
  const cssVarName = (name: string) => `--${finalNamespace}-${name}`;
  /**
   * 获取缓存的 key
   */
  const storageKey = (...key: string[]) => `${finalNamespace}:${key.join(":")}`;

  return {
    namespaceModule,
    namespace: namespaceModule.namespace,
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
    createBem,
    joinNamespace,
    cssVar,
    cssVarName,
    storageKey,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
