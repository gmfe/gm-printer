export default {
  name: '',
  page: {
    gap: {
      paddingTop: '5mm',
      paddingLeft: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm'
    },
    name: 'A4',
    size: { width: '210mm', height: '297mm' },
    type: 'A4',
    printDirection: 'vertical'
  },
  sign: { style: { height: '13px' }, blocks: [] },
  footer: {
    style: { height: '15px' },
    blocks: [
      {
        text: '页码： {{当前页码}} / {{页码总数}}',
        style: {
          top: '6px',
          left: '48%',
          right: '',
          position: 'absolute',
          textAlign: 'center'
        }
      }
    ]
  },
  header: { style: { height: '0px' }, blocks: [] },
  contents: [
    {
      style: { height: '143px' },
      blocks: [
        {
          text: ' {{供应商}}',
          style: {
            top: '11px',
            left: '0px',
            right: '0px',
            fontSize: '26px',
            position: 'absolute',
            textAlign: 'center',
            fontWeight: 'bold'
          }
        },
        {
          text: '采购单位: {{采购单位}}',
          style: { top: '66px', left: '2px', position: 'absolute' }
        },
        {
          text: '采购经办: {{采购员}}',
          style: { top: '66px', left: '524px', position: 'absolute' }
        },
        {
          text: '打印时间: {{当前时间}}',
          style: { top: '92px', left: '2px', position: 'absolute' }
        },
        {
          text: '预采购金额: {{预采购金额}}',
          style: { top: '92px', left: '524px', position: 'absolute' }
        },
        {
          text: '任务数: {{任务数}}',
          style: { top: '118px', left: '2px', position: 'absolute' }
        }
      ]
    },
    {
      type: 'table',
      customerTag: true,
      columns: [
        {
          head: '序号',
          text: '{{列.序号}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '商品名',
          text: '{{列.商品名称}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '规格',
          text: '{{列.规格}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '计划采购',
          text:
            '{{列.计划采购_采购单位}}{{列.采购单位}}({{列.计划采购_基本单位}}{{列.基本单位}})',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '库存',
          text: '{{列.库存}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '建议采购',
          text: '{{列.建议采购}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '实采(基本单位)',
          text: '{{列.实采_基本单位}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '参考成本',
          text: '{{列.参考成本}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: '采购金额',
          text: '{{列.采购金额}}',
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        }
      ],
      dataKey: 'purchase_no_detail',
      subtotal: { show: false },
      className: '',
      specialConfig: {
        style: {},
        separator: '+',
        template_text:
          '{{采购数量_采购单位}}{{采购单位}}*{{商户名}}*{{商品备注}}'
      }
    },
    {
      style: { height: '39px' },
      blocks: [
        {
          text: '采购经办:',
          style: { top: '20px', left: '2px', position: 'absolute' }
        },
        {
          text: '供应商:',
          style: { top: '20px', left: '502px', position: 'absolute' }
        }
      ]
    }
  ]
}
