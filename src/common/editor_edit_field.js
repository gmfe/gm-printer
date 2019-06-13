import i18next from '../../locales'
import React from 'react'
import { Flex, Option, Select } from '../components'
import { observer, inject } from 'mobx-react'
import { Fonter, Gap, Line, Position, Separator, Size, TextAlign, ColumnWidth, Textarea, Title, TipInfo } from '../common/component'
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

  handleChangeTableColumn = (headStyle) => {
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

  handleSetTableDataKey = (dataKey) => {
    const { editStore } = this.props
    editStore.setTableDataKey(dataKey)
  }

  handleSpecialStyleChange = (value) => {
    const { editStore } = this.props
    editStore.setSpecialStyle(value)
  }

  handleSubtotalStyleChange = value => {
    const { editStore } = this.props
    editStore.setSubtotalStyle(value)
  }

  renderBlocks () {
    const { editStore } = this.props
    const { type, text, style, link } = editStore.computedSelectedInfo

    return (
      <div>
        <Title title={i18next.t('编辑字段')}/>
        <Gap/>
        <Position style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
        <Gap/>

        {(!type || type === 'text') && (
          <div>
            <Fonter style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
            <Separator/>
            <TextAlign style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
            <Gap/>

            <Textarea
              value={text}
              placeholder={i18next.t('请输入填充内容')}
              onChange={this.handleChangeBlock.bind(this, 'text')}
            />
          </div>
        )}
        {type === 'line' && (
          <Line style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
        )}
        {type === 'image' && (
          <div>
            <Size style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
            <Gap/>

            <Textarea
              value={link}
              placeholder={i18next.t('请输入链接')}
              onChange={this.handleChangeBlock.bind(this, 'link')}
            />
          </div>
        )}
        <TipInfo text={i18next.t('说明：请勿修改{}中的内容,避免出现数据异常')}/>
        {
          editStore.computedIsTime &&
          <div>
            <TipInfo text={i18next.t(`注：可通过修改“{{}}”中的内容更改时间格式。`)}/>
            <TipInfo text={i18next.t(`1. 格式“2013-01-01 19:00:00”，输入“单据日期： {{单据日期}}”；`)}/>
            <TipInfo text={i18next.t(`2. 格式“2013-01-01”，输入“单据日期： {{单据日期_日期}}”；`)}/>
            <TipInfo text={i18next.t(`3. 格式“19:00:00"，输入“单据日期： {{单据日期_时间}}"；`)}/>
          </div>
        }
      </div>
    )
  }

  renderTable () {
    const { tableDataKeyList, editStore } = this.props
    const { head, headStyle, text, style } = editStore.computedSelectedInfo

    const { specialConfig, subtotal } = editStore.computedTableSpecialConfig
    // 小计样式
    const specialStyle = (specialConfig && specialConfig.style) || {} // 老的配置specialConfig是undefined
    // 每页合计样式
    const subtotalStyle = (subtotal && subtotal.style) || {}

    return (
      <div>
        <Title title={i18next.t('编辑字段')}/>
        <Gap/>

        {tableDataKeyList && <React.Fragment>
          <Flex>
            <Flex alignCenter>{i18next.t('数据类型')}：</Flex>
            <Select className='gm-printer-edit-select' value={editStore.computedTableDataKeyOfSelectedRegion}
              onChange={this.handleSetTableDataKey}>
              {tableDataKeyList.map(v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
            </Select>
          </Flex>
          <Gap height='5px'/>
        </React.Fragment>}

        <Flex alignCenter>
          <Flex alignCenter>{i18next.t('设置列宽')}：</Flex>
          <ColumnWidth style={headStyle} onChange={this.handleChangeTableColumn}/>
        </Flex>

        <Gap height='5px'/>

        <Flex>
          <Flex>{i18next.t('字段设置')}：</Flex>
          <div>
            <div>
              <Fonter style={headStyle} onChange={this.handleChangeTable.bind(this, 'headStyle')}/>
              <Separator/>
              <TextAlign style={headStyle} onChange={this.handleChangeTable.bind(this, 'headStyle')}/>
              <Gap/>

              <Textarea
                value={head}
                placeholder={i18next.t('请输入表头填充内容')}
                onChange={this.handleChangeTable.bind(this, 'head')}
              />
            </div>
            <div>
              <Fonter style={style} onChange={this.handleChangeTable.bind(this, 'style')}/>
              <Separator/>
              <TextAlign style={style} onChange={this.handleChangeTable.bind(this, 'style')}/>
              <Gap/>

              <Textarea
                value={text}
                placeholder={i18next.t('请输入内容填充内容')}
                onChange={this.handleChangeTable.bind(this, 'text')}
              />
            </div>
          </div>
        </Flex>

        <TipInfo text={i18next.t('说明：请勿修改{}中的内容,避免出现数据异常')}/>
        <Gap/>

        <Flex>
          <Flex>{i18next.t('小计设置')}：</Flex>
          <Fonter style={specialStyle} onChange={this.handleSpecialStyleChange}/>
          <Separator/>
          <TextAlign style={specialStyle} onChange={this.handleSpecialStyleChange}/>
        </Flex>

        <Flex>
          <Flex>{i18next.t('合计设置')}：</Flex>
          <Fonter style={subtotalStyle} onChange={this.handleSubtotalStyleChange}/>
          <Separator/>
          <TextAlign style={subtotalStyle} onChange={this.handleSubtotalStyleChange}/>
        </Flex>
      </div>
    )
  }

  render () {
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
  tableDataKeyList: PropTypes.array
}

export default EditorField
