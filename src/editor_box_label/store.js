import EditorStore from '../common/editor_store'

class Store extends EditorStore {
  constructor({ defaultTableDataKey }) {
    super()
    this.defaultTableDataKey = defaultTableDataKey // 修改默认dataKey
  }
}

export default new Store({ defaultTableDataKey: 'ordinary' })
