import i18next from '../../../locales'

const commonFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('单据日期'), value: i18next.t('{{单据日期}}') },
    { key: i18next.t('结款日期'), value: i18next.t('{{结款日期}}') },
    { key: i18next.t('打印时间'), value: i18next.t('{{打印时间}}') },
    { key: i18next.t('单据编号'), value: i18next.t('{{单据编号}}') },
    { key: i18next.t('付款单摘要'), value: i18next.t('{{付款单摘要}}') },
    { key: i18next.t('制单人'), value: i18next.t('{{制单人}}') },
    { key: i18next.t('经办人'), value: '' },
    { key: i18next.t('自定义'), value: '' }
  ],
  [i18next.t('供应商')]: [
    { key: i18next.t('往来单位'), value: i18next.t(`{{往来单位}}`) },
    { key: i18next.t('供应商编号'), value: i18next.t(`{{供应商编号}}`) },
    { key: i18next.t('供应商营业执照号'), value: '' },
    { key: i18next.t('联系电话'), value: i18next.t(`{{联系电话}}`) },
    { key: i18next.t('开户银行'), value: i18next.t(`{{开户银行}}`) },
    { key: i18next.t('银行账号'), value: i18next.t(`{{银行账号}}`) },
    { key: i18next.t('结款方式'), value: i18next.t(`{{结款方式}}`) },
    { key: i18next.t('开户名'), value: i18next.t(`{{开户名}}`) }
  ],
  [i18next.t('金额')]: [
    { key: i18next.t('单据金额'), value: i18next.t(`￥{{单据金额}}`) },
    { key: i18next.t('折让金额'), value: i18next.t(`￥{{折让金额}}`) },
    { key: i18next.t('结算金额'), value: i18next.t(`￥{{结算金额}}`) }
  ],
  [i18next.t('其他')]: [
    { key: i18next.t('页码'), value: i18next.t('{{当前页码}}/{{页码总数}}') }
  ]
}

const tableFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('序号'), value: i18next.t('{{列.序号}}') },
    { key: i18next.t('单据类型'), value: i18next.t('{{列.单据类型}}') },
    { key: i18next.t('单据编号'), value: i18next.t('{{列.单据编号}}') },
    { key: i18next.t('金额'), value: i18next.t('{{列.金额}}') },
    { key: i18next.t('结算金额'), value: i18next.t('{{列.结算金额}}') },
    { key: i18next.t('入库/退货时间'), value: i18next.t('{{列.入库时间}}') },
    { key: i18next.t('自定义'), value: '' }
  ],
  [i18next.t('折让')]: [
    { key: i18next.t('折让原因'), value: i18next.t('{{列.折让原因}}') },
    { key: i18next.t('折让类型'), value: i18next.t('{{列.折让类型}}') },
    { key: i18next.t('折让金额'), value: i18next.t('{{列.折让金额}}') },
    { key: i18next.t('备注'), value: i18next.t('{{列.备注}}') },
    { key: i18next.t('自定义'), value: '' }
  ]
}

export default {
  commonFields,
  tableFields
}
