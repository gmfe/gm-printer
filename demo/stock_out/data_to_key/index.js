import _ from 'lodash'
import Big from 'big.js'
import { MULTI_SUFFIX } from '../../../src'
import moment from 'moment'
import i18next from '../../../locales'
import { isNumber, outStockStatusMap, coverDigit2Uppercase } from '../../util'

const Price = {
  getUnit () {
    return '元'
  }
}

const typeEnum = {
  normal: 'normal',
  multi: 'multi',
  multi_quantity: 'multi_quantity',
  multi_money: 'multi_money',
  multi_quantity_money: 'multi_quantity_money',
  multi_vertical: 'multi_vertical',
  multi_vertical_quantity: 'multi_vertical_quantity',
  multi_vertical_money: 'multi_vertical_money',
  multi_vertical_quantity_money: 'multi_vertical_quantity_money',
  quantity: 'quantity',
  money: 'money',
  quantity_money: 'quantity_money'
}

// 非表格数据
function generateCommon(data) {
  return {
    出库时间: data.out_stock_time,
    单据编号: data.id,
    商户名: data.out_stock_target,
    单据备注: data.out_stock_remark,
    打印时间: moment().format('YYYY-MM-DD HH:mm:ss'),
    出库单状态: outStockStatusMap[data.status],
    最后操作时间: data.last_operate_time,
    打单人: data.name,
    建单人: data.creator,
    成本金额:
      data.money && data.money !== '-' ? data.money + Price.getUnit() : '-'
  }
}

/**
 * 生成双栏商品展示数据
 * @param list
 * @param categoryTotal
 * @return {Array}
 */
function generateMultiData(list) {
  const multiList = [] // 假设skuGroup=[{a:1},{a:2},{a:3},{a:4}],转化为[{a:1,a#2:3},{a:2,a#2:4}]
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

  return multiList
}

function generateMultiData2(list) {
  const multiList = [] // 假设skuGroup = [{a:1},{a:2},{a:3},{a:4}],转化为[{a:1,a#2:3},{a:2,a#2:4}]
  const skuGroup = list

  let index = 0
  const len = skuGroup.length
  const middle = Math.ceil(len / 2)

  while (index < middle) {
    const sku1 = skuGroup[index]
    const sku2 = {}
    _.each(skuGroup[middle + index], (val, key) => {
      sku2[key + MULTI_SUFFIX] = val
    })

    multiList.push({
      ...sku1,
      ...sku2
    })

    index += 1
  }

  return multiList
}

function getOutNum(item) {
  const {
    clean_food,
    batch_details,
    std_unit_name,
    real_std_count,
    quantity,
    sale_unit_name
  } = item

  let amount = 0

  if (clean_food) {
    _.forEach(batch_details, l => {
      amount = Big(amount || 0)
        .plus(l.out_stock_base)
        .toFixed(2)
    })
  } else {
    amount = parseFloat(Big(real_std_count || 0).toFixed(2))
  }

  return {
    baseUnit: isNumber(amount) && std_unit_name ? amount + std_unit_name : '-',
    saleUnit:
      isNumber(quantity) && sale_unit_name ? quantity + sale_unit_name : '-'
  }
}

function getOutPrice(item) {
  const { sale_price, std_unit_name, sale_unit_name, sale_ratio } = item
  if (!sale_price && +sale_price !== 0) {
    return {
      baseUnit: '-',
      saleUnit: '-'
    }
  }
  return {
    baseUnit:
      Big(sale_price || 0)
        .div(100)
        .toFixed(2) +
      Price.getUnit() +
      '/' +
      std_unit_name,
    saleUnit:
      Big(sale_price || 0)
        .times(sale_ratio)
        .div(100)
        .toFixed(2) +
      Price.getUnit() +
      '/' +
      sale_unit_name
  }
}

