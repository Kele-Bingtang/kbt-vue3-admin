# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.7](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.6...v1.4.7) (2024-11-23)

### Features

- 🚀 使用 mittBus 添加页面刷新功能，UseDialog 函数优化 ([e1707fb](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e1707fba59487fad733aeccbda26f6ea4683d7e5))
- 🚀 新增富文本内容解析图片和附件工具 ([def84fe](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/def84fea606ea9f12297d85230e3f381af202713))
- 🚀 proTable 过滤支持全部数据过滤。支持取消卡片样式。支持自定义行不使用编辑和删除按钮 ([f4b1c98](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/f4b1c98fe36ad0a3bd068746b2773f5404bc5c92))

### Bug Fixes

- 🐞 修复 CodeMirror 使用 fullScreen 后，值为空字符问题 ([aa17b18](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/aa17b18f3dfb5e93b73e698f2a2c961a6f22f6d5))
- 🐞 修复值为 0、false， valueFormat 失效问题 ([1b6a80a](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/1b6a80a56c941f6bacde0a382c22fde6516413f3))
- 🐞 子路由 hideInMenun 全为 false 时报错问题修复 ([324e39c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/324e39c50491e3e56b27b85ae28f63c8ccf19092))
- 🐞 proSearch useCollapsed prop 优化 ([12cdac9](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/12cdac95f0fd527e963d41f412060809e85654d1))

### Styling

- 🎨 去掉不需要的引用 ([7df49a7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/7df49a7184eb3be5d346641a6e376f47508ddfba))
- 🎨 去掉不需要的引用 ([9bd30f9](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/9bd30f9df7b986ef36de5d1f009feae759c4593a))

### [1.4.6](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.5...v1.4.6) (2024-07-21)

### Features

- 🚀 proForm 的 Schema 支持 Computed 计算 ([c88fef8](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c88fef85bc040fba994462f6026c8f26d63b75a8))
- 🚀 proTable 导出功能添加可选导出列后再导出 ([d645754](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/d645754ff803028326c025ffcbb601b46fe80e4b))
- 🚀 useDialog、UseDrawer 新增 maxHeight prop。Vue 组件额外添加 confirmLabel、CloseLabel prop，并添加文档说明 ([5539f1f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/5539f1f6c93000a9d97958e18b5e0eaf9fb3c3b2))

### Styling

- 🎨 添加类型引入 ([ff23f30](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/ff23f30a0a03d3abe280e2e423ceb116611bbd38))

### [1.4.5](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.4...v1.4.5) (2024-07-03)

### Features

- 🚀 防抖和节流指令支持指定的限制时间传入 ([fa22f98](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/fa22f984e67fc23583a30111c04489a672ad5551))
- 🚀 过滤新增 CheckBoxSelect 组件代替 ElSelect 组件。ProTable 新增自定义分页信息配置项 ([e60b2e1](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e60b2e1599d048a5a09fcd9981f1f4391bbe68fd))
- 🚀 新增 isEmpty 空值判断（包括数组、对象），validate.ts 文件重命名为 is.ts ([9ae9daf](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/9ae9daf4814d12ed608ab780c48b51249a61a6af))
- 🚀 修改 EP 的五个主题色。ProTable 过滤功能添加选择高亮 ([59e4379](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/59e437934bd1e84a363ca7261278b2233a0caa9d))
- 🚀 codeMirror 新增全屏功能。ProForm 解决禁用配置项不生效问题 ([fd354f2](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/fd354f24ca05aec3ee2b2f87cc9938565f3e51b7))
- 🚀 proTable 添加 ElButton Link 属性渲染单元格 ([53d311d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/53d311d5cc03624c58ff14238c1dcb1fffc3ed67))

### Bug Fixes

- 🐞 公共组件优化，样式优化 ([6eb4d30](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/6eb4d3032cf7ff6b16f1023f2d65a7d4d02e32d5))
- 🐞 修复 CodeMirror 全屏按钮位置错位问题 ([aa11c6e](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/aa11c6e241034dab412bec9acd4984d7d0f3c34c))
- 🐞 useDialog、UseDrawer 确定和取消按钮逻辑优化 ([4422983](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/44229830f66568f37d0fad1d6363be23ad8cbbec))

