export default {
  name: 'xxx',
  page: {
    name: 'A4',
    size: { width: '210mm', height: '297mm' },
    printDirection: 'vertical',
    type: 'A4',
    gap: {
      paddingRight: '5mm',
      paddingLeft: '5mm',
      paddingBottom: '5mm',
      paddingTop: '5mm'
    }
  },
  header: {
    blocks: [
      {
        text: '配送单',
        style: {
          right: '0px',
          left: '0px',
          position: 'absolute',
          top: '0px',
          fontWeight: 'bold',
          fontSize: '26px',
          textAlign: 'center'
        }
      },
      {
        text: '订单号: {{订单号}}',
        style: { left: '2px', position: 'absolute', top: '50px' }
      },
      {
        text: '配送时间：{{配送时间}}',
        style: { left: '261px', position: 'absolute', top: '76px' }
      },
      {
        text: '打印时间：{{当前时间}}',
        style: { right: '', left: '553px', position: 'absolute', top: '76px' }
      },
      {
        text: '分拣序号：{{分拣序号}}',
        style: { right: '', left: '450px', position: 'absolute', top: '50px' }
      },
      {
        text: '下单时间：{{下单时间}}',
        style: { left: '2px', position: 'absolute', top: '76px' }
      }
    ],
    style: { height: '97px' }
  },
  contents: [
    {
      blocks: [
        {
          text: '收货商户: {{收货商户}}({{商户ID}})',
          style: { left: '2px', position: 'absolute', top: '5px' }
        },
        {
          text: '收货人: {{收货人}}',
          style: { right: '', left: '450px', position: 'absolute', top: '6px' }
        },
        {
          text: '收货人电话: {{收货人电话}}',
          style: { left: '2px', position: 'absolute', top: '30px' }
        },
        {
          text: '收货地址: {{收货地址}}',
          style: { right: '', left: '450px', position: 'absolute', top: '30px' }
        },
        {
          text: '订单备注: {{订单备注}}',
          style: { left: '2px', position: 'absolute', top: '55px' }
        }
      ],
      style: { height: '78px' }
    },
    {
      blocks: [{ type: 'counter', style: { left: '-1px', top: '0px' } }],
      style: { height: '112px' }
    },
    {
      className: '',
      type: 'table',
      dataKey: 'orders_category',
      subtotal: { show: true },
      columns: [
        {
          head: '序号',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.序号}}'
        },
        {
          head: '类别',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.类别}}'
        },
        {
          head: '商品名',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.商品名}}'
        },
        {
          head: '规格',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.规格}}'
        },
        {
          head: '下单数',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.下单数}}{{列.销售单位}}'
        },
        {
          head: '出库数(基本单位)',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.出库数_基本单位}}{{列.基本单位}}'
        },
        {
          head: '单价(基本单位)',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.单价_基本单位}}'
        },
        {
          head: '出库金额',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.出库金额}}'
        },
        {
          head: '下单金额',
          headStyle: { textAlign: 'center' },
          text: '{{列.下单金额}}',
          style: { textAlign: 'center' }
        }
      ],
      summaryConfig: {
        pageSummaryShow: true,
        totalSummaryShow: false,
        style: { textAlign: 'center', fontSize: '12px' },
        summaryColumns: ['{{列.出库金额}}', '{{列.下单金额}}']
      }
    },
    { blocks: [], style: { height: '15px' } },
    {
      className: '',
      type: 'table',
      dataKey: 'abnormal',
      subtotal: { show: false },
      columns: [
        {
          head: '商品名',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.商品名}}'
        },
        {
          head: '异常原因',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.异常原因}}'
        },
        {
          head: '异常数量',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.异常数量}}'
        },
        {
          head: '异常金额',
          headStyle: { textAlign: 'center' },
          style: { textAlign: 'center' },
          text: '{{列.异常金额}}'
        }
      ]
    },
    {
      blocks: [
        {
          text: '下单金额：￥{{下单金额}}',
          style: { left: '1px', position: 'absolute', top: '10px' }
        },
        {
          text: '出库金额：￥{{出库金额}}',
          style: { left: '162px', position: 'absolute', top: '10px' }
        },
        {
          text: '运费：￥{{运费}}',
          style: { left: '309px', position: 'absolute', top: '10px' }
        },
        {
          text: '异常金额：￥{{异常金额}}',
          style: { left: '424px', position: 'absolute', top: '10px' }
        },
        {
          text: '销售额(含运税)：￥{{销售额_含运税}}',
          style: { left: '570px', position: 'absolute', top: '10px' }
        }
      ],
      style: { height: '69px' }
    }
  ],
  sign: {
    blocks: [
      {
        text: '签收人：',
        style: { left: '600px', position: 'absolute', top: '5px' }
      }
    ],
    style: { height: '46px' }
  },
  footer: {
    blocks: [
      {
        text: '页码： {{当前页码}} / {{页码总数}}',
        style: { right: '', left: '48%', position: 'absolute', top: '0px' }
      }
    ],
    style: { height: '15px' }
  }
}
