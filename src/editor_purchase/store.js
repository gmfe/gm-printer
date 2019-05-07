import EditorStore from '../common/editor_store'
import { action } from 'mobx'
import i18next from '../../locales'

class Store extends EditorStore {
  /* start---------设置采购明细相关--------- */
  @action.bound
  setPurchaseTableKey (dataKey) {
    // 先移除选中项,安全第一
    this.selected = null
    this.setTableDataKey(dataKey)

    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    // 先去掉所有明细列
    const newCols = tableConfig.columns.filter(o => !o.isSpecialColumn)
    tableConfig.columns.replace(newCols)

    // 单列-总表最后一列,在columns上修改
    if (dataKey === 'purchase_last_col') {
      tableConfig.columns.push({
        'head': i18next.t('明细'),
        'headStyle': { 'textAlign': 'center' },
        'style': { 'textAlign': 'left' },
        'isSpecialColumn': true,
        'specialDetailsKey': '__details',
        'text': i18next.t('{{采购数量_采购单位}}{{采购单位}}*{{商户名}}*{{商品备注}}')
      })
    }
  }

  @action.bound
  setSpecialText (value) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.template_text = value
    // 单列-总表最后一列,在columns上修改
    if (tableConfig.dataKey === 'purchase_last_col') {
      const specialCol = tableConfig.columns.find(o => o.isSpecialColumn)
      specialCol.text = value
    }
  }

  @action.bound
  setSpecialStyle (value) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.style = value
    // 单列-总表最后一列,在columns上修改
    if (tableConfig.dataKey === 'purchase_last_col') {
      const specialCol = tableConfig.columns.find(o => o.isSpecialColumn)
      specialCol.style = value
    }
  }

  @action.bound
  specialTextAddField (fieldText) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.template_text += fieldText
    // 单列-总表最后一列,在columns上修改
    if (tableConfig.dataKey === 'purchase_last_col') {
      const specialCol = tableConfig.columns.find(o => o.isSpecialColumn)
      specialCol.text += fieldText
    }
  }

  /* end---------设置采购明细相关--------- */
}

export default new Store()
