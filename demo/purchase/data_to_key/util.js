import Big from 'big.js'
import _ from 'lodash'
import moment from 'moment'
import { convertNumber2Sid } from '../../util'

export const money = n =>
  Big(n)
    .div(100)
    .toFixed(2)

export const toFixed2 = n => Big(n).toFixed(2)

export const getSpecialTable = (normalTable, size, type) =>
  normalTable.reduce((arr, task) => {
    const specialList = _.chunk(task.__details, size).map(list => ({
      _special: { list, type, fixedSize: size }
    }))
    return [...arr, task, ...specialList]
  }, [])

// 按商品排序并合并相同项
export function sortAndMergeBySkuName(data, type) {
  const nameKey = type === 'bill' ? 'spec_name' : 'sku_name'

  return mergeCell([...data], nameKey)
}

// 按商户排序
export function sortAndMergeByAddressId(data) {
  return mergeCell([...data], 'address_id')
}

// 合并单元格
function mergeCell(list, key) {
  let temp = -1
  let rowSpan = 1
  for (let i = 0; i < list.length; i++) {
    const item = list[i]._origin
    const value = item[key]
    if (value !== temp) {
      temp = value
      const firstIndex = i ? i - rowSpan : 0
      // console.log('==> list firstIndex:', firstIndex, rowSpan, temp);
      list[firstIndex]._origin.rowSpan = rowSpan

      rowSpan = 1
      item.rowSpan = rowSpan
      continue
    }
    item.rowSpan = -1
    rowSpan += 1

    // 最后几个商品是一样的
    if (i === list.length - 1 && rowSpan > 1) {
      list[i + 1 - rowSpan]._origin.rowSpan = rowSpan
    }
  }

  return list
}

function generateTable2(tasks, mergeCellList, type, isMerchant = false) {
  const list = []

  const config =
    type === 'task'
      ? {
          key: 'addresses',
          getDetailsRecord: (o, task) => getTaskDetailsRecord(o, task),
          getDefaultColumn: (task, index) => getTaskDefaultColumn(task, index)
        }
      : {
          key: 'address',
          getDetailsRecord: (o, task) => getBillDetailsRecord(o, task),
          getDefaultColumn: (task, index) => getBillDefaultColumn(task, index)
        }

  // 商户排序
  if (isMerchant && type === 'task') {
    // 后端给的数据奇奇怪怪，搞了一下午，兼容不动，
    // 才让改成这种的，先这样写着吧，
    tasks.map((task, index) => {
      const detailRecord = config.getDetailsRecord(task, task)

      list.push({
        ...config.getDefaultColumn(task, index),
        ...detailRecord,
        明细数: '1', // 手动改吧
        _origin: { ...task }, // [`_${ config.key }`]: {...o},
        _mergeCell: mergeCellList
      })
    })
  } else {
    tasks.map((task, index) => {
      task[config.key].map(o => {
        const detailRecord = config.getDetailsRecord(o, task)

        list.push({
          ...config.getDefaultColumn(task, index),
          ...detailRecord,
          _origin: { ...task, ...o }, // [`_${ config.key }`]: {...o},
          _mergeCell: mergeCellList
        })
      })
    })
  }

  return list
}

/**
 *  备注：
 *  采购来源 和 之前的不同
 *  商户的明细数 手动修改 默认为 1
 *
 */
// 获取 bill details
function getBillDetailsRecord(o, task) {
  return {
    分拣序号: o.sort_id || '-',
    商户名: o.res_name || '-',
    商户ID: convertNumber2Sid(o.address_id) || '-',
    商户自定义编码: o.res_custom_code || '-',
    采购数量_基本单位: parseFloat(toFixed2(o.plan_amount)),
    计划采购数量_基本单位: parseFloat(toFixed2(o.plan_amount)),
    采购数量_采购单位: parseFloat(
      Big(o.plan_amount)
        .div(task.ratio)
        .toFixed(2)
    ),
    计划采购数量_采购单位: parseFloat(
      Big(o.plan_amount)
        .div(task.ratio)
        .toFixed(2)
    ),
    商品备注: o.remark,
    采购来源: o?.source_type || '',
    关联订单号: o?.related_orders || '-',
    线路: o?.route_name || '-',

    采购单位: task.purchase_unit_name,
    基本单位: task.std_unit_name,
    // domo 没有这个
    // 配送批次: DELIVERY_BATCH_MAP[o.delivery_batch] || '-',
    收货时间: o.receive_begin_time
      ? moment(o.receive_begin_time).format('YYYY-MM-DD HH:mm:ss') +
        (o.receive_end_time
          ? '-' + moment(o.receive_end_time).format('YYYY-MM-DD HH:mm:ss')
          : '')
      : ''
  }
}

