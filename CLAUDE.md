# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 这是什么

`gm-printer` 是一个独立于宿主应用的网页打印库(以 npm 包 `gm-printer` 发布)。使用方传入 JSON **模板配置(template config)** 和 **数据(data)**,它负责渲染出经过像素级测量、自动分页的可打印页面(A4/A5/标签/长条等),并驱动浏览器打印对话框。同时附带可视化的 **编辑器(Editor)**,让最终用户通过拖拽/选中/右键来设计模板。由「果麦(gmfe)」前端团队开发,UI 文案与 i18n key 均为中文。

技术栈:React 16 + MobX 4 + webpack 4 + Less。宿主应用需以 **peerDependencies** 形式提供 react/mobx/lodash/moment/big.js 等;唯一的硬依赖是 `qrcode.react`。

## 常用命令

```bash
yarn                  # 安装依赖(以 yarn.lock 为准)
yarn start            # 启动 webpack-dev-server,自动打开 demo: http://localhost:5678
yarn build            # 生产构建,产物输出到 build/(主要用于 CI 发版)
yarn release          # 交互式 bumpp 选版本 → 生成 tag → 触发 .github/workflows/release.yml → npm publish
yarn locale           # i18n-m 同步(从 src/ 抽取/同步多语言文案)
```

- **本项目没有测试套件** —— 没有测试运行器,也没有 `test` 脚本。改动请通过 `yarn start` 在 demo / 实际打印预览中验证。
- **代码检查(lint)只通过 precommit 钩子触发**(husky + lint-staged → 对暂存的 `src/**/*.js` 执行 `eslint --fix`)。没有独立的 `lint` 脚本;需要时手动执行 `npx eslint src/path/to/file.js`。ESLint 继承 `plugin:gmfe/recommended`(standard + prettier + 团队的 import-resolver 别名)。
- 发版流程:在 feature/fix 分支执行 `yarn release` 选择 **beta/alpha** tag;在 `master` 上执行则选择 **正式** tag。推送 `v*` tag 会触发 `.github/workflows/release.yml`(Node 16,执行 build,用 `NPM_TOKEN` 执行 `npm publish`)。遵循 semver:不兼容变更 → 主版本,新增功能 → 次版本,缺陷修复 → 补丁版本。

## 架构

两个协作的 halves 共享同一个唯一事实来源 —— **模板配置(template config)**(结构详见 `README.md`:`page` / `header` / `contents` / `sign` / `footer`)。`contents` 是一个数组,混合了 `panel` 块和 `table` 块。

### 打印引擎 —— `src/printer/`
- `do_print.js` 是对外入口:`doPrint` / `doBatchPrint` / `doBatchFinancePrint` / `getPrintContainerHTML` / `setPrintStyle`。它创建一个隐藏的 `<iframe>`,注入 `getCSS()`,把 `<Printer>` 渲染进去,等待图片/SVG 加载完成(`afterImgAndSvgLoaded`),再调用 `iframe.contentWindow.print()`。
- `printer.js`(`Printer`)组合 `Page` → header/footer/sign + 分页后的 contents。
- `store.js`(`PrinterStore`)是核心复杂度所在:**基于测量的分页**。它先渲染内容,测量真实 DOM 高度(`src/util.js` 中的 `getHeight`/`getWidth`),再按高度把表格行拆分到多页(`pages`、`remainPageHeight`、`tablesInfo`)。当你改动布局/纸张尺寸逻辑时,这里和 `page.js` 的分页计算是最容易出问题的地方。
- 行渲染分散在多个 `table_*_tr.js` 变体中(`table_category_tr`、`table_subtotal_tr`、`table_special_tr`、`table_overallOrder_tr`、`table_diy_summary_tr` …),每种表格 `dataKey`/模式对应一个文件。长条打印有独立的 `long_print_table/` 以及 `longPrint` 页面类型。
- `get_css.js` 拼接 `normalize.csss` + `style.lesss`。**`.lesss`/`.csss` 后缀是有意为之** —— 它们被当作纯文本读取并字符串拼接到注入的 `<style>` 中,刻意绕过 webpack 的 Less/CSS loader。

