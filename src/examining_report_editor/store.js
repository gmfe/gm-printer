import EditorStore from '../common/editor_store'
import { action, toJS } from 'mobx'
import i18next from '../../locales'

const DEFAULT_TABLE_COLUMNS = [
  {
    head: i18next.t('序号'),
    text: i18next.t('{{列.序号}}'),
    style: { textAlign: 'center' },
    headStyle: { textAlign: 'center' }
  },
  {
    head: i18next.t('样品名称'),
    text: i18next.t('{{列.样品名称}}'),
    style: { textAlign: 'center' },
    headStyle: { textAlign: 'center' }
  },
  {
    head: i18next.t('样品编码'),
    text: i18next.t('{{列.样品编码}}'),
    style: { textAlign: 'center' },
    headStyle: { textAlign: 'center' }
  },
  {
    head: i18next.t('检测结果'),
    text: i18next.t('{{列.检测结果}}'),
    style: { textAlign: 'center' },
    headStyle: { textAlign: 'center' }
  }
]

class Store extends EditorStore {
  constructor({ defaultTableDataKey }) {
    super()
    this.defaultTableDataKey = defaultTableDataKey
  }

  getDefaultTableConfig() {
    return {
      dataKey: this.defaultTableDataKey,
      subtotal: { show: false },
      columns: [
        {
          head: i18next.t('表头'),
          text: i18next.t('{{列.表头}}'),
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        }
      ]
    }
  }

  @action
  init(config, data) {
    super.init(config, data)
    this.defaultTableDataKey = 'examiningDetail'
  }

  @action.bound
  addContent(name, index, type, tableConfig = null) {
    super.addContent(name, index, type, tableConfig)
    this.config = toJS(this.config)
  }

  @action
  changeTableDataKey(name, key, options = {}) {
    super.changeTableDataKey(name, key, options)
    this.config = toJS(this.config)
  }

  @action
  removeContent(name) {
    super.removeContent(name)
    this.config = toJS(this.config)
  }
}

export default new Store({ defaultTableDataKey: 'examiningDetail' })
