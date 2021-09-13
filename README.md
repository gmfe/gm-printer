# gm-printer 
    
gm-printer是一个实现开发者自定义网页打印的人类高质量开源库，你可以根据业务需要自定义打印字段配置(<a href='#template_config'>配置详情</a>)，完成高质量网页打印功能。
    

## <div id='development'>开发指南</div>
以下操作将帮助你在本地机器上安装和运行该项目，进行开发
```bash
# 先安装依赖
yarn
# 项目启动
yarn start
# 项目构建(基本不怎么使用)
yarn build 
```
## <div id='usage'>安装使用指南</div>
```bash
# npm
npm i gm-printer
# 或使用 yarn
yarn add gm-printer
```

## <div id='simple_categroy'>配置目录简述</div>
```bash
├── src
│   ├── index.js 
│   ├── add_fields # 右侧对应的字段配置
│   ├── data_to_key # 原始数据转换成打印数据
│   ├── mock_data # 模拟数据
│   ├── printer # 打印区域
│   └── template_config # 打印模板配置文件
│       └── config.js # 一些printer配置信息
├── locales # 多语言文件
```

## 版本管理
所有的版本都有 3 个数字：x.y.z。  
  * 第一个数字是主版本。  
  * 第二个数字是次版本。  
  * 第三个数字是补丁版本。   

当发布新的版本时，不仅仅是随心所欲地增加数字，还要遵循以下规则： 
  * 当进行不兼容的 API 更改时，则升级主版本。
  * 当以向后兼容的方式添加功能时，则升级次版本。
  * 当进行向后兼容的缺陷修复时，则升级补丁版本。  

该约定在所有编程语言中均被采用，每个 npm 软件包都必须遵守该约定，这一点非常重要，因为整个系统都依赖于此。

## 版本发布  [<font size=2.5>参考链接</font>](https://eminoda.github.io/2021/01/29/npm-semver-strategy/)
一般版本发布分为如下几个版：
  * 内测版本(alpha)
  * 公测版本(beta)
  * 正式版本的候选版本(rc: release candiate)
  * 正式版本

发布操作如下：  

  前情提要：
  * 发布重大版本或版本改动较大时，先发布alpha、beta、rc等先行版本。
  * 将`pageage.json`中的`version`修改为`X.X.X-beta.0`，或者运行 `npm version X.X.X-beta.0`来更新`package.json`，同时创建一个 git 标签[参考](https://docs.npmjs.com/cli/version)。
```bash
npm login # 输入用户名和密码

# 之后发布你要发布的测试版本
npm publish --tag (alpha | beta)

# 或发布正式版用
npm publish
```

上述操作在自己的分支上进行发布版本即可，发完后，将分支合并到 master 上！！！

## <div id='template_config'>模板文件(template_config)</div>
config主要是有下面6大部分组成
```js
export default {
  'name': '模板名称',   // 模板名称
  'page': {},         // 模板整体的配置信息
  'header': {},       // 页眉(每页都会渲染)
  'contents': {},     // 主要内容(contents只渲染一次!第一页放不下,会顺延到次页继续渲染,直至全部渲染)
  'sign': {},         // 签名(只在最后一页渲染)
  'footer': {}        // 页脚(每页都会渲染)
}
```
一个简单模板配置如下
```js
export default {
  name: '模板名称',
  page: {
    name: 'A4', // 打印纸张名称
    type: 'A4', // 打印纸张规格(如:A5,A6...)
    size: {
      width: '210mm', // 纸张宽度
      height: '297mm' // 纸张高度
    },
    printDirection: 'vertical', // 打印布局方向(两种: vertical, horizontal)
    gap: {       // 纸张内边距
      paddingRight: '5mm',
      paddingLeft: '5mm',
      paddingBottom: '5mm',
      paddingTop: '5mm'
    }
  },
  header: {     // 页眉
    blocks: [   // blocks数组,里面元素
      {
        text: '收货人: {{收货人}}', // 文本块
        style: {                  // 文本块样式
          right: '',
          left: '450px',
          position: 'absolute',
          top: '6px'
        }
      }
    ],
    style: {                      // header 的样式
      height: '97px'
    }
  },
  contents: [  // contents数组,元素是object. 
    {
      blocks: [
        {
          text: '收货人: {{收货人}}',  // 模板字符串用{{}}表示
          style: {
            right: '',
            left: '450px',
            position: 'absolute',
            top: '6px'
          }
        }
      ],
      style: {
        height: '78px'
      }
    },
    {
      className: '',   
      type: 'table',   // type 表明是table 
      dataKey: 'orders_category',  // table的接受哪些数据. dataKey详细看下文
      subtotal: {     // 是否显示table每页合计
        show: false
      },
      columns: [      // 表单列配置
        {
          head: '序号',
          headStyle: {    // 表头样式
            textAlign: 'center'
          },
          style: {       // 表格样式
            textAlign: 'center'
          },
          text: '{{列.序号}}'  // 表格内容
        }
      ]
    }
  ],
  sign: {    // 签名(只在最后一页打印)
    blocks: [
      {
        text: '签收人：',
        style: {
          left: '600px',
          position: 'absolute',
          top: '5px'
        }
      }
    ],
    style: {
      height: '46px'
    }
  },
  footer: {   // 页脚
    blocks: [
      {
        text: '页码： {{当前页码}} / {{页码总数}}',
        style: {
          right: '',
          left: '48%',
          position: 'absolute',
          top: '0px'
        }
      }
    ],
    style: {
      height: '15px'
    }
  }
}
```

## addFields

右侧的添加字段数据

```js
├── commonFields # 块区域的添加字段
├── summaryFields # 合计汇总字段
├── tableFields # 表格区域的添加字段
```

## data 数据
```json
  {
    common: object, // 非表格数据
    _origin: object, // 原始数据
    _counter: object, //
    _table: { // 表格数据（根据模板的不同，进行整理数据）
      orders: kOrders, // 普通
      orders_multi: kOrdersMulti, // 双栏
      orders_multi_vertical: kOrdersMultiVertical, // 双栏（纵向）
      orders_category: kCategory, // 分类
      orders_category_multi: kCategoryMulti, // 分类 + 双栏
      orders_category_multi_vertical: kCategoryMultiVertical, // 分类+双栏（纵向）
      ...
    },
  }
```

## 区域表示

```js
header
header.block.0
contents.panel.0 //区域块
contents.panel.0.block.0 //区域块的每一个块
contents.table.0 //区域表格
contents.table.0.column.0 // 区域表格的每一个表格
```