### 编辑器 —— `src/editor/`(基础) + 各业务域 `src/editor_*/`
编辑器让用户可视化地修改 Printer 所渲染的同一份 config。关键模式:
- **`common/hoc_with_shadow_dom.js`** 把整个编辑器 + 打印预览渲染进 **Shadow DOM**(`attachShadow({mode:'open'})`),并注入合并后的 printer + editor CSS,使 gm-printer 的样式永远不会与宿主应用冲突。`window.shadowRoot` 被设为全局变量 —— 代码依赖它。
- **`common/hoc_with_store.js`** 用 `{config, mockData}` 初始化 MobX store,并**仅通过 `window.document` 自定义事件**把打印预览的交互桥接回 Editor store —— 而不是通过 React props/context(因为 Printer 生活在 shadow DOM / iframe 中)。事件包括:`gm-printer-select`、`gm-printer-select-region`、`gm-printer-panel-style-set`、`gm-printer-block-style-set`、`gm-printer-block-text-set`、`gm-printer-table-drag`。它还实现了键盘微调(方向键移动块 / 重排表格列、Backspace 删除、Esc 取消选中)。新增编辑器↔预览交互时,请沿用这套事件桥接模式。
- **`common/editor_store.js`**(`EditorStore`)是基础 MobX store:持有 `config`、`selected`、`selectedRegion`。选中状态采用**点号分隔的路径字符串约定**来定位 config 树:
  - 区域(region):`header` · `footer` · `sign` · `contents.panel.N` · `contents.table.N`
  - 元素(element):`header.block.N` · `contents.panel.N.block.M` · `contents.table.N.column.M`
- 每个业务域编辑器(`editor_purchase`、`editor_stockin`、`editor_stockout`、`editor_settle`、`editor_statement`、`editor_account_statement`、`editor_box_label`、`editor_salemenus`、`editor_account`、`examining_report_editor`)都遵循**相同的 4 文件结构**:`editor.js`(组合 `src/common/` 中的共享子编辑器)、`store.js`(`class Store extends EditorStore`,追加业务列/dataKey)、`context_menu.js`、`index.js`(默认导出 `withShadowDom(Editor)`)。新增业务域编辑器时,照此结构复制即可。
- 基础 `src/editor/` 导出 `Editor`(通用/配送单)和 `Editor2`(基于 `editor_menu_config.js` 的菜单配置变体)。

### 数据层
打印调用形式为 `{ config, data }`。`data` 包含 `common`、`_origin`、`_counter` 以及 `_table`(按表格 `dataKey` 索引:`orders`、`orders_multi`、`orders_category`、`orders_category_multi` …,与 `config.js` 及 README 中的模式对应)。config 文本中的 `{{field}}` 占位符会基于此数据进行插值。`src/util.js` 存放共享辅助函数(`getHeight`、`getWidth`、`dispatchMsg`、`getStyleWithDiff`、`getBlockName`、金额格式化等)。

`src/finance_voucher/` 是一个平行的、财务专用的打印机,拥有自己的组件和批量打印机(`doBatchFinancePrint`)。

### 辅助模块
- `src/config.js` —— 纸张类型映射(A4/A5/A4/2/A4/3/241x280/241x140/`longPrint`/`DIY`)、打印方向、块类型(text/line/image/counter/barcode/qrcode)、`MULTI_SUFFIX`/`MULTI_SUFFIX3` 多栏标记。
- `src/components/` —— 内部 UI 组件库(dropdown、tooltip、radio、dialog、tip),统一使用 `gm-` CSS 命名空间。
- `src/common/` —— 共享的编辑器构建块(`editor_title`、`editor_select`、`editor_edit_field`、`editor_add_field`、`editor_special_field`、`editor_page_summary`、`context_menu`、css 辅助)。
- `demo/` —— 开发用应用(webpack 入口)。每个子目录是一个业务域示例;开发时在这里增改 demo 数据。
- `build/` —— webpack 产物 + 内置字体资源(已提交)。`locales/` —— zh / zh-HK / en / th 多语言文件。

## 约定与坑

- **i18n** 是 `locales/index.js` 中的轻量 shim,并非真正的 `i18next`。默认语言为 `zh`。调用 `i18next.t('中文文本')` —— **中文串本身即 key**;缺失的 key 会回退到 `__` 之后的子串。`setLocale` 切换语言,且**必须在渲染前执行**(`import '../locales'` 被刻意放在 `src/index.js` 的第一行)。
- **金额/数量计算使用 `big.js`** —— 涉及价格或数量时绝不要用原生浮点运算。沿用 `price()` 辅助函数的写法。
- **选中路径字符串的取值不能包含下划线**(特指表格 dataKey)—— `computedTableDataKeyOfSelectedRegion` 会按 `_` 切分。该注意点已在 `src/editor/editor.js` 中标注。
- **对外 API 出口是 `src/index.js`** —— 此处导出的内容即为库的契约,其余皆为内部实现。
- README 中的目录说明(`add_fields`、`data_to_key`、`mock_data`、`template_config`)**已过时** —— 这些文件夹已不存在;以当前 `src/` 实际布局为准。但 README 中关于模板配置结构和区域路径的文档仍然准确,是了解 config 结构的最佳参考。
