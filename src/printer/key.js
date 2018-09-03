import _ from 'lodash'
import moment from 'moment'

// TODO 超明

function toKey (data, options) {
  // what
  // child_sort_id
  // source_origin_id

  const Order = {
    '订单号': data.id,
    '序号': `${data.sort_id} ${data.child_sort_id}`,
    '下单时间': moment(data.date_time).format('YYYY-MM-DD HH:mm:ss'),
    '配送时间': `${moment(data.receive_begin_time).format('MM-DD HH:mm:ss')} ~ ${moment(data.receive_end_time).format('MM-DD HH:mm:ss')}`,

    '下单金额': data.total_price,
    '出库金额': data.real_price,
    '运费': data.freight,
    '异常金额': data.abnormal_money,
    '应付金额': data.total_pay,

    '订单备注': data.remark,

    '收货人': data.receiver_name,
    '收货人电话': data.receiver_phone,
    '收货地址': data.address,
    '收货商户': data.resname,
    '收货商户ID': data.sid,

    '地理标签': `${data.area_sign || ''}`,
    '城市': `${data.city}`,

    '商户公司': data.cname,
    '承运商': data.carrier,

    '司机名称': data.driver_name,
    '司机电话': data.driver_phone,

    '结款方式': data.settle_way // TODO
  }

  const Other = {
    '当前时间': moment().format('YYYY-MM-DD HH:mm:ss')
  }

  const kOrders = _.map(data.details, (v, index) => {
    return {
      '序号': index + 1,
      '类别': v.category_title_1,
      '商品名': (v.real_is_weight && !v.is_weight) ? `*${v.name}` : v.name,
      '规格': '', // TODO
      '单价_基本单位': '', // TODO
      '下单数': v.quantity,
      '出库数_基本单位': `${v.real_weight}${v.std_unit_name}`,
      '出库数_销售单位': '', // TODO
      '应付金额': v.real_item_price,
      _original: v
    }
  })

  const idMap = {}
  _.each(data.details, sku => {
    idMap[sku.id] = sku
  })

  const kIdMap = {}
  _.each(kOrders, kSku => {
    kIdMap[kSku._original.id] = kSku
  })

  const kAbnormal = _.map(data.abnormals.concat(data.refunds), v => {
    return {
      '异常原因': v.type_text,
      '异常描述': v.text,
      '异常数量': v.amount_delta,
      '异常金额': v.money_delta,
      ...kIdMap[v.detail_id],
      _original: {
        ...v,
        ...idMap[v.detail_id]
      }
    }
  })

  // TODO
  const kCategory = []

  return {
    ...Order,
    ...Other,
    _table: {
      orders: kOrders,
      category: kCategory,
      abnormal: kAbnormal
    },
    _original: data
  }
}

export {
  toKey
}
