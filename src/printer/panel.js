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
    const {panel} = this.props

    const $dom = ReactDOM.findDOMNode(this)

    printerStore.setHeight({
      [panel]: getHeight($dom)
    })

    window.document.addEventListener('gm-printer-block-insert', this.handleBlockInsert)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-block-insert', this.handleBlockInsert)
  }

  handleBlockInsert = e => {
    const {panel, pageIndex} = this.props

    if (e.detail.panel === panel) {
      printerStore.insertConfigBlock(e.detail.panel, e.detail.type)

      const length = printerStore.config[panel].blocks.length
      const name = getBlockName(pageIndex, panel, length - 1)
      printerStore.setEditActive(name)

      window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-config-set', {
        detail: {
          name,
          config: printerStore.config[panel].blocks[length - 1]
        }
      }))
    }
  }

  render () {
    const {panel, placeholder, pageIndex} = this.props
    const {style, blocks} = printerStore.config[panel]

    return (
      <div className={`gm-printer-panel gm-printer-${panel}`} data-placeholder={placeholder}>
        <div style={style}>
          {_.map(blocks, (block, i) => (
            <Block
              key={i}
              name={getBlockName(pageIndex, panel, i)}
              config={block}
              pageIndex={pageIndex}
              onChange={block => printerStore.setConfigBlock(panel, i, block)}
            />
          ))}
        </div>
      </div>
    )
  }
}

Panel.propTypes = {
  panel: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  pageIndex: PropTypes.number.isRequired
}

export default Panel
