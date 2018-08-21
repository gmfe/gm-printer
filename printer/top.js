import React from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import { getHeight } from './util'
import PropTypes from 'prop-types'
import _ from 'lodash'

@observer
class Top extends React.Component {
  componentDidMount () {
    const $dom = ReactDOM.findDOMNode(this)

    this.props.store.setHeight({
      top: getHeight($dom)
    })
  }

  render () {
    const {blocks, style, pageIndex, store} = this.props

    return (
      <div className='gm-printer-top'>
        <div style={style}>
          {_.map(blocks, (cell, i) => (
            <div key={i} style={cell.style}>{store.template(cell.text, pageIndex)}</div>
          ))}
        </div>
      </div>
    )
  }
}

Top.propTypes = {
  blocks: PropTypes.array.isRequired,
  style: PropTypes.object,
  pageIndex: PropTypes.number
}

export default Top
