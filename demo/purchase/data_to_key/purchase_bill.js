import moment from 'moment'
import i18next from '../../../locales'
import _ from 'lodash'
import Big from 'big.js'
import { money, toFixed2, getSpecialTable } from './util'
import {convertNumber2Sid, coverDigit2Uppercase} from '../../util'
const Price = {
  getUnit() {
    return '元'
  }
}

function generateTable(tasks) {
  return tasks.map((task, index) => {
    const suggest_purchase_num = task.suggest_purchase_num
    let suggestPurchase = ''
    if (Number(task.stock) < 0) {
      suggestPurchase = `${Big(task.plan_amount).toFixed(2)}${
        task.std_unit_name
      }`
    } else {
      suggestPurchase =
        Number(suggest_purchase_num) > 0
          ? `${Big(suggest_purchase_num).toFixed(2)}${task.std_unit_name}`
          : i18next.t('库存充足')
    }

    return {
      [i18next.t('序号')]: ++index,

      [i18next.t('商品名称')]: task.spec_name,
      [i18next.t('单价_基本单位')]: `${money(
        task.purchase_price || 0
      )}${Price.getUnit() + '/'}${task.std_unit_name}`,
      [i18next.t('单价_采购单位')]: `${money(
        Big(task.purchase_price || 0).times(task.ratio)
      )}${Price.getUnit() + '/'}${task.purchase_unit_name}`,

      [i18next.t('一级分类')]: task.category_name_1,
      [i18next.t('二级分类')]: task.category_name_2,
      [i18next.t('品类')]: task.pinlei_name,

      [i18next.t('参考成本')]: `${
        task.ref_price ? money(task.ref_price) : 0
      }${Price.getUnit() + '/'}${task.std_unit_name}`,
      [i18next.t(
        '规格'
      )]: `${task.ratio}${task.std_unit_name}/${task.purchase_unit_name}`,
      [i18next.t('库存')]: toFixed2(task.stock),
      [i18next.t('建议采购')]: suggestPurchase,

      [i18next.t('采购单位')]: task.purchase_unit_name,
      [i18next.t('基本单位')]: task.std_unit_name,

      [i18next.t('计划采购_基本单位')]: toFixed2(task.plan_amount),
      [i18next.t('计划采购_采购单位')]: Big(task.plan_amount)
        .div(task.ratio)
        .toFixed(2),

      [i18next.t('实采_基本单位')]: toFixed2(task.already_purchased_amount),
      [i18next.t('实采_采购单位')]: Big(task.already_purchased_amount)
        .div(task.ratio)
        .toFixed(2),

      [i18next.t('预采购金额')]: money(
        Big(task.purchase_price || 0).times(task.plan_amount)
      ),
      [i18next.t('采购金额')]: money(
        Big(task.purchase_price || 0).times(task.already_purchased_amount)
      ),

      __details: task.address.map(o => {
        return {
          [i18next.t('分拣序号')]: o.sort_id || '-',
          [i18next.t('商户名')]: o.res_name || '-',
          [i18next.t('商户ID')]: convertNumber2Sid(o.address_id) || '-',
          [i18next.t('采购数量_基本单位')]: toFixed2(o.plan_amount),
          [i18next.t('采购数量_采购单位')]: Big(o.plan_amount)
            .div(task.ratio)
            .toFixed(2),
          [i18next.t('商品备注')]: o.remark,

          [i18next.t('采购单位')]: task.purchase_unit_name,
          [i18next.t('基本单位')]: task.std_unit_name
        }
      }),
      _origin: task
    }
  })
}

function purchaseBill(data) {
  const { purchase_sheet, tasks } = data

  let plan_money = Big(0)
  let pur_money = Big(0)
  _.each(tasks, task => {
    if (task.plan_amount) {
      plan_money = Big(task.plan_amount)
        .times(task.purchase_price)
        .plus(plan_money)
    }
    if (task.already_purchased_amount) {
      pur_money = Big(task.already_purchased_amount)
        .times(task.purchase_price)
        .plus(pur_money)
    }
  })

  const common = {
    [i18next.t('当前时间')]: moment().format('YYYY-MM-DD HH:mm:ss'),

    [i18next.t('采购员')]: purchase_sheet.operator,
    [i18next.t('采购单位')]: purchase_sheet.station_name,

    [i18next.t('供应商')]: purchase_sheet.supplier_name,
    [i18next.t('供应商编号')]: purchase_sheet.customer_id, // 这个后台变量名很搞

    [i18next.t('预采购金额')]: money(plan_money),
    [i18next.t('采购金额')]: money(pur_money),

    [i18next.t('任务数')]: tasks.length
  }

  const normalTable = generateTable(tasks)

  // 按一级分类分组
  const groupByCategory1 = _.groupBy(
    normalTable,
    v => v._origin.category_name_1
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
      purchase_one_row: normalTable.reduce(
        (arr, task) => [
          ...arr,
          task,
          { _special: { list: task.__details, type: 'separator' } }
        ],
        []
      ), // 明细: 当行-总表下方一行
      purchase_flex_2: getSpecialTable(normalTable, 2, 'flex'), // 明细: 两栏-总表下方一行两栏
      purchase_flex_4: getSpecialTable(normalTable, 4, 'flex') // 明细: 四栏-总表下方一行四栏
    }
  }
}

export default purchaseBill