const getTableData = (data, type) => {
  const ordinary = _.map(data.details, (item, index) => {
    const outNum = getOutNum(item)
    const outPrice = getOutPrice(item)
    return {
      批次号: index + 1,
      商品编号: item.spu_id,
      规格编号: item.id,
      商品名称: item.name,
      规格: !item.sale_ratio
        ? '-'
        : parseFloat(
            Big(item.std_ratio)
              .mul(item.sale_ratio)
              .toFixed(2)
          ) +
          item.std_unit_name +
          '/' +
          item.sale_unit_name,
      商品分类: item.category,
      操作人: item.creator,
      // 单位
      出库单位_基本单位: item.std_unit_name,
      出库单位_销售单位: item.sale_unit_name,
      // 数量
      出库数_基本单位: outNum.baseUnit,
      出库数_销售单位: outNum.saleUnit,
      // 金额
      出库成本价_基本单位: outPrice.baseUnit,
      出库成本价_销售单位: outPrice.saleUnit,
      成本金额:
        item.money || item.money === 0
          ? Big(item.money || 0)
              .div(100)
              .toFixed(2) + Price.getUnit()
          : '-',
      采购金额_不含税: item.purchase_money_no_tax,
      进项税率: item.tax_rate,
      进项税额: item.tax_money
    }
  })
  const sumMoney = Big(
    _.reduce(data.details, (a, b) => a + parseFloat(b.money) || 0, 0)
  ).toFixed(2)
  const sumQuantity = Big(
    _.reduce(data.details, (a, b) => a + b.quantity, 0)
  ).toFixed(2)
  const kOrdersMulti = generateMultiData(ordinary)
  const kOrdersMultiVertical = generateMultiData2(ordinary)
  const skuTotalObj = {
    _special: {
      text: `${i18next.t('出库数小计')}：${sumQuantity}`
    }
  }
  const sumMoneyObj = {
    _special: {
      text: `${i18next.t('出库金额小计')}：${sumMoney}`,
      upperCaseText: `${i18next.t(
        '出库金额小计'
      )}：${sumMoney}:${coverDigit2Uppercase(sumMoney)}`
    }
  }
  switch (type) {
    case typeEnum.normal:
      return ordinary
    case typeEnum.multi:
      return kOrdersMulti
    case typeEnum.multi_quantity:
      kOrdersMulti.push({
        ...sumMoneyObj
      })
      return kOrdersMulti
    case typeEnum.multi_money:
      kOrdersMulti.push({
        ...skuTotalObj
      })
      return kOrdersMulti
    case typeEnum.multi_quantity_money:
      kOrdersMulti.push(
        {
          ...skuTotalObj
        },
        {
          ...sumMoneyObj
        }
      )
      return kOrdersMulti
    case typeEnum.multi_vertical:
      return kOrdersMultiVertical
    case typeEnum.multi_vertical_quantity:
      kOrdersMultiVertical.push({
        ...sumMoneyObj
      })
      return kOrdersMultiVertical
    case typeEnum.multi_vertical_money:
      kOrdersMultiVertical.push({
        ...skuTotalObj
      })
      return kOrdersMultiVertical
    case typeEnum.multi_vertical_quantity_money:
      kOrdersMultiVertical.push(
        {
          ...skuTotalObj
        },
        {
          ...sumMoneyObj
        }
      )
      return kOrdersMultiVertical
    case typeEnum.quantity:
      ordinary.push({
        ...skuTotalObj
      })
      return ordinary
    case typeEnum.money:
      ordinary.push({
        ...sumMoneyObj
      })
      return ordinary
    case typeEnum.quantity_money:
      ordinary.push(
        {
          ...skuTotalObj
        },
        {
          ...sumMoneyObj
        }
      )
      return ordinary
  }
}

const formatData = data => {
  return {
    common: {
      ...generateCommon(data)
    },
    _table: {
      orders: getTableData(data, 'normal'), // 普通
      orders_multi: getTableData(data, 'multi'), // 双栏
      orders_multi_quantity: getTableData(data, 'multi_quantity'), // 双栏 + 入库数
      orders_multi_money: getTableData(data, 'multi_money'), // 双栏 + 入库金额
      orders_multi_quantity_money: getTableData(data, 'multi_quantity_money'), // 双栏 + 入库金额 + 入库数
      orders_multi_vertical: getTableData(data, 'multi_vertical'), // 双栏（纵向）
      orders_multi_quantity_vertical: getTableData(
        data,
        'multi_vertical_quantity'
      ), // 双栏（纵向） + 入库数
      orders_multi_money_vertical: getTableData(data, 'multi_vertical_money'), // 双栏（纵向） + 入库金额
      orders_multi_quantity_money_vertical: getTableData(
        data,
        'multi_vertical_quantity_money'
      ), // 双栏（纵向） + 入库金额 + 入库数
      orders_quantity: getTableData(data, 'quantity'),
      orders_money: getTableData(data, 'money'),
      orders_quantity_money: getTableData(data, 'quantity_money')
    },
    _origin: data
  }
}

export default formatData
