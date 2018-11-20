import _ from 'lodash'
import moment from 'moment'

function task (data) {
  const taskList = _.sortBy(data.order_detail, 'sort_id')

  const driverTask = _.map(taskList, o => {
    return {
      '序号': o.sort_id || '-',
      '订单号': o.order_id || '-',
      '商户名': o.customer_name || '-',
      '收货地址': o.receive_address || '-',
      '收货时间': moment(o.receive_begin_time).format('MM/DD-HH:mm') + '~\n' + moment(o.receive_end_time).format('MM/DD-HH:mm'),
      '配送框数': '',
      '回收框数': '',
      '订单备注': ''
    }
  })

  return {
    '配送司机': data.driver_name || '-',
    '车牌号': data.car_num || '-',
    '联系方式': data.driver_phone || '-',
    '打印时间': moment().format('YYYY-MM-DD HH:mm:ss'),
    _table: {
      driver_task: driverTask
    },
    _origin: data
  }
}

export default task
