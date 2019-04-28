import i18next from '../../locales'
import React from 'react'
import { Flex, Option, Select } from '../components'
import { observer } from 'mobx-react'
import editStore from './store'
import { tableDataKeyList } from '../config'
import { Fonter, Gap, Line, Position, Separator, Size, TextAlign, ColumnWidth, Textarea, Title, TipInfo } from './component'

@observer
class EditorField extends React.Component {
  handleChangeBlock = (who, value) => {
    if (!editStore.computedIsSelectBlock) {
      return
    }

    editStore.setConfigBlockBy(who, value)
  }

  handleChangeTable = (who, value) => {
    if (!editStore.computedIsSelectTable) {
      return
    }
    editStore.setConfigTable(who, value)
  }

  handleChangeTableColumn = (headStyle) => {
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
    editStore.setTableDataKey(dataKey)
  }

  renderBlocks () {
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
      </div>
    )
  }

  renderTable () {
    const { head, headStyle, text, style } = editStore.computedSelectedInfo

    return (
      <div>
        <Title title={i18next.t('编辑字段')}/>
        <Gap/>
        <Flex>
          <Flex alignCenter>{i18next.t('数据类型')}：</Flex>
          <Select className='gm-printer-edit-select' value={editStore.computedTableDataKeyOfSelectedRegion}
            onChange={this.handleSetTableDataKey}>
            {tableDataKeyList.map(v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>

        <Gap height='5px'/>

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
      </div>
    )
  }

  render () {
    let content = null
    if (editStore.computedIsSelectBlock) {
      content = this.renderBlocks()
    } else if (editStore.computedIsSelectTable) {
      content = this.renderTable()
    }
    return content
  }
}

export default EditorField
