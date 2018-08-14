import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer } from 'mobx-react/index'
import printerStore from './store'
import { getStyleWithDiff } from '../util'

@observer
class Block extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      clientX: null,
      clientY: null
    }
  }

  componentDidMount () {
    const {name, onChange} = this.props

    window.document.addEventListener('gm-printer-block-config-broadcast', e => {
      if (e.detail.name === name) {
        onChange(e.detail.config)
      }
    })
  }

  handleDragStart = ({clientX, clientY}) => {
    const {config, name} = this.props

    this.setState({
      clientX,
      clientY
    })

    printerStore.setEditActive(name)

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-config-set', {
      detail: {
        name,
        config
      }
    }))
  }

  handleDragEnd = ({clientX, clientY}) => {
    const {name, config, onChange} = this.props

    const diffX = clientX - this.state.clientX
    const diffY = clientY - this.state.clientY

    const newStyle = getStyleWithDiff(config.style, diffX, diffY)

    const newConfig = Object.assign({}, config, {style: newStyle})

    onChange(newConfig)

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-style-set', {
      detail: {
        name,
        config: newConfig
      }
    }))
  }

  handleClick = (e) => {
    const {config, name} = this.props

    printerStore.setEditActive(name)

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-config-set', {
      detail: {
        name,
        config
      }
    }))
  }

  render () {
    const {
      name,
      config: {type, text, link, style},
      pageIndex,
      className,
      ...rest
    } = this.props

    let content = null
    if (!type || type === 'text') {
      content = printerStore.template(text, pageIndex)

    } else if (type === 'line') {
      content = null
    } else if (type === 'image') {
      content = <img src={link} style={{width: '100%', height: '100%'}} alt=''/>
    }

    return (
      <div
        {...rest}
        style={style}
        className={classNames('gm-printer-block', className, {
          active: name === printerStore.editActive
        })}
        draggable
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onClick={this.handleClick}
      >
        {content}
      </div>
    )
  }
}

Block.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Block
