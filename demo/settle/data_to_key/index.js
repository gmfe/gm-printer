import _ from 'lodash'
import i18next from '../../../locales'
import Big from 'big.js'
import { coverDigit2Uppercase } from '../../util'
import moment from 'moment'

const REASON = {
  1: i18next.t('抹零'),
  2: i18next.t('供应商计算异常'),
  3: i18next.t('供应商折扣'),
  4: i18next.t('供应商罚款'),
  5: i18next.t('其他')
}

const TYPE = { 1: i18next.t('加钱'), 2: i18next.t('扣钱') }

const getTableData = (data, type, config) => {
  let result = null
  if (type === 'ordinary') {
    // 按submit_time 排序
    const sheets = data.sub_sheets.sort((a, b) => {
      return moment(a.submit_time).isAfter(moment(b.submit_time)) ? 1 : -1
    })

    // 按折让明细展开行：一个单据 N 条折让 = N 行，公共列(序号/单据类型/单据编号/金额/结算金额/入库时间)合并
    result = []
    let seq = 0

    sheets.forEach(item => {
      seq += 1
      const total_money = Big(item.sku_money || 0)
        .plus(item.delta_money)
        .div(100)
        .toFixed(2)
      const settle_money = Big(item.sku_money || 0)
        .plus(item.delta_money)
        .div(100)
        .toFixed(2)

      const total_money2 = item.type === 1 ? total_money : total_money * -1
      const settle_money2 = item.type === 1 ? settle_money : settle_money * -1

      // 判断模板的 ordinary 表是否配了折让相关列，没配则不展开(一个单据一行)
      const ordinaryTable = _.find(
        _.get(config, 'contents', []),
        c => c.type === 'table' && c.dataKey === 'ordinary'
      )
      const colTexts = _.map(_.get(ordinaryTable, 'columns', []), 'text')
      // 折让相关列不参与合并，每条折让单独一行
      const DISCOUNT_KEYS = ['折让原因', '折让类型', '折让金额']
      const hasDiscountCol = colTexts.some(t =>
        DISCOUNT_KEYS.some(k => t.includes(k))
      )
      // 合并列 = 模板里除折让外的所有列
      const mergeCellList = _.compact(
        colTexts.map(t => {
          const name = (t.match(/列\.([^.}]+)/) || [])[1]
          return name && !DISCOUNT_KEYS.some(k => name.includes(k))
            ? name
            : null
        })
      )
      const discounts =
        hasDiscountCol && item.discount && item.discount.length
          ? item.discount
          : [{}]

      discounts.forEach((d, di) => {
        const isFirst = di === 0
        result.push({
          [i18next.t('序号')]: seq,
          [i18next.t('单据类型')]:
            item.type === 1 ? i18next.t('成品入库单') : i18next.t('成品退货单'),
          [i18next.t('单据编号')]: item._id,
          // 合计只累加首行，被合并行清零避免重复计算
          [i18next.t('金额')]: isFirst ? total_money2 : 0,
          [i18next.t('结算金额')]: isFirst ? settle_money2 : 0,
          [i18next.t('入库时间')]: moment(item.submit_time).format(
            'YYYY-MM-DD'
          ),
          [i18next.t('折让原因')]: d.reason ? REASON[d.reason] : '',
          [i18next.t('折让类型')]: d.action ? TYPE[d.action] : '',
          [i18next.t('折让金额')]:
            d.money != null
              ? Big(d.money || 0)
                  .div(100)
                  .toFixed(2)
              : '',
          _origin: {
            ...item,
            // 首行 rowSpan=合并行数，其余行 -1 表示被合并(不渲染)
            rowSpan: isFirst ? discounts.length : -1
          },
          // 声明哪些列参与合并(除折让外的所有模板列)
          _mergeCell: mergeCellList
        })
      })
    })
  } else if (type === 'delta') {
    result = _.map(data.discount, (item, index) => {
      return {
        [i18next.t('序号')]: index + 1,
        [i18next.t('折让原因')]: REASON[item.reason],
        [i18next.t('折让类型')]: TYPE[item.action],
        [i18next.t('折让金额')]: Big(item.money || 0)
          .div(100)
          .toFixed(2),
        [i18next.t('备注')]: item.remark,
        _origin: item
      }
    })
  }
  return result
}

const generateUpperPrice = data => {
  return {
    [i18next.t('单据金额_大写')]: coverDigit2Uppercase(
      Big(data.total_price || 0)
        .div(100)
        .toFixed(2)
    ),
    [i18next.t('折让金额_大写')]: coverDigit2Uppercase(
      Big(data.delta_money || 0)
        .div(100)
        .toFixed(2)
    ),
    [i18next.t('结算金额_大写')]: coverDigit2Uppercase(
      Big(data.total_price || 0)
        .plus(data.delta_money || 0)
        .div(100)
        .toFixed(2)
    )
  }
}

const formatData = (data, config) => {
  return {
    common: {
      [i18next.t('单据日期')]: moment(data.date_time).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      [i18next.t('单据日期_日期')]: moment(data.date_time).format('YYYY-MM-DD'),
      [i18next.t('单据日期_时间')]: moment(data.date_time).format('HH:mm:ss'),
      [i18next.t('结款日期')]: moment(data.pay_time).format('YYYY-MM-DD'),
      [i18next.t('打印时间')]: moment(data.print_time).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      [i18next.t('打印时间_日期')]: moment(data.print_time).format(
        'YYYY-MM-DD'
      ),
      [i18next.t('打印时间_时间')]: moment(data.print_time).format('HH:mm:ss'),
      [i18next.t('单据编号')]: data.id,
      [i18next.t('付款单摘要')]: data.remark,
      [i18next.t('制单人')]: data.print_operator,
      [i18next.t('往来单位')]: data.settle_supplier_name,
      [i18next.t('供应商编号')]: data.customer_id,
      [i18next.t('供应商营业执照号')]: data.business_licence,
      [i18next.t('联系电话')]: data.phone,
      [i18next.t('开户银行')]: data.bank,
      [i18next.t('银行账号')]: data.card_no,
      [i18next.t('结款方式')]: data.pay_method,
      [i18next.t('开户名')]: data.account_name,
      [i18next.t('单据金额')]: Big(data.total_price || 0)
        .div(100)
        .toFixed(2),
      [i18next.t('折让金额')]: Big(data.delta_money || 0)
        .div(100)
        .toFixed(2),
      [i18next.t('结算金额')]: Big(data.total_price || 0)
        .plus(data.delta_money || 0)
        .div(100)
        .toFixed(2),
      ...generateUpperPrice(data)
    },
    _table: {
      ordinary: getTableData(data, 'ordinary', config),
      delta: getTableData(data, 'delta')
    },
    _origin: data
  }
}

export default formatData
