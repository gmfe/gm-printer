import EditorStore from '../common/editor_store'
import { action, observable } from 'mobx'
import i18next from '../../locales'

class Store extends EditorStore {
  constructor({ defaultTableDataKey }) {
    super()
    this.defaultTableDataKey = defaultTableDataKey // 修改默认dataKey
  }

  @observable
  customerTag = false

  /* start---------设置采购明细相关--------- */
  @action.bound
  setPurchaseTableKey(dataKey) {
    // 先移除选中项,安全第一
    this.selected = null
    this.setTableDataKey(dataKey)

    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]
    const __detailsColumn = tableConfig.columns.find(
      o => o.specialDetailsKey === '__details'
    )

    // 先去掉所有明细列
    const newCols = tableConfig.columns.filter(o => !o.isSpecialColumn)
    tableConfig.columns.replace(newCols)

    // 单列-总表最后一列,在columns上修改
    if (
      dataKey === 'purchase_last_col' ||
      dataKey === 'purchase_last_col_noLineBreak'
    ) {
      tableConfig.columns.push({
        head: i18next.t('明细'),
        headStyle: { textAlign: 'center' },
        style: { textAlign: 'left' },
        isSpecialColumn: true,
        separator: '+',
        // detailsType: 'purchase_last_col',
        specialDetailsKey: '__details',
        //   这里写的有问题，应该先用原来的值，没有才用默认值
        text:
          __detailsColumn?.text ||
          i18next.t('{{采购数量_采购单位}}{{采购单位}}*{{商户名}}*{{商品备注}}')
      })
      // 通过detailsType属性区分单列-总表最后一列的数据是否换行展示
      dataKey === 'purchase_last_col'
        ? (tableConfig.columns[
            tableConfig.columns.length - 1
          ].detailLastColType = 'purchase_last_col')
        : (tableConfig.columns[
            tableConfig.columns.length - 1
          ].detailLastColType = 'purchase_last_col_noLineBreak')
    }
  }

  @action.bound
  setSpecialText(value) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.template_text = value
    // 单列-总表最后一列,在columns上修改
    if (
      tableConfig.dataKey === 'purchase_last_col' ||
      tableConfig.dataKey === 'purchase_last_col_noLineBreak'
    ) {
      const specialCol = tableConfig.columns.find(o => o.isSpecialColumn)
      specialCol.text = value
    }
  }

  @action.bound
  setSpecialStyle(value) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.style = value
    // 单列-总表最后一列,在columns上修改
    if (
      tableConfig.dataKey === 'purchase_last_col' ||
      tableConfig.dataKey === 'purchase_last_col_noLineBreak'
    ) {
      const specialCol = tableConfig.columns.find(o => o.isSpecialColumn)
      specialCol.style = value
    }
  }

  @action.bound
  specialTextAddField(fieldText) {
    const arr = this.selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    tableConfig.specialConfig.template_text += fieldText
    // 单列-总表最后一列,在columns上修改
    if (
      tableConfig.dataKey === 'purchase_last_col' ||
      tableConfig.dataKey === 'purchase_last_col_noLineBreak'
    ) {
      const specialCol = tableConfig.columns.find(o => o.isSpecialColumn)
      specialCol.text += fieldText
    }
  }

  /* end---------设置采购明细相关--------- */
  @action.bound
  switchCustomerTag(val) {
    const arr = this.selectedRegion.split('.')
    this.config.contents[arr[2]].customerTag = val
  }
}

export default new Store({ defaultTableDataKey: 'purchase_no_detail' })
