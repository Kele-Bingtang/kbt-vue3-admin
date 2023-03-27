module.exports = {
  root: true,
  extends: [
    "stylelint-config-standard-vue", // 配置stylelint拓展插件
    "stylelint-config-html", // 配置 html 样式格式化
    "stylelint-config-recess-order", // 配置 stylelint css 属性书写顺序插件
  ],
  /**
   * null  => 关闭该规则
   */
  rules: {
    "value-keyword-case": null, // 在 css 中使用 v-bind，不报错
    "no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    "function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    "color-hex-length": "long", // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
    "font-family-no-missing-generic-family-keyword": null, // 禁止在字体族名称列表中缺少通用字体族关键字
    "property-no-unknown": null, // 禁止未知的属性(true 为不允许)
    "no-empty-source": null, // 禁止空源码
    "selector-class-pattern": null, // 强制选择器类名的格式
    "value-no-vendor-prefix": null, // 关闭 vendor-prefix(为了解决多行省略 -webkit-box)
    "selector-class-pattern": null,
    "keyframes-name-pattern": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "v-deep", "deep"],
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["global", "v-deep", "deep"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "apply",
          "variants",
          "responsive",
          "screen",
          "function",
          "if",
          "each",
          "include",
          "mixin",
          "extend",
          "for",
        ],
      },
    ],
    "named-grid-areas-no-invalid": null,
    "function-no-unknown": null,
    "import-notation": "string",
    "rule-empty-line-before": [
      // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行。)"
      "always",
      {
        ignore: ["after-comment", "first-nested"],
      },
    ],
    "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }],
    "order/order": [
      [
        "dollar-variables",
        "custom-properties",
        "at-rules",
        "declarations",
        {
          type: "at-rule",
          name: "supports",
        },
        {
          type: "at-rule",
          name: "media",
        },
        "rules",
      ],
      { severity: "warning" },
    ],
  },
  ignoreFiles: ["**/*.js", "**/*.jsx", "**/*.tsx", "**/*.ts", "**/*.json", "src/styles/*.css", "**/*.module.scss"],
  overrides: [
    // 扫描 .vue/html 文件中的 <style> 标签内的样式
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html",
    },
  ],
};