// 获取 task details
function getTaskDetailsRecord(o, task) {
  return {
    分拣序号: o.sort_id || '-',
    商户名: o.res_name || '-',
    商户ID: convertNumber2Sid(o.address_id) || '-',
    商户自定义编码: o.res_custom_code || '-',
    采购数量_基本单位: parseFloat(toFixed2(o.plan_purchase_amount)),
    计划采购数量_基本单位: parseFloat(toFixed2(o.plan_purchase_amount)),
    采购数量_采购单位: parseFloat(
      Big(o.plan_purchase_amount)
        .div(task.sale_ratio)
        .toFixed(2)
    ),
    计划采购数量_采购单位: parseFloat(
      Big(o.plan_purchase_amount)
        .div(task.sale_ratio)
        .toFixed(2)
    ),
    商品备注: o.remark,

    采购单位: task.sale_unit_name,
    基本单位: task.std_unit_name,
    采购来源: o?.source_type || '',
    关联订单号: o?.related_orders || '-',
    线路: o?.route_name || '-',
    // domo 没有这个
    // 配送批次: DELIVERY_BATCH_MAP[o.delivery_batch] || '-',
    收货时间: o.receive_begin_time
      ? moment(o.receive_begin_time).format('YYYY-MM-DD HH:mm:ss') +
        (o.receive_end_time
          ? '-' + moment(o.receive_end_time).format('YYYY-MM-DD HH:mm:ss')
          : '')
      : ''
  }
}

function getBillDefaultColumn(task, index) {
  return {
    序号: ++index,

    商品名称: task.spec_name,
    单价_基本单位: `${money(task.purchase_price || 0)}`,
    单价_采购单位: `${money(Big(task.purchase_price || 0).times(task.ratio))}`,
    一级分类: task.category_name_1,
    二级分类: task.category_name_2,
    品类: task.pinlei_name,

    参考成本: `${task.ref_price ? money(task.ref_price) : 0} `,
    采购描述: task.description,
    采购备注: task.goods_remark,
    规格: `${task.ratio}${task.std_unit_name}/${task.purchase_unit_name}`,
    库存: parseFloat(toFixed2(task.stock)),
    建议采购: getSuggestPurchase(task),
    规格自定义编码: task?.outer_ids?.toString(),

    采购单位: task.purchase_unit_name,
    基本单位: task.std_unit_name,
    明细数: task.address.length,

    计划采购_基本单位: parseFloat(toFixed2(task.plan_amount)),
    计划采购_采购单位: parseFloat(
      Big(task.plan_amount)
        .div(task.ratio)
        .toFixed(2)
    ),

    实采_基本单位: parseFloat(toFixed2(task.already_purchased_amount)),
    实采_采购单位: parseFloat(
      Big(task.already_purchased_amount)
        .div(task.ratio)
        .toFixed(2)
    ),

    预采购金额: money(Big(task.purchase_price || 0).times(task.plan_amount)),
    采购金额: Big(task.purchase_money || 0).toFixed(2),
    采购金额_不含税: _.isNil(task.purchase_money_no_tax)
      ? '-'
      : task.purchase_money_no_tax,
    进项税率: _.isNil(task.tax_rate)
      ? '-'
      : `${Big(task.tax_rate)
          .div(100)
          .toFixed(2)}%`,
    进项税额: _.isNil(task.tax_money) ? '-' : task.tax_money
  }

  function getSuggestPurchase(task) {
    let suggestPurchase = ''
    if (task.customized_suggest_purchase_amount) {
      suggestPurchase = `${parseFloat(
        toFixed2(task.customized_suggest_purchase_amount)
      )}${task.std_unit_name}`
    } else if (Number(task.stock) < 0) {
      suggestPurchase = `${parseFloat(Big(task.plan_amount).toFixed(2))}${
        task.std_unit_name
      }`
    } else {
      const suggestPurchasing = Big(task?.plan_amount)
        .minus(task?.stock)
        .toFixed(2)
      suggestPurchase =
        Number(task?.stock) >= 0 && suggestPurchasing < 0
          ? '库存充足'
          : `${suggestPurchasing}${task?.std_unit_name}`

      // suggestPurchase =
      //   Number(suggest_purchase_num) > 0
      //     ? `${parseFloat(Big(suggest_purchase_num).toFixed(2))}${
      //         task.std_unit_name
      //       }`
      //     : '库存充足'
    }

    return suggestPurchase
  }
}

