import i18next from '../../locales'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Flex, Option, Select, RadioGroup, Radio } from '../components'
import { InputWithUnit } from '../common/component'
import { pageTypeMap, printDirectionList, LONG_PRINT } from '../config'
import _ from 'lodash'
import { dispatchMsg } from '../util'
import PropTypes from 'prop-types'

@inject('editStore')
@observer
class EditorSelector extends React.Component {
  handleConfigName = e => {
    this.props.editStore.setConfigName(e.target.value)
  }

  handleConfigIsFixLastFooter = _val => {
    this.props.editStore.setConfigIsFixLastFooter(_val)
  }

  handlePageType = value => {
    this.props.editStore.setSizePageType(value)
  }

  handlePageSize(field, value) {
    this.props.editStore.setPageSize(field, value)
  }

  handlePrintDirection = value => {
    this.props.editStore.setPagePrintDirection(value)
  }

  handleSelectedRegion = selected => {
    dispatchMsg('gm-printer-select-region', { selected })
  }

  handleSetBatchPrintConfig = type => {
    this.props.editStore.setBatchPrintConfig(type)
  }

  render() {
    const {
      config: {
        name,
        page,
        batchPrintConfig,
        isFixLastFooter,
        showDiyOverAllOrder
      },
      computedRegionList,
      computedSelectedRegionTip,
      selectedRegion
    } = this.props.editStore
    const isDIY = page.type === 'DIY'
    const isLongPrint = page.type === LONG_PRINT
    return (
      <div>
        <Flex alignCenter>
          <div>{i18next.t('模板名称')}：</div>
          <input
            className='gm-printer-edit-input-custom'
            type='text'
            value={name}
            onChange={this.handleConfigName}
          />
        </Flex>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('打印规格')}：</div>
          <Select
            className='gm-printer-edit-select'
            value={page.type}
            onChange={this.handlePageType}
          >
            {_.map(pageTypeMap, (v, k) => (
              <Option key={k} value={k}>
                {v.name}
              </Option>
            ))}
          </Select>
        </Flex>

        {(isDIY || isLongPrint) && (
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('纸张宽度')}：</div>
            <InputWithUnit
              className='gm-printer-edit-input-custom'
              unit='mm'
              value={page.size.width}
              onChange={this.handlePageSize.bind(this, 'width')}
            />
          </Flex>
        )}

        {isDIY && (
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('纸张高度')}：</div>
            <InputWithUnit
              className='gm-printer-edit-input-custom'
              unit='mm'
              value={page.size.height}
              onChange={this.handlePageSize.bind(this, 'height')}
            />
          </Flex>
        )}
        {!isLongPrint && (
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('打印布局')}：</div>
            <Select
              className='gm-printer-edit-select'
              value={page.printDirection}
              onChange={this.handlePrintDirection}
            >
              {_.map(printDirectionList, v => (
                <Option key={v.value} value={v.value}>
                  {v.text}
                </Option>
              ))}
            </Select>
          </Flex>
        )}

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('选择区域')}：</div>
          <Select
            className='gm-printer-edit-select'
            value={selectedRegion || 'all'}
            onChange={this.handleSelectedRegion}
          >
            {_.map(computedRegionList, v => (
              <Option key={v.value} value={v.value}>
                {v.text}
              </Option>
            ))}
          </Select>
        </Flex>

        {this.props.isPurchase && (
          <>
            <Flex alignCenter className='gm-padding-top-5'>
              <div>{i18next.t('批量打印设置')}：</div>
              <Select
                className='gm-printer-edit-select'
                value={batchPrintConfig}
                onChange={this.handleSetBatchPrintConfig}
              >
                <Option value={1}>不连续打印</Option>
                <Option value={2}>连续打印</Option>
              </Select>
            </Flex>
            <div>
              <p style={{ color: 999, paddingLeft: 24 }}>
                不连续打印（一张采购单不出现多供应商）
              </p>
              <p style={{ color: 999, paddingLeft: 24 }}>
                连续打印（一张采购单可能出现多个供应商）
              </p>
            </div>
          </>
        )}

        {showDiyOverAllOrder !== undefined && (
          <Flex alignCenter className='gm-padding-top-5'>
            <label htmlFor={1}>是否固定末页签名和页脚区域：</label>
            <RadioGroup
              name='isFixFooter'
              value={isFixLastFooter}
              inline
              onChange={this.handleConfigIsFixLastFooter}
              className='gm-flex'
            >
              <Radio value style={{ display: 'flex', marginRight: 10 }}>
                <span style={{ marginLeft: 5 }}>是</span>
              </Radio>
              <Radio value={false} style={{ display: 'flex' }}>
                <span style={{ marginLeft: 5 }}>否</span>
              </Radio>
            </RadioGroup>
          </Flex>
        )}

        <Flex className='gm-padding-top-5 gm-text-red' column>
          {computedSelectedRegionTip}
        </Flex>
      </div>
    )
  }
}

EditorSelector.propTypes = {
  isPurchase: PropTypes.bool,
  editStore: PropTypes.object
}
EditorSelector.defaultProps = {
  isPurchase: false
}

export default EditorSelector
