import i18next from '../locales'

export const LONG_PRINT = "longPrint"

export const pageTypeMap = {
  A4: {
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
  A5: {
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
    name: i18next.t('二分纸'),
    size: {
      width: '210mm',
      height: '140mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  'A4/3': {
    name: i18next.t('三分纸'),
    size: {
      width: '210mm',
      height: '93mm'
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
      height: '140mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '16mm',
      paddingBottom: '5mm',
      paddingLeft: '16mm'
    }
  },
  // 新增长条打印配置选项
  [LONG_PRINT]: {
    name: i18next.t('长条打印'),
    size: {
      width: '80mm',
      height: '100mm'
    },
    printDirection: 'vertical',
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  DIY: {
    name: i18next.t('自定义纸张'),
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

export const printDirectionList = [
  { value: 'vertical', text: i18next.t('纵向') },
  { value: 'horizontal', text: i18next.t('横向') }
]

export const borderStyleList = [
  { value: 'solid', text: i18next.t('实线') },
  { value: 'dashed', text: i18next.t('虚线') },
  { value: 'dotted', text: i18next.t('圆点') }
]

export const tableClassNameList = [
  { value: '', text: i18next.t('默认样式') },
  { value: 'className0', text: i18next.t('浅实线样式') },
  { value: 'className1', text: i18next.t('无实线样式') }
]

export const tableDataKeyList = [
  { value: 'orders', text: i18next.t('全部商品') },
  { value: 'abnormal', text: i18next.t('异常商品') }
]

export const blockTypeList = [
  { value: '', text: i18next.t('插入文本') },
  { value: 'line', text: i18next.t('插入线条') },
  { value: 'image', text: i18next.t('插入图片') },
  { value: 'counter', text: i18next.t('插入分类汇总') },
  { value: 'barcode', text: i18next.t('插入订单条形码') },
  { value: 'qrcode', text: i18next.t('插入订单溯源二维码') }
]

export const MULTI_SUFFIX = '_MULTI_SUFFIX'

export const MULTI_SUFFIX3 = '_MULTI_SUFFIX3'
