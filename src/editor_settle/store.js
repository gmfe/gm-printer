import EditorStore from '../common/editor_store'
import i18next from '../../locales'

class Store extends EditorStore {
  defaultTableDataKey = 'ordinary'
  defaultTableSubtotal = {
    show: false,
    fields: [
      {
        name: i18next.t('金额'),
        valueField: 'total_money2'
      },
      {
        name: i18next.t('结算金额'),
        valueField: 'settle_money2'
      }
    ],
    displayName: true
  }
}

export default new Store()
