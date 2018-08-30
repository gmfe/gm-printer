import React from 'react'
import { blockTypeList, tableClassNameList } from '../config'
import editStore from './store'
import _ from 'lodash'
import { Hr } from './component'

class ContextMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: null,
      popup: {
        left: 0,
        top: 0
      },
      block: {
        left: 0,
        top: 0
      }
    }
  }

  componentDidMount () {
    window.document.addEventListener('click', this.handleClick)
  }

  componentWillUnmount () {
    window.document.removeEventListener('click', this.handleClick)
  }

  handleClick = (e) => {
    // 简单处理
    if (e.target.parentNode && e.target.parentNode.className === 'gm-printer-edit-contextmenu') {
      return
    }

    this.setState({
      name: null
    })
  }

  handleContextMenu = (e) => {
    const {target: {dataset: {name}}, clientX, clientY} = e

    if (!name) {
      return
    }

    // name
    // header
    // header.block.0
    // contents.panel.0
    // contents.panel.0.block.0
    // contents.table.0
    // contents.table.0.column.0

    console.log(name)

    e.preventDefault()

    const rect = e.target.getBoundingClientRect()

    this.setState({
      name,
      popup: {
        left: clientX,
        top: clientY
      },
      block: {
        left: clientX - rect.x,
        top: clientY - rect.y
      }
    })
  }

  handleInsertBlock = (type) => {
    const {name, block} = this.state

    editStore.addConfigBlock(name, type, {
      left: block.left + 'px',
      top: block.top + 'px'
    })

    this.setState({
      name: null
    })
  }

  renderPanel () {
    return _.map(blockTypeList, v => (
      <div key={v.value} onClick={this.handleInsertBlock.bind(this, v.value)}>{v.text}</div>
    ))
  }

  handleRemove = () => {
    const {name} = this.state

    editStore.setSelected(name)
    editStore.removeConfig()

    this.setState({
      name: null
    })
  }

  renderBlock () {
    return (
      <div onClick={this.handleRemove}>
        移除
      </div>
    )
  }

  handleAddColumn = (diff) => {
    const {name} = this.state

    editStore.setSelected(name)
    editStore.addTableColumnByDiff(diff)

    this.setState({
      name: null
    })
  }

  handleTableClassName = (className) => {
    const {name} = this.state
    editStore.setConfigTableClassName(name, className)

    this.setState({
      name: null
    })
  }

  renderColumn () {
    return (
      <React.Fragment>
        <div onClick={this.handleAddColumn.bind(this, -1)}>
          向左插入
        </div>
        <div onClick={this.handleAddColumn.bind(this, 1)}>
          向右插入
        </div>
        <Hr/>
        <div onClick={this.handleRemove}>
          移除
        </div>
        <Hr/>
        {_.map(tableClassNameList, v => (
          <div key={v.value} onClick={this.handleTableClassName.bind(this, v.value)}>
            {v.text}
          </div>
        ))}
      </React.Fragment>
    )
  }

  render () {
    const {children, ...rest} = this.props
    const {name, popup} = this.state
    const arr = (name && name.split('.')) || []

    return (
      <div {...rest} onContextMenu={this.handleContextMenu}>
        {children}
        <div className='gm-printer-edit-contextmenu' style={{
          position: 'fixed',
          ...popup
        }}>
          {name && arr.length === 1 && this.renderPanel()}
          {name && arr.length === 3 && arr[1] === 'panel' && this.renderPanel()}
          {name && arr.length === 3 && arr[1] === 'block' && this.renderBlock()}
          {name && arr.length === 5 && arr[1] === 'table' && this.renderColumn()}
        </div>
      </div>
    )
  }
}

ContextMenu.propTypes = {}

ContextMenu.deaultProps = {}

export default ContextMenu
