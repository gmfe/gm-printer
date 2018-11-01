import React from 'react'
import { Flex } from 'react-gm'
import { observer } from 'mobx-react'
import editStore from './store'
import { Separator, Fonter, Position, TextAlign, Textarea, Line, Size } from './component'

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

  handleRemove = () => {
    editStore.removeConfig()
  }

  renderBlocks () {
    const { type, text, style, link } = editStore.computedSelectedInfo

    return (
      <React.Fragment>
        <Flex alignCenter>
          <i className='xfont xfont-bill' style={{ color: 'rgb(253, 82, 113)' }}/>基本信息
        </Flex>
        <div>
          <Position style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
        </div>
        {(!type || type === 'text') && (
          <div>
            <Fonter style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
            <Separator/>
            <TextAlign style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>
            <br/>
            <Textarea
              value={text}
              placeholder='请输入填充内容'
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
            <br/>
            <Textarea
              value={link}
              placeholder='请输入链接'
              onChange={this.handleChangeBlock.bind(this, 'link')}
            />
          </div>
        )}
      </React.Fragment>
    )
  }

  renderTable () {
    const { head, headStyle, text, style } = editStore.computedSelectedInfo

    return (
      <React.Fragment>
        <Flex alignCenter>
          <i className='xfont xfont-bill' style={{ color: 'rgb(253, 82, 113)' }}/>基本信息
        </Flex>
        <div>
          <Fonter style={headStyle} onChange={this.handleChangeTable.bind(this, 'headStyle')}/>
          <Separator/>
          <TextAlign style={headStyle} onChange={this.handleChangeTable.bind(this, 'headStyle')}/>
          <br/>
          <Textarea
            value={head}
            placeholder='请输入表头填充内容'
            onChange={this.handleChangeTable.bind(this, 'head')}
          />
        </div>
        <div>
          <Fonter style={style} onChange={this.handleChangeTable.bind(this, 'style')}/>
          <Separator/>
          <TextAlign style={style} onChange={this.handleChangeTable.bind(this, 'style')}/>
          <br/>
          <Textarea
            value={text}
            placeholder='请输入内容填充内容'
            onChange={this.handleChangeTable.bind(this, 'text')}
          />
        </div>
      </React.Fragment>
    )
  }

  render () {
    let content = null
    if (editStore.computedIsSelectBlock) {
      content = this.renderBlocks()
    } else if (editStore.computedIsSelectTable) {
      content = this.renderTable()
    }
    return <div className='gm-padding-10'>{content}</div>
  }
}

export default EditorField
