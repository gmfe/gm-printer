import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import CommonContextMenu from '../common/common_context_menu'
import { inject, observer } from 'mobx-react'
import _ from 'lodash'
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
  isMenuItemEnabled = key => {
    const { menuConfig } = this.props
    if (!menuConfig) return true
    if (Array.isArray(menuConfig)) return menuConfig.includes(key)
    if (typeof menuConfig === 'object') return !!menuConfig[key]
    return true
  }

  hasSubtotalBtn = name => {
    if (!name) return false
    const arr = name.split('.')
    if (!_.includes(arr, 'table')) return false
    const dataKey = this.props.editStore.config.contents[arr[2]].dataKey
    return dataKey === 'examiningDetail' || dataKey.startsWith('examiningDetail_')
  }

  handleChangeTableDataKey = (key, name) => {
    const { editStore } = this.props
    editStore.changeTableDataKey(name, key)
  }

  renderTableAction = name => {
    if (!this.hasSubtotalBtn(name)) {
      return null
    }

    const arr = name.split('.')
    const { dataKey } = this.props.editStore.config.contents[arr[2]]
    const keyArr = dataKey.split('_')
    const isMultiActive = keyArr.includes('multi')

    return (
      <>
        {this.isMenuItemEnabled('multi') && (
          <div
            onClick={this.handleChangeTableDataKey.bind(this, 'multi', name)}
            className={isMultiActive ? 'active' : ''}
          >
            {i18next.t('双栏商品')}
          </div>
        )}
      </>
    )
  }

  render() {
    const { editStore, mockData } = this.props
    return (
      <CommonContextMenu
        renderTableAction={this.renderTableAction}
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
  mockData: PropTypes.object,
  menuConfig: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.object
  ])
}

export default ContextMenu
