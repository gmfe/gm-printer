import EditorStore from '../common/editor_store'
import { computed } from 'mobx'

class Store extends EditorStore {
  @computed
  get computedTableDataKeyOfSelectedRegion() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        const dataKey = this.config.contents[arr[2]].dataKey
        return dataKey
      }
    }
  }
}

export default new Store()
