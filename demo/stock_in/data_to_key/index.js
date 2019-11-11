import _ from 'lodash'
import i18next from '../../../locales'
import Big from 'big.js'
import { coverDigit2Uppercase } from '../../util'
import { MULTI_SUFFIX } from '../../../src'

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
    [i18next.t('往来单位')]: data.supplier_name,
    [i18next.t('单据日期')]: data.submit_time,
    [i18next.t('单据编号')]: data.id,
    [i18next.t('单据备注')]: data.remark,
    [i18next.t('打单人')]: data.print_operator,
    [i18next.t('打印时间')]: data.print_time,
    [i18next.t('折让金额')]: data.delta_money || 0,
    [i18next.t('商品金额')]: data.sku_money || 0,
    [i18next.t('整单金额')]: Big(data.delta_money || 0)
      .plus(data.sku_money || 0)
      .toFixed(2)
  }
}

/**
 * 生成双栏商品展示数据
 * @param list
 * @param categoryTotal
 * @return {Array}
 */
function generateMultiData(list) {
  let multiList = [] // 假设skuGroup=[{a:1},{a:2},{a:3},{a:4}],转化为[{a:1,a#2:3},{a:2,a#2:4}]
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
  let multiList = [] // 假设skuGroup = [{a:1},{a:2},{a:3},{a:4}],转化为[{a:1,a#2:3},{a:2,a#2:4}]
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

const getTableData = (data, type) => {
  const ordinary = _.map(data.details, (item, index) => {
    const purchase_unit_quantity = Big(item.quantity || 0).div(item.ratio)
    return {
      [i18next.t('批次号')]: index + 1,
      [i18next.t('规格ID')]: item.id,
      [i18next.t('商品名称')]: item.name,
      [i18next.t('商品分类')]: item.category,
      [i18next.t('入库单位_基本单位')]: item.std_unit,
      [i18next.t('入库单位_包装单位')]: item.purchase_unit,
      [i18next.t('入库数_基本单位')]: item.quantity,
      [i18next.t('入库单价_基本单位')]:
        item.unit_price !== null ? Big(item.unit_price).toFixed(2) : '',
      [i18next.t('入库金额')]:
        item.money !== null ? Big(item.money).toFixed(2) : '',
      [i18next.t('商品备注')]: item.remark,
      [i18next.t('商品ID')]: item.spu_id,
      [i18next.t('最高入库单价')]:
        item.max_stock_unit_price !== null
          ? Big(item.max_stock_unit_price).toFixed(2)
          : '',
      [i18next.t('入库数_包装单位')]: purchase_unit_quantity.toFixed(2),
      [i18next.t('入库单价_包装单位')]:
        +purchase_unit_quantity.toFixed() === 0
          ? ''
          : Big(item.money || 0)
              .div(purchase_unit_quantity)
              .toFixed(2),
      [i18next.t('操作人')]: item.operator,
      [i18next.t('存放货位')]: item.shelf_name,
      [i18next.t('保质期')]: item.life_time,
      [i18next.t('生产日期')]: item.production_time,
      [i18next.t('补差金额')]:
        item.different_price !== null
          ? Big(item.different_price).toFixed(2)
          : ''
    }
  })
  const sumMoney = Big(
    _.reduce(data.details, (a, b) => a + parseFloat(b.money), 0)
  ).toFixed(2)
  const sumQuantity = _.reduce(data.details, (a, b) => a + b.quantity, 0)
  const kOrdersMulti = generateMultiData(ordinary)
  const kOrdersMultiVertical = generateMultiData2(ordinary)
  const skuTotalObj = {
    _special: {
      text: `${i18next.t('入库数小计')}：${sumQuantity}`
    }
  }
  const sumMoneyObj = {
    _special: {
      text: `${i18next.t('入库金额小计')}：${sumMoney}`,
      upperCaseText: `${i18next.t('入库金额小计')}：${sumMoney}${i18next.t(
        '大写'
      )}:${coverDigit2Uppercase(sumMoney)}`
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

const generateUpperPrice = data => {
  return {
    [i18next.t('折让金额_大写')]: coverDigit2Uppercase(data.delta_money || 0),
    [i18next.t('商品金额_大写')]: coverDigit2Uppercase(data.sku_money || 0),
    [i18next.t('整单金额_大写')]: coverDigit2Uppercase(
      Big(data.delta_money || 0)
        .plus(data.sku_money || 0)
        .toFixed(2)
    )
  }
}

const formatData = data => {
  return {
    common: {
      ...generateCommon(data),
      ...generateUpperPrice(data)
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
