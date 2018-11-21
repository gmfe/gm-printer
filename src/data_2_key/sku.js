import _ from 'lodash'
import moment from 'moment'

function sku (data) {
  // 司机装车信息(分拣方式: 八卦, 统配) => 只打印统配的!
  const skuList = _.filter(data.sku_detail, o => o.sort_name === '统配')
  const skuListAfterSort = _.sortBy(skuList, ['category_1_id', 'category_2_id'])
  const skuGroup = _.groupBy(skuListAfterSort, 'category_1_name')

  /* --------- 分类商品统计 ---------------- */
  const counter = _.map(skuGroup, (o, k) => ({text: k, len: o.length}))

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

  const common = {
    '配送司机': data.driver_name || '-',
    '车牌号': data.car_num || '-',
    '联系方式': data.driver_phone || '-',
    '打印时间': moment().format('YYYY-MM-DD HH:mm:ss')
  }

  return {
    common,
    _counter: counter,
    _table: {
      driver_sku: driverSku
    },
    _origin: data
  }
}

export default sku
