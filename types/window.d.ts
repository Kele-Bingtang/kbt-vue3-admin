declare global {
  interface Navigator {
    browserLanguage: string;
  }
  interface Window {
    webkitCancelAnimationFrame;
    mozCancelAnimationFrame;
    oCancelAnimationFrame;
    msCancelAnimationFrame;
    webkitRequestAnimationFrame;
    mozRequestAnimationFrame;
    oRequestAnimationFrame;
    msRequestAnimationFrame;
  }
}

declare global {
  /**
   * 平台的名称、版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    lastBuildTime: string;
  };
}

export {}; // 扩展 global 而不是覆盖
