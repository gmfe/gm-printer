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

    '税额_基本单位': '', // 商品税额（基本单位）加总, 由下面的函数算
    '税额_销售单位': '',

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

function toKey (data) {
  // 商品按分类排序
  const sortByCategory = _.sortBy(data.details, v => v.category_title_1)
  // 普通订单
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
      '出库数_销售单位': v.sale_ratio === 1 ? v.real_weight_std
        : parseFloat(Big(v.real_weight).div(v.sale_ratio).toFixed(2)) + v.sale_unit_name,

      '税率': v.tax_rate ? Big(v.tax_rate).div(100).toFixed(2) + '%' : 0,
      '不含税单价_基本单位': v.sale_price_without_tax || 0,
      '不含税单价_销售单位': v.sale_price_without_tax ? Big(v.sale_price_without_tax).div(v.sale_ratio || 1).toFixed(2) : 0,
      '商品税额_基本单位': v.tax || 0,
      '商品税额_销售单位': v.tax ? Big(v.tax).div(v.sale_ratio).toFixed(2) : 0, // TODO 后台重新提供

      '单价_基本单位': v.std_sale_price,
      '单价_销售单位': v.sale_price,
      '原单价': v, // TODO 报价单价格

      '应付金额': v.real_item_price,
      '应付金额_不含税': v.real_item_price_without_tax,

      '自定义编码': v.outer_id,
      '商品描述': v.desc,
      '备注': v.remark, // 商品备注

      _origin: v
    }
  })

  const kIdMap = {}
  let taxSumStd = Big(0)
  let taxSumSale = Big(0)
  _.each(kOrders, kSku => {
    kIdMap[kSku._origin.id] = kSku

    taxSumSale = taxSumSale.plus(kSku['商品税额_销售单位'])
    taxSumStd = taxSumStd.plus(kSku['商品税额_基本单位'])
  })

  // 异常明细
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

  // 分类数量
  const counter = _.map(group, (o, k) => ({ text: k, len: o.length }))

  let kCategory = []
  _.forEach(group, (value, key) => {
    kCategory = kCategory.concat(value)

    let total = Big(0)
    _.each(value, v => (total = total.plus(v._origin.real_item_price)))

    kCategory.push({
      _special: {
        category_title_1: key,
        total: total.valueOf()
      }
    })
  })

  return {
    ...generateOrder(data),
    _counter: counter,
    _table: {
      orders: kOrders,
      category: kCategory,
      abnormal: kAbnormal
    },
    _origin: data
  }
}

export {
  toKey
}
