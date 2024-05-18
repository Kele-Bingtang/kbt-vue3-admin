# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v0.0.2...v0.1.0) (2024-05-18)

### ⚠ BREAKING CHANGES

- 、

### Features

- 支持 pnpm、新增 Icon 组件、ElementPlus Icon 去掉全局注入 ([9241b1c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/9241b1c544d7818f9cac6ad2bdfbcb2038295ea2))
- 🚀 布局适配移动端，Tinymce 添加多图片上传功能 ([3e8f346](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/3e8f346a25c4fd4274594931b76f0a044c8956f4))
- 🚀 分页优化 ([38632b7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/38632b721c1289a4a00b8a7f53aa57a667e88d99))
- 🚀 公共组件使用命名空间，重构所有 scss 样式规范，优化部分组件问题，按需引入 EP 组件 ([4c225e1](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/4c225e19098b61917a21602fdd1f4a743849ec25))
- 🚀 升级 ProTable、ProForm 等相关组件 ([379eceb](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/379eceb2c5f007f03bdc0d4aa54ce1997a0d6265))
- 🚀 添加 .versionrc 文件，支持多种 commit type 显示在 changeLog 文档，添加中文版 commit 提交提示，修复部分内容 ([e1a4ac7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e1a4ac7579fd6f8621fdfd31b741e23a10e527d1))
- 🚀 添加 iframe 缓存 ([3eaf43b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/3eaf43b851c8994c474e2a94544468bec3fc4e80))
- 🚀 添加 request 枚举类相关使用，添加部分状态码的处理 ([af35c83](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/af35c83b744b4536f804187ccb06859e3a031131))
- 🚀 添加 standard-version 生命周期，可配置跳过 bump 版本号、commit、tag、changelog 执行 ([777682c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/777682c213a22ec9844a9e9c7771dd79813616e3))
- 🚀 添加超级表单功能，升级依赖版本，修复布局样式 ([516c929](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/516c9294302678e64c63cecb0844b55eabaa4c6a))
- 🚀 添加多个环境变量。使用 vite-plugin-style-import 解决 EP 样式按需加载。解决 unplugin-auto-import/vite 问题。重构 Pinia 缓存格式。添加 useStorage、useCache，添加固定标签页配置项。自定义路由类型重构 ([fb2db2f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/fb2db2f74dbb3ca7d3e4526b293d2ad21b5ba1f6))
- 🚀 新增 Axios 避免重复请求功能，添加通过 name 查找路由功能 ([d7c69f2](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/d7c69f26e47e595087d532b189c1dc31d3081aff))
- 🚀 新增 Dialog、Drawer 的函数式调用功能。Icon 组件支持自定义颜色和悬停色，添加图片预览功能 ([a4a4109](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/a4a41093c81e23b134e18803e4b94f9fa9a29efb))
- 🚀 新增 iframe 新窗口打开功能、支持 iframe 通信自动跳转路由，新增 ProTable 组件 ([09a8c68](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/09a8c68163f9cf993d4df5a75514615ba80aefd7))
- 🚀 新增 useDesign 命名空间配置 ([968af1e](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/968af1e21b8adb00b7d672cacdf325297f394aea))
- 🚀 新增 VITE_ROUTER_MODE 环境变量，支持 hash 和 h5 历史模式，修复 request 的 mappingUrl ([0570a6c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0570a6c6dbe91804a3e0d0dcc5448b46f5374740))
- 🚀 修复 Mixins 布局二级菜单，添加两个右键菜单组件 ([4d905f6](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/4d905f6c2b23ab80f03bd9a0093e7e8ff53bc03e))
- 🚀 修复 ProTable 反复请求问题 ([8d09958](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8d099587b2013521afa75be8948cc3fbe10165b0))
- 🚀 修复 ProTable 默认值覆盖输入值 ([3258b65](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/3258b65ec1ed1c1e6628dbdef4ae413ca429015a))
- 🚀 优化 proTable ([ed9885c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/ed9885c61493e338d6c5bb5f46bc547b7466f575))
- 🚀 优化 ProTable，修复异常被捕获不显示控制台问题，更新主页时间线，添加使用文档链接 ([b78aadb](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b78aadb02714baa8ec15e14884e55f96c10936d8))
- 🚀 优化超级表单 ([7bdb6cf](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/7bdb6cf80eec9b20818158d3b5b65471cdb827bd))
- 🚀 优化超级表格详情，修复 iframe 样式 ([d17b450](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/d17b450ee6b8073f2534ec5fdef61261312c7676))
- 🚀 优化图标组件，新增图标选择器组件，优化 Vue Import，解决新版表格拽问题 ([c1e41af](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c1e41afd05ef8e9f95453d2838768c354b44f6be))
- 🚀 支持 pnpm 包管理器 ([1c25d3d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/1c25d3d69ec2839810e808459719b63f5f113d16))
- 🚀 支持 URL 传参来渲染全屏页面 ([e595f5a](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e595f5ac5b361ac8456ce31a0d7fe5351f8086dc))
- 🚀 重构工程化 import export，添加视频播放器、高亮组件、优化 useDialog、useDrawer 组件 ([29f55a9](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/29f55a984f516014c93ed3d38e4a70a62fc1cc42))
- 🚀 自定义顶部高度、菜单宽度。修复样式。所有依赖升级最新版 ([6a254db](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/6a254db20b4deadd8296a2938c61f0fd5cb1b2c5))
- 🚀 proTable scope 支持 enum ([6a6311c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/6a6311c9d4b833b82583dacd95cfdff4dd71e1c0))
- 🚀 Tootip 支持多行溢出，request 解决无法登录问题 ([16a793f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/16a793f399e71824e12b5f537584fb696bdebd5f))
- 🚀 views 组件支持非根节点，request 内容修改 ([08ab77b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/08ab77b1c2df4d12b3749b948ad100f7dfdc2429))

