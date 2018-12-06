import i18next from '../../locales'
import moment from 'moment'
import _ from 'lodash'
import Big from 'big.js'
import { MULTI_SUFFIX } from '../config'
import { coverDigit2Uppercase, price, convertNumber2Sid } from './util'

const SETTLE_WAY = {
  0: i18next.t('先款后货'),
  1: i18next.t('先货后款')
}

/**
 * 生成双栏商品展示数据
 * @param list
 * @param categoryTotal
 * @return {Array}
 */
function generateMultiData (list, categoryTotal) {
  let multiList = []
  // 假设skuGroup = [{a: 1}, {a:2}, {a: 3}, {a: 4}], 转化为 [{a:1, a#2:3}, {a:2, a#2: 4}]
  const skuGroup = list

  let index = 0
  const len = skuGroup.length

  while (index < len) {
    const sku1 = skuGroup[index]
    const sku2 = {}
    _.each(skuGroup[1 + index], (val, key) => {
      sku2[key + MULTI_SUFFIX] = val
    })

    multiList.push({
      ...sku1,
      ...sku2
    })

    index += 2
  }

  if (categoryTotal) {
    multiList.push(categoryTotal)
  }

  return multiList
}

// 非表格数据
function generateCommon (data) {
  return {
    [i18next.t('订单号')]: data.id,
    [i18next.t('分拣序号')]: `${data.sort_id} ${data.child_sort_id}`,

    [i18next.t('下单时间')]: moment(data.date_time).format('YYYY-MM-DD HH:mm:ss'),
    [i18next.t('配送时间')]: `${moment(data.receive_begin_time).format('MM-DD HH:mm:ss')} ~ ${moment(data.receive_end_time).format('MM-DD HH:mm:ss')}`,
    [i18next.t('当前时间')]: moment().format('YYYY-MM-DD HH:mm:ss'),
    [i18next.t('订单备注')]: data.remark,

    [i18next.t('下单金额')]: price(data.total_price),
    [i18next.t('出库金额')]: price(data.real_price),
    [i18next.t('运费')]: price(data.freight),
    [i18next.t('异常金额')]: price(data.abnormal_money),
    [i18next.t('销售额_含运税')]: price(data.total_pay),

    [i18next.t('税额')]: price(data.total_tax), // 商品税额加总

    [i18next.t('商户公司')]: data.cname,
    [i18next.t('承运商')]: data.carrier,
    [i18next.t('结款方式')]: SETTLE_WAY[data.settle_way],

    [i18next.t('线路')]: data.address_route_name || '-',
    [i18next.t('城市')]: data.city || '-',
    [i18next.t('城区')]: data.area_l1 || '-',
    [i18next.t('街道')]: data.area_l2 || '-',

    [i18next.t('司机名称')]: data.driver_name || '-',
    [i18next.t('司机电话')]: data.driver_phone || '-',
    [i18next.t('销售经理')]: data.sale_manager.name || '-',
    [i18next.t('销售经理电话')]: data.sale_manager.phone || '-',

    // 收货人信息
    [i18next.t('收货商户')]: data.resname,
    [i18next.t('商户ID')]: convertNumber2Sid(data.sid),
    [i18next.t('收货人')]: data.receiver_name,
    [i18next.t('收货人电话')]: data.receiver_phone,
    [i18next.t('收货地址')]: data.address
  }
}

// 大写金额数据
function generateUpperPrice (data) {
  return {
    [i18next.t('下单金额_大写')]: coverDigit2Uppercase(data.total_price),
    [i18next.t('出库金额_大写')]: coverDigit2Uppercase(data.real_price),
    [i18next.t('运费_大写')]: coverDigit2Uppercase(data.freight),
    [i18next.t('异常金额_大写')]: coverDigit2Uppercase(data.abnormal_money),
    [i18next.t('销售额_含运税_大写')]: coverDigit2Uppercase(data.total_pay),

    [i18next.t('商品税额_大写')]: coverDigit2Uppercase(data.total_tax) // 商品税额加总
  }
}

