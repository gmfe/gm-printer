import _ from 'lodash'
import moment from 'moment'
import Big from 'big.js'

const SETTLE_WAY = {
  0: '先款后货',
  1: '先货后款'
}

function generateOrder (data) {
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

function order (data) {
  // 商品按分类排序
  const sortByCategory = _.sortBy(data.details, v => v.category_title_1)

  /* ----------- 普通订单  ------------ */
  const kOrders = _.map(sortByCategory, (v, index) => {
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

  /* ----------- 一行2列普通订单 ---------- */
  const kOrdersMulti = generateMultiData(kOrders)

  const kIdMap = {}
  _.each(kOrders, kSku => {
    kIdMap[kSku._origin.id] = kSku
  })

  /* ------------ 异常明细 ----------- */
  const kAbnormal = _.map(data.abnormals.concat(data.refunds), v => {
    const abnormal = {
      '异常原因': v.type_text,
      '异常描述': v.text,
      '异常数量': v.amount_delta,
      '异常金额': v.money_delta
    }
    return {
      ...kIdMap[v.detail_id],
      ...abnormal,
      _origin: v,
      _abnormal: abnormal
    }
  })

  const group = _.groupBy(kOrders, v => v._origin.category_title_1)

  /* --------- 分类商品统计 ---------------- */
  const counter = _.map(group, (o, k) => ({ text: k, len: o.length }))

  /* -------- 单列分类商品 和 一行2列分类商品 ------- */
  let kCategory = []
  let kCategoryMulti = []
  _.forEach(group, (value, key) => {
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
    ...generateOrder(data),
    _counter: counter,
    _table: {
      orders: kOrders, // 商品
      orders_multi: kOrdersMulti, // 多列商品
      orders_category: kCategory, // 分类的商品
      orders_category_multi: kCategoryMulti, // 分类的多列的商品
      abnormal: kAbnormal // 异常明细
    },
    _origin: data
  }
}

function sku (data) {
  // 司机装车信息(分拣方式: 八卦, 统配) => 只打印统配的!
  const skuList = _.filter(data.sku_detail, o => o.sort_name === '统配')
  const skuListAfterSort = _.sortBy(skuList, ['category_1_id', 'category_2_id'])
  const skuGroup = _.groupBy(skuListAfterSort, 'category_1_name')

  /* --------- 分类商品统计 ---------------- */
  const counter = _.map(skuGroup, (o, k) => ({ text: k, len: o.length }))

  /* --------- 分类商品 -------------------- */
  function getDetail (sku) {
    const len = sku.customer_detail.length
    return _.flatten(_.map(sku.customer_detail, (customer, index) =>
      [
        `[${customer.sort_id || '-'}]${customer.customer_name}*`,
        customer.sku_amount,
        (index + 1) % 2 === 0 ? '\n' : len !== 1 && index !== len - 1 ? '+' : ''
      ]
    ))
  }

  let driverSku = []
  _.forEach(skuGroup, (skuArr, categoryName) => {
    const skuList = _.map(skuArr, sku => ({
      '商品名称': sku.sku_name || '-',
      '总计': sku.quantity + sku.std_unit || '-',
      '分类': sku.category_2_name || '-',
      '明细': getDetail(sku)
    }))
    // 每种分类的数量
    const groupLength = skuGroup[categoryName].length
    const categoryLen = {
      _special: {
        text: `${categoryName}: ${groupLength}`
      }
    }

    driverSku = driverSku.concat(skuList, categoryLen)
  })

  return {
    '配送司机': data.driver_name || '-',
    '车牌号': data.car_num || '-',
    '联系方式': data.driver_phone || '-',
    '打印时间': moment().format('YYYY-MM-DD HH:mm:ss'),
    _counter: counter,
    _table: {
      driver_sku: driverSku
    },
    _origin: data
  }
}

function task (data) {
  const taskList = _.sortBy(data.order_detail, 'sort_id')

  const driverTask = _.map(taskList, o => {
    return {
      '序号': o.sort_id || '-',
      '订单号': o.order_id || '-',
      '商户名': o.customer_name || '-',
      '收货地址': o.receive_address || '-',
      '收货时间': moment(o.receive_begin_time).format('MM/DD-HH:mm') + '~\n' + moment(o.receive_end_time).format('MM/DD-HH:mm'),
      '配送框数': '',
      '回收框数': '',
      '订单备注': ''
    }
  })

  return {
    '配送司机': data.driver_name || '-',
    '车牌号': data.car_num || '-',
    '联系方式': data.driver_phone || '-',
    '打印时间': moment().format('YYYY-MM-DD HH:mm:ss'),
    _table: {
      driver_task: driverTask
    },
    _origin: data
  }
}

function toKey (data) {
  switch (data.__gm_printer_data_type) {
    case 'order':
      return order(data)
    case 'sku':
      return sku(data)
    case 'task':
      return task(data)
    default:
      return console.log('没有此类型数据')
  }
}

export {
  toKey
}
