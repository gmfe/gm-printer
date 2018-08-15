import React from 'react'
import { observer } from 'mobx-react/index'
import _ from 'lodash'
import editStore from './store'
import { Separator, Fonter, Position, TextAlign, Text, Line, Size } from './component'

@observer
class EditHeader extends React.Component {
  handleChangeBlock = (who, value) => {
    if (!editStore.selected) {
      return
    }

    editStore.setConfigBlock(who, value)
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

    return (
      <div>
        {_.map(fun.slice(0, -1), (v, i) => React.cloneElement(v, {key: i}))}
      </div>
    )
  }

  renderTable () {
    return null
  }

  render () {
    if (editStore.computedIsSelectPanel) {
      return this.renderPanel()
    } else if (editStore.computedIsSelectBlock) {
      return this.renderBlocks()
    } else if (editStore.computedIsSelectTable) {
      return this.renderTable()
    }
    return <div>单击选中内容编辑</div>
  }
}

EditHeader.propTypes = {}

EditHeader.deaultProps = {}

export default EditHeader
