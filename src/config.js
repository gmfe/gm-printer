export const pageTypeMap = {
  'A4': {
    name: 'A4',
    size: {
      width: '210mm',
      height: '297mm'
    },
    gap: {
      paddingTop: '8mm',
      paddingRight: '8mm',
      paddingBottom: '8mm',
      paddingLeft: '8mm'
    }
  },
  'A5': {
    name: 'A5',
    size: {
      width: '148mm',
      height: '210mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  'A4/2': {
    name: '二分纸',
    size: {
      width: '210mm',
      height: '148.5mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  'A4/3': {
    name: '三分纸',
    size: {
      width: '210mm',
      height: '99mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  '241x280': {
    name: '241x280',
    size: {
      width: '241mm',
      height: '280mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '16mm',
      paddingBottom: '5mm',
      paddingLeft: '16mm'
    }
  },
  '241x140': {
    name: '241x140',
    size: {
      width: '241mm',
      height: '280mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '16mm',
      paddingBottom: '5mm',
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
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  }
}

export const fontSizeList = [
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

export const printDirectionList = [
  { value: 'vertical', text: '纵向' },
  { value: 'horizontal', text: '横向' }
]

export const borderStyleList = [
  { value: 'solid', text: '实线' },
  { value: 'dashed', text: '虚线' },
  { value: 'dotted', text: '圆点' }
]

export const tableClassNameList = [
  { value: '', text: '默认样式' },
  { value: 'className1', text: '无实线样式' }
]

export const tableDataKeyList = [
  { value: 'orders', text: '全部商品' },
  { value: 'abnormal', text: '异常商品' }
]

export const blockTypeList = [
  { value: '', text: '插入文本' },
  { value: 'line', text: '插入线条' },
  { value: 'image', text: '插入图片' },
  { value: 'counter', text: '插入分类汇总' }
]

export const MULTI_SUFFIX = '_MULTI_SUFFIX'
