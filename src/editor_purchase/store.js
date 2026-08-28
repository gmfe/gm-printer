import EditorStore from '../common/editor_store'
import { action, observable } from 'mobx'
import i18next from '../../locales'
import { getDataKeySuffix, isLastColDataKey } from '../common/data_key_util'

const getPurchaseDefaultDetailText = () =>
  i18next.t('{{采购数量_采购单位}}{{采购单位}}*{{商户名}}*{{商品备注}}')

/** 创建/切换「单列-最后一列」时，明细列 text 应与 template_text 一致 */
const resolveDetailTemplateText = (tableConfig, specialTableConfig) => {
  const existing = tableConfig.specialConfig?.template_text
  if (existing) return existing
  if (specialTableConfig && specialTableConfig.defaultDetailText !== undefined) {
    return specialTableConfig.defaultDetailText
  }
  return getPurchaseDefaultDetailText()
}

const syncLastColColumnText = (tableConfig) => {
  if (!isLastColDataKey(tableConfig.dataKey)) return
  const templateText = tableConfig.specialConfig?.template_text
  if (!templateText) return
  const specialCol = tableConfig.columns?.find((o) => o.isSpecialColumn)
  if (specialCol) specialCol.text = templateText
}

class Store extends EditorStore {
  constructor({ defaultTableDataKey }) {
    super()
    this.defaultTableDataKey = defaultTableDataKey
  }

  @observable
  customerTag = false

  @action.bound
  init(config, data) {
    super.init(config, data)
    config?.contents?.forEach((tableConfig) => {
      if (tableConfig?.type === 'table') syncLastColColumnText(tableConfig)
    })
  }

  @action.bound
  setPurchaseTableKey(dataKey, specialTableConfig) {
    this.selected = null
    this.setTableDataKey(dataKey)

    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    const newCols = tableConfig.columns.filter((o) => !o.isSpecialColumn)
    tableConfig.columns.replace(newCols)

    if (isLastColDataKey(dataKey)) {
      const templateText = resolveDetailTemplateText(tableConfig, specialTableConfig)
      tableConfig.columns.push({
        head: i18next.t('明细'),
        headStyle: { textAlign: 'center' },
        style: { textAlign: 'left' },
        isSpecialColumn: true,
        separator: '+',
        specialDetailsKey: '__details',
        text: templateText,
      })
      const suffix = getDataKeySuffix(dataKey)
      tableConfig.columns[tableConfig.columns.length - 1].detailLastColType =
        suffix === 'last_col' ? 'purchase_last_col' : 'purchase_last_col_noLineBreak'
    }
  }

  @action.bound
  setSpecialText(value) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.template_text = value
    if (isLastColDataKey(tableConfig.dataKey)) {
      const specialCol = tableConfig.columns.find((o) => o.isSpecialColumn)
      if (specialCol) specialCol.text = value
    }
  }

  @action.bound
  setSpecialStyle(value) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.style = value
    if (isLastColDataKey(tableConfig.dataKey)) {
      const specialCol = tableConfig.columns.find((o) => o.isSpecialColumn)
      if (specialCol) specialCol.style = value
    }
  }

  @action.bound
  specialTextAddField(fieldText) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.template_text += fieldText
    if (isLastColDataKey(tableConfig.dataKey)) {
      const specialCol = tableConfig.columns.find((o) => o.isSpecialColumn)
      if (specialCol) specialCol.text += fieldText
    }
  }

  @action.bound
  switchCustomerTag(val) {
    const arr = this.selectedRegion.split('.')
    this.config.contents[arr[2]].customerTag = val
  }
}

export default new Store({ defaultTableDataKey: 'purchase_no_detail' })
