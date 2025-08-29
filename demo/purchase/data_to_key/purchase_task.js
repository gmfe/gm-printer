import moment from 'moment'
import _ from 'lodash'
import i18next from '../../../locales'
import Big from 'big.js'
import {
  money,
  toFixed2,
  getSpecialTable,
  getPurchaseIndependentRolSku,
  getPurchaseIndependentRolAddress
} from './util'
import {convertNumber2Sid, coverDigit2Uppercase} from '../../util'

const Price = {
  getUnit () {
    return '元'
  }
}

function generateTable (tasks) {
  return tasks.map((task, index) => {
    // 打印会汇集相同商品的记录，计划采购是总和，每个商品对应的库存相同。建议采购的值：总和计划 - 库存（自己算）
    let suggestPurchase = ''
    if (Number(task.stock) < 0) {
      suggestPurchase = `${Big(task.plan_purchase_amount).toFixed(2)}${task.std_unit_name}`
    } else {
      suggestPurchase = Number(task.suggest_purchase_num) > 0
        ? `${Big(task.suggest_purchase_num).toFixed(2)}${task.std_unit_name}`
        : i18next.t('库存充足')
    }

    return {
      [i18next.t('序号')]: ++index,

      [i18next.t('商品名称')]: task.sku_name,
      [i18next.t('单价_基本单位')]: '',
      [i18next.t('单价_采购单位')]: '',

      [i18next.t('一级分类')]: task.category1_name,
      [i18next.t('二级分类')]: task.category2_name,
      [i18next.t('品类')]: task.pinlei_name,

      [i18next.t('参考成本')]: `${task.price ? money(task.price) : 0}${Price.getUnit() + '/'}${task.std_unit_name}`,
      [i18next.t('规格')]: `${task.sale_ratio}${task.std_unit_name}/${task.sale_unit_name}`,
      [i18next.t('库存')]: toFixed2(task.stock),
      [i18next.t('建议采购')]: suggestPurchase,

      [i18next.t('采购单位')]: task.sale_unit_name,
      [i18next.t('基本单位')]: task.std_unit_name,

      [i18next.t('计划采购_基本单位')]: toFixed2(task.plan_purchase_amount),
      [i18next.t('计划采购_采购单位')]: Big(task.plan_purchase_amount).div(task.sale_ratio).toFixed(2),

      [i18next.t('实采_基本单位')]: '',
      [i18next.t('实采_采购单位')]: '',

      [i18next.t('预采购金额')]: money(Big(task.plan_purchase_amount).times(task.price || 0)),
      [i18next.t('采购金额')]: '',

      __details: task.addresses.map(o => {
        return {
          [i18next.t('分拣序号')]: o.sort_id || '-',
          [i18next.t('商户名')]: o.res_name || '-',
          [i18next.t('商户ID')]: convertNumber2Sid(o.address_id) || '-',
          [i18next.t('采购数量_基本单位')]: toFixed2(o.plan_purchase_amount),
          [i18next.t('采购数量_采购单位')]: Big(o.plan_purchase_amount).div(task.sale_ratio).toFixed(2),
          [i18next.t('商品备注')]: o.remark,

          [i18next.t('采购单位')]: task.sale_unit_name,
          [i18next.t('基本单位')]: task.std_unit_name
        }
      }),
      _origin: task
    }
  })
}

function purchaseTask (data) {
  const { purchaser, station_name, settle_supplier_name, customer_id, tasks = [] } = data

  let purchase_money = Big(0)
  _.each(tasks, task => {
    task.plan_purchase_amount = _.reduce(task.addresses, (sum, addr) => (sum + addr.plan_purchase_amount), 0)
    purchase_money = Big(task.plan_purchase_amount).times(task.price || 0).plus(purchase_money)
  })

  const common = {
    [i18next.t('当前时间')]: moment().format('YYYY-MM-DD HH:mm:ss'),

    [i18next.t('采购员')]: purchaser?.length ? purchaser.map(o => o.purchaser_name).join(',') : '-',
    [i18next.t('采购单位')]: station_name,

    [i18next.t('供应商')]: settle_supplier_name,
    [i18next.t('供应商编号')]: customer_id, // 这个后台变量名很搞

    [i18next.t('预采购金额')]: money(purchase_money),
    [i18next.t('采购金额')]: '',

    [i18next.t('任务数')]: tasks.length
  }

  const purchase_independent_rol_sku = getPurchaseIndependentRolSku(
    tasks,
    'task'
  )
  const purchase_independent_rol_address = getPurchaseIndependentRolAddress(
    tasks,
    'task'
  )

  const normalTable = generateTable(tasks)

  // 按一级分类分组
  const groupByCategory1 = _.groupBy(
    normalTable,
    v => v._origin.category1_name
  )
  let kCategory = []
  let index = 1
  _.forEach(groupByCategory1, (value, key) => {
    // 分类小计
    const list = _.map(value, sku => {
      return {
        ...sku,
        [i18next.t('序号')]: index++
      }
    })

    // 分类计数
    const categoryTotal = {
      _special: {
        text: '分类总数：' + list.length
      }
    }

    /* -------- 分类  ------------- */
    kCategory = kCategory.concat(list, [categoryTotal])
  })

  return {
    common,
    _table: {
      purchase_no_detail_category: kCategory, // 分类
      purchase_no_detail: normalTable, // 无明细
      purchase_last_col: normalTable, // 明细:单列-总表最后一列
      purchase_one_row: normalTable.reduce((arr, task) => [...arr, task, { _special: { list: task.__details, type: 'separator' } }], []), // 明细: 当行-总表下方一行
      purchase_flex_2: getSpecialTable(normalTable, 2, 'flex'), // 明细: 两栏-总表下方一行两栏
      purchase_flex_4: getSpecialTable(normalTable, 4, 'flex'), // 明细: 四栏-总表下方一行四栏

      purchase_detail_one_row: normalTable, // 明细按采购明细单行 无明细字段
      purchase_independent_rol_sku, // 明细按采购明细单行 商品排序 且有明细字段
      purchase_independent_rol_address, // 明细按采购明细单行 按商户排序 有明细字段
    }
  }
}

export default purchaseTask
