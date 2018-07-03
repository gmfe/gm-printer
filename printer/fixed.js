import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {observer} from 'mobx-react/index'
import printerStore from './store'

@observer
class Fixed extends React.Component {
  render () {
    const {blocks, pageIndex} = this.props

    return (
      <div className='gm-printer-fixed'>
        {_.map(blocks, (v, i) => {
          if (v.type === 'image') {
            return (
              <img key={i} src={v.link} style={v.style} alt=''/>
            )
          } else {
            return (
              <div key={i} style={v.style}>{printerStore.template(v.text, pageIndex)}</div>
            )
          }
        })}
      </div>
    )
  }
}

Fixed.propTypes = {
  blocks: PropTypes.array.isRequired,
  pageIndex: PropTypes.number
}

export default Fixed
