import i18next from '../../locales'
import React from 'react'
import CommonContextMenu from '../common/common_context_menu'
import { inject, observer } from 'mobx-react'
import { Printer } from '../printer'
import _ from 'lodash'
import PropTypes from 'prop-types'

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
  handleSubtotal = name => {
    const { editStore } = this.props

    editStore.setSubtotalShow(name)
  }

  hasSubtotalBtn = name => {
    if (!name) return false

    const arr = name.split('.')
    if (_.includes(arr, 'table')) {
      const dataKey = this.props.editStore.config.contents[arr[2]].dataKey
      // 折让表格没有每页小计
      return dataKey !== 'delta'
    }
  }

  renderOrderActionBtn = name => {
    if (!this.hasSubtotalBtn(name)) {
      return null
    }

    const arr = name.split('.')
    const { subtotal } = this.props.editStore.config.contents[arr[2]]

    const isSubtotalActive = subtotal.show

    return (
      <>
        <div
          onClick={this.handleSubtotal.bind(this, name)}
          className={isSubtotalActive ? 'active' : ''}
        >
          {i18next.t('每页合计')}
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
          isSomeSubtotalTr
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
