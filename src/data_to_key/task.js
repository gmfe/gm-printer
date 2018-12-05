import i18next from '../../locales'
import _ from 'lodash'
import moment from 'moment'

function task (data) {
  const taskList = _.sortBy(data.order_detail, 'sort_id')

  const driverTask = _.map(taskList, o => {
    return {
      [i18next.t('序号')]: o.sort_id || '-',
      [i18next.t('订单号')]: o.order_id || '-',
      [i18next.t('商户名')]: o.customer_name || '-',
      [i18next.t('收货地址')]: o.receive_address || '-',
      [i18next.t('收货时间')]: moment(o.receive_begin_time).format('MM/DD-HH:mm') + '~\n' + moment(o.receive_end_time).format('MM/DD-HH:mm'),
      [i18next.t('配送框数')]: '',
      [i18next.t('回收框数')]: '',
      [i18next.t('订单备注')]: ''
    }
  })

  const common = {
    [i18next.t('配送司机')]: data.driver_name || '-',
    [i18next.t('车牌号')]: data.car_num || '-',
    [i18next.t('联系方式')]: data.driver_phone || '-',
    [i18next.t('打印时间')]: moment().format('YYYY-MM-DD HH:mm:ss')
  }

  return {
    common,
    _table: {
      driver_task: driverTask
    },
    _origin: data
  }
}

export default task
