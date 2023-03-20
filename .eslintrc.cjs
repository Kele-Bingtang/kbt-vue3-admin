/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
    "./.eslintrc-globals.json",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    // typeScript (https://typescript-eslint.io/rules)
    "@typescript-eslint/no-unused-vars": process.env.NODE_ENV === "production" ? "error" : "warn", // 禁止定义未使用的变量
    "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
    "@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
    "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
    "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
    "@typescript-eslint/ban-types": "off", // 禁止使用特定类型
    "@typescript-eslint/explicit-function-return-type": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    "@typescript-eslint/no-var-requires": "off", // 不允许在 import 语句中使用 require 语句
    "@typescript-eslint/no-empty-function": "off", // 禁止空函数
    "@typescript-eslint/no-use-before-define": "off", // 禁止在变量定义之前使用它们
    "@typescript-eslint/ban-ts-comment": "off", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    "@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)
    "@typescript-eslint/explicit-module-boundary-types": "off", // 要求导出函数和类的公共类方法的显式返回和参数类型

    // vue (https://eslint.vuejs.org/rules)
    "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
    "vue/v-slot-style": "error", // 强制执行 v-slot 指令样式
    "vue/no-mutating-props": "off", // 不允许组件 prop的改变
    "vue/custom-event-name-casing": "off", // 为自定义事件名称强制使用特定大小写
    "vue/attributes-order": "off", // vue api使用顺序，强制执行属性顺序
    "vue/one-component-per-file": "off", // 强制每个组件都应该在自己的文件中
    "vue/html-closing-bracket-newline": "off", // 在标签的右括号之前要求或禁止换行
    "vue/max-attributes-per-line": "off", // 强制每行的最大属性数
    // "vue/max-attributes-per-line": [2, { singleline: 10, multiline: { max: 1 }}], // 强制每行的最大属性数
    "vue/attribute-hyphenation": "off", // 对模板中的自定义组件强制执行属性命名样式
    "vue/require-default-prop": "off", // 此规则要求为每个 prop 为必填时，必须提供默认值
    "vue/multi-word-component-names": "off", // 要求组件名称始终为 “-” 链接的单词
    "vue/valid-template-root": "off",
    "vue/singleline-html-element-content-newline": "off", // 在单行元素的内容之前和之后需要换行符
    "vue/multiline-html-element-content-newline": "off", // 在多行元素的内容之前和之后需要换行符
    // "vue/name-property-casing": [2, "PascalCase"], // 为 Vue 组件中的 name 属性强制使用特定大小写(PascalCase | kebab-case)
    "vue/no-v-html": "off", // 禁止使用 v-html 来防止 XSS 攻击
    "accessor-pairs": 2, // 强制 getter 和 setter 在对象中成对出现
    "arrow-spacing": [2, { before: true, after: true }], // 在箭头函数中的箭头前后强制保持一致的间距
    "block-spacing": [2, "always"], // 禁止或强制在代码块中开括号前和闭括号后有空格
    "brace-style": [2, "1tbs", { allowSingleLine: true }], // 强制在代码块中使用一致的大括号风格
    camelcase: [0, { properties: "always" }], // 强制使用骆驼拼写法命名约定
    "comma-dangle": [
      // 是否加加逗号
      2,
      {
        arrays: "ignore", // 数组后面加逗号
        objects: "ignore", // 对象
        imports: "ignore", // import { a,b, }
        exports: "ignore",
        functions: "ignore",
      },
    ], // 要求或禁止末尾逗号
    "comma-spacing": [2, { before: false, after: true }], // 在逗号前后强制保持一致的间距
    "comma-style": [2, "last"], // 强制使用一致的逗号样式
    "constructor-super": 2, // 要求在构造函数中有 super() 的调用
    curly: [2, "multi-line"], // 强制所有控制语句使用一致的括号风格
    "dot-location": [2, "property"], // 在点之前和之后强制执行一致的换行符
    "eol-last": 2, // 要求或禁止文件末尾存在空行
    eqeqeq: ["error", "always", { null: "ignore" }], // 要求使用 === 和 !==
    "generator-star-spacing": [2, { before: true, after: true }], // 强制 generator 函数中 * 号周围使用一致的空格
    "handle-callback-err": [2, "^(err|error)$"], // 要求回调函数中有容错处理
    indent: [2, 2, { SwitchCase: 1 }], // 强制使用一致的缩进
    "jsx-quotes": [2, "prefer-double"], // 强制在 JSX 属性中一致地使用双引号或单引号
    "key-spacing": [2, { beforeColon: false, afterColon: true }], // 强制在对象字面量的属性中键和值之间使用一致的间距
    "keyword-spacing": [2, { before: true, after: true }], // 强制在关键字前后使用一致的空格
    "new-cap": [2, { newIsCap: true, capIsNew: false }], // 要求构造函数首字母大写
    "new-parens": 2, // 强制或禁止调用无参构造函数时有圆括号
    "no-prototype-builtins": "off", // 禁止直接使用 Object.prototypes 的内置属性
    "no-array-constructor": 2, // 禁用 Array 构造函数
    "no-caller": 2, // 禁用 arguments.caller 或 arguments.callee
    "no-console": "off", // 禁用 console
    "no-class-assign": 2, // 禁止修改类声明的变量
    "no-cond-assign": 2, // 禁止条件表达式中出现赋值操作符
    "no-const-assign": 2, // 禁止修改 const 声明的变量
    "no-control-regex": 0, // 禁止在正则表达式中使用控制字符
    "no-delete-var": 2, // 禁止删除变量
    "no-dupe-args": 2, // 禁止 function 定义中出现重名参数
    "no-dupe-class-members": 2, // 禁止类成员中出现重复的名称
    "no-dupe-keys": 2, // 禁止对象字面量中出现重复的 key
    "no-duplicate-case": 2, // 禁止出现重复的 case 标签
    "no-empty-character-class": 2, // 禁止在正则表达式中使用空字符集
    "no-empty-pattern": 2, // 禁止使用空解构模式
    "no-eval": 2, // 禁用 eval()
    "no-ex-assign": 2, // 禁止对 catch 子句的参数重新赋值
    "no-extend-native": 2, // 禁止扩展原生类型
    "no-extra-bind": 2, // 禁止不必要的 .bind() 调用
    "no-extra-boolean-cast": 2, // 禁止不必要的布尔转换
    "no-extra-parens": [2, "functions"], // 禁止不必要的括号
    "no-fallthrough": 2, // 禁止 case 语句落空
    "no-floating-decimal": 2, // 禁止数字字面量中使用前导和末尾小数点
    "no-func-assign": 2, // 禁止对 function 声明重新赋值
    "no-implied-eval": 2, // 禁用隐式的eval()
    "no-inner-declarations": [2, "functions"], // 禁止在嵌套的块中出现变量声明或 function 声明
    "no-invalid-regexp": 2, // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
    "no-irregular-whitespace": 2, // 禁止不规则的空白
    "no-iterator": 2, // 禁用 __iterator__ 属性
    "no-label-var": 2, // 不允许标签与变量同名
    "no-labels": [2, { allowLoop: false, allowSwitch: false }], // 禁用标签语句
    "no-lone-blocks": 2, // 禁用不必要的嵌套块
    "no-mixed-spaces-and-tabs": 2, // 禁止空格和 tab 的混合缩进
    "no-multi-spaces": 2, // 禁止使用多个空格
    "no-multi-str": 2, // 禁止多行字符串
    "no-multiple-empty-lines": [2, { max: 1 }], // 禁止出现多行空行
    "no-native-reassign": 2, // 不允许修改只读全局变量。此规则在 ESLint v3.3.0 中已弃用，并由 no-global-assign 规则取代
    "no-negated-in-lhs": 2, // 禁止对关系运算符 in 的左操作数使用否定操作符(!)
    "no-new-object": 2, // 不允许使用Object构造函数
    "no-new-require": 2, // 禁止调用 require 时使用 new 操作符
    "no-new-symbol": 2, // 禁止new Symbol
    "no-new-wrappers": 2, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    "no-obj-calls": 2, // 禁止把全局对象作为函数调用
    "no-octal": 2, // 禁用八进制字面量
    "no-octal-escape": 2, // 禁止在字符串字面量中使用八进制转义序列
    "no-path-concat": 2, // 禁止对 __dirname 和 __filename 进行字符串连接
    "no-proto": 2, // 禁用 __proto__ 属性。__proto__属性已从 ECMAScript 3.1 中弃用，不应在代码中使用。改为使用方法getPrototypeOf
    "no-redeclare": 2, // 禁止多次声明同一变量
    "no-regex-spaces": 2, // 禁止正则表达式字面量中出现多个空格
    "no-return-assign": [2, "except-parens"], // 禁止在 return 语句中使用赋值语句
    "no-self-assign": 2, // 禁止自我赋值
    "no-self-compare": 2, // 禁止自身比较
    "no-sequences": 2, // 禁用逗号操作符
    "no-shadow-restricted-names": 2, // 禁止将标识符定义为受限的名字
    "no-spaced-func": 2, // 要求或禁止在函数标识符和其调用之间有空格
    "no-sparse-arrays": 2, // 禁用稀疏数组
    "no-this-before-super": 2, // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
    "no-throw-literal": 2, // 禁止抛出异常字面量
    "no-trailing-spaces": 2, // 禁用行尾空格
    "no-undef": process.env.NODE_ENV === "production" ? 2 : 1, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    "no-undef-init": 2, // 禁止将变量初始化为 undefined
    "no-unexpected-multiline": 2, // 不允许混淆多行表达式
    "no-unmodified-loop-condition": 2, // 该规则查找循环条件内的引用，然后检查这些引用的变量是否在循环中被修改
    "no-unneeded-ternary": [2, { defaultAssignment: false }], // 当存在更简单的选择时，此规则不允许三元运算符
    "no-unreachable": 2, // 禁止在 return、throw、continue 和 break 语句后出现不可达代码
    "no-unsafe-finally": 2, // 禁止在 finally 语句块中出现控制流语句
    "no-unused-vars": [process.env.NODE_ENV === "production" ? "error" : "warn", { vars: "all", args: "none" }], // 禁止出现未使用的变量，函数和函数的参数
    "no-useless-call": 2, // 禁止不必要的 .call() 和 .apply()
    "no-useless-computed-key": 2, // 禁止在对象中使用不必要的计算属性键
    "no-useless-constructor": 2, // 禁用不必要的构造函数
    "no-useless-escape": 0, // 禁用不必要的转义字符
    "no-whitespace-before-property": 2, // 如果对象的属性位于同一行上，则该规则不允许围绕点或在开头括号之前留出空白。当对象和属性位于不同的行上时，此规则允许使用空格，因为向更长的属性链添加换行符是很常见的
    "no-with": 2, // 禁用 with 语句
    "one-var": [2, { initialized: "never" }], // 使用同一个关键字声明多个变量时要么在同一行声明要么都换行声明。这条规则在变量声明周围执行一致的换行符。这条规则忽略了for循环条件中的变量声明
    "operator-linebreak": [2, "after", { overrides: { "?": "before", ":": "before" } }], // 强制操作符使用一致的换行符
    "padded-blocks": [2, "never"], // 要求或禁止块内填充
    quotes: [2, "double", { avoidEscape: true, allowTemplateLiterals: true }], // 强制一致使用反引号，双引号或单引号
    semi: [2, "always"], // 要求或禁止使用分号
    "semi-spacing": "error", // 强制分号之前和之后使用一致的空格
    "space-before-blocks": [2, "always"], // 强制在块之前使用一致的空格
    "space-before-function-paren": [
      2,
      {
        anonymous: "always", // 匿名函数表达式（例如 function () {}）
        named: "never", // 命名函数表达式（例如 function foo () {}）
        asyncArrow: "always", // 异步箭头函数表达式（例如 async () => {}）
      },
    ], // 强制在 function 的左括号之前使用一致的空格
    "space-in-parens": [2, "never"], // 强制在圆括号内使用一致的空格
    "space-infix-ops": 2, // 要求操作符周围有空格
    "space-unary-ops": [2, { words: true, nonwords: false }], // 强制在一元操作符前后使用一致的空格
    "spaced-comment": [
      2,
      "always",
      { markers: ["global", "globals", "eslint", "eslint-disable", "*package", "!", ","] },
    ], // 强制在注释中 // 或 /* 使用一致的空格
    "template-curly-spacing": [2, "never"], // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    "use-isnan": 2, // 要求使用 isNaN() 检查 NaN
    "valid-typeof": 2, // 强制 typeof 表达式与有效的字符串进行比较
    "wrap-iife": [2, "any"], // 该规则要求所有立即调用的函数表达式都包含在圆括号中
    "yield-star-spacing": [2, "both"], // 此规则强制执行*周围 yield*表达式的间距。
    yoda: [2, "never"], // 这条规则旨在强制执行一种将变量与文字值进行比较的一致条件样式
    "prefer-const": 2, // 要求使用 const 声明那些声明后不再被修改的变量
    // eslint-disable-next-line no-undef
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0, // 禁用 debugger
    "object-curly-spacing": [2, "always"], // 此规则在对象文字的大括号内执行一致的间距，解构赋值和导入/导出说明符。
    "array-bracket-spacing": [2, "never"], // 该规则在数组括号内强制实现一致的间距
  },
};
