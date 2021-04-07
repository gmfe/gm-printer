import i18next from '../../locales'
import React from 'react'
import { Flex, Option, Select } from '../components'
import { observer, inject } from 'mobx-react'
import {
  Fonter,
  Gap,
  Line,
  Position,
  Separator,
  Size,
  TextAlign,
  ColumnWidth,
  Textarea,
  Title,
  TipInfo
} from '../common/component'
import { get } from 'mobx'
import PropTypes from 'prop-types'

@inject('editStore')
@observer
class EditorField extends React.Component {
  handleChangeBlock = (who, value) => {
    const { editStore } = this.props
    if (!editStore.computedIsSelectBlock) {
      return
    }

    editStore.setConfigBlockBy(who, value)
  }

  handleChangeTable = (who, value) => {
    const { editStore } = this.props
    if (!editStore.computedIsSelectTable) {
      return
    }
    editStore.setConfigTable(who, value)
  }

  handleChangeTableColumn = headStyle => {
    const { editStore } = this.props
    if (!editStore.computedIsSelectTable) {
      return
    }
    const { style } = editStore.computedSelectedInfo
    const _style = { ...style }
    if (headStyle.width === 'auto') {
      delete _style.wordBreak
      delete headStyle.wordBreak
    } else {
      _style.wordBreak = 'break-all'
      headStyle.wordBreak = 'break-all'
    }
    // 设置tbody > tr > td
    editStore.setConfigTable('style', _style)
    // 设置thead > tr > td
    editStore.setConfigTable('headStyle', headStyle)
  }

  handleSetTableDataKey = dataKey => {
    const { editStore } = this.props
    editStore.setTableDataKey(dataKey)
  }

  handleSpecialStyleChange = value => {
    const { editStore } = this.props
    editStore.setSpecialStyle(value)
  }

  handleSubtotalStyleChange = value => {
    const { editStore } = this.props
    editStore.setSubtotalStyle(value)
  }