### Code Refactoring

- ♻️ 去掉多余的重复函数 ([0b2de24](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0b2de2484e0070d7032b57965b5be321f5d34e78))

### Styling

- 🎨 useDialog、UseDrawer OnConfirm、OnClose 逻辑优化 ([b2862c5](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b2862c58782230615839c4a002e883ee60f04860))

### [1.4.4](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.3...v1.4.4) (2024-06-23)

### Features

- 🚀 proForm 添加 colRow props 快捷让每一个 col 独占一行 ([9cff921](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/9cff9218af30888c46972cd82fc08316660d9770))
- 🚀 proForm 新增 label 为 Computed 类型逻辑处理，ElSelect 支持 enum 里指定 disabled 实现禁用功能 ([b9f3b09](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b9f3b09fc7b750796656da1b9a2a0cbd88d30d2f))

### Bug Fixes

- 🐞 路由重置函数优化。添加 403、404、500 路由。路由加载函数优化 ([4b0cc7f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/4b0cc7f82f0f0bd4bc8e3d7176bcd0ac33cc933a))
- 🐞 修复 UseDialog、UseDrawer 使用 inject 失效问题 ([f9242d3](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/f9242d3b0b80c9829c88ac54d7649e606017563a))

### Styling

- 🎨 添加路由配置的使用注释 ([00ef51e](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/00ef51e5d263e7630495ce2f5252cded89951a39))
- 🎨 useDialog、useDrawer 的 onConfirm 和 onClose 添加 Promise<void> 返回类型 ([18c9dbd](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/18c9dbdd17d0e8844b738ecc562aef82c484f9ff))

### [1.4.3](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.2...v1.4.3) (2024-06-20)

### Features

- 🚀 新增 removeBatchTab 函数，优化路由初始化判断，路由配置支持菜单 render ([3763517](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/37635173cebd31d1e827156b0afd81019b129b4b))
- 🚀 proForm 新增 ElToopTip 提示功能，位于 label 右上角 ([20b1c0c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/20b1c0ca249010b85a14bd85ffe7c66a77bd7002))
- 🚀 useDialog、UseDrawer 的 onConfirm、onClose 函数支持 return false 阻止关闭。UseDialog 弹框全屏高度计算优化 ([2992d65](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/2992d65391ce85142759846e91f3ac0fe25ea59d))

### Bug Fixes

- 🐞 useDrawer 阻止关闭判断优化 ([fe89e20](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/fe89e20aa325e4a24045660931c8c02ce56c1ba0))

### Styling

- 🎨 登录逻辑移到 router beforeEach 里 ([509720f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/509720fe6a73eb5e9533fad396c3421424afcbe4))
- 🎨 主题色悬停 class 重命名 ([e7dd6bd](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e7dd6bd4bd27b2245f08f3e14fda281fffecdf53))

### [1.4.2](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.1...v1.4.2) (2024-06-16)

### Features

- 🚀 安装 @types/qs 依赖 ([a1ef5c7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/a1ef5c7df01abce55db136b322049b8a47ef5045))

### Bug Fixes

- 🐞 proForm 删除的 key 由一级 key 改为具体的嵌套 key。修复 DialogForm includeModelKeys 循环处理问题 ([41f39f6](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/41f39f6ea164d82c784e2f6b883fe25844aad244))

### Docs

- 📚 更新 README 文档 ([042f97b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/042f97b7364703865557e7f3b30eb47485725fbd))

### Styling

- 🎨 修改 MainContent 默认样式 ([c52b0f7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c52b0f78666774bacda604aff0cb163095eafa55))
- 🎨 mainContent padding 样式去掉 ([ee3539b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/ee3539b84dc96f5a630ae5d08918c3595c74ef6a))

### [1.4.1](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.4.0...v1.4.1) (2024-06-14)

### Features

- 🚀 ProTable 添加内置按钮数组禁用 props。修复 ProTable 批量删除按钮 disabled 失效问题 ([0431572](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0431572dc3febe1ba7926de9812723f0201ce767))

