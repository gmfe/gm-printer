import i18next from '../../locales'

/**
 * 每页合计金额单选
 * id 与 data_to_key 中文 key 对齐，用于对本页行求和，不要轻易改 id
 */
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
  },
  {
    value: i18next.t('变化前金额'),
    id: '变化前金额'
  },
  {
    value: i18next.t('下单金额（不含税）'),
    id: '下单金额_不含税'
  },
  {
    value: i18next.t('实收金额'),
    id: '实收金额'
  },
  {
    value: i18next.t('实收金额（不含税）'),
    id: '实收金额_不含税'
  }
]

/**
 * 整单合计金额单选（比每页合计多「出库金额（不含税）」）
 * id 与 data.common 中文 key 对齐，取订单已算金额，不重算
 */
const overallOrderRadioList = [
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
  },
  {
    value: i18next.t('变化前金额'),
    id: '变化前金额'
  },
  {
    value: i18next.t('下单金额（不含税）'),
    id: '下单金额_不含税'
  },
  {
    value: i18next.t('出库金额（不含税）'),
    id: '出库金额_不含税'
  },
  {
    value: i18next.t('实收金额'),
    id: '实收金额'
  },
  {
    value: i18next.t('实收金额（不含税）'),
    id: '实收金额_不含税'
  }
]

const accountRadioList = {
  下单金额: i18next.t('下单金额'),
  出库金额: i18next.t('出库金额'),
  实际金额: i18next.t('实际金额')
}

export { subtotalRadioList, overallOrderRadioList, accountRadioList }
