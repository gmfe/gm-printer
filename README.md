# gm-printer 

## 目录简要
```bash
├── src
│   ├── config.js # 一些printer配置信息
│   ├── data_to_key # 原始数据转换成打印数据
│   ├── editor # 右侧打印编辑界面
│   ├── index.js 
│   ├── mock_data # 模拟数据
│   ├── printer # 打印区域
│   ├── template_config # 打印模板配置文件
│   └── util.js 
├── locales # 多语言文件
```

## 模板文件(template_config)
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


