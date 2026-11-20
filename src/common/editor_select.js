import i18next from '../../locales'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Flex, Option, Select, RadioGroup, Radio } from '../components'
import { InputWithUnit } from '../common/component'
import { pageTypeMap, printDirectionList, fontFamilyList, LONG_PRINT } from '../config'
import _ from 'lodash'
import { dispatchMsg } from '../util'
import PropTypes from 'prop-types'

/**
 * 本机字体可用性检测（DOM 宽度法）：
 * 用同一文本分别以「不存在的字体（强制走浏览器 fallback 默认）」和「目标字体栈」
 * 离屏渲染量宽，宽度差 >0.5px 说明栈中有字体真实命中（未安装时会 fallback 到与
 * 假字体相同的系统默认，宽度一致）。基线不能用 monospace：中文等宽字体自身会
 * fallback 到系统默认，与目标字体栈的 fallback 同源，导致未安装也判 true。
 */
const isFontInstalled = (fontFamily) => {
  if (typeof document === 'undefined' || !fontFamily) return true
  const host = document.body
  if (!host) return true
  const probe = document.createElement('div')
  probe.textContent = '配送单验收签字汉字测试123'
  probe.style.cssText =
    'position:absolute;left:-9999px;top:0;font-size:32px;white-space:nowrap;'
  const widthOf = (ff) => {
    probe.style.fontFamily = ff
    host.appendChild(probe)
    const w = probe.getBoundingClientRect().width
    host.removeChild(probe)
    return w
  }
  // 基线：一个肯定不存在的字体名 → 浏览器对中文回落系统默认；目标栈若全未安装，回落结果与之等宽
  const base = widthOf('GmDefinitelyNotAFont999')
  return Math.abs(widthOf(fontFamily) - base) > 0.5
}

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

  handleFontFamily = value => {
    this.props.editStore.setPageFontFamily(value)
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
    const { showFontFamily, fontFamilies } = this.props
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

        {showFontFamily && (
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('打印字体')}：</div>
            <Select
              className='gm-printer-edit-select'
              value={page.fontFamily || ''}
              onChange={this.handleFontFamily}
            >
              {_.map(fontFamilies || fontFamilyList, v => {
                // 非默认字体且本机未安装时，选项标注提示：选中后打印/导出会退化为默认字体
                const installed = isFontInstalled(v.value)
                return (
                  <Option key={v.value} value={v.value}>
                    {v.text}
                    {!installed && (
                      <span
                        className='gm-text-red gm-padding-left-5'
                        style={{ fontSize: '11px' }}
                      >
                        （本机未安装，将退化默认字体）
                      </span>
                    )}
                  </Option>
                )
              })}
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
  showFontFamily: PropTypes.bool,
  // 自定义打印字体列表（扩展接口）：[{ value, text }]；不传用内置 fontFamilyList
  fontFamilies: PropTypes.array,
  editStore: PropTypes.object
}
EditorSelector.defaultProps = {
  isPurchase: false,
  showFontFamily: false
}

export default EditorSelector
