import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
import { getHeight, getBlockName, dispatchMsg, pxAdd } from '../util'
import classnames from 'classnames'
import Block from './block'

@inject('printerStore')
@observer
class Panel extends React.Component {
  componentDidMount () {
    const { name, printerStore } = this.props

    if (!printerStore.ready) {
      const $dom = ReactDOM.findDOMNode(this)

      printerStore.setHeight(name, getHeight($dom))
    }

    this.state = {
      clientY: null
    }
  }

  handleDragStart = ({ clientY }) => {
    this.setState({
      clientY
    })
  }

  handleDragEnd = ({ clientY }) => {
    const { name, config } = this.props

    let diffY = clientY - this.state.clientY

    // 如果是签名和 footer 则反向
    if (name === 'sign' || name === 'footer') {
      diffY = -diffY
    }

    dispatchMsg('gm-printer-panel-style-set', {
      name,
      style: {
        height: pxAdd(config.style.height, diffY)
      }
    })
  }

  handleSelectedRegion = () => {
    const { name, printerStore } = this.props
    printerStore.setSelectedRegion(name)

    dispatchMsg('gm-printer-select-region', { selected: name })
  }

  render () {
    const { name, config, placeholder, pageIndex, style, printerStore } = this.props
    const active = name === printerStore.selectedRegion

    return (
      <div
        className={classnames(
          'gm-printer-panel',
          `gm-printer-${name}`,
          { active }
        )}
        data-name={name}
        data-placeholder={placeholder}
        style={Object.assign({}, style, config.style)}
        onClick={this.handleSelectedRegion}
      >
        {_.map(config.blocks, (block, i) => (
          <Block
            key={i}
            name={getBlockName(name, i)}
            config={block}
            pageIndex={pageIndex}
          />
        ))}
        <div
          draggable
          className='gm-printer-panel-drag'
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        />
      </div>
    )
  }
}

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  pageIndex: PropTypes.number.isRequired,
  style: PropTypes.object
}

export default Panel
