export default {
  page: {
    printDirection: 'vertical',
    gap: {
      paddingLeft: '5mm',
      paddingBottom: '5mm',
      paddingTop: '5mm',
      paddingRight: '5mm'
    },
    size: { width: '210mm', height: '278mm' },
    name: '自定义纸张',
    type: 'DIY'
  },
  contents: [
    {
      blocks: [
        {
          text: '黄马甲生鲜供应链',
          style: {
            left: '281px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            top: '8px',
            position: 'absolute'
          }
        },
        {
          text: '订单号：{{订单号}}',
          style: {
            left: '16px',
            fontWeight: 'bold',
            top: '32px',
            fontSize: '16px',
            position: 'absolute'
          }
        },
        {
          text: '配送时间：{{配送时间}}',
          style: { left: '264px', top: '137px', position: 'absolute' }
        },
        {
          text: '收货商户：{{收货商户}}({{商户ID}})',
          style: {
            left: '13px',
            fontWeight: 'bold',
            top: '59px',
            position: 'absolute'
          }
        },
        {
          text: '收货人电话：{{收货人电话}}',
          style: { left: '13px', top: '131px', position: 'absolute' }
        },
        {
          text: '收货人：{{收货人}}',
          style: { left: '13px', top: '82px', position: 'absolute' }
        },
        {
          text: '收货地址：{{收货地址}}',
          style: { left: '13px', top: '107px', position: 'absolute' }
        },
        {
          text: '订单备注：{{订单备注}}',
          style: { left: '13px', top: '158px', position: 'absolute' }
        },
        {
          text: '',
          style: { left: '573px', top: '96px', position: 'absolute' }
        },
        {
          text: '下单时间：{{下单时间}}',
          style: { left: '574px', top: '119px', position: 'absolute' }
        },
        {
          text: '客服电话：18682915607\n',
          style: { left: '577px', top: '141px', position: 'absolute' }
        },
        {
          text: '分拣序号：{{分拣序号}}',
          style: {
            left: '296px',
            fontWeight: 'bold',
            top: '80px',
            fontSize: '16px',
            position: 'absolute'
          }
        }
      ],
      style: { height: '196px' }
    },
    {
      dataKey: 'orders_category',
      className: '',
      subtotal: { show: false },
      type: 'table',
      columns: [
        {
          text: '{{列.序号}}',
          style: { textAlign: 'center' },
          head: '序号',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.类别}}',
          style: { textAlign: 'center' },
          head: '类别',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.商品名}}',
          style: { textAlign: 'center' },
          head: '商品名',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.规格}}',
          style: { textAlign: 'center' },
          head: '规格',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.下单数}}{{列.销售单位}}',
          style: { textAlign: 'center' },
          head: '下单数',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.出库数_基本单位}}{{列.基本单位}}',
          style: { textAlign: 'center' },
          head: '出库数(基本单位)',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.单价_基本单位}}',
          style: { textAlign: 'center' },
          head: '单价(基本单位)',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.出库金额}}',
          style: { textAlign: 'center' },
          head: '出库金额',
          headStyle: { textAlign: 'center' }
        }
      ]
    },
    { style: { height: '60px' }, blocks: [] },
    {
      dataKey: 'abnormal',
      className: '',
      subtotal: { show: false },
      type: 'table',
      columns: [
        {
          text: '{{列.商品名}}',
          style: { textAlign: 'center' },
          head: '商品名',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.异常原因}}',
          style: { textAlign: 'center' },
          head: '异常原因',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.异常数量}}',
          style: { textAlign: 'center' },
          head: '异常数量',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.异常金额}}',
          style: { textAlign: 'center' },
          head: '异常金额',
          headStyle: { textAlign: 'center' }
        },
        {
          text: '{{列.异常描述}}',
          style: { textAlign: 'center' },
          head: '异常描述',
          headStyle: { textAlign: 'center' }
        }
      ]
    },
    {
      blocks: [
        {
          text: '下单金额：￥{{下单金额}}',
          style: { left: '1px', top: '10px', position: 'absolute' }
        },
        {
          text: '出库金额：￥{{出库金额}}',
          style: { left: '162px', top: '10px', position: 'absolute' }
        },
        {
          text: '运费：￥{{运费}}',
          style: { left: '309px', top: '10px', position: 'absolute' }
        },
        {
          text: '异常金额：￥{{异常金额}}',
          style: { left: '424px', top: '10px', position: 'absolute' }
        },
        {
          text: '销售额(含运税)：￥{{销售额_含运税}}',
          style: { left: '570px', top: '10px', position: 'absolute' }
        },
        {
          text:
            '客户交接单一式四联签收，白、粉客户留存，蓝、黄返回公司，有异常请在交接单一式四联注明',
          style: { left: '1px', top: '32px', position: 'absolute' }
        },
        {
          text: '配送司机签字:',
          style: { left: '247px', top: '77px', position: 'absolute' }
        },
        {
          text: '客户签字:',
          style: { left: '524px', top: '77px', position: 'absolute' }
        },
        {
          text: '',
          style: {
            left: '119.453125px',
            top: '145.109375px',
            position: 'absolute'
          }
        }
      ],
      style: { height: '208px' }
    }
  ],
  sign: { blocks: [], style: { height: '13px' } },
  name: '黄马甲交接单',
  header: { blocks: [], style: { height: '2px' } },
  footer: {
    blocks: [
      {
        text: '页码：{{当前页码}} / {{页码总数}}',
        style: { left: '678px', top: '-1px', position: 'absolute' }
      }
    ],
    style: { height: '32px' }
  }
}
