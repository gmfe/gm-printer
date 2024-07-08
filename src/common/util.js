import i18next from '../../locales'

/**
 * 每页合计设置单选按钮
 * id的值是用来计算每页的金额总数，不要轻易随便改
 */
// 整单合计和每页合计栏都使用的这个
const subtotalRadioList = [
  {
    value: i18next.t('下单金额'),
    id: '下单金额'
  },
  {
    value: i18next.t('出库金额'),
    id: '出库金额'
  },
  {
    value: i18next.t('实际金额'),
    id: '实际金额'
  }
]

const accountRadioList = {
  下单金额: i18next.t('下单金额'),
  出库金额: i18next.t('出库金额'),
  实际金额: i18next.t('实际金额')
}

export { subtotalRadioList, accountRadioList }
