import order from './order'
import sku from './sku'
import task from './task'
import checklist from './checklist'

/**
 * 根据__gm_printer_data_type 处理各种的数据
 * @param data
 * @return {*}
 */
export default function toKey(data) {
  console.log(data)
  switch (data.__gm_printer_data_type) {
    case 'order':
      return order(data)
    case 'sku':
      return sku(data)
    case 'task':
      return task(data)
    case 'check_list':
      return checklist(data)
    default:
      throw new Error(`${data.__gm_printer_data_type} error!`)
  }
}
