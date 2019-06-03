import i18next from '../../locales'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Flex, Option, Select } from '../components'
import { InputWithUnit } from '../common/component'
import { pageTypeMap, printDirectionList } from '../config'
import _ from 'lodash'
import { dispatchMsg } from '../util'

@inject('editStore')
@observer
class EditorSelector extends React.Component {
  handleConfigName = (e) => {
    this.props.editStore.setConfigName(e.target.value)
  }

  handlePageType = (value) => {
    this.props.editStore.setSizePageType(value)
  }

  handlePageSize (field, value) {
    this.props.editStore.setPageSize(field, value)
  }

  handlePrintDirection = (value) => {
    this.props.editStore.setPagePrintDirection(value)
  }

  handleSelectedRegion = (selected) => {
    dispatchMsg('gm-printer-select-region', { selected })
  }

  render () {
    const { config: { name, page }, computedRegionList, computedSelectedRegionTip, selectedRegion } = this.props.editStore
    const isDIY = page.type === 'DIY'

    return (
      <div>
        <Flex alignCenter>
          <div>{i18next.t('模板名称')}：</div>
          <input className='gm-printer-edit-input-custom' type='text' value={name} onChange={this.handleConfigName}/>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('打印规格')}：</div>
          <Select className='gm-printer-edit-select' value={page.type} onChange={this.handlePageType}>
            {_.map(pageTypeMap, (v, k) => <Option key={k} value={k}>{v.name}</Option>)}
          </Select>
        </Flex>

        {isDIY && <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('纸张宽度')}：</div>
          <InputWithUnit className='gm-printer-edit-input-custom' unit='mm' value={page.size.width}
            onChange={this.handlePageSize.bind(this, 'width')}/>
        </Flex>}

        {isDIY && <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('纸张高度')}：</div>
          <InputWithUnit className='gm-printer-edit-input-custom' unit='mm' value={page.size.height}
            onChange={this.handlePageSize.bind(this, 'height')}/>
        </Flex>}

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('打印布局')}：</div>
          <Select className='gm-printer-edit-select' value={page.printDirection} onChange={this.handlePrintDirection}>
            {_.map(printDirectionList, v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('选择区域')}：</div>
          <Select className='gm-printer-edit-select' value={selectedRegion || 'all'}
            onChange={this.handleSelectedRegion}>
            {_.map(computedRegionList, v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5 gm-text-red'>
          {computedSelectedRegionTip}
        </Flex>
      </div>
    )
  }
}

export default EditorSelector
