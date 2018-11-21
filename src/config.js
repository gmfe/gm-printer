const pageTypeMap = {
  'A4': {
    name: 'A4', // name 仅仅作为select展示用
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
    name: 'A5',
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
  '241x280': {
    name: '241x280',
    size: {
      width: '241mm',
      height: '280mm'
    },
    gap: {
      paddingTop: '3mm',
      paddingRight: '16mm',
      paddingBottom: '3mm',
      paddingLeft: '16mm'
    }
  },
  'DIY': {
    name: '自定义纸张',
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

const printDirectionList = [
  { value: 'vertical', text: '纵向' },
  { value: 'horizontal', text: '横向' }
]

const counterStateList = [
  { value: true, text: '展示' },
  { value: false, text: '不展示' }
]

const borderStyleList = [
  { value: 'solid', text: '实线' },
  { value: 'dashed', text: '虚线' },
  { value: 'dotted', text: '圆点' }
]

const tableClassNameList = [
  { value: '', text: '默认样式' },
  { value: 'className1', text: '样式一' }
]

const tableDataKeyList = [
  { value: 'orders', text: '全部商品' },
  { value: 'abnormal', text: '异常商品' }
]

const panelList = [
  { value: 'header', text: '页眉' },
  { value: 'sign', text: '签名' },
  { value: 'footer', text: '页脚' }
]

const blockTypeList = [
  { value: '', text: '插入文本' },
  { value: 'line', text: '插入线条' },
  { value: 'image', text: '插入图片' }
]

export {
  fontSizeList,
  borderStyleList,
  tableClassNameList,
  tableDataKeyList,
  panelList,
  blockTypeList,
  pageTypeMap,
  printDirectionList,
  counterStateList
}
