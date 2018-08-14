import React from 'react'
import { observer } from 'mobx-react/index'
import _ from 'lodash'
import editStore from './store'
import { Separator, Fonter, Position, TextAlign, Text, Line, Size } from './component'

@observer
class EditHeader extends React.Component {
  handleChangeBy = (who, value) => {
    if (!editStore.name) {
      return
    }

    const newConfig = Object.assign({}, editStore.data.config, {
      [who]: value
    })

    this.doChange(newConfig)
  }

  doChange = (config) => {
    editStore.setConfig(config)

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-config-broadcast', {
      detail: {
        name: editStore.name,
        config
      }
    }))
  }

  render () {
    const {config: {type, style, text, link}} = editStore.data

    let fun = []

    fun.push(<Position style={style} onChange={this.handleChangeBy.bind(this, 'style')}/>)
    fun.push(<Separator/>)

    if (!type || type === 'text') {
      fun.push(<Fonter style={style} onChange={this.handleChangeBy.bind(this, 'style')}/>)
      fun.push(<Separator/>)
      fun.push(<TextAlign style={style} onChange={this.handleChangeBy.bind(this, 'style')}/>)
      fun.push(<Separator/>)
      fun.push(<Text
        value={text}
        placeholder='请输入填充内容'
        style={{width: '300px'}}
        onChange={this.handleChangeBy.bind(this, 'text')}
      />)
      fun.push(<Separator/>)
    }

    if (type === 'line') {
      fun.push(<Line style={style} onChange={this.handleChangeBy.bind(this, 'style')}/>)
      fun.push(<Separator/>)
    }

    if (type === 'image') {
      fun.push(<Size style={style} onChange={this.handleChangeBy.bind(this, 'style')}/>)
      fun.push(<Separator/>)
      fun.push(<Text
        value={link}
        placeholder='请输入链接'
        style={{width: '300px'}}
        onChange={this.handleChangeBy.bind(this, 'link')}
      />)
      fun.push(<Separator/>)
    }

    return (
      <div>
        {_.map(fun.slice(0, -1), (v, i) => React.cloneElement(v, {key: i}))}
      </div>
    )
  }
}

EditHeader.propTypes = {}

EditHeader.deaultProps = {}

export default EditHeader
