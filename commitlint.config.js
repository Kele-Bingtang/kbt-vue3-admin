/**
 * feat：新特性、新功能
 * fix：修改 Bug
 * perf：优化相关，比如提升性能、体验
 * style：代码格式修改, 注意不是 CSS 修改
 * docs：仅文档新增、改动
 * test：测试用例修改
 * refactor：代码重构
 * build：编译相关的修改，例如发布版本、对项目构建或者依赖的改动
 * ci：持续集成修改
 * chore：其他修改, 比如改变构建流程、或者增加依赖库、工具等
 * revert：回滚到上一个版本
 * optimize: 优化构建工具或运行时性能
 * workflow: 工作流变动
 * wip: 开发中
 * types: 类型定义文件更改
 */

module.exports = {
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"], // body 换行
    "footer-leading-blank": [1, "always"], // footer 以空行开头
    "header-max-length": [2, "always", 108], // header 最长 108
    "subject-empty": [2, "never"], // subject 不能为空
    "type-empty": [2, "never"], // type 不能为空
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "style",
        "docs",
        "test",
        "refactor",
        "build",
        "ci",
        "chore",
        "revert",
        "optimize",
        "workflow",
        "wip",
        "types",
      ],
    ],
  },
};
