import React from 'react'
import { observer } from 'mobx-react/index'
import _ from 'lodash'
import editStore from './store'
import { Separator, Fonter, Position, TextAlign, Text, Line, Size } from './component'

@observer
class EditBottom extends React.Component {
  handleChangeBlock = (who, value) => {
    if (!editStore.selected) {
      return
    }

    editStore.setConfigBlock(who, value)
  }

  handleRemoveBlock = () => {
    editStore.removeConfigBlock()
  }

  renderPanel () {
    // TODO
    return null
  }

  renderBlocks () {
    const {type, text, style, link} = editStore.computedSelectedInfo

    let fun = []

    fun.push(<Position style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>)
    fun.push(<Separator/>)

    if (!type || type === 'text') {
      fun.push(<Fonter style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>)
      fun.push(<Separator/>)
      fun.push(<TextAlign style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>)
      fun.push(<Separator/>)
      fun.push(<Text
        value={text}
        placeholder='请输入填充内容'
        style={{width: '300px'}}
        onChange={this.handleChangeBlock.bind(this, 'text')}
      />)
      fun.push(<Separator/>)
    }

    if (type === 'line') {
      fun.push(<Line style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>)
      fun.push(<Separator/>)
    }

    if (type === 'image') {
      fun.push(<Size style={style} onChange={this.handleChangeBlock.bind(this, 'style')}/>)
      fun.push(<Separator/>)
      fun.push(<Text
        value={link}
        placeholder='请输入链接'
        style={{width: '300px'}}
        onChange={this.handleChangeBlock.bind(this, 'link')}
      />)
      fun.push(<Separator/>)
    }

    fun.push(<button onClick={this.handleRemoveBlock}>X</button>)

    return _.map(fun, (v, i) => React.cloneElement(v, {key: i}))
  }

  renderTable () {
    return null
  }

  render () {
    let content = '单击选中内容编辑，或拖动内容以摆放位置'
    if (editStore.computedIsSelectPanel) {
      content = this.renderPanel()
    } else if (editStore.computedIsSelectBlock) {
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
