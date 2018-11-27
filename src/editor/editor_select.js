import React from 'react'
import editStore from './store'
import { observer } from 'mobx-react'
import { Flex, Option, Select } from 'react-gm'
import { InputWithUnit } from './component'
import { counterStateList, pageTypeMap, printDirectionList } from '../config'
import _ from 'lodash'
import { dispatchMsg } from '../util'

@observer
class EditorSelector extends React.Component {
  handleConfigName = (e) => {
    editStore.setConfigName(e.target.value)
  }

  handlePageType = (value) => {
    editStore.setSizePageType(value)
  }

  handlePageSize (field, value) {
    editStore.setPageSize(field, value)
  }

  handlePrintDirection = (value) => {
    editStore.setPagePrintDirection(value)
  }

  handleCounterShow = (value) => {
    editStore.setCounterShow(value)
  }

  handleSelectedRegion = (selected) => {
    dispatchMsg('gm-printer-select-region', { selected })
  }

  render () {
    const { config: { name, page, counter }, computedRegionList } = editStore
    const isDIY = page.type === 'DIY'

    return (
      <div>
        <Flex alignCenter>
          <div>模板名称：</div>
          <input className='input-sm' type='text' value={name} onChange={this.handleConfigName}/>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>打印规格：</div>
          <Select className='gm-printer-edit-select' value={page.type} onChange={this.handlePageType}>
            {_.map(pageTypeMap, (v, k) => <Option key={k} value={k}>{v.name}</Option>)}
          </Select>
        </Flex>

        {isDIY && <Flex alignCenter className='gm-padding-top-5'>
          <div>纸张宽度：</div>
          <InputWithUnit className='input-sm' unit='mm' value={page.size.width}
            onChange={this.handlePageSize.bind(this, 'width')}/>
        </Flex>}

        {isDIY && <Flex alignCenter className='gm-padding-top-5'>
          <div>纸张高度：</div>
          <InputWithUnit className='input-sm' unit='mm' value={page.size.height}
            onChange={this.handlePageSize.bind(this, 'height')}/>
        </Flex>}

        <Flex alignCenter className='gm-padding-top-5'>
          <div>打印方向：</div>
          <Select className='gm-printer-edit-select' value={page.printDirection} onChange={this.handlePrintDirection}>
            {_.map(printDirectionList, v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>分类数量：</div>
          <Select className='gm-printer-edit-select' value={counter.show} onChange={this.handleCounterShow}>
            {_.map(counterStateList, v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>选择区域：</div>
          <Select className='gm-printer-edit-select' value={editStore.selectedRegion || 'all'}
            onChange={this.handleSelectedRegion}>
            {_.map(computedRegionList, v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5 gm-text-red'>
          说明：区域中的内容仅打印一次
        </Flex>
      </div>
    )
  }
}

export default EditorSelector