### Bug Fixes

- 🐞 解决部署访问失败问题 ([298bcef](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/298bcefdf54b0e61933e21248fc67a8b2d6e8504))
- 🐞 修复 ProTable 和 log 类型 ([0d21148](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0d211484e32eb4cb04229ef9b548a12245b23bf0))
- 🐞 修复 ProTable 使用 enum + el-search + key 后，当 enum 为接口时重复调用两次问题 ([0b93ed4](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0b93ed48179f27d6401e7ed8df5bcb0eb33416a4))
- 🐞 dialogForm 的 handleAdd 添加 Event 判断。ProTable ProForm 接口适配直接返回数据以及 .data 里取数据。ProTable 导出优化，支持自定义导出方法 ([2c74f73](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/2c74f7369e619961203f79d3335680a8f21a36e1))
- 🐞 dialogForm 的 handleEdit 添加 Event 判断 ([8cc9873](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8cc9873b1fe668ed9008265b06b56e08f50364a8))

### Styling

- 🎨 更改 settings 默认配置 ([bee3f6c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/bee3f6c40de6c3771c45667f31e1443f3b199f4d))
- 🎨 去掉全局 log 打印，解决生产访问失败问题 ([8ba3e04](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8ba3e04c0cbe42238d1f0a3e10ed3442fcca84d0))
- 🎨 添加 log 打印介绍功能 ([4ff899c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/4ff899c438f170c7d6ea6f38d419f34e26e62017))

## [1.4.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.3.4...v1.4.0) (2024-06-10)

### Features

- 🚀 添加全局 log 打印功能，支持 base、info、success、warning、danger、error、table、picture 函数美化输出到控制台 ([d7fc3e5](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/d7fc3e5158d2554e712acf8b928c02a9fc63dde0))
- 🚀 新增 WebSocket 的 Store ([397b8e4](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/397b8e4a11d8ca4ab2975bc735c5902060aaf15b))

### Styling

- 🎨 分页 padding 修改。ProFormItem render 传入 style ([9f78354](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/9f78354dfbff47b44cf2350162a43e7b8ceb1c21))
- 🎨 dialogForm 代码格式修改 ([68b0d5a](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/68b0d5a03c9d1baae9abe657c890681c805943b9))

### Docs

- 📚 更新 README.md 文档 ([94075be](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/94075be902f0d19caad08c6696413cea71107ff7))

### [1.3.4](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.3.3...v1.3.4) (2024-06-06)

### Features

- 🚀 proTable、ProForm 添加是否使用缓存 enum 配置项 ([7ede707](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/7ede707fed690215f176d8f4f3239ca2c121e1b5))

### Bug Fixes

- 🐞 修复 ProForm 的 Select 渲染 undefined 值。添加常用的原子 class。封装 DialogForm 传给 Dialog 的 props ([c745a3e](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c745a3e706a49243af479dc4c02f8b48001d00b9))
- 🐞 修复 ProTable enum 调用接口获取字典数据后，ProSearch 和 DialogForm 使用了 ProForm，导致重复获取调用接口重复获取字典数据问题 ([fc5f6a8](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/fc5f6a8c8fb1423176659e4d296d8e9cd6841883))

### Styling

- 🎨 iconPicker 添加 tip props。修复 IconPicker 传不存在的 icon 名字报错问题 ([b01a5fe](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b01a5fef31bfb9f3fc898951f0b0c93a41ab1b13))
- 🎨 useDialog 默认高度 400。ProForm 添加自定义组件的 style 透传。ProForm 内置 IconPicker 组件 ([d2abc0c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/d2abc0c83a55ace0fded036b665ad867bfa767c4))

### [1.3.3](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.3.2...v1.3.3) (2024-06-05)

### Features

- 🚀 treeFilter 添加部分 props 功能 ([fd26055](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/fd2605510f7ff2bf565fd464fa3d27e97748719b))

### Bug Fixes

- 🐞 修复静态资源找不到问题 ([7260689](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/7260689b2a8939b2b167f9122917bbb5d185edf3))
- 🐞 修复类型丢失导致打包失败问题 ([8acc44d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8acc44d659629cbffa14f4fac9047d1f136c49cd))

