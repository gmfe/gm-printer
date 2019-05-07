import i18next from '../../../locales'

const commonFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('打印时间'), value: i18next.t('{{当前时间}}') },
    { key: i18next.t('采购经办'), value: i18next.t('{{采购员}}') },
    { key: i18next.t('采购单位'), value: i18next.t('{{采购单位}}') },
    { key: i18next.t('供应商'), value: i18next.t('{{供应商}}') },
    { key: i18next.t('供应商编号'), value: i18next.t('{{供应商编号}}') },
    { key: i18next.t('预采购金额'), value: i18next.t('{{预采购金额}}') },
    { key: i18next.t('采购金额'), value: i18next.t('{{采购金额}}') },
    { key: i18next.t('任务数'), value: i18next.t('{{任务数}}') }
  ],
  [i18next.t('其他')]: [
    { key: i18next.t('页码'), value: i18next.t('{{当前页码}} / {{页码总数}}') }
  ]
}

const tableFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('序号'), value: i18next.t('{{列.序号}}') },
    { key: i18next.t('商品名称'), value: i18next.t('{{列.商品名称}}') },
    { key: i18next.t('规格'), value: i18next.t('{{列.规格}}') },
    { key: i18next.t('一级分类'), value: i18next.t('{{列.一级分类}}') },
    { key: i18next.t('二级分类'), value: i18next.t('{{列.二级分类}}') },
    { key: i18next.t('品类'), value: i18next.t('{{列.品类}}') },
    { key: i18next.t('参考成本'), value: i18next.t('{{列.参考成本}}') }
  ],
  [i18next.t('数量')]: [
    { key: i18next.t('库存'), value: i18next.t('{{列.库存}}') },
    { key: i18next.t('计划采购(基本单位)'), value: i18next.t('{{列.计划采购_基本单位}}{{列.基本单位}}') },
    { key: i18next.t('计划采购(采购单位)'), value: i18next.t('{{列.计划采购_采购单位}}{{列.采购单位}}') },
    { key: i18next.t('实采(基本单位)'), value: i18next.t('{{列.实采_基本单位}}{{列.基本单位}}') },
    { key: i18next.t('实采(采购单位)'), value: i18next.t('{{列.实采_采购单位}}{{列.采购单位}}') },
    { key: i18next.t('建议采购'), value: i18next.t('{{列.建议采购}}') }
  ],
  [i18next.t('价格')]: [
    { key: i18next.t('单价(基本单位)'), value: i18next.t('{{列.单价_基本单位}}') },
    { key: i18next.t('单价(采购单位)'), value: i18next.t('{{列.单价_采购单位}}') }
  ],
  [i18next.t('金额')]: [
    { key: i18next.t('预采购金额'), value: i18next.t('{{列.预采购金额}}') },
    { key: i18next.t('采购金额'), value: i18next.t('{{列.采购金额}}') }
  ]
}

const detailFields = [
  { key: i18next.t('商户名'), value: i18next.t('{{商户名}}') },
  { key: i18next.t('商户ID'), value: i18next.t('{{商户ID}}') },
  { key: i18next.t('采购数量(采购单位)'), value: i18next.t('{{采购数量_采购单位}}{{采购单位}}') },
  { key: i18next.t('采购数量(基本单位)'), value: i18next.t('{{采购数量_基本单位}}{{基本单位}}') },
  { key: i18next.t('分拣序号'), value: i18next.t('{{分拣序号}}') },
  { key: i18next.t('商品备注'), value: i18next.t('{{商品备注}}') }
]

export default {
  commonFields,
  tableFields,
  detailFields
}
