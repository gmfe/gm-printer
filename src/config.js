const pageSizeMap = {
  'A4': {
    size: {
      width: '210mm',
      height: '297mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  'A5': {
    size: {
      width: '180mm',
      height: '260mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  '自定义': {
    size: {
      width: '210mm',
      height: '150mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
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

const tableStyleList = [
  {value: 'gm-printer-table-style-1', text: '样式一'},
  {value: 'gm-printer-table-style-2', text: '样式二'},
  {value: 'gm-printer-table-style-3', text: '样式三'}
]

const panelList = [
  {value: 'header', text: '页眉'},
  {value: 'top', text: '页头'},
  {value: 'bottom', text: '页尾'},
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
  tableStyleList,
  panelList,
  blockTypeList,
  pageSizeMap
}