  renderBlocks() {
    const { editStore, showNewDate } = this.props
    const { type, text, style, link } = editStore.computedSelectedInfo

    return (
      <div>
        <Title title={i18next.t('编辑字段')} />
        <Gap />
        <Position
          style={style}
          onChange={this.handleChangeBlock.bind(this, 'style')}
        />
        <Gap />

        {(!type || type === 'text') && (
          <div>
            <Fonter
              style={style}
              onChange={this.handleChangeBlock.bind(this, 'style')}
            />
            <Separator />
            <TextAlign
              style={style}
              onChange={this.handleChangeBlock.bind(this, 'style')}
            />
            <Gap />

            <Textarea
              value={text}
              placeholder={i18next.t('请输入填充内容')}
              onChange={this.handleChangeBlock.bind(this, 'text')}
            />
          </div>
        )}
        {type === 'line' && (
          <Line
            style={style}
            onChange={this.handleChangeBlock.bind(this, 'style')}
          />
        )}
        {type === 'qrcode' && (
          <Size
            style={style}
            onChange={this.handleChangeBlock.bind(this, 'style')}
          />
        )}
        {type === 'image' && (
          <div>
            <Size
              style={style}
              onChange={this.handleChangeBlock.bind(this, 'style')}
            />
            <Gap />

            <Textarea
              value={link}
              placeholder={i18next.t('请输入链接')}
              onChange={this.handleChangeBlock.bind(this, 'link')}
            />
          </div>
        )}
        <TipInfo
          text={i18next.t('说明：谨慎修改{}中的内容,避免出现数据异常')}
        />
        {editStore.computedIsTime && (
          <div>
            <TipInfo
              text={i18next.t('注：可通过修改“{{}}”中的内容更改时间格式。')}
            />
            <TipInfo
              text={i18next.t(
                '1. 格式“2013-01-01 19:00:00”，输入“单据日期： {{单据日期}}”；'
              )}
            />
            <TipInfo
              text={i18next.t(
                '2. 格式“2013-01-01”，输入“单据日期： {{单据日期_日期}}”；'
              )}
            />
            <TipInfo
              text={i18next.t(
                '3. 格式“19:00:00"，输入“单据日期： {{单据日期_时间}}"；'
              )}
            />
            {showNewDate && (
              <>
                <TipInfo
                  text={i18next.t(
                    '4. 格式“01-01 19:00:00”，输入“单据日期： {{单据日期_无年份}}”；'
                  )}
                />
                <TipInfo
                  text={i18next.t(
                    '5. 格式“01-01”，输入“单据日期： {{单据日期_日期_无年份}}"；'
                  )}
                />
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  renderTable() {
    const { tableDataKeyList, editStore } = this.props
    const { head, headStyle, text, style } = editStore.computedSelectedInfo

    const { specialConfig, subtotal } = editStore.computedTableSpecialConfig
    // 小计样式,specialConfig可能是undefined
    const specialStyle =
      editStore.computedTableSpecialConfig?.specialConfig?.style || {}
    // 小计是否大写
    const specialTrNeedUpperCase =
      (specialConfig && specialConfig.needUpperCase) || false
    // 每页合计样式
    const subtotalStyle = (subtotal && subtotal.style) || {}
    //  每页合计是否大写
    const subtotalNeedUpperCase =
      (editStore.computedTableSpecialConfig.subtotal &&
        get(subtotal, 'needUpperCase')) ||
      false
    // 大写的金额是否在前
    const subtotalUpperCaseBefore =
      (editStore.computedTableSpecialConfig.subtotal &&
        get(subtotal, 'isUpperCaseBefore')) ||
      false
    // 大写和小写的金额是否分开
    const subtotalUpperLowerCaseSeparate =
      (editStore.computedTableSpecialConfig.subtotal &&
        get(subtotal, 'isUpperLowerCaseSeparate')) ||
      false
    // 位置交换
    const subtotalCommutationPlace =
      (editStore.computedTableSpecialConfig.subtotal &&
        get(subtotal, 'isCommutationPlace')) ||
      false

    return (
      <div>
        <Title title={i18next.t('编辑字段')} />
        <Gap />

        {tableDataKeyList && (
          <>
            <Flex>
              <Flex alignCenter>{i18next.t('数据类型')}：</Flex>
              <Select
                className='gm-printer-edit-select'
                value={editStore.computedTableDataKeyOfSelectedRegion}
                onChange={this.handleSetTableDataKey}
              >
                {tableDataKeyList.map(v => (
                  <Option key={v.value} value={v.value}>
                    {v.text}
                  </Option>
                ))}
              </Select>
            </Flex>
            <Gap height='5px' />
          </>
        )}

        <Flex alignCenter>
          <Flex alignCenter>{i18next.t('设置列宽')}：</Flex>
          <ColumnWidth
            style={headStyle}
            onChange={this.handleChangeTableColumn}
          />
        </Flex>

        <Gap height='5px' />

        <Flex alignCenter>
          <Flex alignCenter>{i18next.t('设置行高')}：</Flex>
          <input
            value={editStore.computedTableCustomerRowHeight}
            onChange={e => {
              const value = e.target.value
              if (+value <= 100 && +value >= 0)
                editStore.setTableCustomerRowHeight(value)
            }}
            type='number'
            className='gm-printer-edit-input-custom'
          />
          px
        </Flex>

        <Gap height='5px' />

        <Flex alignCenter>
          <Flex alignCenter>{i18next.t('商品排列')}：</Flex>
          <Select
            className='gm-printer-edit-select'
            value={editStore.computedTableArrange}
            onChange={editStore.setTableArrange}
          >
            <Option value='lateral'>{i18next.t('横向排列')}</Option>
            <Option value='vertical'>{i18next.t('纵向排列')}</Option>
          </Select>
        </Flex>

        <Flex alignCenter className='gm-padding-top-5 gm-text-desc'>
          {i18next.t('商品排列仅适用于双栏商品设置')}
        </Flex>

        <Gap height='5px' />

        <Flex alignCenter>
          <Flex alignCenter>{i18next.t('表格样式')}：</Flex>
          <Select
            className='gm-printer-edit-select'
            value={editStore.tableCustomStyle}
            onChange={editStore.changeTableCustomStyle}
          >
            <Option value='default'>{i18next.t('默认样式')}</Option>
            <Option value='className0'>{i18next.t('样式一')}</Option>
            <Option value='className1'>{i18next.t('样式二')}</Option>
            <Option value='className2'>{i18next.t('样式三')}</Option>
          </Select>
        </Flex>

        <Gap height='5px' />

        <Flex>
          <Flex>{i18next.t('字段设置')}：</Flex>
          <div>
            <div>
              <Fonter
                style={headStyle}
                onChange={this.handleChangeTable.bind(this, 'headStyle')}
              />
              <Separator />
              <TextAlign
                style={headStyle}
                onChange={this.handleChangeTable.bind(this, 'headStyle')}
              />
              <Gap />

              <Textarea
                value={head}
                placeholder={i18next.t('请输入表头填充内容')}
                onChange={this.handleChangeTable.bind(this, 'head')}
              />
            </div>
            <div>
              <Fonter
                style={style}
                onChange={this.handleChangeTable.bind(this, 'style')}
              />
              <Separator />
              <TextAlign
                style={style}
                onChange={this.handleChangeTable.bind(this, 'style')}
              />
              <Gap />

              <Textarea
                value={text}
                placeholder={i18next.t('请输入内容填充内容')}
                onChange={this.handleChangeTable.bind(this, 'text')}
              />
            </div>
          </div>
        </Flex>

        <TipInfo
          text={i18next.t('说明：谨慎修改{}中的内容,避免出现数据异常')}
        />
        <Gap />

        <Flex>
          <Flex>{i18next.t('小计设置')}：</Flex>
          <Fonter
            style={specialStyle}
            onChange={this.handleSpecialStyleChange}
          />
          <Separator />
          <TextAlign
            style={specialStyle}
            onChange={this.handleSpecialStyleChange}
          />
        </Flex>

        <EditorSubtotalCheck
          subtotalCheckDisabled
          subtotalChecked={specialTrNeedUpperCase}
          subtotalCheckOnChange={editStore.setSpecialUpperCase}
          subtotalCheckText='显示大写金额'
        />

        <Flex>
          <Flex>{i18next.t('合计设置')}：</Flex>
          <Fonter
            style={subtotalStyle}
            onChange={this.handleSubtotalStyleChange}
          />
          <Separator />
          <TextAlign
            style={subtotalStyle}
            onChange={this.handleSubtotalStyleChange}
          />
        </Flex>
        {/* <Flex style={{ margin: '5px 0 5px 62px' }}>
          <Flex alignCenter>
            <input
              type='checkbox'
              checked={subtotalCommutationPlace}
              onChange={editStore.setSubtotalCommutationPlace}
            />
          </Flex>
          <Flex>&nbsp;{i18next.t('合计、每页合计交换位置')}</Flex>
        </Flex> */}
        <EditorSubtotalCheck
          subtotalCheckDisabled
          subtotalChecked={subtotalNeedUpperCase}
          subtotalCheckOnChange={editStore.setSubtotalUpperCase}
          subtotalCheckText='显示大写金额'
        />
        <EditorSubtotalCheck
          subtotalCheckDisabled={subtotalNeedUpperCase}
          subtotalChecked={subtotalUpperCaseBefore}
          subtotalCheckOnChange={editStore.setSubtotalUpperCaseBefore}
          subtotalCheckText='大写金额在前'
        />
        <EditorSubtotalCheck
          subtotalCheckDisabled={subtotalNeedUpperCase}
          subtotalChecked={subtotalUpperLowerCaseSeparate}
          subtotalCheckOnChange={editStore.setSubtotalUpperLowerCaseSeparate}
          subtotalCheckText='大、小写金额分左右两边展示'
        />
      </div>
    )
  }

  render() {
    const { editStore } = this.props

    let content = null
    if (editStore.computedIsSelectBlock) {
      content = this.renderBlocks()
    } else if (editStore.computedIsSelectTable) {
      content = this.renderTable()
    }
    return content
  }
}

EditorField.propTypes = {
  editStore: PropTypes.object,
  tableDataKeyList: PropTypes.array,
  showNewDate: PropTypes.bool
}
EditorField.defaultProps = {
  showNewDate: false
}

class EditorSubtotalCheck extends React.Component {
  render() {
    const {
      subtotalCheckDisabled,
      subtotalChecked,
      subtotalCheckOnChange,
      subtotalCheckText
    } = this.props

    return (
      <Flex style={{ margin: '5px 0 5px 62px' }}>
        <Flex alignCenter>
          <input
            type='checkbox'
            disabled={!subtotalCheckDisabled}
            checked={subtotalChecked}
            onChange={subtotalCheckOnChange}
          />
        </Flex>
        <Flex>&nbsp;{i18next.t(`${subtotalCheckText}`)}</Flex>
      </Flex>
    )
  }
}

EditorSubtotalCheck.propTypes = {
  subtotalCheckDisabled: PropTypes.bool,
  subtotalChecked: PropTypes.bool,
  subtotalCheckOnChange: PropTypes.func,
  subtotalCheckText: PropTypes.string
}

export default EditorField
