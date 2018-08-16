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

  handleDragStart = ({clientX, clientY}) => {
    const {name} = this.props

    this.setState({
      clientX,
      clientY
    })

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-select', {
      detail: {
        selected: name
      }
    }))
  }

  handleDragEnd = ({clientX, clientY}) => {
    const {config} = this.props

    const diffX = clientX - this.state.clientX
    const diffY = clientY - this.state.clientY

    const newStyle = getStyleWithDiff(config.style, diffX, diffY)

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-style-set', {
      detail: {
        style: newStyle
      }
    }))
  }

  handleClick = () => {
    const {name} = this.props

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-select', {
      detail: {
        selected: name
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
          active: name === printerStore.selected
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
  pageIndex: PropTypes.number.isRequired
}

export default Block
