const pageSizeMap = {
  'A4': {
    size: {
      width: '210mm',
      height: '297mm'
    },
    gap: {
      paddingTop: '3mm',
      paddingRight: '3mm',
      paddingBottom: '3mm',
      paddingLeft: '3mm'
    }
  },
  'A5': {
    size: {
      width: '180mm',
      height: '260mm'
    },
    gap: {
      paddingTop: '3mm',
      paddingRight: '3mm',
      paddingBottom: '3mm',
      paddingLeft: '3mm'
    }
  },
  '自定义1': {
    size: {
      width: '210mm',
      height: '150mm'
    },
    gap: {
      paddingTop: '3mm',
      paddingRight: '3mm',
      paddingBottom: '3mm',
      paddingLeft: '3mm'
    }
  }
}

const fontSizeList = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px'
]

const borderStyleList = [
  {value: 'solid', text: '实线'},
  {value: 'dashed', text: '虚线'},
  {value: 'dotted', text: '圆点'}
]

const tableClassNameList = [
  {value: '', text: '默认'},
  {value: 'className1', text: '样式一'}
]

const TABLETYPE_CATEGORY1TOTAL = 'typeCategory1Total'

const tableTypeList = [
  {value: '', text: '默认'},
  {value: TABLETYPE_CATEGORY1TOTAL, text: '一级分类+总计'}
]

const panelList = [
  {value: 'header', text: '页眉'},
  {value: 'top', text: '顶部'},
  {value: 'table', text: '表格'},
  {value: 'bottom', text: '底部'},
  {value: 'sign', text: '签名'},
  {value: 'footer', text: '页脚'}
]

const blockTypeList = [
  {value: '', text: '文本'},
  {value: 'line', text: '线条'},
  {value: 'image', text: '图片'}
]

export {
  fontSizeList,
  borderStyleList,
  tableClassNameList,
  tableTypeList,
  TABLETYPE_CATEGORY1TOTAL,
  panelList,
  blockTypeList,
  pageSizeMap
}