function getTaskDefaultColumn(task, index) {
  return {
    序号: ++index,

    商品名称: task.sku_name,
    单价_基本单位: '',
    单价_采购单位: '',

    一级分类: task.category1_name,
    二级分类: task.category2_name,
    品类: task.pinlei_name,

    参考成本: `${task.price ? money(task.price) : 0} `,
    采购描述: task.description,
    商品备注: task.goods_remark,
    规格: `${task.sale_ratio}${task.std_unit_name}/${task.sale_unit_name}`,
    库存: parseFloat(toFixed2(task.stock)),
    建议采购: getSuggestPurchase(task),
    规格自定义编码: task?.outer_ids?.toString(),

    采购单位: task.sale_unit_name,
    基本单位: task.std_unit_name,
    明细数: task.addresses.length,

    计划采购_基本单位: parseFloat(toFixed2(task.plan_purchase_amount)),
    计划采购_采购单位: parseFloat(
      Big(task.plan_purchase_amount)
        .div(task.sale_ratio)
        .toFixed(2)
    ),

    实采_基本单位: '',
    实采_采购单位: '',

    预采购金额: money(Big(task.plan_purchase_amount).times(task.price || 0)),
    采购金额: ''
  }

  function getSuggestPurchase(task) {
    // 打印会汇集相同商品的记录，计划采购是总和，每个商品对应的库存相同。建议采购的值：总和计划 - 库存（自己算）
    let suggestPurchase = ''
    if (task.customized_suggest_purchase_amount) {
      suggestPurchase = `${parseFloat(
        toFixed2(task.customized_suggest_purchase_amount)
      )}${task.std_unit_name}`
    } else if (Number(task.stock) < 0) {
      suggestPurchase = `${parseFloat(
        Big(task.plan_purchase_amount).toFixed(2)
      )}${task.std_unit_name}`
    } else {
      suggestPurchase =
        Number(task.suggest_purchase_num) > 0
          ? `${parseFloat(Big(task.suggest_purchase_num).toFixed(2))}${
              task.std_unit_name
            }`
          : '库存充足'
    }
    // if (Number(task.suggest_purchase_num) <= 0) {
    //   suggestPurchase = '库存充足'
    // }
    return suggestPurchase
  }
}

// 按商品排序并合并相同项
export const getPurchaseIndependentRolSku = (tasks, type = 'bill') => {
  // 基础字段
  const baseCell = [
    '序号',
    '规格',
    '一级分类',
    '品类',
    '采购描述',
    '明细数',
    '商品名称',
    '规格自定义编码',
    '二级分类',
    '参考成本',
    '采购备注'
  ]

  // 数量字段
  const numCell = [
    '库存',
    '计划采购_基本单位',
    '计划采购_采购单位',
    '实采_基本单位',
    '实采_采购单位',
    '建议采购'
  ]
  const priceCell = ['单价_基本单位', '单价_采购单位']
  // 金额字段
  const amountCell = [
    '预采购金额',
    '采购金额_不含税',
    '进项税额',
    '采购金额',
    '进项税率'
  ]
  // 商品排序合并单元格
  const goodsSortingMergeCell = [
    ...baseCell,
    ...numCell,
    ...priceCell,
    ...amountCell
  ]

  return sortAndMergeBySkuName(
    generateTable2([...tasks], goodsSortingMergeCell, type),
    type
  )
}

// 按商户排序合并单元格
export const getPurchaseIndependentRolAddress = (tasks, type = 'bill') => {
  // 商户排序合并单元格
  const merchantSortingMergeCell = ['商户名', '商户自定义编码', '商户ID']

  return sortAndMergeByAddressId(
    generateTable2([...tasks], merchantSortingMergeCell, type, true)
  )
}
