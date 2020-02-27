import i18next from '../../../locales'

const commonFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('出库时间'), value: '{{出库时间}}' },
    { key: i18next.t('单据编号'), value: '{{单据编号}}' },
    { key: i18next.t('商户名'), value: '{{商户名}}' },
    { key: i18next.t('单据备注'), value: '{{单据备注}}' },
    { key: i18next.t('打印时间'), value: '{{打印时间}}' },
    { key: i18next.t('出库单状态'), value: '{{出库单状态}}' },
    { key: i18next.t('最后操作时间'), value: '{{最后操作时间}}' },
    { key: i18next.t('打单人'), value: '{{打单人}}' },
    { key: i18next.t('建单人'), value: '{{建单人}}' }
  ],
  [i18next.t('金额')]: [
    {
      key: i18next.t('成本金额'),
      value: `{{成本金额}}`
    }
  ],
  [i18next.t('其他')]: [
    { key: i18next.t('页码'), value: '{{当前页码}}/{{页码总数}}' }
  ]
}

const tableFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('批次号'), value: '{{列.批次号}}' },
    { key: i18next.t('商品编号'), value: '{{列.商品编号}}' },
    { key: i18next.t('规格编号'), value: '{{列.规格编号}}' },
    { key: i18next.t('商品名称'), value: '{{列.商品名称}}' },
    { key: i18next.t('规格'), value: '{{列.规格}}' },
    { key: i18next.t('商品分类'), value: '{{列.商品分类}}' },
    { key: i18next.t('操作人'), value: '{{列.操作人}}' },
    { key: i18next.t('自定义'), value: '' }
  ],
  [i18next.t('单位')]: [
    {
      key: i18next.t('出库单位（基本单位）'),
      value: '{{列.出库单位_基本单位}}'
    },
    {
      key: i18next.t('出库单位（销售单位）'),
      value: '{{列.出库单位_销售单位}}'
    }
  ],
  [i18next.t('数量')]: [
    {
      key: i18next.t('出库数（基本单位）'),
      value: '{{列.出库数_基本单位}}'
    },
    {
      key: i18next.t('出库数（销售单位）'),
      value: '{{列.出库数_销售单位}}'
    }
  ],
  [i18next.t('金额')]: [
    {
      key: i18next.t('出库成本价（基本单位）'),
      value: '{{列.出库成本价_基本单位}}'
    },
    {
      key: i18next.t('出库成本价（销售单位）'),
      value: '{{列.出库成本价_销售单位}}'
    },
    {
      key: i18next.t('成本金额'),
      value: '{{列.成本金额}}'
    },
    { key: i18next.t('采购金额（不含税)'), value: '{{列.采购金额_不含税}}' },
    { key: i18next.t('进项税率'), value: '{{列.进项税率}}' },
    { key: i18next.t('进项税额'), value: '{{列.进项税额}}' }
  ]
}

export default {
  commonFields,
  tableFields
}
