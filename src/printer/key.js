import _ from 'lodash'

function toKey (data, options) {
  const idMap = {}
  _.each(data.details, sku => {
    idMap[sku.id] = sku
  })

  // TODO
  const kAbnormal = _.map(data.abnormals.concat(data.refunds), v => {
    return {
      _original: {
        ...v,
        ...idMap[v.detail_id]
      }
    }
  })

  const kOrders = _.map(data.details, v => {
    return {
      _original: v
    }
  })

  const kCategory = []

  return {
    orders: kOrders,
    category: kCategory,
    abnormal: kAbnormal,
    _original: data
  }
}

export {
  toKey
}
