import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { dispatchMsg, getStyleWithDiff } from '../util'

@inject('printerStore')
@observer
class Block extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      clientX: null,
      clientY: null,
      isEdit: false
    }
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-block-edit', this.handleBlockEdit)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-block-edit', this.handleBlockEdit)
  }

  handleBlockEdit = (e) => {
    const { name } = this.props

    if (e.detail.name !== name) {
      return
    }

    this.setState({
      isEdit: true
    }, () => {
      this.refEdit.focus()
      this.refEdit.select()
    })
  }

  handleDragStart = ({ clientX, clientY }) => {
    const { name } = this.props

    this.setState({
      clientX,
      clientY
    })

    dispatchMsg('gm-printer-select', {
      selected: name
    })
  }

  handleDragEnd = ({ clientX, clientY }) => {
    const { config } = this.props
    const diffX = clientX - this.state.clientX
    const diffY = clientY - this.state.clientY

    const style = getStyleWithDiff(config.style, diffX, diffY)

    dispatchMsg('gm-printer-block-style-set', {
      style
    })
  }

  handleClick = () => {
    const { name } = this.props

    dispatchMsg('gm-printer-select', {
      selected: name
    })
  }

  handleDoubleClick = () => {
    const { config: { type } } = this.props
    if (!type || type === 'text') {
      this.setState({
        isEdit: true
      }, () => {
        this.refEdit.focus()
      })
    }
  }

  handleEditBlur = () => {
    this.setState({
      isEdit: false
    })
  }

  handleText = (e) => {
    dispatchMsg('gm-printer-block-text-set', {
      text: e.target.value
    })
  }

  render () {
    const {
      name,
      config: { type, text, link, style },
      pageIndex,
      className,
      printerStore,
      ...rest
    } = this.props
    const { isEdit } = this.state

    let content = null
    if (!type || type === 'text') {
      content = printerStore.template(text, pageIndex)
    } else if (type === 'line') {
      content = null
    } else if (type === 'image') {
      content = <img src={link} style={{ width: '100%', height: '100%' }} alt=''/>
    }

    const active = name === printerStore.selected

    return (
      <div
        {...rest}
        style={style}
        className={classNames('gm-printer-block', className, {
          active
        })}
        data-name={name}
        draggable
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        {content}
        {(!type || type === 'text') && active && isEdit && (
          <textarea
            ref={ref => (this.refEdit = ref)}
            className='gm-printer-block-text-edit' value={text}
            onChange={this.handleText}
            onBlur={this.handleEditBlur}
          />
        )}
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
