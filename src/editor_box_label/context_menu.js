import React from 'react'
import { inject, observer } from 'mobx-react'
import CommonContextMenu from '../common/common_context_menu'
import { Printer } from '../printer'
import i18next from '../../locales'
import PropTypes from 'prop-types'

const blockTypeList = [
  { value: '', text: i18next.t('插入文本') },
  { value: 'line', text: i18next.t('插入线条') },
  { value: 'image', text: i18next.t('插入图片') },
  { value: 'barcode', text: i18next.t('插入箱签条形码') }
]

@inject(stores => ({
  editStore: stores.editStore,
  mockData: stores.mockData
}))
@observer
class ContextMunu extends React.Component {
  handleChangeTableDataKey = (key, name) => {
    const { editStore } = this.props

    editStore.changeTableDataKey(name, key)
  }

  renderOrderActionBtn = name => {
    const arr = name.split('.')
    const { dataKey } = this.props.editStore.config.contents[arr[2]]
    const keyArr = dataKey.split('_')

    const isMultiActive = keyArr.includes('multi')

    return (
      <>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'multi', name)}
          className={isMultiActive ? 'active' : ''}
        >
          {i18next.t('双栏商品')}
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
          data={mockData}
          selected={editStore.selected}
          selectedRegion={editStore.selectedRegion}
          config={editStore.config}
        />
      </CommonContextMenu>
    )
  }
}

ContextMunu.propTypes = {
  editStore: PropTypes.object,
  mockData: PropTypes.object
}

export default ContextMunu