### Styling

- 🎨 超级组件 create 函数支持在 script setup 直接使用。message 函数支持 ElMesage 的 plain 以及默认开启 plain ([e211188](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e21118847ffac4e28860a37b3b70378700d4f316))

### [1.3.2](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.3.1...v1.3.2) (2024-06-04)

### Features

- 🚀 proForm 新增 includeModelKeys prop，指定不要被自动清除的 key ([6a1f5f9](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/6a1f5f994c8fe921b14db8d2eb611a39126bdbee))

### Bug Fixes

- 🐞 解决部署 Vercel 后，路由刷新 404 问题 ([deb412b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/deb412bff48a595d082fb9a3628871cdddc3784e))
- 🐞 修复 ProTable 初始化重复发起请求。DialogForm 内容修复 ([cc3bb2d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/cc3bb2de2555293f9b77e5ac354182eb6c90bd65))
- 🐞 重构 DialogForm 组件代码，修复部分缺陷 ([f592db6](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/f592db632245484a86a9b2e8139d97790950a7c2))

### Styling

- 🎨 添加 vue 引用的导入 ([37ef9b2](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/37ef9b2724a54c78996d2673b3de3438e58a646b))
- 🎨 scss 样式引入位置迁移。优化部分 TS 类型 ([1bf4f2f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/1bf4f2f6709eb0c91d7df4c2f3a978a13d3a4eea))
- 🎨 useDialog、UseDrawer 添加 footer 插槽 ([0ada931](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/0ada9311ff52533b22b9069085e7e0ea21949692))

### [1.3.1](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.3.0...v1.3.1) (2024-06-03)

### Features

- 🚀 proTable 新增行内编辑校验必填方法。Pro 组件 create 函数支持传入 ref 或者 shallowRef 对象 ([940a92f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/940a92f6943669aa2f3715ff60c8010a9294b1c6))

### Styling

- 🎨 proTable 去除 Demo 代码 ([424eac8](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/424eac8eed7cfa3838c7640fcfe8cc95b181b184))

## [1.3.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.2.0...v1.3.0) (2024-06-02)

### Features

- 🚀 新增表格自定义筛选器功能，修复 ProForm、ProSearch 问题 ([7243e17](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/7243e1786849ce84b714fafe7b47aea19b740450))
- 🚀 pro 组件新增两个 create 函数来实现函数式编程，修复 Use 组件问题。统一缓存 key 的前缀。新增一个针对 Emits 转换的全局 TS 类型 ([2145876](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/21458765b8fd81d8452c997d5ba9503a298aed97))
- 🚀 proTable 添加点击行激活行内编辑功能，修复 ProForm 不随全局 size 变化问题。修复 ProTable 行内编辑 model 额外添加了多级 prop 问题 ([c6f7131](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c6f7131ebbf1cdab7f8adad7621dbf070887235f))
- 🚀 proTable 添加前端过滤器规则，支持 lt、gt、ge、eq、like、between、in 等规则以及自定义规则函数 ([3778f2c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/3778f2c8980af62302e3718c1403a2ea60b55fe0))
- 🚀 proTable 新增行内编辑功能。修复多个 prop 时，ProForm 存储问题 ([162040c](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/162040c24bd57c98f5fc1b188f7f29a9c2d3b805))

### Bug Fixes

- 🐞 处理 ProTable 的 default 为函数问题 ([7a3d8f8](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/7a3d8f8000ca68110f78e73eded375728db06a9c))
- 🐞 修复 ProTable 传给 ProSearch 的 Props 缺失问题。修复表格过滤器和 ProSearch 查询参数关联失效问题 ([c237789](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c2377890e912c8078a6a04a0787fd3aedeee4a50))
- 🐞 修复打包后超级组件存在循环引用问题 ([66b61d8](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/66b61d81f85bbc538fa73a4117a22677cdeeb559))
- 🐞 修复自定义全局 TS 类型被 eslint 认为没有被定义报错 ([13ec24d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/13ec24d8d589e536a01e73f1fc66a16ac0b99df7))
- 🐞 修复自定义筛选器和 ProSearch 关联问题，ProForm 添加 props 配置项（适配自定义筛选器） ([ecfb0c3](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/ecfb0c383bb14347b3fded451e9d579781ceefa7))
- 🐞 provide 的 key 采用 InjectionKey 代替字符串 ([32ca848](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/32ca8489a921b9ddd0cf387e680d6b267fccd533))

