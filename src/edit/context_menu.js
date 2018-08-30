import React from 'react'
import { blockTypeList } from '../config'
import editStore from './store'
import _ from 'lodash'

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

  renderBlock () {
    return _.map(blockTypeList, v => (
      <div key={v.value} onClick={this.handleInsertBlock.bind(this, v.value)}>{v.text}</div>
    ))
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
          {name && arr.length === 1 && this.renderBlock()}
          {name && arr.length === 3 && arr[1] === 'panel' && this.renderBlock()}
        </div>
      </div>
    )
  }
}

ContextMenu.propTypes = {}

ContextMenu.deaultProps = {}

export default ContextMenu
