export default {
  name: '',
  page: {
    name: 'A4',
    size: {
      width: '210mm',
      height: '297mm'
    },
    printDirection: 'vertical',
    type: 'A4',
    gap: {
      paddingRight: '5mm',
      paddingLeft: '5mm',
      paddingBottom: '5mm',
      paddingTop: '5mm'
    }
  },
  header: { style: { height: '0px' }, blocks: [] },
  contents: [
    {
      blocks: [
        {
          text: '出货单',
          style: {
            right: '0px',
            left: '0px',
            position: 'absolute',
            top: '10px',
            fontWeight: 'bold',
            fontSize: '26px',
            textAlign: 'center'
          }
        },
        {
          text: '出库时间： {{出库时间}}',
          style: {
            left: '2px',
            position: 'absolute',
            top: '62px'
          }
        },
        {
          text: '单据编号：{{单据编号}}',
          style: {
            left: '430px',
            position: 'absolute',
            top: '62px'
          }
        },
        {
          text: '商户名：{{商户名}}',
          style: {
            left: '2px',
            position: 'absolute',
            top: '93px'
          }
        },
        {
          text: '单据备注：{{单据备注}}',
          style: {
            left: '2px',
            position: 'absolute',
            top: '127px'
          }
        }
      ],
      style: {
        height: '151px'
      }
    },
    {
      className: '',
      type: 'table',
      dataKey: 'orders',
      subtotal: {},
      specialConfig: { style: {} },
      columns: [
        {
          head: '批次号',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.批次号}}'
        },
        {
          head: '商品编号',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.商品编号}}'
        },
        {
          head: '商品名称',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.商品名称}}'
        },
        {
          head: '商品分类',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.商品分类}}'
        },
        {
          head: '出库数（基本单位）',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.出库数_基本单位}}'
        },
        {
          head: '出库单位（基本单位）',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.出库单位_基本单位}}'
        },
        {
          head: '出库成本价（基本单位）',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.出库成本价_基本单位}}'
        },
        {
          head: '成本金额',
          headStyle: {
            textAlign: 'center'
          },
          style: {
            textAlign: 'center'
          },
          text: '{{列.成本金额}}'
        }
      ]
    },
    {
      blocks: [
        {
          text: '成本金额: ￥{{成本金额}}',
          style: { position: 'absolute', left: '2px', top: '12px' }
        }
      ],
      style: { height: '56px' }
    }
  ],
  sign: {
    blocks: [],
    style: {}
  },
  footer: {
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
