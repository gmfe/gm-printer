import moment from 'moment'
import _ from 'lodash'
import Big from 'big.js'

const SETTLE_WAY = {
  0: '先款后货',
  1: '先货后款'
}

/* i18n-scan-disable */
const coverDigit2Uppercase = (n) => {
  if (_.isNil(n) || _.isNaN(n)) {
    return '-'
  }

  const fraction = ['角', '分']

  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ]

  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]

  const head = n < 0 ? '欠' : ''

  n = Math.abs(n)

  let left = ''; let right = ''
  let i = 0
  for (i; i < fraction.length; i++) {
    right += digit[Math.floor(Big(n).times(Big(10).pow(i + 1)).mod(10).toString())] + fraction[i]
  }

  right = right.replace(/(零.)+$/, '').replace(/(零.)/, '零') || '整'

  n = Math.floor(n)

  for (i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    left = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + left
  }

  return head + (left.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零') + right).replace(/^整$/, '零元整')
}

/**
 * 生成多列商品展示数据
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
      sku2[key + '$2'] = val
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
  // 收货人信息分两种情况
  let customerInfo = {}
  const originCustomer = data.origin_customer
  if (originCustomer.origin_area && originCustomer.origin_area.name) {
    customerInfo = {
      '收货商户': `${originCustomer.origin_resname}(${originCustomer.address_id || '-'})`,
      '收货人': originCustomer.origin_receiver_name,
      '收货人电话': originCustomer.origin_receiver_phone,
      '收货地址': `${originCustomer.origin_area.first_name}-${originCustomer.origin_area.name}-${originCustomer.address}`
    }
  } else {
    customerInfo = {
      '收货商户': `${data.resname}(${data.sid || '-'})`,
      '收货人': data.receiver_name,
      '收货人电话': data.receiver_phone,
      '收货地址': `${data.address_sign === '未指定' ? data.address : data.address_sign + '|' + data.address}`
    }
  }

  return {
    '订单号': data.id,
    '序号': `${data.sort_id} ${data.child_sort_id}`,

    '下单时间': moment(data.date_time).format('YYYY-MM-DD HH:mm:ss'),
    '配送时间': `${moment(data.receive_begin_time).format('MM-DD HH:mm:ss')} ~ ${moment(data.receive_end_time).format('MM-DD HH:mm:ss')}`,
    '打印时间': moment().format('YYYY-MM-DD HH:mm:ss'), // 也就是当前时间
    '当前时间': moment().format('YYYY-MM-DD HH:mm:ss'),
    '订单备注': data.remark,

    '下单金额': data.total_price,
    '出库金额': data.real_price,
    '运费': data.freight,
    '异常金额': data.abnormal_money,
    '应付金额': data.total_pay,

    '税额_基本单位': data.total_tax, // 商品税额（基本单位）加总
    '税额_销售单位': data.total_sale_unit_tax,

    '商户公司': data.cname,
    '承运商': data.carrier,
    '结款方式': SETTLE_WAY[data.settle_way],

    '线路': data.address_route_name,
    '地理标签': data.area_sign || '-',
    '城市': data.city || '-',
    '城区': data.area_l1 || '-',
    '街道': data.area_l2 || '-',

    '司机名称': data.driver_name,
    '司机电话': data.driver_phone,
    '销售经理': data.sale_manager.name || '-',
    '销售经理电话': data.sale_manager.phone || '-',

    // 收货人信息
    ...customerInfo
  }
}

// 大写金额数据
function generateUpperPrice (data) {
  return {
    '下单金额_大写': coverDigit2Uppercase(data.total_price),
    '出库金额_大写': coverDigit2Uppercase(data.real_price),
    '运费_大写': coverDigit2Uppercase(data.freight),
    '异常金额_大写': coverDigit2Uppercase(data.abnormal_money),
    '应付金额_大写': coverDigit2Uppercase(data.total_pay),

    '税额_基本单位_大写': coverDigit2Uppercase(data.total_tax), // 商品税额（基本单位）加总
    '税额_销售单位_大写': coverDigit2Uppercase(data.total_sale_unit_tax)
  }
}

// 普通订单数据
function generateOrderData (list) {
  return _.map(list, (v, index) => {
    return {
      '序号': index + 1,
      '商品ID': v.id,
      '商品名': (v.real_is_weight && !v.is_weight) ? `*${v.name}` : v.name,
      '类别': v.category_title_1,
      '商品二级分类': v.category_title_2,
      '商品品类': v.pinlei_title,
      'SPU名称': v.spu_name,
      '规格': v.std_unit_name === v.sale_unit_name && v.sale_ratio === 1 ? `按${v.sale_unit_name}`
        : `${v.sale_ratio}${v.std_unit_name}/${v.sale_unit_name}`,

      '下单数': v.quantity + v.sale_unit_name,
      '出库数_基本单位': `${v.real_weight}${v.std_unit_name}`,
      '出库数_销售单位': v.sale_ratio === 1 ? v.real_weight
        : parseFloat(Big(v.real_weight).div(v.sale_ratio).toFixed(2)) + v.sale_unit_name,

      '税率': v.tax_rate ? Big(v.tax_rate).div(100).toFixed(2) + '%' : 0,
      '不含税单价_基本单位': v.sale_price_without_tax || 0,
      '不含税单价_销售单位': v.sale_price_without_tax ? Big(v.sale_price_without_tax).div(v.sale_ratio || 1).toFixed(2) : 0,
      '商品税额_基本单位': v.tax || 0,
      '商品税额_销售单位': v.sale_unit_tax || 0,

      '单价_基本单位': v.std_sale_price,
      '单价_销售单位': v.sale_price,
      '原单价': 'TODO后台提供', // TODO 报价单价格

      '应付金额': v.real_item_price,
      '应付金额_不含税': v.real_item_price_without_tax,

      '自定义编码': v.outer_id,
      '商品描述': v.desc,
      '备注': v.remark, // 商品备注

      _origin: v
    }
  })
}

// 异常商品表单
function generateAbnormalData (data, kIdMap) {
  // 异常表单 = 退货商品 + 异常商品
  return _.map(data.abnormals.concat(data.refunds), v => {
    const abnormal = {
      '异常原因': v.type_text,
      '异常描述': v.text,
      '异常数量': v.amount_delta,
      '异常金额': v.money_delta
    }
    return {
      ...kIdMap[v.detail_id], // 异常商品的商品信息
      ...abnormal,
      _origin: v,
      _abnormal: abnormal // editor_add_field用到这些字段
    }
  })
}

// 商品分类统计
function generateCounter (groupByCategory1) {
  return _.map(groupByCategory1, (o, k) => ({text: k, len: o.length}))
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
        text: `${key}小计: ${total.valueOf()}`
      }
    }

    // 单列分类商品
    kCategory = kCategory.concat(value, categoryTotal)

    // 多列商品
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
