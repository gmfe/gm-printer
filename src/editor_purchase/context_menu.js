import i18next from '../../locales'
import React from 'react'
import CommonContextMenu from '../common/common_context_menu'
import { inject, observer } from 'mobx-react'
import { Printer } from '../printer'
import PropTypes from 'prop-types'
import _ from 'lodash'

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
  hasSubtotalBtn = name => {
    if (!name) return false
    const noSubtotalList = ['abnormal', 'abnormalDetails']
    const arr = name.split('.')
    if (_.includes(arr, 'table')) {
      const dataKey = this.props.editStore.config.contents[arr[2]].dataKey
      return !_.includes(noSubtotalList, dataKey)
    }
  }

  handleChangeTableDataKey = (key, name) => {
    const { editStore } = this.props

    editStore.changeTableDataKey(name, key)
  }

  renderOrderActionBtn = name => {
    if (!this.hasSubtotalBtn(name)) {
      return null
    }

    const arr = name.split('.')
    const { dataKey } = this.props.editStore.config.contents[arr[2]]
    const keyArr = dataKey.split('_')

    const isMultiActive = keyArr.includes('multi')
    const isCategoryActive = keyArr.includes('category')

    return (
      <>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'multi', name)}
          className={isMultiActive ? 'active' : ''}
        >
          {i18next.t('双栏商品')}
        </div>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'category', name)}
          className={isCategoryActive ? 'active' : ''}
        >
          {i18next.t('商品分类')}
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

ContextMenu.propTypes = {
  editStore: PropTypes.object,
  mockData: PropTypes.object
}
export default ContextMenu
