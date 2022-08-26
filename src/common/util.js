import i18next from '../../locales'

/**
 * 每页合计设置单选按钮
 * id的值是用来计算每页的金额总数，不要轻易随便改
 * id值暂时使用_origin的值，可优化改为{{列.xxxx}}的值，改起来有代价，先不改
 */
const subtotalRadioList = [
  {
    value: i18next.t('下单金额'),
    id: 'total_item_price'
  },
  {
    value: i18next.t('出库金额'),
    id: 'real_item_price'
  }
]

const accountRadioList = {
  total_item_price: i18next.t('下单金额'),
  real_item_price: i18next.t('出库金额')
}

export { subtotalRadioList, accountRadioList }
