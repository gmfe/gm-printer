import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import printerStore from './store'
import _ from 'lodash'
import { getHeight, getBlockName } from '../util'
import Block from './block'

@observer
class Panel extends React.Component {
  componentDidMount () {
    const {name} = this.props

    if (!printerStore.ready) {
      const $dom = ReactDOM.findDOMNode(this)

      printerStore.setHeight(name, getHeight($dom))
    }
  }

  render () {
    const {name, config, placeholder, pageIndex, style} = this.props

    return (
      <div
        className={`gm-printer-panel gm-printer-${name}`}
        data-placeholder={placeholder}
        style={style}
      >
        <div style={config.style}>
          {_.map(config.blocks, (block, i) => (
            <Block
              key={i}
              name={getBlockName(name, i)}
              config={block}
              pageIndex={pageIndex}
            />
          ))}
        </div>
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