// 普通订单数据
function generateOrderData (list) {
  return _.map(list, (v, index) => {
    return {
      [i18next.t('序号')]: index + 1,
      [i18next.t('商品ID')]: v.id,
      [i18next.t('商品名')]: v.real_is_weight && !v.is_weigh ? `*${v.name}` : v.name,
      [i18next.t('类别')]: v.category_title_1,
      [i18next.t('商品二级分类')]: v.category_title_2,
      [i18next.t('商品品类')]: v.pinlei_title,
      [i18next.t('SPU名称')]: v.spu_name,
      [i18next.t('规格')]: v.std_unit_name === v.sale_unit_name && v.sale_ratio === 1 ? i18next.t(
        /* src:`按${v.sale_unit_name}` => tpl:按${VAR1} */'KEY9',
        { VAR1: v.sale_unit_name }
      )
        : `${v.sale_ratio}${v.std_unit_name}/${v.sale_unit_name}`,
      [i18next.t('自定义编码')]: v.outer_id,
      [i18next.t('商品描述')]: v.desc,
      [i18next.t('备注')]: v.remark, // 商品备注

      [i18next.t('基本单位')]: v.std_unit_name,
      [i18next.t('销售单位')]: v.sale_unit_name,

      [i18next.t('下单数')]: v.quantity,
      [i18next.t('出库数_基本单位')]: v.real_weight,
      [i18next.t('出库数_销售单位')]: v.sale_ratio === 1 ? v.real_weight
        : parseFloat(Big(v.real_weight).div(v.sale_ratio).toFixed(2)),

      [i18next.t('税率')]: v.tax_rate ? Big(v.tax_rate).div(100).toFixed(2) + '%' : 0,
      [i18next.t('不含税单价_基本单位')]: price(Big(v.sale_price_without_tax || 0).div(v.sale_ratio)),
      [i18next.t('不含税单价_销售单位')]: price(v.sale_price_without_tax),
      [i18next.t('单价_基本单位')]: price(v.std_sale_price),
      [i18next.t('单价_销售单位')]: price(v.sale_price),

      [i18next.t('商品税额')]: price(v.tax),
      [i18next.t('出库金额')]: price(v.real_item_price),
      [i18next.t('出库金额_不含税')]: price(v.real_item_price_without_tax),
      _origin: v
    }
  })
}

// 异常商品表单
function generateAbnormalData (data, kIdMap) {
  // 异常表单 = 退货商品 + 异常商品
  return _.map(data.abnormals.concat(data.refunds), v => {
    return {
      [i18next.t('异常原因')]: v.type_text,
      [i18next.t('异常描述')]: v.text,
      [i18next.t('异常数量')]: v.amount_delta,
      [i18next.t('异常金额')]: price(v.money_delta),
      ...kIdMap[v.detail_id], // 异常商品的商品信息
      _origin: v
    }
  })
}

// 商品分类统计
function generateCounter (groupByCategory1) {
  return _.map(groupByCategory1, (o, k) => ({ text: k, len: o.length }))
}

function order (data) {
  // 商品按分类排序
  const sortByCategory1 = _.sortBy(data.details, v => v.category_title_1)

  /* ----------- 普通订单  ------------ */
  const kOrders = generateOrderData(sortByCategory1)

  // 商品map
  const kIdMap = _.reduce(kOrders, (res, cur) => {
    res[cur._origin.id] = cur
    return res
  }, {})

  // 按一级分类分组
  const groupByCategory1 = _.groupBy(kOrders, v => v._origin.category_title_1)

  /* -------- 单列分类商品 和 一行展示两商品的分类的表单 ------- */
  let kCategory = []
  let kCategoryMulti = []
  _.forEach(groupByCategory1, (value, key) => {
    // 分类小计
    let total = Big(0)
    _.each(value, v => (total = total.plus(v._origin.real_item_price)))
    const categoryTotal = {
      _special: {
        text: i18next.t(
          /* src:`${key}小计：${total.valueOf()}` => tpl:${VAR1}小计：${VAR2} */'KEY10',
          { VAR1: key, VAR2: total.toFixed(2) }
        )
      }
    }

    // 单列分类商品
    kCategory = kCategory.concat(value, categoryTotal)

    // 双栏商品
    kCategoryMulti = kCategoryMulti.concat(generateMultiData(value, categoryTotal))
  })

  return {
    common: generateCommon(data),
    _upperPrice: generateUpperPrice(data),
    _counter: generateCounter(groupByCategory1), // 分类商品统计
    _table: {
      orders: kOrders, // 商品
      orders_multi: generateMultiData(kOrders), // 一行展示两商品的普通订单
      orders_category: kCategory, // 分类的商品
      orders_category_multi: kCategoryMulti, // 分类的多列的商品
      abnormal: generateAbnormalData(data, kIdMap) // 异常明细
    },
    _origin: data
  }
}

export default order
