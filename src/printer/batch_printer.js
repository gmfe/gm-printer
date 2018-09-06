import React from 'react'
import Printer from './printer'
import _ from 'lodash'
import PropTypes from 'prop-types'

// TODO
class BatchPrinter extends React.Component {
  render () {
    const {
      config,
      datas
    } = this.props

    return (
      <div>
        {_.map(datas, (v, i) => (
          <Printer
            key={i}
            data={datas[i]}
            config={config}
          />
        ))}
      </div>
    )
  }
}

BatchPrinter.propTypes = {
  config: PropTypes.object.isRequired,
  datas: PropTypes.object
}

export default BatchPrinter
