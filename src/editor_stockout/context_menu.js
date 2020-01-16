import i18next from '../../locales'
import React from 'react'
import CommonContextMenu from '../common/common_context_menu'
import { inject, observer } from 'mobx-react'
import { Printer } from '../printer'

const blockTypeList = [
  { value: '', text: i18next.t('插入文本') },
  { value: 'line', text: i18next.t('插入线条') },
  { value: 'image', text: i18next.t('插入图片') }
]

@inject(stores => ({
  editStore: stores.editStore,
  mockData: stores.mockData
}))
@observer
class ContextMenu extends React.Component {
  handleChangeTableDataKey = (key, name) => {
    const { editStore } = this.props

    editStore.changeTableDataKeyStockout(name, key)
  }

  renderOrderActionBtn = name => {
    const arr = name.split('.')
    const { dataKey } = this.props.editStore.config.contents[arr[2]]
    const keyArr = dataKey.split('_')

    const isQuantityActive = keyArr.includes('quantity')
    const isMoneyActive = keyArr.includes('money')
    const isMultiActive = keyArr.includes('multi')

    return (
      <>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'multi', name)}
          className={isMultiActive ? 'active' : ''}
        >
          {i18next.t('双栏商品')}
        </div>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'quantity', name)}
          className={isQuantityActive ? 'active' : ''}
        >
          {i18next.t('出库数小计')}
        </div>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'money', name)}
          className={isMoneyActive ? 'active' : ''}
        >
          {i18next.t('出库金额小计')}
        </div>
      </>
    )
  }

  render() {
    const { editStore, mockData } = this.props
    return (
      <CommonContextMenu
        renderTableAction={this.renderOrderActionBtn}
        insertBlockList={blockTypeList}
      >
        <Printer
          key={editStore.computedPrinterKey}
          selected={editStore.selected}
          selectedRegion={editStore.selectedRegion}
          config={editStore.config}
          data={mockData}
        />
      </CommonContextMenu>
    )
  }
}

export default ContextMenu
