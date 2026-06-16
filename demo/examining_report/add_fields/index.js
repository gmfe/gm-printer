import i18next from '../../../locales'

const commonFields = {
  [i18next.t('基础')]: [
    { key: i18next.t('报告编号'), value: i18next.t('{{报告编号}}') },
    { key: i18next.t('报告名称'), value: i18next.t('{{报告名称}}') },
    { key: i18next.t('检测机构'), value: i18next.t('{{检测机构}}') },
    { key: i18next.t('检测日期'), value: i18next.t('{{检测日期}}') },
    { key: i18next.t('打印时间'), value: i18next.t('{{打印时间}}') },
    { key: i18next.t('自定义'), value: '' }
  ]
}

const tableFields = {
  [i18next.t('检测明细')]: [
    { key: i18next.t('序号'), value: i18next.t('{{列.序号}}') },
    { key: i18next.t('样品名称'), value: i18next.t('{{列.样品名称}}') },
    { key: i18next.t('样品编码'), value: i18next.t('{{列.样品编码}}') },
    { key: i18next.t('检测结果'), value: i18next.t('{{列.检测结果}}') },
    { key: i18next.t('自定义'), value: '' }
  ]
}

export default {
  commonFields,
  tableFields
}
