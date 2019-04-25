import i18next from '../../../locales'
import _ from 'lodash'
import Big from 'big.js'

function checklist (data) {
  // 按一级分类分组
  const groupByCategory1 = _.groupBy(data.details, d => d.category_title_1)
  let kCategoryList = []

  _.forEach(groupByCategory1, (value) => {
    kCategoryList = kCategoryList.concat(value)
  })

  // 过滤按订单投框
  const checklist = _.map(_.filter(kCategoryList, c => !c.union_dispatch), (sku, index) => {
    return {
      [i18next.t('序号')]: index + 1,
      [i18next.t('分类')]: (`${sku.category_title_1}-${sku.category_title_2}-${sku.pinlei_title}`) || '-',
      [i18next.t('商品ID')]: sku.id || '-',
      [i18next.t('商品名')]: sku.name || '-',
      [i18next.t('基本单位')]: sku.std_unit_name,
      [i18next.t('规格')]: (sku.std_unit_name === sku.sale_unit_name && sku.sale_ratio === 1) ? i18next.t(
        /* src:`按${sku.sale_unit_name}` => tpl:按${VAR1} */'KEY9',
        { VAR1: sku.sale_unit_name })
        : `${sku.sale_ratio}${sku.std_unit_name}/${sku.sale_unit_name}`,
      [i18next.t('下单数_基本单位')]: Big(sku.quantity || 0).times(sku.sale_ratio),
      [i18next.t('实配数_基本单位')]: sku.real_weight
    }
  })

  const common = {
    [i18next.t('订单号')]: data.id || '-',
    [i18next.t('分拣序号')]: data.sort_id || '-',
    [i18next.t('司机')]: data.driver_name || '-',
    [i18next.t('商户名')]: data.resname || '-',
    [i18next.t('线路')]: data.address_route_name || '-'
  }

  return {
    common,
    _table: {
      check_list: checklist
    },
    _origin: data
  }
}

export default checklist
