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

const getTableData = (data, type) => {
  let result = null
  if (type === 'ordinary') {
    // 按submit_time 排序
    const sheets = data.sub_sheets.sort((a, b) => {
      return moment(a.submit_time).isAfter(moment(b.submit_time)) ? 1 : -1
    })

    result = _.map(sheets, (item, index) => {
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

      return {
        [i18next.t('序号')]: index + 1,
        [i18next.t('单据类型')]:
          item.type === 1 ? i18next.t('成品入库单') : i18next.t('成品退货单'),
        [i18next.t('单据编号')]: item._id,
        [i18next.t('金额')]: total_money,
        [i18next.t('结算金额')]: settle_money,
        [i18next.t('入库时间')]: moment(item.submit_time).format('YYYY-MM-DD'),
        _origin: {
          ...item,
          total_money2,
          settle_money2
        }
      }
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

const formatData = data => {
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
      ordinary: getTableData(data, 'ordinary'),
      delta: getTableData(data, 'delta')
    },
    _origin: data
  }
}

export default formatData
