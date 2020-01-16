import EditorStore from '../common/editor_store'
import { action } from 'mobx'
import _ from 'lodash'

class Store extends EditorStore {
  @action
  changeTableDataKeyStockout(name, key) {
    const arr = name.split('.')
    const { dataKey } = this.config.contents[arr[2]]
    const keyArr = dataKey.split('_')
    let newDataKey
    // 当前有这个key则去掉
    if (keyArr.includes(key)) {
      newDataKey = _.without(keyArr, key)
    } else {
      newDataKey = _.concat(keyArr, key)
    }
    newDataKey = _.sortBy(newDataKey, [
      o => o === 'money',
      o => o === 'quantity',
      o => o === 'multi',
      o => o === 'orders'
    ])

    this.config.contents[arr[2]].dataKey = newDataKey.join('_')
  }
}

export default new Store()
