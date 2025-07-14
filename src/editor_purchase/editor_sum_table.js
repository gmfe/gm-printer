/* eslint-disable react/prop-types */
import i18next from '../../locales'
// @ts-ignore
import React, { Component } from 'react'
import { Flex, Switch } from '../components/index'
import { inject, observer } from 'mobx-react'

// @ts-ignore
@inject('editStore')
// @ts-ignore
@observer
class TableDetailEditor extends Component {
  handleSwitchChange = val => {
    const { editStore } = this.props
    editStore.switchCustomerTag(val)
  }

  render() {
    const { editStore } = this.props
    const {
      addFields: { sumTableConfig }
    } = this.props
    if (editStore.computedRegionIsTable) {
      const arr = editStore.selectedRegion.split('.')
      const tableConfig = editStore.config.contents[arr[2]]
      return (
        <div className='gm-margin-top-5'>
          <Flex>
            <div className='gm-margin-right-10'>
              {sumTableConfig.label || i18next.t('配置')}
            </div>
            <Switch
              checked={tableConfig.customerTag}
              onChange={this.handleSwitchChange}
            />
          </Flex>
          {sumTableConfig.showTips && (
            <div className='gm-margin-top-5' style={{ color: 'red' }}>
              {sumTableConfig.tips}
            </div>
          )}
        </div>
      )
    }
    return null
  }
}

export default TableDetailEditor