### Bug Fixes

- 🐞 去掉无用字符串 ([b441bd5](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b441bd5cc1b376e249d01844625112ae8962792e))
- 🐞 修复 ProTable ([346b1ec](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/346b1ec39160d1eeeba69392193929ab3304eb87))
- 🐞 修复 refresh 找不到警告 ([9a08594](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/9a08594e12e4d143b876c32b55214da2ee6ae63b))
- 🐞 修复 Tinymce 富文本无法渲染，修复 iframe 标签无法刷新问题 ([044fb62](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/044fb627b495403a83b87b9f62e218f23f6d1452))
- 🐞 修复 UseDialog Demo 报错问题 ([cc4ef25](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/cc4ef25f60e53f311e209506ff32dadb68b5e74a))
- 🐞 修复 VContextMenu 路由无法找到对应组件 ([839b122](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/839b122119c4fecd3d31787053269966f320dac5))
- 🐞 修复 WangEditor 重复注册自定义插件问题，组件 .value 换位 unref，优化 ProTable 分页功能 ([540119f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/540119fd7b6392337732d37ad5c3e8a6afbb6669))
- 🐞 修复标签页无法缓存、Mixins 布局三级路由以上无法渲染 ([1ae8050](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/1ae8050f7eb37c0b95bc9fcc96944d295644c335))
- 🐞 修复超级表单 Demo 无法渲染 el-input 组件问题 ([27cbf81](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/27cbf810f634e10389dec97c4fd7eb00bb7237e3))
- 🐞 修复图片路径引入错误问题 ([d9db9cf](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/d9db9cfc6b3e7d6fb493ac77d0cbe63ad1926fc8))
- 🐞 修复无法打包问题 ([56bf52a](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/56bf52a73d034f5f2c5ca19d7fd26391b7684fe1))
- 🐞 修复无法启动问题 ([3cff924](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/3cff924d7bac0bbf29e1b7bce926527dc6ecf036))
- 🐞 修复一些样式 ([1170f87](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/1170f871e25ac7e9d85963dd25fe8b4b971a7d3d))
- 🐞 wang 富文本修复全屏下被菜单栏遮住 ([62ce0be](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/62ce0beab111e0e6e768773e25a629e0d3efb40d))

### Others

- **release:** 0.0.2 ([f043d2b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/f043d2bfcfe5b88e3b50ad989b5431e1b5d79ccd))

### Docs

- 📚 添加 Template 文档说明 ([0cec623](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0cec62393a67508f5fd41f2e7aa607b3a35e4db1))

### Code Refactoring

- ♻️ 重构样式 ([bfd28f6](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/bfd28f6f853b31258b99b11ffe4310905af0cd76))
- ♻️ request 的 ElMessage 换成 admin 封装的 message ([b75c409](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b75c4091546fec4baee5b5e68fb6839608e42ae5))

### [0.0.2](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v0.1.0...v0.0.2) (2023-03-26)

## 0.0.1 (2023-03-26)

### ⚠ BREAKING CHANGES

- 新增 commit 规范

### Features

- 🚀 添加 git-cz、commitizen、commitlint，在提交 commit 时智能提示。添加 standard-version 管理版本和生成 CHANGELOG.md 文档 ([c55bf08](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c55bf08b4b60951c7c84e29562e3324ddfdbbe40))
- 🚀 添加 commitlint、husky 相关配置，对 commit 进行规范化，添加 stylelint，对整个项目样式进行规范管理 ([8a4a694](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8a4a69402c75d557dedecb53c642fe1e9425f55a))
