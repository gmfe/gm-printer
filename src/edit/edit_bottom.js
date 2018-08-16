import React from 'react'
import { observer } from 'mobx-react/index'
import _ from 'lodash'
import editStore from './store'
import { Separator, Fonter, Position, TextAlign, Text, Line, Size } from './component'

@observer
class EditBottom extends React.Component {
  handleChangeBlock = (who, value) => {
    if (!editStore.computedIsSelectBlock) {
      return
    }

    editStore.setConfigBlock(who, value)
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

    fun.push(<button onClick={this.handleRemove}>X</button>)

    return _.map(fun, (v, i) => React.cloneElement(v, {key: i}))
  }

  renderTable () {
    const {head, headStyle, text, style} = editStore.computedSelectedInfo

    const fun = []

    fun.push(<Fonter style={headStyle} onChange={this.handleChangeTable.bind(this, 'headStyle')}/>)
    fun.push(<Separator/>)
    fun.push(<TextAlign style={headStyle} onChange={this.handleChangeTable.bind(this, 'headStyle')}/>)
    fun.push(<Separator/>)
    fun.push(<Text
      value={head}
      placeholder='请输入表头填充内容'
      style={{width: '200px'}}
      onChange={this.handleChangeTable.bind(this, 'head')}
    />)

    fun.push(<span style={{
      display: 'inline-block',
      margin: '0 10px',
      borderLeft: '2px solid red',
      height: '1em',
      verticalAlign: 'middle'
    }}/>)

    fun.push(<Fonter style={style} onChange={this.handleChangeTable.bind(this, 'style')}/>)
    fun.push(<Separator/>)
    fun.push(<TextAlign style={style} onChange={this.handleChangeTable.bind(this, 'style')}/>)
    fun.push(<Separator/>)
    fun.push(<Text
      value={text}
      placeholder='请输入内容填充内容'
      style={{width: '200px'}}
      onChange={this.handleChangeTable.bind(this, 'text')}
    />)

    fun.push(<button style={{marginLeft: '20px'}} onClick={this.handleRemove}>X</button>)

    return _.map(fun, (v, i) => React.cloneElement(v, {key: i}))
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