## [1.2.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.1.0...v1.2.0) (2024-05-30)

### Features

- 🚀 新增 createTable 函数快速创建 ProTable。修复重复依赖引入。添加两个全局 TS 类型。ProForm 新增表单组件自定义插槽功能，ProForm 通过组件名引入组件改为组件本身引入，添加 ElUpload、ElRadio、ElCheckbox 组件支持。 ([a0df495](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/a0df495015b31f3f10235316ee9ffe3025cf35bb))

## [1.1.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.0.1...v1.1.0) (2024-05-29)

### Features

- 🚀 新增 codeMirror focus 样式 ([f8bf581](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/f8bf581f8a2cb604692a6471bed4f5e7413b9bed))
- 🚀 新增 EP 自定义命名空间功能，优化部分组件适配命名空间样式，图片预览、视频预览添加组件式打开方式 ([24aad15](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/24aad15be423d16bb45fa9a813bbf7d4b07f9280))
- 🚀 新增 EP 组件、样式按需引入功能以及配置化管理 ([a00545d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/a00545dbba4bd828138bb3d28e50d9eb3773da5a))
- 🚀 新增菜单手风琴配置项 ([cb24a38](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/cb24a386c78f13a9b30a15c47b5a3f16f972f883))
- 🚀 重构 ProForm 的代码，用 TSX 写法完成，SearchForm 改为 ProSearch，内置使用 ProForm 实现，ProTable 的内置搜索使用 ProSearch 实现 ([08681ff](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/08681ff22c54d374b551fda2cd31da0401f9437a))
- 🚀 proTable 添加行拖拽功能 ([35bec55](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/35bec55ed5773127c600424f9531368189e6c7f6))
- 🚀 proTable、ProForm、ProSearch 添加 hooks 函数动态操作配置项、props 参数等。编写 ProForm Demo ([5536d21](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/5536d213f42f2d0f0dabc193ceac2c000b4a8650))
- 🚀 provide 和 inject 使用 InjectionKey、Symbol 处理类型 ([b4bbcfd](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b4bbcfd2222f7068cc7f114f618d4853400062a0))

### Bug Fixes

- 🐞 解决 JSX 元素隐式具有类型 "any"，因为不存在接口 "JSX.IntrinsicElements" 问题 ([9884484](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/988448431b25c1e3ce1c64752c9ce79e6e78df25))
- 🐞 新增其他组件的 Props、Emits、Expose 说明，修复 CodeMirror 问题。修复国际化切换英文刷新自动恢复中文问题 ([3b1c709](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/3b1c709c2eea409b925e9318430af0517971e9a0))
- 🐞 修复 Pro 超级组件关联问题，修复 ProSearch 动态删除 schema 后 Grid 布局不自动补全问题 ([1e3ba29](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/1e3ba293a664321f35b6dd52c6dd54b78bff04de))
- 🐞 修复 Pro 组件的 hook 函数兼容问题，添加 ProTable、ProSearch 的 hook 函数 Demo。对象类型修改为 Record ([64917e3](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/64917e34bdde443b2741f0e0a5ac3dbef4d6609d))
- 🐞 修复打包失败问题 ([13616b7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/13616b763215f71f3959f20600bf812560521346))
- 🐞 修复打包样式丢失问题 ([539929b](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/539929bb4d09aad122ba2cb730c5f9cff8036e0e))

### Docs

- 📚 更新图片预览、视频预览参数说明文档 ([cdfcc3a](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/cdfcc3a756e9d9507cd613885a63d184eeffba8a))

### Code Refactoring

- ♻️ 对 ProTable 的表格按钮区、表格进行组件封装，减少 index.vue 的代码复杂度 ([ccc4d26](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/ccc4d268a1dc1de7f1e3899ebd7bd47be15b2cbd))
- ♻️ 样式导入重构 ([aed7871](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/aed7871472c46b3986cf12a3c9f39ed6863e39a1))

