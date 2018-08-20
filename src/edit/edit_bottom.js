import React from 'react'
import { observer } from 'mobx-react/index'
import editStore from './store'
import { Separator, Fonter, Position, TextAlign, Textarea, Line, Size } from './component'

@observer
class EditBottom extends React.Component {
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
    const {type, text, style, link} = editStore.computedSelectedInfo

    return (
      <React.Fragment>
        <div>
          <button onClick={this.handleRemove}>移除</button>
        </div>
        <hr/>
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
    const {head, headStyle, text, style} = editStore.computedSelectedInfo

    return (
      <React.Fragment>
        <div>
          <button onClick={this.handleRemove}>移除</button>
        </div>
        <hr/>
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
    let content = '单击选中内容编辑，或拖动内容以摆放位置'
    if (editStore.computedIsSelectBlock) {
      content = this.renderBlocks()
    } else if (editStore.computedIsSelectTable) {
      content = this.renderTable()
    }
    return <div className='gm-printer-edit-header-bottom'>{content}</div>
  }
}

EditBottom.propTypes = {}

EditBottom.deaultProps = {}

export default EditBottom