### Styling

- 🎨 删除 ProForm、ProSearch 1.0 的组件，正式进入 2.0 组件 ([b5f0807](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/b5f0807626217b2b88b1273f52fb14178a5179d6))

### [1.0.1](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v1.0.0...v1.0.1) (2024-05-23)

### Bug Fixes

- 🐞 修复打包失败问题 ([6f2bdee](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/6f2bdee0b94e6e1c97d02ad47e10671019df380c))

## [1.0.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v0.3.0...v1.0.0) (2024-05-23)

### Features

- 🚀 去掉 vue-codemirro6 组件依赖，利用 codemirror6 原生 API 搭建 codemirror 组件 ([655e8c7](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/655e8c74530ff203fa46a03d95afdbce1e0132e3))
- 🚀 添加 id 生成器工具类，优化自定义 ts 类型 ([62d027d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/62d027d4193ef57daa19aaa51ac673c377ca6db2))
- 🚀 新增 v-code-diff 组件，优化 codeMirror 对比器样式以及添加部分 props ([caaa6b5](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/caaa6b52c694e51f062143ab734a7ec19910d6ad))
- 🚀 优化 CodeMirror，新增代码对比的 CodeMirror 组件 ([c0d1602](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/c0d1602e98c5ec90eb3a84c8978513a312644410))

### Code Refactoring

- ♻️ 热门组件 Demo 添加 Props、Emits、Expose、Slot 配置项说明 ([de7c5c4](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/de7c5c4283af2a03e05fc21d42bf76b9155adaa7))
- ♻️ 组件、表格、Excel、权限、工具、自定义指令、标签页操作等 Demo 的元素、样式重构，更有层次感 ([e90e202](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e90e20292386158322d25c007b5a781a575c4073))

## [0.3.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v0.2.0...v0.3.0) (2024-05-20)

### Features

- 🚀 新增 CodeMirror 代码编辑器组件（Demo 版） ([8370c7d](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8370c7d3e6e74d04e29a7b2c075c5848e25b2d77))
- 🚀 新增 CodeMirror 组件，提高多种代码语言和主题 ([e2d00f5](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/e2d00f5f840b6a03db9229d4a8a00549b365c43b))

### Bug Fixes

- 🐞 修复打包失败 ([404e61f](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/404e61f109f9b674c2b41f708acb781261e0c1a5))

## [0.2.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v0.1.0...v0.2.0) (2024-05-19)

### Features

- 🚀 新增 vue 3.4 的 defineModel 语法，优化 defineEmits 类型 ([5162f5a](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/5162f5ac6010430c3626388a099dcca375a98ebd))
- 🚀 新增 WorkDrawer 组件，优化 UseDialog、UseWDrawer 函数 ([af572ac](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/af572ac04f6084a247dd7cc20ba626da68e63006))

### Styling

- 🎨 样式位置切换 ([64d10d1](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/64d10d173c170bdfccc7383a2221d3e7f74b64ae))

### TypeScript File

- 💎 types 类型文件重构 ([2511929](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/2511929cbcd62a406c4232e19bc1a518fd68c8f4))

### Code Refactoring

- ♻️ 六个 Layout 布局样式重构，解决遗留样式问题，添加部分新交互样式 ([ab04528](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/ab04528f1ffa71d4ec2cb45acf58445bc1c40653))
- ♻️ 重构 ThemeDrawer 全局配置组件。重构菜单、头部主题切换样式、交互。重构暗黑模式展示样式，重构面包屑样式。修复标签页第一个固定标签的右键内容显示问题 ([8152a56](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/8152a56ba78efd25c52de52b131f798bad1ea927))
- ♻️ layout 样式文件重命名 ([28022ae](https://github.com/Kele-Bingtang/kbt-vue3-admin/commit/28022ae119e3ba6847e4fe82308ad3f402828e41))

## [0.1.0](https://github.com/Kele-Bingtang/kbt-vue3-admin/compare/v0.0.2...v0.1.0) (2024-05-18)

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
